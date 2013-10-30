describe('Directive: oscOutput', function () {
  'use strict';

  var element, parentScope, isolatedScope, template, defaultOSC, backendMock, oscHostConfigMock;

  // load the directive's module
  beforeEach(module('oscmodulatorApp'));
  beforeEach(module('views/osc-output.html'));

  beforeEach(function(){
    // Create a DOM fragment to turn into a directive instance.
    template = angular.element(
      '<div data-osc-output data-osc-output-config="osc" data-remove="removeOSCOutput(index)"></div>'
    );

    // Create a fresh scope for this test.
    defaultOSC = {
      id: {input:1, output:1},
      host: null,
      path: null,
      parameters: []
    };

    backendMock = {
      setOSCOutput: function(){},
      setOSCParameters: function(){},
      setOSCPath: function(){},
      setOSCHost: function(){},
      removeOSCOutput: function(){}
    };

    oscHostConfigMock = {
      hosts:[
        {
          name:'a',
          address: 'localhost',
          port: 9000
        },
        {
          name: 'b',
          address: 'localhost',
          port: 9001
        },
        {
          name: 'c',
          address: 'localhost',
          port: 9002
        }
      ],
      ids:['a','b','c']
    };

    // Provide a mock version of the oscHostConfig service.
    module(function($provide){
      $provide.value('oscHostConfig', oscHostConfigMock);
      $provide.value('backend', backendMock);
    });
  });

  it('should provide reasonable defaults to scope properties if none are passed.', inject(function($compile, $rootScope){
    parentScope = $rootScope.$new();
    parentScope.osc = {
      id: {
        input: 1,
        output: 1
      }
    };

    // Compile the DOM into an Angular view using using our test scope.
    element = $compile(template)(parentScope);
    isolatedScope = element.scope();
    isolatedScope.$apply();

    expect(isolatedScope.config.host).toBeNull('The default host should be un-configured.');
    expect(isolatedScope.config.path).toBeNull('The default path should be un-configured.');
    expect(isolatedScope.config.parameters).toBeDefined('The default parameters list should exist.');
    expect(isolatedScope.config.parameters.length).toBe(0, 'The default parameters list should be empty.');
    expect(isolatedScope.config.id).toBeDefined('The input should have an id.');
    expect(isolatedScope.config.id).toEqual({input:1, output:1}, 'The input should not modify its id.');
    expect(isolatedScope.valid).toBe(false, 'The output should not be considered valid in its default state.');
  }));

  it('should default to having no osc parameters.', inject(function($compile, $rootScope){
    parentScope = $rootScope.$new();
    parentScope.osc = defaultOSC;

    // Compile the DOM into an Angular view using using our test scope.
    element = $compile(template)(parentScope);
    isolatedScope = element.scope();
    isolatedScope.$apply();

    expect(isolatedScope.config.parameters.length).toBe(0);
    expect(element.find('div[name=oscParam]').length).toBe(0);
  }));

  it('should be able to remove osc parameters.', inject(function($compile, $rootScope){
    parentScope = $rootScope.$new();
    parentScope.osc = defaultOSC;
    parentScope.osc.host = 'a';
    parentScope.osc.path = '/path';
    parentScope.osc.parameters = [
      {value:'a'},
      {value:'b'},
      {value:'c'}
    ];

    // Compile the DOM into an Angular view using using our test scope.
    element = $compile(template)(parentScope);
    isolatedScope = element.scope();
    isolatedScope.$apply();

    expect(isolatedScope.config.parameters.length).toBe(3, 'The output should have the parameters specified by the parent.');
    expect(element.find('div[name=oscParam]').length).toBe(3, 'The DOM should reflect the parameters specified by the parent.');

    spyOn(backendMock, 'setOSCParameters');
    isolatedScope.removeOSCParameter(1);
    isolatedScope.$apply();

    expect(isolatedScope.config.parameters.length).toBe(2, 'The output should have one less parameter.');
    expect(parentScope.osc.parameters.length).toBe(2, 'The parent scope should reflect that a parameter was removed.');
    expect(element.find('div[name=oscParam]').length).toBe(2, 'The DOM should reflect removal of the parameter.');
    expect(element.find('div[name=oscParam] input').first().val())
      .toBe('a', 'The first parameter input in the DOM should show the correct value.');
    expect(element.find('div[name=oscParam] input').last().val())
      .toBe('c', 'The last parameter input in the DOM should show the correct value.');
    expect(backendMock.setOSCParameters).toHaveBeenCalledWith({input:1, output:1},['a','c']);
  }));

  it('should be able to add osc parameters.', inject(function($compile, $rootScope){
    parentScope = $rootScope.$new();
    parentScope.osc = defaultOSC;
    parentScope.osc.parameters = [
      {value:'a'},
      {value:'b'}
    ];

    // Compile the DOM into an Angular view using using our test scope.
    element = $compile(template)(parentScope);
    isolatedScope = element.scope();
    isolatedScope.$apply();

    expect(isolatedScope.config.parameters.length).toBe(2, 'The parameters should be pre-configured.');

    spyOn(backendMock, 'setOSCParameters');
    isolatedScope.addOSCParameter();
    isolatedScope.$apply();

    expect(isolatedScope.config.parameters.length).toBe(3, 'A new parameter should have been added.');
    expect(parentScope.osc.parameters.length).toBe(3, 'The parent scope should reflect the new parameter.');
    expect(element.find('div[name=oscParam]').length).toBe(3, 'The DOM should show the new parameter.');
    expect(element.find('div[name=oscParam] input').first().val())
      .toBe('a', 'The first parameter in the DOM should remain unchanged.');
    expect(element.find('div[name=oscParam] input').last().val())
      .toBe('', 'The last parameter in the DOM should be un-configured.');
    expect(backendMock.setOSCParameters).not.toHaveBeenCalled();
  }));

  it('should tell the backend if one of the OSC parameters changed.', inject(function($compile, $rootScope){
    parentScope = $rootScope.$new();
    parentScope.osc = defaultOSC;
    parentScope.osc.host = 'a';
    parentScope.osc.path = '/path';

    spyOn(backendMock, 'setOSCParameters');

    // Compile the DOM into an Angular view using using our test scope.
    element = $compile(template)(parentScope);
    isolatedScope = element.scope();
    isolatedScope.$apply();

    expect(backendMock.setOSCParameters).not.toHaveBeenCalled();

    isolatedScope.addOSCParameter();
    isolatedScope.config.parameters[0].value = 'a';
    isolatedScope.$apply();

    expect(backendMock.setOSCParameters).toHaveBeenCalledWith({input:1, output:1}, ['a']);

    isolatedScope.addOSCParameter();
    isolatedScope.$apply();

    expect(backendMock.setOSCParameters.calls.length)
      .toBe(1, 'The backend should not be called if not specifying new parameters.');

    isolatedScope.config.parameters[1].value = 'b';
    isolatedScope.$apply();

    expect(backendMock.setOSCParameters.calls.length)
      .toBe(2, 'The backend should be updated when the new parameter becomes valid.');
  }));

  it('Should have an un-configured select object for setting the OSC hosts.', function(){
    // Pretend that we haven't setup any host configurations yet.
    module(function($provide){
      $provide.value('oscHostConfig', {hosts:[], ids:[]});
    });

    inject(function ($compile, $rootScope){
      parentScope = $rootScope.$new();
      parentScope.osc = defaultOSC;

      // Compile the DOM into an Angular view using using our test scope.
      element = $compile(template)(parentScope);
      isolatedScope = element.scope();
      isolatedScope.$apply();

      expect(isolatedScope.config.host).toBeNull();

      // There should be a select object with one option that is unconfigured.
      expect(element.find('select.oscHost option').length).toEqual(1);
      expect(element.find('select.oscHost option').attr('value')).toBe('');
    });
  });

  it('Should be possible to configure the OSC host list but should not set a default.', function(){
      // Provide a mock version of the oscHostConfig service.
      module(function($provide){
        $provide.value('oscHostConfig', {hosts:[], ids:['a','b','c']});
      });

      // Have to perform dependency injection after creating the mocks.
      inject(function($compile, $rootScope){
        parentScope = $rootScope.$new();
        parentScope.osc = defaultOSC;

        // Compile the DOM into an Angular view using using our test scope.
        element = $compile(template)(parentScope);
        isolatedScope = element.scope();
        isolatedScope.$apply();

        expect(isolatedScope.config.host).toBeNull();
        expect(isolatedScope.hosts.ids.length).toBe(3);

        // Should have the 3 options set in the scope and an empty option.
        expect(element.find('select.oscHost option').length).toEqual(4);
        // Where the first element is unconfigured.
        expect(element.find('select.oscHost option').first().text()).toBe('');
      });
    }
  );

  it('should be possible to set the default OSC host through config.', function() {
    // Provide a mock version of the oscHostConfig service.
    module(function($provide){
      $provide.value('oscHostConfig', {hosts:[], ids:['host 1','host 2','host 3']});
    });

    inject(function($compile, $rootScope){
      parentScope = $rootScope.$new();
      parentScope.osc = defaultOSC;
      parentScope.hosts = ['host 1', 'host 2', 'host 3'];
      parentScope.osc.host = 'host 2';

      // Compile the DOM into an Angular view using using our test scope.
      element = $compile(template)(parentScope);
      isolatedScope = element.scope();
      isolatedScope.$apply();

      expect(isolatedScope.config.host).toBe('host 2');

      // Should only have the 3 options specified in the scope.
      expect(element.find('select.oscHost option').length).toEqual(3);
      expect(element.find('select.oscHost option').first().text()).toBe('host 1');
      expect(element.find('select.oscHost option').last().text()).toBe('host 3');
      expect(element.find('select.oscHost option').first().next().attr('selected')).toBe('selected');
    });
  });

  it('should default to an empty OSC path.', inject(function($compile, $rootScope){
    parentScope = $rootScope.$new();
    parentScope.osc = defaultOSC;

    spyOn(backendMock, 'setOSCPath');

    // Compile the DOM into an Angular view using using our test scope.
    element = $compile(template)(parentScope);
    isolatedScope = element.scope();
    isolatedScope.$apply();

    expect(isolatedScope.config.path).toBeNull();
    expect(element.find('input[name=oscPath]').val()).toBe('');
    expect(backendMock.setOSCPath).not.toHaveBeenCalled();
  }));

  it('should be possible to configure the OSC path.', inject(function($compile, $rootScope){
    parentScope = $rootScope.$new();
    parentScope.osc = defaultOSC;
    parentScope.osc.path = '/path/to/object';
    parentScope.osc.host = 'a';

    spyOn(backendMock, 'setOSCOutput');

    // Compile the DOM into an Angular view using using our test scope.
    element = $compile(template)(parentScope);
    isolatedScope = element.scope();
    isolatedScope.$apply();

    expect(isolatedScope.config.path).toBe('/path/to/object');
    expect(element.find('input[name=oscPath]').val()).toBe('/path/to/object');
    expect(backendMock.setOSCOutput)
      .toHaveBeenCalledWith({id:{input:1, output:1}, path:'/path/to/object', host:'a', parameters:[]});
  }));

  it('should update the parent OSC path.', inject(function($compile, $rootScope){
    parentScope = $rootScope.$new();
    parentScope.osc = defaultOSC;
    parentScope.osc.path = '/my/first/path';
    parentScope.osc.host = 'a';

    spyOn(backendMock, 'setOSCPath');
    spyOn(backendMock, 'setOSCOutput');

    // Compile the DOM into an Angular view using using our test scope.
    element = $compile(template)(parentScope);
    isolatedScope = element.scope();
    isolatedScope.$apply();

    expect(isolatedScope.config.path).toBe('/my/first/path');
    expect(backendMock.setOSCOutput)
      .toHaveBeenCalledWith({id:{input:1, output:1}, path:'/my/first/path', host:'a', parameters:[]});

    isolatedScope.config.path = '/my/second/path';
    isolatedScope.$apply();

    expect(parentScope.osc.path).toBe('/my/second/path');
    expect(element.find('input[name=oscPath]').val()).toBe('/my/second/path');
    expect(backendMock.setOSCPath.calls.length).toBe(1, 'The backend should have been updated when updating the path.');
    expect(backendMock.setOSCPath.mostRecentCall.args[1])
      .toBe('/my/second/path', 'The backend should have received an updated path.');
  }));

  it('should reset the OSC Host if the configured host was removed.', inject(function($compile, $rootScope){
    parentScope = $rootScope.$new();
    parentScope.osc = defaultOSC;
    parentScope.osc.host = 'b';
    parentScope.osc.path = '/path';

    spyOn(backendMock, 'removeOSCOutput');

    // Compile the DOM into an Angular view using using our test scope.
    element = $compile(template)(parentScope);
    isolatedScope = element.scope();
    isolatedScope.$apply();

    expect(isolatedScope.config.host).toBe('b', 'The output should be configured with the b host to start.');
    expect(isolatedScope.valid).toBe(true, 'The output should be considered valid to start with.');

    $rootScope.$broadcast('oscHostConfig:remove', 'b');

    expect(isolatedScope.config.host).toBeNull('The host should have been reset.');
    expect(isolatedScope.valid).toBe(false, 'The output should not be valid without a valid host.');
    expect(backendMock.removeOSCOutput).toHaveBeenCalledWith({input:1, output:1});
  }));

  it('should be considered valid if it has a path and host.', inject(function($compile, $rootScope){
    parentScope = $rootScope.$new();
    parentScope.osc = defaultOSC;
    parentScope.osc.host = 'b';
    parentScope.osc.path = '/path';

    spyOn(backendMock, 'setOSCOutput');

    // Compile the DOM into an Angular view using using our test scope.
    element = $compile(template)(parentScope);
    isolatedScope = element.scope();
    isolatedScope.$apply();

    expect(isolatedScope.valid).toBe(true, 'The scope should be valid if it has a path and a host.');
    expect(isolatedScope.isValid()).toBe(true, 'The scope isValid method should return the valid property value.');
    expect(backendMock.setOSCOutput).toHaveBeenCalledWith({id:{input:1, output:1}, host:'b', path:'/path', parameters:[]});
  }));

  it('should not be considered valid if it is missing the path.', inject(function($compile, $rootScope){
    parentScope = $rootScope.$new();
    parentScope.osc = defaultOSC;
    parentScope.osc.host = 'b';

    spyOn(backendMock, 'removeOSCOutput');

    // Compile the DOM into an Angular view using using our test scope.
    element = $compile(template)(parentScope);
    isolatedScope = element.scope();
    isolatedScope.$apply();

    expect(isolatedScope.valid).toBe(false, 'The output should not be valid without a path.');
    expect(isolatedScope.isValid()).toBe(false, 'The output isValid method should return the valid property value.');
    expect(backendMock.removeOSCOutput).not.toHaveBeenCalled();

    isolatedScope.config.path = '/path';
    isolatedScope.$apply();

    expect(isolatedScope.valid).toBe(true, 'The output should be valid once a path is set.');
    expect(backendMock.removeOSCOutput).not.toHaveBeenCalled();

    isolatedScope.config.path = '';
    isolatedScope.$apply();

    expect(isolatedScope.valid).toBe(false, 'The output should be invalid if the path is emptied.');
    expect(backendMock.removeOSCOutput).toHaveBeenCalledWith({input:1, output:1});
  }));

  it('should not be considered valid if it is missing the host.', inject(function($compile, $rootScope){
    parentScope = $rootScope.$new();
    parentScope.osc = defaultOSC;
    parentScope.osc.path = '/path';

    spyOn(backendMock, 'removeOSCOutput');

    // Compile the DOM into an Angular view using using our test scope.
    element = $compile(template)(parentScope);
    isolatedScope = element.scope();
    isolatedScope.$apply();

    expect(isolatedScope.valid).toBe(false, 'The scope should not be valid without a host.');
    expect(isolatedScope.isValid()).toBe(false, 'The scope isValid method should return the valid property value.');
    expect(backendMock.removeOSCOutput).not.toHaveBeenCalled();

    isolatedScope.config.host = 'a';
    isolatedScope.$apply();

    expect(isolatedScope.valid).toBe(true, 'The scope should be valid once a host is set.');
    expect(backendMock.removeOSCOutput).not.toHaveBeenCalled();

    isolatedScope.config.host = null;
    isolatedScope.$apply();

    expect(isolatedScope.valid).toBe(false, 'The scope should be invalid if the host is emptied.');
    expect(backendMock.removeOSCOutput).toHaveBeenCalledWith({input:1, output:1});
  }));

  it('should update the backend service when it becomes valid.', inject(function($compile, $rootScope){
    parentScope = $rootScope.$new();
    parentScope.osc = defaultOSC;
    parentScope.osc.path = '/path';

    spyOn(backendMock, 'setOSCOutput');

    // Compile the DOM into an Angular view using using our test scope.
    element = $compile(template)(parentScope);
    isolatedScope = element.scope();
    isolatedScope.$apply();

    expect(backendMock.setOSCOutput).not.toHaveBeenCalled();

    isolatedScope.config.host = 'a';
    isolatedScope.$apply();

    expect(backendMock.setOSCOutput).toHaveBeenCalledWith({id:{input:1, output:1}, host:'a', path:'/path', parameters:[]});
  }));

  it('should update the osc path on the backend when it changes.', inject(function($compile, $rootScope){
    parentScope = $rootScope.$new();
    parentScope.osc = defaultOSC;
    parentScope.osc.path = '/path';
    parentScope.osc.host = 'a';

    spyOn(backendMock, 'setOSCOutput');
    spyOn(backendMock, 'setOSCPath');

    // Compile the DOM into an Angular view using using our test scope.
    element = $compile(template)(parentScope);
    isolatedScope = element.scope();
    isolatedScope.$apply();

    expect(backendMock.setOSCOutput).toHaveBeenCalled();

    isolatedScope.config.path = '/new/path';
    isolatedScope.$apply();

    expect(backendMock.setOSCOutput.calls.length).toBe(1, 'The output should only be added to the backend once.');
    expect(backendMock.setOSCPath).toHaveBeenCalledWith({input:1, output:1}, '/new/path');
  }));

  it('should update the osc host on the backend when it changes.', inject(function($compile, $rootScope){
    parentScope = $rootScope.$new();
    parentScope.osc = defaultOSC;
    parentScope.osc.host = 'a';
    parentScope.osc.path = '/path';

    spyOn(backendMock, 'setOSCOutput');
    spyOn(backendMock, 'setOSCHost');

    // Compile the DOM into an Angular view using using our test scope.
    element = $compile(template)(parentScope);
    isolatedScope = element.scope();
    isolatedScope.$apply();

    expect(backendMock.setOSCOutput).toHaveBeenCalled();

    isolatedScope.config.host = 'b';
    isolatedScope.$apply();

    expect(backendMock.setOSCOutput.calls.length).toBe(1, 'The output should only be added to the backend once.');
    expect(backendMock.setOSCHost).toHaveBeenCalledWith({input:1, output:1}, 'b');
  }));
});
