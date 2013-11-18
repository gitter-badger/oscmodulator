describe('Controller: MainCtrl', function () {
  'use strict';
  var scope, messageMiddleware;

  // load the controller's module
  beforeEach(module('oscmodulatorApp'));

  beforeEach(inject(function($rootScope, $controller) {
    scope = $rootScope.$new();
    messageMiddleware = {
      init:function(){}
    };

    spyOn(messageMiddleware, 'init');

    $controller('MainCtrl', {$scope: scope, messageMiddleware: messageMiddleware});
  }));

  it('should initialize the messageMiddleware service.', function(){
    expect(messageMiddleware.init).toHaveBeenCalled();
  });

  it('should toggle the OSC Host panel.', function(){
    expect(scope.hideOSCPanel).toBe(true);

    scope.toggleOSCPanel();

    expect(scope.hideOSCPanel).toBe(false);

    scope.toggleOSCPanel();

    expect(scope.hideOSCPanel).toBe(true);
  });

  it('should toggle the MIDI Port panel.', function(){
    expect(scope.hideMIDIPanel).toBe(true);

    scope.toggleMIDIPanel();

    expect(scope.hideMIDIPanel).toBe(false);

    scope.toggleMIDIPanel();

    expect(scope.hideMIDIPanel).toBe(true);
  });

  it('should swap the OSC Host and MIDI panels when opening both.', function(){
    expect(scope.hideMIDIPanel).toBe(true);
    expect(scope.hideOSCPanel).toBe(true);

    scope.toggleOSCPanel();
    scope.toggleMIDIPanel();

    expect(scope.hideOSCPanel).toBe(true, 'The OSC panel should be closed when the MIDI panel is open.');
    expect(scope.hideMIDIPanel).toBe(false);

    scope.toggleOSCPanel();

    expect(scope.hideOSCPanel).toBe(false);
    expect(scope.hideMIDIPanel).toBe(true, 'The MIDI panel should be closed when the OSC panel is open.');
  });
});
