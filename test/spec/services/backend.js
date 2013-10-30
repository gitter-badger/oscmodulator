describe('Service: backend', function () {
  'use strict';
  var backend, rootScope, midiMock;

  // load the service's module
  beforeEach(module('oscmodulatorApp'));

  beforeEach(function(){
    midiMock = {
      start: function(){}
    };

    module(function($provide){
      $provide.value('midi', midiMock);
    });

    inject(function (_backend_, $rootScope) {
      backend = _backend_;
      rootScope = $rootScope;
    });
  });

  it('should initialize the midi object.', function(){
    spyOn(midiMock, 'start');
    backend.init();
    expect(midiMock.start).toHaveBeenCalled();
  });

});
