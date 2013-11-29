describe('Service: messageMiddleware', function () {
  'use strict';
  var messageMiddleware, rootScope, legatoMock;

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
      }
    };

    module(function($provide){
      $provide.value('legato', legatoMock);
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

    spyOn(legatoMock, 'in').andReturn("/1");
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

  it('should be able to set a midi input.', inject(function(inputConfig){
    inputConfig.init([{
      midi:{
        note: '63',
        type: 'note'
      }
    }]);

    spyOn(legatoMock, 'on').andReturn(22);
    spyOn(legatoMock, 'removeRoute');
    messageMiddleware.setMidiInput(inputConfig.inputs[1].id);

    expect(legatoMock.on.calls[0].args[0]).toBe('/:/:/note/63', 'The path should have been called correctly.');
    expect(inputConfig.inputs[1].routeId).toBe(22, 'It should have stored the input id from legato.');
    expect(legatoMock.removeRoute).not.toHaveBeenCalled();

    inputConfig.inputs[1].midi.note = '64';
    messageMiddleware.setMidiInput(inputConfig.inputs[1].id);

    expect(legatoMock.on.calls.length).toBe(2, 'The legato routes should have been updated.');
    expect(legatoMock.removeRoute).toHaveBeenCalled();
  }));

  it('should be able to remove a midi input.', inject(function(inputConfig){
    inputConfig.init([{
      midi:{
        note: '63',
        type: 'note'
      }
    }]);

    spyOn(legatoMock, 'on').andReturn(22);
    spyOn(legatoMock, 'removeRoute');
    messageMiddleware.setMidiInput(inputConfig.inputs[1].id);

    expect(inputConfig.inputs[1].routeId).toBeDefined();
    expect(legatoMock.removeRoute).not.toHaveBeenCalled();

    messageMiddleware.removeInput(inputConfig.inputs[1].id);

    expect(legatoMock.removeRoute).toHaveBeenCalledWith(22);
    expect(inputConfig.inputs[1].routeId).toBeNull();
  }));
});
