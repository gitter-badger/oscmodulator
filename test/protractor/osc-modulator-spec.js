describe('angularjs homepage', function() {
  'use strict';

  var
    modulator = require('./page-objects/modulator'),
    debugPanel = require('./page-objects/debug-panel'),
    midiConfigPanel = require('./page-objects/midi-config-panel'),
    oscConfigPanel = require('./page-objects/osc-config-panel'),
    inputs = require('./page-objects/input'),
    homepage = 'http://localhost:9000';

  beforeEach(function(){
    browser.get(homepage);
  });

	it('should start with one midi input.', function () {
    expect(inputs.getRows().count()).toBe(1);
  });

  it('should be able to open the midi panel.', function(){
    expect(midiConfigPanel.isOpen()).toBe(false);

    midiConfigPanel.open();

    expect(midiConfigPanel.isOpen()).toBe(true);
  });

	it('should be possible to open the midi configuration window before there are available ' +
		'midi hosts', function(){
		debugPanel.setMidiInputPorts([]);

		midiConfigPanel.open();

		expect(midiConfigPanel.isOpen()).toBe(true);
		expect(midiConfigPanel.getAvailablePorts().count()).toBe(0);
	});

  it('should be able to open the osc panel.', function(){
    expect(oscConfigPanel.isOpen()).toBe(false);

    oscConfigPanel.open();

    expect(oscConfigPanel.isOpen()).toBe(true);
  });

  it('should be able to select a midi input port.', function(){
    var name = 'Foo Bar';

    debugPanel.setMidiInputPorts([name]);
    midiConfigPanel.open();

    // Turn on the first midi input
    midiConfigPanel.selectPort(0);

    expect(inputs.getPortOptions(0).count()).toBe(2);
    expect(inputs.getPortOption(0, 0).getText()).toBe('All');
    expect(inputs.getPortOption(0, -1).getText()).toBe(name);
  });

  it('should be able to setup an osc port.', function(){
    oscConfigPanel.open();

    oscConfigPanel.addPort('name', 'localhost', '9050');

    expect(inputs.getOSCHostOptions(0, 0).count()).toBe(2);
    expect(inputs.getOSCHostOption(0, 0, -1).getText()).toBe('name');
  });

  it('should be able to receive midi events.', function(){
    modulator.basicSetup();

    expect(debugPanel.getOutputs().count()).toBe(0);

    debugPanel.sendMidiMessage(1, ':', ':', ':', 50);

    expect(debugPanel.getOutputs().count()).toBe(1);
    expect(debugPanel.getOutput(0).getText()).toEqual('OSC -> /?');

    inputs.getOSCPath(0, 0).clear();
    oscConfigPanel.setPort(0, '33');

    inputs.setOSCPath(0, 0, '/some/path');

    debugPanel.sendMidiMessage();

    expect(debugPanel.getOutputs().count()).toBe(2);
    expect(debugPanel.getOutput(-1).getText()).toBe('OSC -> /some/path?');
  });

  it('should be able to send osc messages if the osc host is removed and re-added.', function(){
    modulator.basicSetup();

    // Make sure no messages have been sent yet.
    expect(debugPanel.getOutputs().count()).toBe(0);

    debugPanel.sendMidiMessage(1, ':', ':', ':', 50);

    // Make sure we can send messages.
    expect(debugPanel.getOutputs().count()).toBe(1);
    expect(debugPanel.getOutput(0).getText()).toEqual('OSC -> /?');

    // Remove the current host.
    oscConfigPanel.setPort(0, '\b\b\b\b');

    // Try to send another message.
    debugPanel.sendMidiMessage();

    // Make sure no new messages were sent since we don't have a host configured.
    expect(debugPanel.getOutputs().count()).toBe(1);

    // Make sure the osc output row host was updated and is now empty.
    expect(inputs.getOSCHostOptions().count()).toBe(1);
    expect(inputs.getOSCHostOption(0, 0, -1).getText()).toBe('');

    // Fix the osc port.
    oscConfigPanel.setPort(0, '8989');

    // Try to send another message.
		debugPanel.sendMidiMessage();

    // Make sure nothing new was sent.
    expect(debugPanel.getOutputs().count()).toBe(1);

    // Select the updated host and change the path.
    inputs.setOSCHostOption(0, 0, -1);

    // Send another message.
		debugPanel.sendMidiMessage();

    // Make sure the message was sent this time.
    expect(debugPanel.getOutputs().count()).toBe(2);
    expect(debugPanel.getOutput(-1).getText()).toEqual('OSC -> /?');
  });

  it('should be able to send osc messages if the output hosts are configured before' +
    'the midi input is configured.', function(){
    modulator.basicMidiHostSetup();
    modulator.basicOSCHostSetup();

    // Setup midi to OSC.
    modulator.setupOSCRow(0, 0, 'live', '/', []);

    // Make sure no messages have been sent yet.
    expect(debugPanel.getOutputs().count()).toBe(0);

    // Send a fake midi message
		debugPanel.sendMidiMessage(1, ':', ':', ':', 50);

    // Make sure we can send messages.
    expect(debugPanel.getOutputs().count()).toBe(0);

    // Activate a midi host.
    modulator.setupMidiRow(0, 'All', 'All', ':', 'All');

    // Send a fake midi message
		debugPanel.sendMidiMessage();

    // Make sure we can send messages.
    expect(debugPanel.getOutputs().count()).toBe(1);
    expect(debugPanel.getOutput(-1).getText()).toEqual('OSC -> /?');
  });

  it('should disable the midi input row when a midi host is removed.', function(){
    var name = 'Foo Bar';

    debugPanel.setMidiInputPorts([name]);

		modulator.basicSetup();

		// Make sure no messages have been sent yet.
		expect(debugPanel.getOutputs().count()).toBe(0);

		// Send a fake midi message
		debugPanel.sendMidiMessage(1, ':', ':', ':', 50);

		expect(debugPanel.getOutputs().count()).toBe(1);

		// Disable the input
    midiConfigPanel.open();
    midiConfigPanel.selectPort(0);

    // Make sure midi messages are nolonger handled and that no errors occur.
		expect(inputs.getPortOptions().count()).toBe(1);
  });

	it('should be able to change the midi input port for a midi input row multiples times.', function(){
    var name1 = 'Baz',
      name2 = 'Foo',
      name3 = 'Fighter';

    debugPanel.setMidiInputPorts([name1, name2, name3]);

    modulator.basicSetup();
    midiConfigPanel.open();
    midiConfigPanel.selectPort(1);
    midiConfigPanel.selectPort(2);

    // Make sure we can receive messages.
    debugPanel.sendMidiMessage(2, ':', ':', ':', 90);
    expect(debugPanel.getOutputs().count()).toBe(1);

    inputs.setPortByName(0, name2);

    // Make sure we still receive messages.
    debugPanel.sendMidiMessage();
    expect(debugPanel.getOutputs().count()).toBe(2);

    inputs.setPortByName(0, name3);

    // Make sure we don't receive any messages since we're not listening for Fighter
    debugPanel.sendMidiMessage();
    expect(debugPanel.getOutputs().count()).toBe(2);

    // Sending on the Fighter port should work.
    debugPanel.sendMidiMessage(3, ':', ':', ':', 80);
    expect(debugPanel.getOutputs().count()).toBe(3);

    inputs.setPortByName(0, name1);
    debugPanel.sendMidiMessage(1, ':', ':', ':', 70);
    expect(debugPanel.getOutputs().count()).toBe(4);
	});

  it('should be able to trigger multiple OSC outputs from a single midi event.', function(){
    var name1 = 'Bar',
      name2 = 'Boo',
      name3 = 'Bell';

    modulator.basicSetup();
    midiConfigPanel.open();
    midiConfigPanel.selectPort(1);

    inputs.addOutput(0);
    modulator.setupOSCRow(0, 1, 1, '/some/other/path', []);

    debugPanel.sendMidiMessage(1, '1', 'note', ':', 50);

    expect(debugPanel.getOutputs().count()).toBe(2);
    expect(debugPanel.getOutput(0).getText()).toBe('OSC -> /?');
    expect(debugPanel.getOutput(-1).getText()).toBe('OSC -> /some/other/path?');
	});

  // TODO:
//  it('should be able to automatically re-select an OSC output host if the OSC host becomes invalid and then valid again.',
//    function(){
//			expect(true).toBe(true);
//		});
//
//  it('should be able to automatically re-select a midi input host if the midi host is de-selected and then reselected.',
//    function(){
//			expect(true).toBe(true);
//		});
});