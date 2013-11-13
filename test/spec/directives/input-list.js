describe('Directive: inputList', function () {
  'use strict';
  var element, template, parentScope, isolatedScope, inputConfigMock, backendMock, defaultInputs, swapBackend, swapInputConfig;

  beforeEach(module('oscmodulatorApp'));
  beforeEach(module('views/input-list.html'));
  beforeEach(module('views/midi-input.html'));
  beforeEach(module('views/osc-output.html'));

  beforeEach(function() {
    template = angular.element('<div data-input-list></div>');

    defaultInputs = {
      1:{
        id:{input:1},
        name:'bob',
        collapsed:false,
        mute:false,
        solo:false,
        midi:{
          note:'c3',
          type:'on'
        },
        outputs:{
          1:{
            id:{
              input:1,
              output:1
            },
            host:'a',
            path:'/path',
            parameters:[]
          }
        }
      }
    };

    swapBackend();
  });

  swapBackend = function(){
    backendMock = {
      setMidiInput: function(){},
      removeInput: function(){},
      setOSCOutput: function(){},
      removeOutput: function(){}
    };

    module(function($provide){
      $provide.value('messageMiddleware', backendMock);
    });
  };

  swapInputConfig = function(){
    inputConfigMock = {
      addInput: function(){},
      removeInput: function(){},
      duplicateInput: function(){},
      addOutput: function(){}
    };

    module(function($provide){
      $provide.value('inputConfig', inputConfigMock);
    });
  };

  it('should provide access to the oscHostConfig object.', function(){
    swapInputConfig();

    inject(function($rootScope, $compile){
      parentScope = $rootScope.$new();

      element = $compile(template)(parentScope);
      isolatedScope = element.scope();
      isolatedScope.$apply();

      expect(isolatedScope.inputConfig).toBeDefined('The inputConfig should be accessible on the scope.');
    });
  });

  it('should be able to add inputs when they become valid.', function(){
    swapInputConfig();

    inject(function($rootScope, $compile){
      parentScope = $rootScope.$new();

      spyOn(backendMock, 'setMidiInput');

      element = $compile(template)(parentScope);
      isolatedScope = element.scope();
      isolatedScope.$apply();

      expect(backendMock.setMidiInput).not.toHaveBeenCalled();

      parentScope.$broadcast('input:midi:add', {input:1});

      expect(backendMock.setMidiInput).toHaveBeenCalledWith({input:1});
    });
  });

  it('should update the messageMiddleware when an input changes.', function(){
    swapInputConfig();

    inject(function($rootScope, $compile){
      parentScope = $rootScope.$new();

      spyOn(backendMock, 'setMidiInput');

      element = $compile(template)(parentScope);
      isolatedScope = element.scope();
      isolatedScope.$apply();

      expect(backendMock.setMidiInput).not.toHaveBeenCalled();

      parentScope.$broadcast('input:midi:update', {input:1});

      expect(backendMock.setMidiInput).toHaveBeenCalledWith({input:1});
    });
  });

  it('should be able to remove midi inputs.', function(){
    swapInputConfig();

    inject(function($rootScope, $compile){
      parentScope = $rootScope.$new();

      spyOn(backendMock, 'removeInput');
      spyOn(inputConfigMock, 'removeInput');

      element = $compile(template)(parentScope);
      isolatedScope = element.scope();
      isolatedScope.$apply();

      expect(backendMock.removeInput).not.toHaveBeenCalled();
      expect(inputConfigMock.removeInput).not.toHaveBeenCalled();

      parentScope.$broadcast('input:midi:remove', {input:1});

      expect(backendMock.removeInput).toHaveBeenCalledWith({input:1});
      expect(inputConfigMock.removeInput).toHaveBeenCalledWith({input:1});
    });
  });

  it('should be able to duplicate midi inputs.', function(){
    swapInputConfig();

    inject(function($rootScope, $compile){
      parentScope = $rootScope.$new();

      spyOn(inputConfigMock, 'duplicateInput');

      element = $compile(template)(parentScope);
      isolatedScope = element.scope();
      isolatedScope.$apply();

      expect(inputConfigMock.duplicateInput).not.toHaveBeenCalled();

      parentScope.$broadcast('input:midi:duplicate', {input:1});

      expect(inputConfigMock.duplicateInput).toHaveBeenCalledWith({input:1});
    });
  });

  it('should create OSC outputs when an input requests one.', function(){
    swapInputConfig();

    inject(function($rootScope, $compile){
      parentScope = $rootScope.$new();

      spyOn(inputConfigMock, 'addOutput');

      element = $compile(template)(parentScope);
      isolatedScope = element.scope();
      isolatedScope.$apply();

      expect(inputConfigMock.addOutput).not.toHaveBeenCalled();

      parentScope.$broadcast('output:osc:create');

      expect(inputConfigMock.addOutput).toHaveBeenCalled();
    });
  });

  it('should tell the messageMiddleware when outputs become valid.', function(){
    swapInputConfig();

    inject(function($rootScope, $compile){
      inputConfigMock.inputs = defaultInputs;

      parentScope = $rootScope.$new();

      spyOn(backendMock, 'setOSCOutput');

      element = $compile(template)(parentScope);
      isolatedScope = element.scope();
      isolatedScope.$apply();

      expect(backendMock.setOSCOutput).toHaveBeenCalledWith({input:1, output:1});
    });
  });

  it('should not tell the messageMiddleware if an output is added to an invalid input.', function(){
    swapInputConfig();

    inject(function($compile, $rootScope){
      inputConfigMock.inputs = defaultInputs;
      inputConfigMock.inputs[1].midi.note = null;

      parentScope = $rootScope.$new();

      spyOn(backendMock, 'setOSCOutput');

      element = $compile(template)(parentScope);
      isolatedScope = element.scope();
      isolatedScope.$apply();

      expect(backendMock.setOSCOutput).not.toHaveBeenCalled();
    });
  });

  it('should update the messageMiddleware when osc outputs are modified.', inject(function($rootScope, $compile, inputConfig){
    inputConfig.inputs = defaultInputs;

    parentScope = $rootScope.$new();

    spyOn(backendMock, 'setOSCOutput');
    spyOn(backendMock, 'removeOutput');

    element = $compile(template)(parentScope);
    isolatedScope = element.scope();
    isolatedScope.$apply();

    expect(backendMock.setOSCOutput).toHaveBeenCalled();
    expect(backendMock.removeOutput).not.toHaveBeenCalled();

    inputConfig.inputs[1].outputs[1].path = '/new/path';
    inputConfig.$apply();

    expect(backendMock.setOSCOutput.calls.length).toBe(2, 'The messageMiddleware should be updated when the output path changes.');
    expect(backendMock.removeOutput).toHaveBeenCalledWith({input:1, output:1});
  }));

  it('should not update the messageMiddleware if outputs are modified on an invalid input.',
    inject(function($compile, $rootScope, inputConfig){
      inputConfig.inputs = defaultInputs;
      inputConfig.inputs[1].midi.note = null;

      parentScope = $rootScope.$new();

      spyOn(backendMock, 'setOSCOutput');

      element = $compile(template)(parentScope);
      isolatedScope = element.scope();
      isolatedScope.$apply();

      expect(backendMock.setOSCOutput).not.toHaveBeenCalled();

      inputConfig.inputs[1].outputs[1].path = '/new/path';
      inputConfig.$apply();

      expect(backendMock.setOSCOutput).not.toHaveBeenCalled();
    })
  );

  it('should update the messageMiddleware if outputs are removed.', inject(function($compile, $rootScope, inputConfig){
    inputConfig.inputs = defaultInputs;

    parentScope = $rootScope.$new();

    spyOn(backendMock, 'removeOutput');

    element = $compile(template)(parentScope);
    isolatedScope = element.scope();
    isolatedScope.$apply();

    expect(backendMock.removeOutput).not.toHaveBeenCalled();

    $rootScope.$broadcast('output:osc:remove', {input:1,output:1});

    expect(backendMock.removeOutput).toHaveBeenCalledWith({input:1,output:1});
  }));

  it('should not update the messageMiddleware if outputs are removed from invalid inputs but should update the input config.',
    inject(function($compile, $rootScope, inputConfig){
      inputConfig.inputs = defaultInputs;
      inputConfig.inputs[1].midi.note = null;

      parentScope = $rootScope.$new();

      spyOn(backendMock, 'setOSCOutput');
      spyOn(backendMock, 'removeOutput');
      spyOn(inputConfig, 'removeOutput').andCallThrough();

      element = $compile(template)(parentScope);
      isolatedScope = element.scope();
      isolatedScope.$apply();

      expect(backendMock.setOSCOutput).not.toHaveBeenCalled();
      expect(backendMock.removeOutput).not.toHaveBeenCalled();
      expect(inputConfig.removeOutput).not.toHaveBeenCalled();

      $rootScope.$broadcast('output:osc:remove', {input:1, output:1});

      expect(backendMock.removeOutput).not.toHaveBeenCalled();
      expect(inputConfig.removeOutput).toHaveBeenCalledWith({input:1, output:1});
    })
  );
});
