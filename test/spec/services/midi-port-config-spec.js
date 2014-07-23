describe('Service: MidiPortConfig', function () {
  'use strict';
  var midiPortConfig, legatoMock, messageMiddleware;

  // load the service's module
  beforeEach(module('oscmodulatorApp'));

  // instantiate service
  beforeEach(function(){
    legatoMock = {
      midi:{
        ins:function(){},
        outs:function(){}
      }
    };

    module(function($provide){
      $provide.value('legato', legatoMock);
    });

    inject(function (_midiPortConfig_, _messageMiddleware_) {
      midiPortConfig = _midiPortConfig_;
      messageMiddleware = _messageMiddleware_;
    });
  });

  it('should update its list of ports when the midi ports change.', function () {
    expect(midiPortConfig.ports.length).toBe(0, 'The ports should be empty to start.');

    messageMiddleware.availableMidiPorts.inputs = ['a', 'b'];
    messageMiddleware.$apply();

    expect(midiPortConfig.ports.length).toBe(2, 'The ports should match the middleware.');
    expect(midiPortConfig.ports[0].name).toBe('a', 'The port name should match.');
    expect(midiPortConfig.ports[0].enabled).toBe(false, 'The port should be disabled by default.');
    expect(midiPortConfig.ports[0].index).toBe(0, 'The port index should be saved for opening the port.');
    expect(midiPortConfig.ports[0].id).toBeNull('The id should be null by default.');

    midiPortConfig.ports[0].enabled = true;
    midiPortConfig.ports[0].id = 1;
    messageMiddleware.availableMidiPorts.inputs = ['a', 'c', 'd'];
    messageMiddleware.$apply();

    expect(midiPortConfig.ports.length).toBe(3, 'The ports should have been updated.');
    expect(midiPortConfig.ports[0].name).toBe('a', 'The first port should not have changed.');
    expect(midiPortConfig.ports[0].enabled).toBe(true, 'The first port should still be enabled.');
    expect(midiPortConfig.ports[0].id).toBe(1, 'The first port id should not have changed.');
    expect(midiPortConfig.ports[1].name).toBe('c', 'The second port should have changed.');
    expect(midiPortConfig.ports[1].enabled).toBe(false, 'The new ports should be disabled.');
  });

  it('should be able to add and remove midi port listeners.', function(){
    spyOn(messageMiddleware, 'listenToMidiPort').andReturn(1);
    spyOn(messageMiddleware, 'removeMidiPort');

    messageMiddleware.availableMidiPorts.inputs = ['a', 'b'];
    messageMiddleware.$apply();

    expect(midiPortConfig.ports.length).toBe(2, 'It should start with 2 ports.');
    expect(messageMiddleware.listenToMidiPort).not.toHaveBeenCalled();

    midiPortConfig.ports[0].enabled = true;
    midiPortConfig.toggleMidiInput(0);

    expect(messageMiddleware.listenToMidiPort).toHaveBeenCalledWith(0);
    expect(midiPortConfig.ports[0].id).toBe(1, 'An id should have been set for the port.');

    midiPortConfig.ports[0].enabled = false;
    midiPortConfig.toggleMidiInput(0);

    expect(midiPortConfig.ports[0].id).toBe(null, 'The id should have been reset when disabled.');
    expect(messageMiddleware.removeMidiPort).toHaveBeenCalledWith(1);
  });

});
