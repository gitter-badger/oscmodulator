describe('Service: messageMiddleware', function () {
  'use strict';
  var backend, rootScope, midiMock;

  // load the service's module
  beforeEach(module('oscmodulatorApp'));

  beforeEach(function(){
    midiMock = {
      connect: function(){},
      on: function(){}
    };

    module(function($provide){
      $provide.value('midi', midiMock);
    });

    inject(function (_messageMiddleware_, $rootScope) {
      backend = _messageMiddleware_;
      rootScope = $rootScope;
    });
  });

  it('should initialize the midi object.', function(){
    spyOn(midiMock, 'connect');
    backend.init();
    expect(midiMock.connect).toHaveBeenCalled();
  });

  it('should be able to create legato paths.', function(){
    var path;

    path = backend.getPath(1, '63');

    expect(path).toBe('/midi1/1/note/63');

    path = backend.getPath(':', '2');

    expect(path).toBe('/midi1/:/note/2');
  });

  it('should be able to set a midi input.', inject(function(inputConfig){
    inputConfig.init([{
      midi:{
        note: '63',
        type: 'on'
      }
    }]);

    spyOn(midiMock, 'on');
    backend.setMidiInput(inputConfig.inputs[1].id);

    expect(midiMock.on.calls[0].args[0]).toBe('/midi1/:/note/63', 'The path should have been called correctly.');
  }));
});
