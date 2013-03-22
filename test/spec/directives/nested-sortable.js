'use strict';

describe('Directive: nestedSortable', function ()
{
    var element;

    beforeEach(module('oscmodulatorApp'));

    beforeEach(module('views/nested-sortable.html', 'views/midi-input.html'));

    beforeEach(inject(function (_$rootScope_, _$compile_, $templateCache)
    {
//        scope = _$rootScope_;
//        $compile = _$compile_;
        element = angular.element('<div data-nested-sortable></div>');
        element = _$compile_(element)(_$rootScope_);
        _$rootScope_.$digest();
//        $templateCache.put('views/nested-sortable.html', '.<template-goes-here />');
    }));
/*
    it('should have one midi input to start', inject(function ($rootScope, $compile)
    {

    }));

    it('should expand and collapse', inject( function( $rootScope, $compile )
    {

    }));
*/
});
