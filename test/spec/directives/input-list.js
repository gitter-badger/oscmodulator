describe('Directive: inputList', function () {
  'use strict';
  var element, template, parentScope, isolatedScope;

  beforeEach(module('oscmodulatorApp'));
  beforeEach(module('views/input-list.html'));
  beforeEach(module('views/midi-input.html'));
  beforeEach(module('views/osc-output.html'));

  beforeEach(inject(function ($rootScope) {
    template = angular.element('<div data-input-list></div>');

    parentScope = $rootScope.$new();
  }));

  it('should provide access to the oscHostConfig object.', inject(function($compile){
    // Compile the DOM into an Angular view using using our test scope.
    element = $compile(template)(parentScope);
    isolatedScope = element.scope();
    isolatedScope.$apply();

    expect(isolatedScope.inputConfig).toBeDefined('The inputConfig should be accessible on the scope.');
  }));
});
