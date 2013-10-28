describe('Directive: oscOutput', function () {
  'use strict';

  var element, parentScope, isolatedScope, template, defaultOSC;

  // load the directive's module
  beforeEach(module('oscmodulatorApp'));
  beforeEach(module('views/osc-output.html'));

  beforeEach(function(){
    // Create a DOM fragment to turn into a directive instance.
    template = angular.element(
      '<div data-osc-output data-osc-output-config="osc"></div>'
    );

    // Create a fresh scope for this test.
    defaultOSC = {
      host: null,
      path: null,
      parameters: []
    };
  });

  it('should provide reasonable defaults to scope properties if none are passed.', inject(function($compile, $rootScope){
    parentScope = $rootScope.$new();
    parentScope.osc = defaultOSC;
    parentScope.osc = {};

    // Compile the DOM into an Angular view using using our test scope.
    element = $compile(template)(parentScope);
    isolatedScope = element.scope();
    isolatedScope.$apply();

    expect(isolatedScope.config.host).toBeNull();
    expect(isolatedScope.config.path).toBeNull();
    expect(isolatedScope.config.parameters).toBeDefined();
    expect(isolatedScope.config.parameters.length).toBe(0);
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
    parentScope.osc.parameters = [
      {value:'a'},
      {value:'b'},
      {value:'c'}
    ];

    // Compile the DOM into an Angular view using using our test scope.
    element = $compile(template)(parentScope);
    isolatedScope = element.scope();
    isolatedScope.$apply();

    expect(isolatedScope.config.parameters.length).toBe(3);
    expect(element.find('div[name=oscParam]').length).toBe(3);

    isolatedScope.removeOSCParameter(1);
    isolatedScope.$apply();

    // Expect the directive and parent scopes to have one fewer parameters.
    expect(isolatedScope.config.parameters.length).toBe(2);
    expect(parentScope.osc.parameters.length).toBe(2);

    // Expect the DOM to have removed the b parameter.
    expect(element.find('div[name=oscParam]').length).toBe(2);
    expect(element.find('div[name=oscParam] input').first().val()).toBe('a');
    expect(element.find('div[name=oscParam] input').last().val()).toBe('c');
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

    expect(isolatedScope.config.parameters.length).toBe(2);

    isolatedScope.addOSCParameter();
    isolatedScope.$apply();

    // Expect the current and parent scopes to have one more parameter.
    expect(isolatedScope.config.parameters.length).toBe(3);
    expect(parentScope.osc.parameters.length).toBe(3);

    // Expect the DOM to have a new parameter at the end of the list.
    expect(element.find('div[name=oscParam]').length).toBe(3);
    expect(element.find('div[name=oscParam] input').first().val()).toBe('a');
    expect(element.find('div[name=oscParam] input').last().val()).toBe('');
  }));

  it('Should have an unconfigured select object for setting the OSC hosts.',
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
    })
  );

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

    // Compile the DOM into an Angular view using using our test scope.
    element = $compile(template)(parentScope);
    isolatedScope = element.scope();
    isolatedScope.$apply();

    expect(isolatedScope.config.path).toBeNull();
    expect(element.find('input[name=oscPath]').val()).toBe('');
  }));

  it('should be possible to configure the OSC path.', inject(function($compile, $rootScope){
    parentScope = $rootScope.$new();
    parentScope.osc = defaultOSC;
    parentScope.osc.path = '/path/to/object';

    // Compile the DOM into an Angular view using using our test scope.
    element = $compile(template)(parentScope);
    isolatedScope = element.scope();
    isolatedScope.$apply();

    expect(isolatedScope.config.path).toBe('/path/to/object');
    expect(element.find('input[name=oscPath]').val()).toBe('/path/to/object');
  }));

  it('should be possible to update the parent OSC path.', inject(function($compile, $rootScope){
    parentScope = $rootScope.$new();
    parentScope.osc = defaultOSC;
    parentScope.osc.path = '/my/first/path';

    // Compile the DOM into an Angular view using using our test scope.
    element = $compile(template)(parentScope);
    isolatedScope = element.scope();
    isolatedScope.$apply();

    expect(isolatedScope.config.path).toBe('/my/first/path');

    isolatedScope.config.path = '/my/second/path';
    isolatedScope.$apply();

    expect(parentScope.osc.path).toBe('/my/second/path');
    expect(element.find('input[name=oscPath]').val()).toBe('/my/second/path');
  }));

  it('should reset the OSC Host if the configured host was removed.', inject(function($compile, $rootScope){
    parentScope = $rootScope.$new();
    parentScope.osc = defaultOSC;
    parentScope.osc.host = 'b';

    // Compile the DOM into an Angular view using using our test scope.
    element = $compile(template)(parentScope);
    isolatedScope = element.scope();
    isolatedScope.$apply();

    expect(isolatedScope.config.host).toBe('b');

    $rootScope.$broadcast('oscHostConfig:remove', 'b');

    expect(isolatedScope.config.host).toBeNull();
  }));
});
