'use strict';

describe('Directive: nestedSortable', function () {
  var element;

  beforeEach(module('oscmodulatorApp'));

//  beforeEach(module('views/nested-sortable.html'));
//  beforeEach(module('views/midi-input.html'));

  beforeEach(inject(function (_$rootScope_, _$compile_, $templateCache) {
    //        scope = _$rootScope_;
    //        $compile = _$compile_;
//    element = angular.element('<div data-nested-sortable></div>');
//    element = _$compile_(element)(_$rootScope_);
//    _$rootScope_.$digest();
    //        $templateCache.put('views/nested-sortable.html', '.<template-goes-here />');
  }));

  it('should be expanded', inject(function ($rootScope, $compile) {
    //expect( element.find('li.leaf').length ).toBe(0);
  }));
/*
  it('should start out expanded', inject(function($rootScope, $compile) {

  }));

  it('should expand and collapse', inject(function ($rootScope, $compile) {

  }));
*/
});
