describe('Directive: nestedSortable', function () {
  'use strict';
  var element;

  beforeEach(module('oscmodulatorApp'));
  beforeEach(module('views/input-list.html'));
  beforeEach(module('views/midi-input.html'));
  beforeEach(module('views/osc-output.html'));

  beforeEach(inject(function ($rootScope, $compile) {
    element = angular.element('<div data-input-list></div>');
    element = $compile(element)($rootScope);
    $rootScope.$digest();
  }));

  it('should start with one midi input', inject(function ($rootScope/*, $compile*/) {
    expect($rootScope.inputs.length).toBe(1);
    expect(element.children().length).toBe(1);
  }));
});
