describe('Service: messageMiddleware', function () {
  'use strict';
  var messageMiddleware, rootScope, legatoMock, inputConfigMock;

  // load the service's module
  beforeEach(module('oscmodulatorApp'));

  beforeEach(function(){
    legatoMock = {
      init: function(){},
      in: function(){},
      on: function(){},
      removeInput: function(){},
      removeRoute: function(){},
      midi:{
        In:function(){},
        ins:function(){
          return ['a', 'b'];
        },
        outs:function(){
          return ['c','d'];
        }
      },
      osc:{
        Out:function(){return function(){};}
      }
    };

    inputConfigMock = {
      inputs:{
        1:{
          id:{input:1},
          valid:true,
          midi:{
            note: '63',
            type: 'note',
            port:{
              id:'/:'
            },
            channel:'All'
          },
          outputs:{
            1:{
              valid:true,
              path:'/path',
              host: 'a',
              parameters:[]
            }
          }
        }
      },
      init:function(){}
    };

    module(function($provide){
      $provide.value('legato', legatoMock);
      $provide.value('inputConfig', inputConfigMock);
    });

    inject(function (_messageMiddleware_, $rootScope) {
      messageMiddleware = _messageMiddleware_;
      rootScope = $rootScope;
    });
  });

  it('should initialize the midi object.', function(){
    spyOn(legatoMock, 'init');
    messageMiddleware.init();
    expect(legatoMock.init).toHaveBeenCalled();
  });

  it('should be able to update its list of available midi ports.', function(){
    spyOn(legatoMock.midi, 'ins').andCallThrough();
    spyOn(legatoMock.midi, 'outs').andCallThrough();

    expect(messageMiddleware.availableMidiPorts.inputs.length).toBe(0, 'The midi ĭnput ports should start out unconfigured.');
    expect(messageMiddleware.availableMidiPorts.outputs.length).toBe(0, 'The midi outputs should start out unconfigured.');

    messageMiddleware.updateAvailableMidiPorts();

    expect(messageMiddleware.availableMidiPorts.inputs.length).toBe(2, 'The midi ĭnput ports should now be configured.');
    expect(messageMiddleware.availableMidiPorts.outputs.length).toBe(2, 'The midi outputs should now be configured.');
  });

  it('should be able to listen on midi ports.', function(){
    var result,
      midiListener = function(){};

    spyOn(legatoMock, 'in').andReturn('/1');
    spyOn(legatoMock.midi, 'In').andReturn(midiListener);

    result = messageMiddleware.listenToMidiPort(0);

    expect(legatoMock.in).toHaveBeenCalledWith(midiListener);
    expect(result).toBe('/1', 'The id of new port should be returned.');
  });

  it('should be able to remove midi ports', function(){
    var result;
    spyOn(legatoMock, 'in').andReturn('/1');
    spyOn(legatoMock, 'removeInput');

    result = messageMiddleware.listenToMidiPort(0);

    expect(legatoMock.in).toHaveBeenCalled();

    messageMiddleware.removeMidiPort(result);

    expect(legatoMock.removeInput).toHaveBeenCalledWith(result);
  });

  it('should be able to create legato paths.', function(){
    var path;

    path = messageMiddleware.getPath('/midi1', 1, 'note', '63');

    expect(path).toBe('/midi1/1/note/63');

    path = messageMiddleware.getPath('/1', ':', 'cc', '2');

    expect(path).toBe('/1/:/cc/2');
  });

  it('should be able to set a midi input.', function(){
    spyOn(legatoMock, 'on').andReturn(22);

    messageMiddleware.setMidiInput('/:', '63', 'note', ':');

    expect(legatoMock.on).toHaveBeenCalled();
    expect(legatoMock.on.calls[0].args[0])
      .toBe('/:/:/note/63', 'The path should have been called correctly.');

    inputConfigMock.inputs[1].midi.note = '64';
    messageMiddleware.setMidiInput('/:', '64', 'note', ':');

    expect(legatoMock.on.calls.length).toBe(2, 'The legato routes should have been updated.');
  });

  it('should be able to remove a midi input.', function(){
    spyOn(legatoMock, 'on').andReturn(22);
    spyOn(legatoMock, 'removeRoute');
    messageMiddleware.setMidiInput(1, '/:', '63', 'note', ':');

    expect(legatoMock.removeRoute).not.toHaveBeenCalled();

    messageMiddleware.removeInput(1);

    expect(legatoMock.removeRoute).toHaveBeenCalledWith(22);
  });

  it('should be able to add an OSC output host.', function(){
    spyOn(legatoMock.osc, 'Out').andReturn(function(){});

    var outputId = messageMiddleware.addOSCOutputHost('localhost', '9000');

    expect(legatoMock.osc.Out).toHaveBeenCalledWith('localhost', '9000');
    expect(outputId).toBe(1, 'An id should have been returned to access the new output.');
  });

  it('should be able to remove an existing OSC output host.', function(){
    var result1, id1, result2, result3;
    result1 = messageMiddleware.removeOSCOutputHost(1);

    expect(result1).toBe(false, 'It should not be possible to remove hosts that do not exist.');

    id1 = messageMiddleware.addOSCOutputHost('localhost', '9000');
    result2 = messageMiddleware.removeOSCOutputHost(id1);

    expect(result2).toBe(true);

    result3 = messageMiddleware.removeOSCOutputHost(id1);

    expect(result3).toBe(false, 'Cannot remove the same output multiple times.');
  });

  it('should be able to add an osc output.', function(){
    var inputPortId, outputHostId, inputId, outputId;
    inputPortId = messageMiddleware.listenToMidiPort(0);
    inputId = messageMiddleware.setMidiInput(inputPortId, ':', 'note', ':');
    outputHostId = messageMiddleware.addOSCOutputHost('localhost','9000');
    outputId = messageMiddleware.setOSCOutput(inputId, outputHostId, 1, '/path', ['foo','bar']);

    expect(outputId).not.toBeNull();
  });

  it('should send to all outputs on input events.', function(){
    // TODO
  });
});
