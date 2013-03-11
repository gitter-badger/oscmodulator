'use strict';

describe('Directive: midiInput', function() {
  beforeEach(module('oscmodulatorUIApp'));

  var element;

  it('should make hidden element visible', inject(function($rootScope, $compile) {
    element = angular.element('<midi-input></midi-input>');
    element = $compile(element)($rootScope);
    expect(element.text()).toBe('this is the midiInput directive');
  }));
});
