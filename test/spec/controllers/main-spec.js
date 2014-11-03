describe('Controller: MainCtrl', function () {
  'use strict';
  var scope, messageMiddleware, midiPortConfig;

  // load the controller's module
  beforeEach(module('oscmodulatorApp'));

  beforeEach(inject(function($rootScope, $controller) {
    scope = $rootScope.$new();
    messageMiddleware = {
      init:function(){},
      updateAvailableMidiPorts:function(){}
    };

    spyOn(messageMiddleware, 'init');

    $controller('MainCtrl', {$scope: scope, messageMiddleware: messageMiddleware, midiPortConfig: midiPortConfig});
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

  it('should toggle the MIDI Port panel.', inject(function($timeout){
    spyOn(messageMiddleware, 'updateAvailableMidiPorts');

    expect(scope.hideMIDIPanel).toBe(true);
    expect(messageMiddleware.updateAvailableMidiPorts).not.toHaveBeenCalled();

    scope.toggleMIDIPanel();
    $timeout.flush();

    expect(scope.hideMIDIPanel).toBe(false);
    expect(messageMiddleware.updateAvailableMidiPorts).toHaveBeenCalled();

    scope.toggleMIDIPanel();
    $timeout.flush();

    expect(scope.hideMIDIPanel).toBe(true);
    expect(messageMiddleware.updateAvailableMidiPorts.calls.length)
      .toBe(1, 'The available ports should only be updated when opening the midi port config form.');
  }));

  it('should swap the OSC Host and MIDI panels when opening both.', inject(function($timeout){
    expect(scope.hideMIDIPanel).toBe(true);
    expect(scope.hideOSCPanel).toBe(true);

    scope.toggleOSCPanel();
    scope.toggleMIDIPanel();
    $timeout.flush();

    expect(scope.hideOSCPanel).toBe(true, 'The OSC panel should be closed when the MIDI panel is open.');
    expect(scope.hideMIDIPanel).toBe(false);

    scope.toggleOSCPanel();

    expect(scope.hideOSCPanel).toBe(false);
    expect(scope.hideMIDIPanel).toBe(true, 'The MIDI panel should be closed when the OSC panel is open.');
  }));
});
