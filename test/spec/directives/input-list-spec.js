describe('Directive: inputList', function () {
  'use strict';
  var element, template, parentScope, isolatedScope, inputConfigMock,
    messageMiddlewareMock, swapMessageMiddleware, swapInputConfig,
    swapMidiPortConfig, midiPortConfigMock;

  beforeEach(module('oscmodulatorApp'));
  beforeEach(module('views/input-list.html'));
  beforeEach(module('views/midi-input.html'));
  beforeEach(module('views/osc-output.html'));

  beforeEach(function() {
    template = angular.element('<div data-input-list></div>');
    swapMessageMiddleware();
    swapMidiPortConfig();
    swapInputConfig();
  });

  swapMessageMiddleware = function(){
    messageMiddlewareMock = {
      availableMidiPorts: {
        inputs: ['a','b']
      },
      setMidiInput: function(){},
      removeInput: function(){},
      setOSCOutput: function(){},
      removeOSCOutput: function(){},
      updateOSCOutput: function(){}
    };

    module(function($provide){
      $provide.value('messageMiddleware', messageMiddlewareMock);
    });
  };

  swapMidiPortConfig = function(){
    var portA = {
      name:'a',
      id: '/a',
      index: 0,
      enabled: true
    }, portB = {
      name:'b',
      id:'/b',
      index:1,
      enabled:false
    }, portAll = {
      name:'All',
      id:'/:',
      index:null,
      enabled:true
    };

    midiPortConfigMock = {
      ports: [portA,portB],
      enabledPorts: [portAll,portA],
      defaultMidiPort: portAll
    };

    module(function($provide){
      $provide.value('midiPortConfig', midiPortConfigMock);
    });
  };

  swapInputConfig = function(){
    inputConfigMock = {
      addInput: function(){},
      deleteInput: function(){},
      removeInput: function(){},
      duplicateInput: function(){},
      addOutput: function(){},
      removeOutput: function(){},
      inputs:{
        1:{
          id:{input:1},
          name:'bob',
          collapsed:false,
          mute:false,
          solo:false,
          valid: false,
          midi:{
            name: 'c3',
            note: 36,
            type:'All',
            port:{
              name:'All',
              id: '/:',
              index: null,
              enabled: true
            },
            channel: 'All'
          },
          outputs:{
            1:{
              id:{
                input:1,
                output:1
              },
              host:{
                id:1,
                name:'a',
                address:'localhost',
                port:'9000'
              },
              path:'/path',
              parameters:[],
              valid: false
            }
          }
        }
      }
    };

    module(function($provide){
      $provide.value('inputConfig', inputConfigMock);
    });
  };

  it('should provide access to the oscHostConfig object.', inject(function($rootScope, $compile){
    parentScope = $rootScope.$new();

    element = $compile(template)(parentScope);
    isolatedScope = element.scope();
    isolatedScope.$apply();

    expect(isolatedScope.inputConfig).toBeDefined('The inputConfig should be accessible on the scope.');
  }));

  it('should be able to add inputs when they become valid.', inject(function($rootScope, $compile){
    inputConfigMock.inputs[1].midi.name = null;
    inputConfigMock.inputs[1].midi.note = null;

    parentScope = $rootScope.$new();

    spyOn(messageMiddlewareMock, 'setMidiInput');

    element = $compile(template)(parentScope);
    isolatedScope = element.scope();
    isolatedScope.$apply();

    expect(messageMiddlewareMock.setMidiInput).not.toHaveBeenCalled();

    inputConfigMock.inputs[1].midi.name = 'c3';
    inputConfigMock.inputs[1].midi.note = 36;
    inputConfigMock.inputs[1].valid = true;
    parentScope.$broadcast('input:midi:add', {input:1});

    expect(messageMiddlewareMock.setMidiInput).toHaveBeenCalledWith('/:', 36, 'All', 'All');
  }));

  it('should update the messageMiddleware when an input changes.', inject(function($rootScope, $compile){
    inputConfigMock.inputs[1].midi.name = null;
    parentScope = $rootScope.$new();

    spyOn(messageMiddlewareMock, 'setMidiInput');

    element = $compile(template)(parentScope);
    isolatedScope = element.scope();
    isolatedScope.$apply();

    expect(messageMiddlewareMock.setMidiInput).not.toHaveBeenCalled();

    inputConfigMock.inputs[1].midi.name = 'c3';
    inputConfigMock.inputs[1].midi.note = 36;
    inputConfigMock.inputs[1].valid = true;
    parentScope.$broadcast('input:midi:update', {input:1});

    expect(messageMiddlewareMock.setMidiInput).toHaveBeenCalledWith('/:', 36, 'All', 'All');
  }));

  it('should be able to delete midi inputs.', inject(function($rootScope, $compile){
    inputConfigMock.inputs[1].midi.name = 'c3';
    parentScope = $rootScope.$new();

    spyOn(messageMiddlewareMock, 'removeInput');
    spyOn(inputConfigMock, 'removeInput');

    element = $compile(template)(parentScope);
    isolatedScope = element.scope();
    isolatedScope.$apply();

    expect(messageMiddlewareMock.removeInput).not.toHaveBeenCalled();
    expect(inputConfigMock.removeInput).not.toHaveBeenCalled();

    parentScope.$broadcast('input:midi:delete', {input:1});

    expect(messageMiddlewareMock.removeInput).toHaveBeenCalledWith(1);
    expect(inputConfigMock.removeInput).toHaveBeenCalledWith({input:1});
  }));

  it('should be able to disable midi inputs.', inject(function($rootScope, $compile){
    parentScope = $rootScope.$new();

    spyOn(messageMiddlewareMock, 'removeInput');
    spyOn(inputConfigMock, 'removeInput');

    element = $compile(template)(parentScope);
    isolatedScope = element.scope();
    isolatedScope.$apply();

    expect(messageMiddlewareMock.removeInput).not.toHaveBeenCalled();
    expect(inputConfigMock.removeInput).not.toHaveBeenCalled();

    parentScope.$broadcast('input:midi:disable', {input:1});

    expect(messageMiddlewareMock.removeInput).toHaveBeenCalledWith(1);
    expect(inputConfigMock.removeInput).not.toHaveBeenCalled();
  }));

  it('should be able to duplicate midi inputs.', inject(function($rootScope, $compile){
    parentScope = $rootScope.$new();

    spyOn(inputConfigMock, 'duplicateInput');

    element = $compile(template)(parentScope);
    isolatedScope = element.scope();
    isolatedScope.$apply();

    expect(inputConfigMock.duplicateInput).not.toHaveBeenCalled();

    parentScope.$broadcast('input:midi:duplicate', {input:1});

    expect(inputConfigMock.duplicateInput).toHaveBeenCalledWith({input:1});
  }));

  it('should create OSC outputs when an input requests one.', inject(function($rootScope, $compile){
    parentScope = $rootScope.$new();

    spyOn(inputConfigMock, 'addOutput');

    element = $compile(template)(parentScope);
    isolatedScope = element.scope();
    isolatedScope.$apply();

    expect(inputConfigMock.addOutput).not.toHaveBeenCalled();

    parentScope.$broadcast('output:osc:create');

    expect(inputConfigMock.addOutput).toHaveBeenCalled();
  }));

  it('should tell the messageMiddleware when outputs become valid.', inject(function($rootScope, $compile){
    inputConfigMock.inputs[1].midi.name = 'c3';
    parentScope = $rootScope.$new();

    spyOn(messageMiddlewareMock, 'setOSCOutput');

    element = $compile(template)(parentScope);
    isolatedScope = element.scope();
    isolatedScope.$apply();

    expect(messageMiddlewareMock.setOSCOutput).toHaveBeenCalledWith(1, 1, 1, '/path', []);
  }));

  it('should not tell the messageMiddleware if an output is added to an invalid input.', inject(function($compile, $rootScope){
    inputConfigMock.inputs[1].midi.note = null;
    inputConfigMock.inputs[1].midi.name = null;

    parentScope = $rootScope.$new();

    spyOn(messageMiddlewareMock, 'setOSCOutput');

    element = $compile(template)(parentScope);
    isolatedScope = element.scope();
    isolatedScope.$apply();

    expect(messageMiddlewareMock.setOSCOutput).not.toHaveBeenCalled();
  }));

  it('should update the messageMiddleware when osc outputs are modified.', inject(function($rootScope, $compile){
    inputConfigMock.inputs[1].midi.name = 'c3';
    parentScope = $rootScope.$new();

    spyOn(messageMiddlewareMock, 'updateOSCOutput');
    spyOn(messageMiddlewareMock, 'setOSCOutput');
    spyOn(messageMiddlewareMock, 'removeOSCOutput');

    element = $compile(template)(parentScope);
    isolatedScope = element.scope();
    isolatedScope.$apply();

    expect(messageMiddlewareMock.setOSCOutput).toHaveBeenCalled();
    expect(messageMiddlewareMock.removeOSCOutput).not.toHaveBeenCalled();
    expect(messageMiddlewareMock.updateOSCOutput).not.toHaveBeenCalled();

    inputConfigMock.inputs[1].outputs[1].path = '/new/path';
    $rootScope.$apply();

    expect(messageMiddlewareMock.setOSCOutput.calls.length).toBe(1,
      'The messageMiddleware should have only been called once.');
    expect(messageMiddlewareMock.removeOSCOutput).not.toHaveBeenCalled();
    expect(messageMiddlewareMock.updateOSCOutput).toHaveBeenCalledWith(1,1,1,'/new/path',[]);
  }));

  it('should not update the messageMiddleware if outputs are modified on an invalid input.',
    inject(function($compile, $rootScope){
      inputConfigMock.inputs[1].midi.note = null;
      inputConfigMock.inputs[1].midi.name = null;

      parentScope = $rootScope.$new();

      spyOn(messageMiddlewareMock, 'setOSCOutput');

      element = $compile(template)(parentScope);
      isolatedScope = element.scope();
      isolatedScope.$apply();

      expect(messageMiddlewareMock.setOSCOutput).not.toHaveBeenCalled();

      inputConfigMock.inputs[1].outputs[1].path = '/new/path';
      $rootScope.$apply();

      expect(messageMiddlewareMock.setOSCOutput).not.toHaveBeenCalled();
    })
  );

  it('should update the messageMiddleware if outputs are removed.', inject(function($compile, $rootScope){
    inputConfigMock.inputs[1].midi.name = 'c3';
    parentScope = $rootScope.$new();

    spyOn(messageMiddlewareMock, 'removeOSCOutput');

    element = $compile(template)(parentScope);
    isolatedScope = element.scope();
    isolatedScope.$apply();

    expect(messageMiddlewareMock.removeOSCOutput).not.toHaveBeenCalled();

    $rootScope.$broadcast('output:osc:remove', {input:1,output:1});

    expect(messageMiddlewareMock.removeOSCOutput).toHaveBeenCalledWith(1, 1);
  }));

  it('should not update the messageMiddleware if outputs are removed from invalid inputs but should update the input config.',
    inject(function($compile, $rootScope){
      inputConfigMock.inputs[1].midi.note = null;
      inputConfigMock.inputs[1].midi.name = null;

      parentScope = $rootScope.$new();

      spyOn(messageMiddlewareMock, 'setOSCOutput');
      spyOn(messageMiddlewareMock, 'removeOSCOutput');
      spyOn(inputConfigMock, 'removeOutput').andCallThrough();

      element = $compile(template)(parentScope);
      isolatedScope = element.scope();
      isolatedScope.$apply();

      expect(messageMiddlewareMock.setOSCOutput).not.toHaveBeenCalled();
      expect(messageMiddlewareMock.removeOSCOutput).not.toHaveBeenCalled();
      expect(inputConfigMock.removeOutput).not.toHaveBeenCalled();

      $rootScope.$broadcast('output:osc:remove', {input:1, output:1});

      expect(messageMiddlewareMock.removeOSCOutput).not.toHaveBeenCalled();
      expect(inputConfigMock.removeOutput).toHaveBeenCalledWith({input:1, output:1});
    })
  );

  it('should remove the output from the messageMiddleware if outputs become invalid.',
    inject(function($compile, $rootScope){
      parentScope = $rootScope.$new();

      spyOn(messageMiddlewareMock, 'setOSCOutput');
      spyOn(messageMiddlewareMock, 'removeOSCOutput');
      spyOn(inputConfigMock, 'removeOutput').andCallThrough();

      element = $compile(template)(parentScope);
      isolatedScope = element.scope();
      isolatedScope.$apply();

      expect(messageMiddlewareMock.setOSCOutput).toHaveBeenCalled();
      expect(messageMiddlewareMock.removeOSCOutput).not.toHaveBeenCalled();
      expect(inputConfigMock.removeOutput).not.toHaveBeenCalled();

      $rootScope.$broadcast('output:osc:disable', {input:1, output:1});

      expect(messageMiddlewareMock.setOSCOutput.calls.length).toBe(1);
      expect(messageMiddlewareMock.removeOSCOutput).toHaveBeenCalledWith(1, 1);
      expect(inputConfigMock.removeOutput).not.toHaveBeenCalled();
    })
  );

  it('should setup osc outputs if there are valid outputs when an input becomes valid.',
    inject(function($compile, $rootScope){
      inputConfigMock.inputs[1].midi.note = null;
      inputConfigMock.inputs[1].midi.name = null;
      inputConfigMock.inputs[1].outputs[2] = {
        id:{input:1, output:2},
        host:{
          id:2,
          name:'foo',
          port:9090,
          address:'localhost'
        },
        path:'/some/other/path',
        parameters:[]
      };

      parentScope = $rootScope.$new();

      spyOn(messageMiddlewareMock, 'setMidiInput');
      spyOn(messageMiddlewareMock, 'setOSCOutput');

      element = $compile(template)(parentScope);
      isolatedScope = element.scope();
      isolatedScope.$apply();

      expect(messageMiddlewareMock.setMidiInput).not.toHaveBeenCalled();
      expect(messageMiddlewareMock.setOSCOutput).not.toHaveBeenCalled();

      inputConfigMock.inputs[1].midi.note = 36;
      inputConfigMock.inputs[1].midi.name = 'c3';
      $rootScope.$apply();

      expect(messageMiddlewareMock.setMidiInput).toHaveBeenCalledWith('/:', 36, 'All', 'All');
      expect(messageMiddlewareMock.setOSCOutput.calls.length).toBe(2);
      expect(messageMiddlewareMock.setOSCOutput).toHaveBeenCalledWith(1, 1, 1, '/path', []);
      expect(messageMiddlewareMock.setOSCOutput).toHaveBeenCalledWith(1, 2, 2, '/some/other/path', []);
    })
  );
});
