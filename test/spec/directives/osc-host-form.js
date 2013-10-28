describe('Directive: oscHostForm', function () {
  'use strict';

  var element, parentScope, isolatedScope, template;

  // load the directive's module
  beforeEach(module('oscmodulatorApp'));
  beforeEach(module('views/osc-host-form.html'));

  beforeEach(inject(function ($rootScope){
    // Create a DOM fragment to turn into a directive instance.
    template = angular.element(
      '<div data-osc-host-form></div>'
    );

    // Create a fresh scope for this test.
    parentScope = $rootScope.$new();
  }));

  it('should provide access to the oscHostConfig.', inject(function($compile){
    // Compile the DOM into an Angular view using using our test scope.
    element = $compile(template)(parentScope);
    isolatedScope = element.scope();
    isolatedScope.$apply();

    expect(isolatedScope.oscHostConfig).toBeDefined('The oscHostConfig should be accessible on the scope.');
  }));
});
