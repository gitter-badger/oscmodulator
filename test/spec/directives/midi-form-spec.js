'use strict';

describe('Directive: midiForm', function () {

  // load the directive's module
  beforeEach(module('oscmodulatorApp'));
  beforeEach(module('views/midi-form.html'));

  var element, parentScope, isolatedScope, template, midiPortConfigMock;

  beforeEach(function(){
    midiPortConfigMock = {};

    module(function($provide){
      $provide.value('midiPortConfig', midiPortConfigMock);
    });

    inject(function ($rootScope) {
      template = angular.element('<div data-midi-form></div>');

      parentScope = $rootScope.$new();
    });
  });

  it('should expose the midiPortConfig object on the scope.', inject(function ($compile) {
    element = $compile(template)(parentScope);
    isolatedScope = element.scope();
    isolatedScope.$apply();

    expect(isolatedScope.midiPortConfig)
      .toBe(midiPortConfigMock, 'The MIDI port configuration should be exposed on the scope.');
  }));
});
