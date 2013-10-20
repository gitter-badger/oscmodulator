describe('Controller: MainCtrl', function () {
  'use strict';
  var scope;

  // load the controller's module
  beforeEach(module('oscmodulatorApp'));

  beforeEach(inject(function($rootScope, $controller) {
    scope = $rootScope.$new();
    $controller('MainCtrl', {$scope: scope});
  }));

  it('should configure the default scope.', function(){
    expect(scope.inputs.length).toBe(1);
  });

  it('should be able to add new inputs.', function(){
    expect(scope.inputs.length).toBe(1);

    scope.addMidiInput();

    expect(scope.inputs.length).toBe(2);
  });
});
