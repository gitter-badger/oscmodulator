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

  it('should configure the default scope.', function(){
    expect(scope.inputs.length).toBe(1);
  });

  it('should be able to add new inputs.', function(){
    expect(scope.inputs.length).toBe(1);
    expect(scope.inputs[0].id).toBe(1);
    expect(scope.inputsCreated).toBe(1);

    scope.addMidiInput();

    expect(scope.inputs.length).toBe(2);
    expect(scope.inputs[0].id).toBe(1);
    expect(scope.inputs[1].id).toBe(2);
    expect(scope.inputsCreated).toBe(2);
  });
});
