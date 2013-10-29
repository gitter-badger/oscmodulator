describe('Directive: inputList', function () {
  'use strict';
  var element, template, parentScope, isolatedScope;

  beforeEach(module('oscmodulatorApp'));
  beforeEach(module('views/input-list.html'));
  beforeEach(module('views/midi-input.html'));
  beforeEach(module('views/osc-output.html'));

  beforeEach(function() {
    template = angular.element('<div data-input-list></div>');
  });

  it('should provide access to the oscHostConfig object.', function(){
    module(function($provide){
      $provide.value('oscHostConfig',{});
    });

    inject(function($rootScope, $compile){
      parentScope = $rootScope.$new();

      // Compile the DOM into an Angular view using using our test scope.
      element = $compile(template)(parentScope);
      isolatedScope = element.scope();
      isolatedScope.$apply();

      expect(isolatedScope.inputConfig).toBeDefined('The inputConfig should be accessible on the scope.');
    });
  });
});
