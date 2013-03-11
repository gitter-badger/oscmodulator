'use strict';

describe('Directive: nestedSortable', function() {
  beforeEach(module('oscmodulatorUIApp'));

  var element;

  it('should make hidden element visible', inject(function($rootScope, $compile) {
    element = angular.element('<nested-sortable></nested-sortable>');
    element = $compile(element)($rootScope);
    expect(element.text()).toBe('this is the nestedSortable directive');
  }));
});
