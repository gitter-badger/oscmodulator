describe('Directive: nestedSortable', function () {
  'use strict';
  var element;

  beforeEach(module('oscmodulatorApp'));
  beforeEach(module('views/input-list.html'));
  beforeEach(module('views/midi-input.html'));

  beforeEach(inject(function (_$rootScope_, _$compile_, $templateCache) {
    element = angular.element('<div data-input-list></div>');
    element = _$compile_(element)(_$rootScope_);
    _$rootScope_.$digest();
  }));

  it('should start with one midi input', inject(function ($rootScope/*, $compile*/) {
    expect($rootScope.inputs.length).toBe(1);
    expect(element.children().length).toBe(1);
  }));
});
