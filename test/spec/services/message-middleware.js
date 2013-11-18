describe('Service: messageMiddleware', function () {
  'use strict';
  var messageMiddleware, rootScope, legatoMock;

  // load the service's module
  beforeEach(module('oscmodulatorApp'));

  beforeEach(function(){
    legatoMock = {
      init: function(){},
      on: function(){}
    };

    module(function($provide){
      $provide.value('legato', legatoMock);
    });

    inject(function (_messageMiddleware_, $rootScope) {
      messageMiddleware = _messageMiddleware_;
      rootScope = $rootScope;
    });
  });

  it('should initialize the midi object.', function(){
    spyOn(legatoMock, 'init');
    messageMiddleware.init();
    expect(legatoMock.init).toHaveBeenCalled();
  });

  it('should be able to create legato paths.', function(){
    var path;

    path = messageMiddleware.getPath(1, '63');

    expect(path).toBe('/midi1/1/note/63');

    path = messageMiddleware.getPath(':', '2');

    expect(path).toBe('/midi1/:/note/2');
  });

  it('should be able to set a midi input.', inject(function(inputConfig){
    inputConfig.init([{
      midi:{
        note: '63',
        type: 'on'
      }
    }]);

    spyOn(legatoMock, 'on').andReturn(22);
    messageMiddleware.setMidiInput(inputConfig.inputs[1].id);

    expect(legatoMock.on.calls[0].args[0]).toBe('/midi1/:/note/63', 'The path should have been called correctly.');
    expect(inputConfig.inputs[1].legatoId).toBe(22, 'It should have stored the input id from legato.');
  }));
});
