describe('Controller: MainCtrl', function () {
  'use strict';
  var scope, backend;

  // load the controller's module
  beforeEach(module('oscmodulatorApp'));

  beforeEach(inject(function($rootScope, $controller) {
    scope = $rootScope.$new();
    backend = {
      init:function(){}
    };

    $controller('MainCtrl', {$scope: scope, backend: backend});
  }));

  // TODO Should we test that the backend service is initialized?

  it('should toggle the OSC Host panel.', function(){
    expect(scope.hideOSCPanel).toBe(true);

    scope.toggleOSCPanel();

    expect(scope.hideOSCPanel).toBe(false);

    scope.toggleOSCPanel();

    expect(scope.hideOSCPanel).toBe(true);
  });

  it('should emit an event when it wants to add a new input.', function(){
    var listener = {change:function(){}};
    spyOn(listener, 'change');

    scope.$on('create:input', function(){
      listener.change();
    });

    scope.addMidiInput();

    expect(listener.change).toHaveBeenCalled();
  });

  it('should default to a single, un-configured OSC Host.', function(){
    expect(scope.hosts.length).toBe(1);
    expect(scope.hosts[0].name).toBeNull();
    expect(scope.hosts[0].address).toBeNull();
    expect(scope.hosts[0].port).toBeNull();
  });

  it('should be able to add OSC Host configurations.', function(){
    expect(scope.hosts.length).toBe(1);

    scope.addOSCHost();

    expect(scope.hosts.length).toBe(2);
    expect(scope.hosts[1].name).toBeNull();
    expect(scope.hosts[1].address).toBeNull();
    expect(scope.hosts[1].port).toBeNull();
  });

  it('should be able to remove OSC Host configurations.', function(){
    expect(scope.hosts.length).toBe(1);

    scope.addOSCHost();
    scope.addOSCHost();
    scope.addOSCHost();

    expect(scope.hosts.length).toBe(4);

    scope.removeOSCHost(0);

    expect(scope.hosts.length).toBe(3);

    scope.removeOSCHost(0);

    expect(scope.hosts.length).toBe(2);
  });

  it('should always have at least one OSC Host.', function(){
    expect(scope.hosts.length).toBe(1);

    scope.removeOSCHost(0);

    expect(scope.hosts.length).toBe(1);
  });

  it('should start with an empty list of OSC Host ids.', function(){
    expect(scope.hostIds.length).toBe(0);
  });

  it('should keep the OSC Host ids in sync with the OSC Hosts.', function(){
    scope.hosts[0].name = 'a';
    scope.$apply();

    expect(scope.hostIds.length).toBe(1);
    expect(scope.hostIds[0]).toBe('a');

    scope.hosts.push({name:'b'});
    scope.$apply();

    expect(scope.hostIds.length).toBe(2);
    expect(scope.hostIds[1]).toBe('b');

    scope.hosts.splice(0, 1);
    scope.$apply();

    expect(scope.hostIds[0]).toBe('b');

    scope.hosts.splice(0, 1);
    scope.$apply();

    expect(scope.hostIds.length).toBe(0);
  });

  it('should handle invalid OSC Host ids.', function(){
    scope.hosts = [
      {
        name: ''
      },
      {
        name: 'Resolume'
      }
    ];
    scope.$apply();

    expect(scope.hostIds.length).toBe(1);
    expect(scope.hostIds[0]).toBe('Resolume');
  });
});
