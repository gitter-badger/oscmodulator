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

    scope.$on('create:input', function(event){
      listener.change();
    });

    scope.addMidiInput();

    expect(listener.change).toHaveBeenCalled();
  });
});
