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

  it('should receive input:new events.', function(){
    spyOn(backend, 'newInput');
    rootScope.$broadcast('input:new');
    expect(backend.newInput).toHaveBeenCalled();
  });

  it('should receive input:update:midi:note events.', function(){
    spyOn(backend, 'updateInputMidiNote');
    rootScope.$broadcast('input:update:midi:note', 'fakeId', 'c7');
    expect(backend.updateInputMidiNote).toHaveBeenCalledWith('fakeId','c7');
  });

  it('should receive input:update:midi:type events.', function(){
    spyOn(backend, 'updateInputMidiNoteType');
    rootScope.$broadcast('input:update:midi:type', 'fakeId', 'off');
    expect(backend.updateInputMidiNoteType).toHaveBeenCalledWith('fakeId','off');
  });

  it('should receive input:update:mute events.', function(){
    spyOn(backend, 'updateInputMute');
    rootScope.$broadcast('input:update:mute', 'fakeId', true);
    expect(backend.updateInputMute).toHaveBeenCalledWith('fakeId',true);
  });

  it('should receive input:update:solo events.', function(){
    spyOn(backend, 'updateInputSolo');
    rootScope.$broadcast('input:update:solo', 'fakeId', true);
    expect(backend.updateInputSolo).toHaveBeenCalledWith('fakeId',true);
  });

  it('should receive input:remove events.', function(){
    spyOn(backend, 'removeInput');
    rootScope.$broadcast('input:remove', 'fakeId');
    expect(backend.removeInput).toHaveBeenCalledWith('fakeId');
  });

});
