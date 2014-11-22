describe('Directive: oscOutput', function () {
  'use strict';

  var element, parentScope, isolatedScope, template,
    defaultOSC, backendMock, oscHostConfigMock, setupEventListeners,
    getIsolatedScope;

  // load the directive's module
  beforeEach(module('oscmodulatorApp'));
  beforeEach(module('views/osc-output.html'));

  beforeEach(function () {
    // Create a DOM fragment to turn into a directive instance.
    template = angular.element(
      '<div data-osc-output data-osc-output-config="osc"></div>'
    );

    // Create a fresh scope for this test.
    defaultOSC = {
      id: {input: 1, output: 1},
      host: null,
      path: null,
      parameters: [],
      valid: false
    };

    backendMock = {
      setOSCOutput: function () {},
      setOSCParameters: function () {},
      setOSCPath: function () {},
      setOSCHost: function () {},
      removeOSCOutput: function () {}
    };

    oscHostConfigMock = {
      hosts: [
        {
          name: 'a',
          address: 'localhost',
          port: 9000,
          id: 0
        },
        {
          name: 'b',
          address: 'localhost',
          port: 9001,
          id: 1
        },
        {
          name: 'c',
          address: 'localhost',
          port: 9002,
          id: 2
        }
      ],
      ids: [
        {
          name: 'a',
          id: 0
        },
        {
          name: 'b',
          id: 1
        },
        {
          name: 'c',
          id: 2
        }
      ]
    };

    // Provide a mock version of the oscHostConfig service.
    module(function ($provide) {
      $provide.value('oscHostConfig', oscHostConfigMock);
      $provide.value('messageMiddleware', backendMock);
    });
  });

  // Replicate the event listening that will happen in the app.
  setupEventListeners = function (parentScope) {
    parentScope.add = function () {};
    parentScope.update = function () {};
    parentScope.remove = function () {};
    parentScope.disable = function () {};
    parentScope.$on('output:osc:add', function (event, id) {
      parentScope.add(id);
    });
    parentScope.$on('output:osc:update', function (event, id) {
      parentScope.update(id);
    });
    parentScope.$on('output:osc:remove', function (event, id) {
      parentScope.remove(id);
    });
    parentScope.$on('output:osc:disable', function (event, id) {
      parentScope.disable(id);
    });
  };

  getIsolatedScope = function (element) {
    var localScope = element.scope();
    localScope.$apply();
    return element.isolateScope();
  };

  it('should default to having no osc parameters.', inject(function ($compile, $rootScope) {
    parentScope = $rootScope.$new();
    parentScope.osc = defaultOSC;

    // Compile the DOM into an Angular view using using our test scope.
    element = $compile(template)(parentScope);
    isolatedScope = getIsolatedScope(element);
    isolatedScope.$apply();

    expect(isolatedScope.config.parameters.length).toBe(0);
    expect(element.find('div[name=oscParam]').length).toBe(0);
  }));

  it('should be able to remove osc parameters.', inject(function ($compile, $rootScope) {
    parentScope = $rootScope.$new();
    parentScope.osc = defaultOSC;
    parentScope.osc.host = 'a';
    parentScope.osc.path = '/path';
    parentScope.osc.parameters = ['a', 'b', 'c'];

    // Compile the DOM into an Angular view using using our test scope.
    element = $compile(template)(parentScope);
    isolatedScope = getIsolatedScope(element);
    isolatedScope.$apply();

    expect(isolatedScope.config.parameters.length).toBe(3, 'The output should have the parameters specified by the parent.');
    expect(element.find('div[name=oscParam]').length).toBe(3, 'The DOM should reflect the parameters specified by the parent.');

    isolatedScope.removeOSCParameter(1);
    isolatedScope.$apply();

    expect(isolatedScope.config.parameters.length).toBe(2, 'The output should have one less parameter.');
    expect(parentScope.osc.parameters.length).toBe(2, 'The parent scope should reflect that a parameter was removed.');
    expect(element.find('div[name=oscParam]').length).toBe(2, 'The DOM should reflect removal of the parameter.');
    expect(element.find('div[name=oscParam] input').first().val())
      .toBe('a', 'The first parameter input in the DOM should show the correct value.');
    expect(element.find('div[name=oscParam] input').last().val())
      .toBe('c', 'The last parameter input in the DOM should show the correct value.');
  }));

  it('should be able to add osc parameters.', inject(function ($compile, $rootScope) {
    parentScope = $rootScope.$new();
    parentScope.osc = defaultOSC;
    parentScope.osc.parameters = ['a', 'b'];

    // Compile the DOM into an Angular view using using our test scope.
    element = $compile(template)(parentScope);
    isolatedScope = getIsolatedScope(element);
    isolatedScope.$apply();

    expect(isolatedScope.config.parameters.length).toBe(2, 'The parameters should be pre-configured.');

    isolatedScope.addOSCParameter();
    isolatedScope.$apply();

    expect(isolatedScope.parameterInputs.length).toBe(3, 'A new parameter should have been added.');
    expect(parentScope.osc.parameters.length).toBe(2, 'The parent scope should not be udpated with empty parameters.');
    expect(element.find('div[name=oscParam]').length).toBe(3, 'The DOM should show the new parameter.');
    expect(element.find('div[name=oscParam] input').first().val())
      .toBe('a', 'The first parameter in the DOM should remain unchanged.');
    expect(element.find('div[name=oscParam] input').last().val())
      .toBe('', 'The last parameter in the DOM should be un-configured.');
  }));

  it('should send an update event if one of the OSC parameters changed.', inject(function ($compile, $rootScope) {
    parentScope = $rootScope.$new();
    parentScope.osc = defaultOSC;
    parentScope.osc.host = 'a';
    parentScope.osc.path = '/path';

    setupEventListeners(parentScope);

    spyOn(parentScope, 'update');

    // Compile the DOM into an Angular view using using our test scope.
    element = $compile(template)(parentScope);
    isolatedScope = getIsolatedScope(element);
    isolatedScope.$apply();

    expect(parentScope.update).not.toHaveBeenCalled();

    isolatedScope.addOSCParameter();
    isolatedScope.parameterInputs[0].value = 'a';
    isolatedScope.parametersChanged();
    isolatedScope.$apply();

    expect(isolatedScope.config.parameters.length)
      .toBe(1, 'The parameter list should have be updated with the value from the input.');
    expect(isolatedScope.config.parameters[0]).toBe('a', 'The first parameter should match the input value.');
    expect(parentScope.update).toHaveBeenCalledWith({input: 1, output: 1});

    isolatedScope.addOSCParameter();
    isolatedScope.$apply();

    expect(parentScope.update.calls.length).toBe(1, 'The update event should not be broadcast when adding empty inputs.');

    isolatedScope.parameterInputs[1].value = 'b';
    isolatedScope.parametersChanged();
    isolatedScope.$apply();

    expect(parentScope.update.calls.length)
      .toBe(2, 'The messageMiddleware should be updated when the new parameter becomes valid.');
  }));

  it('Should have an un-configured select object for setting the OSC hosts.', function () {
    // Pretend that we haven't setup any host configurations yet.
    module(function ($provide) {
      $provide.value('oscHostConfig', {hosts: [], ids: []});
    });

    inject(function ($compile, $rootScope) {
      parentScope = $rootScope.$new();
      parentScope.osc = defaultOSC;

      // Compile the DOM into an Angular view using using our test scope.
      element = $compile(template)(parentScope);
      isolatedScope = getIsolatedScope(element);
      isolatedScope.$apply();

      expect(isolatedScope.config.host).toBeNull();

      // There should be a select object with one option that is unconfigured.
      expect(element.find('select.oscHost option').length).toEqual(1);
      expect(element.find('select.oscHost option').attr('value')).toBe('');
    });
  });

  it('Should be possible to configure the OSC host list but should not set a default.', function () {
      // Provide a mock version of the oscHostConfig service.
      module(function ($provide) {
        $provide.value('oscHostConfig', oscHostConfigMock);
      });

      // Have to perform dependency injection after creating the mocks.
      inject(function ($compile, $rootScope) {
        parentScope = $rootScope.$new();
        parentScope.osc = defaultOSC;

        // Compile the DOM into an Angular view using using our test scope.
        element = $compile(template)(parentScope);
        isolatedScope = getIsolatedScope(element);
        isolatedScope.$apply();

        expect(isolatedScope.config.host).toBeNull();
        expect(isolatedScope.hosts.hosts.length).toBe(3);

        // Should have the 3 options set in the scope and an empty option.
        expect(element.find('select.oscHost option').length).toEqual(4);
        // Where the first element is unconfigured.
        expect(element.find('select.oscHost option').first().text()).toBe('');
      });
    }
  );

  it('should be possible to set the default OSC host through config.', function () {
    // Provide a mock version of the oscHostConfig service.
    module(function ($provide) {
      $provide.value('oscHostConfig', oscHostConfigMock);
    });

    inject(function ($compile, $rootScope) {
      parentScope = $rootScope.$new();
      parentScope.osc = defaultOSC;
      parentScope.hosts = oscHostConfigMock;
      parentScope.osc.host = oscHostConfigMock.ids[1];

      // Compile the DOM into an Angular view using using our test scope.
      element = $compile(template)(parentScope);
      isolatedScope = getIsolatedScope(element);
      isolatedScope.$apply();

      expect(isolatedScope.config.host).toBe(oscHostConfigMock.ids[1]);

      // Should only have the 3 options specified in the scope.
      expect(element.find('select.oscHost option').length).toEqual(3);
      expect(element.find('select.oscHost option').first().text()).toBe('a');
      expect(element.find('select.oscHost option').last().text()).toBe('c');
      expect(element.find('select.oscHost option').first().next().attr('selected')).toBe('selected');
    });
  });

  it('should default to an empty OSC path.', inject(function ($compile, $rootScope) {
    parentScope = $rootScope.$new();
    parentScope.osc = defaultOSC;

    spyOn(backendMock, 'setOSCPath');

    // Compile the DOM into an Angular view using using our test scope.
    element = $compile(template)(parentScope);
    isolatedScope = getIsolatedScope(element);
    isolatedScope.$apply();

    expect(isolatedScope.config.path).toBeNull();
    expect(element.find('input[name=oscPath]').val()).toBe('');
    expect(backendMock.setOSCPath).not.toHaveBeenCalled();
  }));

  it('should be possible to configure the OSC path.', inject(function ($compile, $rootScope) {
    parentScope = $rootScope.$new();
    parentScope.osc = defaultOSC;
    parentScope.osc.path = '/path/to/object';
    parentScope.osc.host = 'a';

    // Compile the DOM into an Angular view using using our test scope.
    element = $compile(template)(parentScope);
    isolatedScope = getIsolatedScope(element);
    isolatedScope.$apply();

    expect(isolatedScope.config.path).toBe('/path/to/object');
    expect(element.find('input[name=oscPath]').val()).toBe('/path/to/object');
  }));

  it('should update the parent OSC path.', inject(function ($compile, $rootScope) {
    parentScope = $rootScope.$new();
    parentScope.osc = defaultOSC;
    parentScope.osc.path = '/my/first/path';
    parentScope.osc.host = 'a';

    // Compile the DOM into an Angular view using using our test scope.
    element = $compile(template)(parentScope);
    isolatedScope = getIsolatedScope(element);
    isolatedScope.$apply();

    expect(isolatedScope.config.path).toBe('/my/first/path');

    isolatedScope.config.path = '/my/second/path';
    isolatedScope.$apply();

    expect(parentScope.osc.path).toBe('/my/second/path');
    expect(element.find('input[name=oscPath]').val()).toBe('/my/second/path');
  }));

  it('should reset the OSC Host if the configured host was removed.', inject(function ($compile, $rootScope) {
    parentScope = $rootScope.$new();
    parentScope.osc = defaultOSC;
    parentScope.osc.host = oscHostConfigMock.ids[1];
    parentScope.osc.path = '/path';

    // Compile the DOM into an Angular view using using our test scope.
    element = $compile(template)(parentScope);
    isolatedScope = getIsolatedScope(element);
    isolatedScope.$apply();

    expect(isolatedScope.config.host).toBe(oscHostConfigMock.ids[1], 'The output should be configured with the b host to start.');
    expect(isolatedScope.config.valid).toBe(true, 'The output should be considered valid to start with.');

    $rootScope.$broadcast('oscHostConfig:remove', 'b');

    expect(isolatedScope.config.host).toBeNull('The host should have been reset.');
    expect(isolatedScope.config.valid).toBe(false, 'The output should not be valid without a valid host.');
  }));

  it('should be considered valid if it has a path and host.', inject(function ($compile, $rootScope) {
    parentScope = $rootScope.$new();
    parentScope.osc = defaultOSC;
    parentScope.osc.host = 'b';
    parentScope.osc.path = '/path';

    // Compile the DOM into an Angular view using using our test scope.
    element = $compile(template)(parentScope);
    isolatedScope = getIsolatedScope(element);
    isolatedScope.$apply();

    expect(isolatedScope.config.valid).toBe(true, 'The scope should be valid if it has a path and a host.');
    expect(isolatedScope.save()).toBe(true, 'The scope save method should return the valid property value.');
  }));

  it('should not be considered valid if it is missing the path.', inject(function ($compile, $rootScope) {
    parentScope = $rootScope.$new();
    parentScope.osc = defaultOSC;
    parentScope.osc.host = 'b';

    // Compile the DOM into an Angular view using using our test scope.
    element = $compile(template)(parentScope);
    isolatedScope = getIsolatedScope(element);
    isolatedScope.$apply();

    expect(isolatedScope.config.valid).toBe(false, 'The output should not be valid without a path.');
    expect(isolatedScope.save()).toBe(false, 'The output save method should return the valid property value.');

    isolatedScope.config.path = '/path';
    isolatedScope.$apply();

    expect(isolatedScope.config.valid).toBe(true, 'The output should be valid once a path is set.');

    isolatedScope.config.path = '';
    isolatedScope.$apply();

    expect(isolatedScope.config.valid).toBe(false, 'The output should be invalid if the path is emptied.');
  }));

  it('should not be considered valid if it is missing the host.', inject(function ($compile, $rootScope) {
    parentScope = $rootScope.$new();
    parentScope.osc = defaultOSC;
    parentScope.osc.path = '/path';

    // Compile the DOM into an Angular view using using our test scope.
    element = $compile(template)(parentScope);
    isolatedScope = getIsolatedScope(element);
    isolatedScope.$apply();

    expect(isolatedScope.config.valid).toBe(false, 'The scope should not be valid without a host.');
    expect(isolatedScope.save()).toBe(false, 'The scope save method should return the valid property value.');

    isolatedScope.config.host = 'a';
    isolatedScope.$apply();

    expect(isolatedScope.config.valid).toBe(true, 'The scope should be valid once a host is set.');

    isolatedScope.config.host = null;
    isolatedScope.$apply();

    expect(isolatedScope.config.valid).toBe(false, 'The scope should be invalid if the host is emptied.');
  }));

  it('should send disable events when it becomes invalid.', inject(function ($compile, $rootScope) {
    parentScope = $rootScope.$new();
    parentScope.osc = defaultOSC;

    setupEventListeners(parentScope);

    spyOn(parentScope, 'remove');
    spyOn(parentScope, 'update');
    spyOn(parentScope, 'disable');

    // Compile the DOM into an Angular view using using our test scope.
    element = $compile(template)(parentScope);
    isolatedScope = getIsolatedScope(element);
    isolatedScope.$apply();

    expect(parentScope.update).not.toHaveBeenCalled();
    expect(parentScope.remove).not.toHaveBeenCalled();
    expect(parentScope.disable).not.toHaveBeenCalled();

    isolatedScope.config.path = '/path';
    isolatedScope.config.host = 'a';
    isolatedScope.$apply();

    expect(parentScope.update.calls.length).toBe(1);
    expect(parentScope.remove).not.toHaveBeenCalled();
    expect(parentScope.disable).not.toHaveBeenCalled();

    isolatedScope.config.path = null;
    isolatedScope.$apply();

    expect(parentScope.update.calls.length).toBe(1);
    expect(parentScope.remove).not.toHaveBeenCalled();
    expect(parentScope.disable).toHaveBeenCalled();
  }));

  it('should send remove events when the remove button is pressed.', inject(function ($rootScope, $compile) {
    parentScope = $rootScope.$new();
    parentScope.osc = defaultOSC;
    parentScope.osc.path = '/path';
    parentScope.osc.host = 'a';

    setupEventListeners(parentScope);

    spyOn(parentScope, 'remove');

    element = $compile(template)(parentScope);
    isolatedScope = getIsolatedScope(element);
    isolatedScope.$apply();

    expect(parentScope.remove).not.toHaveBeenCalled();

    isolatedScope.removeMe();

    expect(parentScope.remove).toHaveBeenCalledWith({input: 1, output: 1});
  }));

  it('should send add events when the output becomes valid.', inject(function ($compile, $rootScope) {
    parentScope = $rootScope.$new();
    parentScope.osc = defaultOSC;

    setupEventListeners(parentScope);

    spyOn(parentScope, 'add');
    spyOn(parentScope, 'remove');
    spyOn(parentScope, 'update');

    // Compile the DOM into an Angular view using using our test scope.
    element = $compile(template)(parentScope);
    isolatedScope = getIsolatedScope(element);
    isolatedScope.$apply();

    expect(parentScope.add).not.toHaveBeenCalled();

    isolatedScope.config.host = 'a';
    isolatedScope.$apply();

    expect(parentScope.add).not.toHaveBeenCalled();

    isolatedScope.config.path = '/path';
    isolatedScope.$apply();

    expect(parentScope.add).toHaveBeenCalledWith({input: 1, output: 1});
    expect(parentScope.remove).not.toHaveBeenCalled();
    expect(parentScope.update).not.toHaveBeenCalled();

    isolatedScope.config.path = '/path/2';
    isolatedScope.$apply();

    expect(parentScope.add.calls.length).toBe(1, 'The add event should only have been sent once.');

    isolatedScope.config.host = null;
    isolatedScope.$apply();

    expect(parentScope.add.calls.length).toBe(1, 'The add event should only have been sent once.');

    isolatedScope.config.host = 'b';
    isolatedScope.$apply();

    expect(parentScope.add.calls.length)
      .toBe(2, 'The add event should be sent again if the output becomes invalid and then valid.');
  }));

  it('should send update events when it changes.', inject(function ($compile, $rootScope) {
    parentScope = $rootScope.$new();
    parentScope.osc = defaultOSC;
    parentScope.osc.host = 'a';
    parentScope.osc.path = '/path';

    setupEventListeners(parentScope);

    spyOn(parentScope, 'update');

    // Compile the DOM into an Angular view using using our test scope.
    element = $compile(template)(parentScope);
    isolatedScope = getIsolatedScope(element);
    isolatedScope.$apply();

    expect(parentScope.update).not.toHaveBeenCalled();

    isolatedScope.config.host = 'b';
    isolatedScope.$apply();

    expect(parentScope.update.calls.length).toBe(1, 'The update event should only be sent once.');
    expect(parentScope.update).toHaveBeenCalledWith({input: 1, output: 1});

    isolatedScope.config.path = '/path/2';
    isolatedScope.$apply();

    expect(parentScope.update.calls.length).toBe(2, 'The update event should have been sent after changing the path.');
    expect(parentScope.update).toHaveBeenCalledWith({input: 1, output: 1});
  }));
});
