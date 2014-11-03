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

    oscConfigPanel.addOutput('name', 'localhost', '9050');

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

    browser.debugger();

    // Make sure no new messages were sent since we don't have a host configured.
    expect(debugPanel.getOutputs().count()).toBe(1);

    // Make sure the osc output row host was updated and is now empty.
    expect(inputs.getOSCHostOptions().count()).toBe(1);
    expect(inputs.getOSCHostOption(0, 0, -1).getText()).toBe('');

    // Fix the osc port.
    oscConfigPanel.setPort(0, '8989');

    // Try to send another message.
		debugPanel.sendMidiMessage();

    browser.debugger();

    // Make sure nothing new was sent.
    expect(debugPanel.getOutputs().count()).toBe(1);

    // Select the updated host and change the path.
    inputs.setOSCHostOption(0, 0, -1);

    // Send another message.
		debugPanel.sendMidiMessage();

    browser.debugger();

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
    modulator.basicSetup();
    midiConfigPanel.open();
    midiConfigPanel.selectPort(1);

    inputs.addOutput(0);
    modulator.setupOSCRow(0, 1, 1, '/some/other/path', []);

    debugPanel.sendMidiMessage(1, '1', 'Note', ':', 50);

    expect(debugPanel.getOutputs().count()).toBe(2);
    expect(debugPanel.getOutput(0).getText()).toBe('OSC -> /?');
    expect(debugPanel.getOutput(-1).getText()).toBe('OSC -> /some/other/path?');
	});

  it('should be able to handle complex routing between multiple inputs and outputs.', function(){
    var mi1 = 'In 1',
      mi2 = 'In 2',
      mi3 = 'In 3',
      oo1 = 'Out 1',
      oo2 = 'Out 2',
      oo3 = 'Out 3';

    // Listen to all midi ports
    debugPanel.setMidiInputPorts([mi1, mi2, mi3]);
    midiConfigPanel.open();
    midiConfigPanel.selectPort(0);
    midiConfigPanel.selectPort(1);
    midiConfigPanel.selectPort(2);

    // and add 3 more inputs.
    inputs.addRow();
    inputs.addRow();

    // Add 3 output ports
    oscConfigPanel.open();
    oscConfigPanel.setName(0, oo1);
    oscConfigPanel.setAddress(0, 'localhost');
    oscConfigPanel.setPort(0, '1');
    oscConfigPanel.addOutput(oo2, 'localhost', '2');
    oscConfigPanel.addOutput(oo3, 'localhost', '3');

    // Add an output to the 2nd input.
    inputs.addOutput(1);

    // Add two outputs to the 3rd input.
    inputs.addOutput(2);
    inputs.addOutput(2);

    // We now have the following input structure:
    // 1 -> 1
    // 2 -> 1
    // 2 -> 2
    // 3 -> 1
    // 3 -> 2
    // 3 -> 3

    modulator.setupMidiRow(0, mi1, 'All', ':', 'All');
    modulator.setupOSCRow(0, 0, oo1, '/in/1/out/1', []);

    modulator.setupMidiRow(1, mi2, 'All', ':', 'All');
    modulator.setupOSCRow(1, 0, oo2, '/in/2/out/1', []);
    modulator.setupOSCRow(1, 1, oo2, '/in/2/out/2', []);

    modulator.setupMidiRow(2, mi3, 'All', ':', 'All');
    modulator.setupOSCRow(2, 0, oo3, '/in/3/out/1', []);
    modulator.setupOSCRow(2, 1, oo3, '/in/3/out/2', []);
    modulator.setupOSCRow(2, 2, oo3, '/in/3/out/3', []);

    debugPanel.sendMidiMessage(1, 1, 'Note', '22', 50);

    expect(debugPanel.getOutputs().count()).toBe(1);
    expect(debugPanel.getOutput(0).getText()).toBe('OSC -> /in/1/out/1?');

    debugPanel.clearOutput();
    debugPanel.sendMidiMessage(2, 5, 'CC', '32', 78);

    expect(debugPanel.getOutputs().count()).toBe(2);
    expect(debugPanel.getOutput(0).getText()).toBe('OSC -> /in/2/out/1?');
    expect(debugPanel.getOutput(1).getText()).toBe('OSC -> /in/2/out/2?');

    debugPanel.clearOutput();
    debugPanel.sendMidiMessage(3, 1, 'Note', '22', 68);

    expect(debugPanel.getOutputs().count()).toBe(3);
  });

  it('should be able to correctly route midi input notes and noteTypes.', function(){
    var mi1 = 'In 1',
      oo1 = 'Out 1';

    // Listen to all midi ports
    debugPanel.setMidiInputPorts([mi1]);
    midiConfigPanel.open();
    midiConfigPanel.selectPort(0);

    // and add 3 more inputs.
    inputs.addRow();
    inputs.addRow();

    // Add 3 output ports
    oscConfigPanel.open();
    oscConfigPanel.setName(0, oo1);
    oscConfigPanel.setAddress(0, 'localhost');
    oscConfigPanel.setPort(0, '1');

    // Add an output to the 2nd input.
    inputs.addOutput(1);

    // Add two outputs to the 3rd input.
    inputs.addOutput(2);
    inputs.addOutput(2);

    // We now have the following input structure:
    // 1 -> 1
    // 2 -> 1
    // 2 -> 2
    // 3 -> 1
    // 3 -> 2
    // 3 -> 3

    modulator.setupMidiRow(0, mi1, 'All', '23', 'note');
    modulator.setupOSCRow(0, 0, oo1, '/in/1/out/1', []);

    modulator.setupMidiRow(1, mi1, 'All', '23', 'CC');
    modulator.setupOSCRow(1, 0, oo1, '/in/2/out/1', []);
    modulator.setupOSCRow(1, 1, oo1, '/in/2/out/2', []);

    modulator.setupMidiRow(2, mi1, '3', '45', 'All');
    modulator.setupOSCRow(2, 0, oo1, '/in/3/out/1', []);
    modulator.setupOSCRow(2, 1, oo1, '/in/3/out/2', []);
    modulator.setupOSCRow(2, 2, oo1, '/in/3/out/3', []);

    debugPanel.sendMidiMessage(1, '1', 'note', '23', 50);

    expect(debugPanel.getOutputs().count()).toBe(1);
    expect(debugPanel.getOutput(0).getText()).toBe('OSC -> /in/1/out/1?');

    debugPanel.clearOutput();
    debugPanel.sendMidiMessage(1, '2', 'CC', '23', 78);

    expect(debugPanel.getOutputs().count()).toBe(2);
    expect(debugPanel.getOutput(0).getText()).toBe('OSC -> /in/2/out/1?');
    expect(debugPanel.getOutput(1).getText()).toBe('OSC -> /in/2/out/2?');

    debugPanel.clearOutput();
    debugPanel.sendMidiMessage(1, '3', 'CC', '40', 87);

    expect(debugPanel.getOutputs().count()).toBe(0);

    debugPanel.sendMidiMessage(1, '3', 'CC', '45', 88);

    expect(debugPanel.getOutputs().count()).toBe(3);

    debugPanel.clearOutput();
    debugPanel.sendMidiMessage(1, '3', 'note', '45', 90);

    expect(debugPanel.getOutputs().count()).toBe(3);
  });


  it('should be able to route messages from specific midi input channels.', function(){
    var mi1 = 'In 1',
      oo1 = 'Out 1';

    // Listen to all midi ports
    debugPanel.setMidiInputPorts([mi1]);
    midiConfigPanel.open();
    midiConfigPanel.selectPort(0);

    // and add 3 more inputs.
    inputs.addRow();
    inputs.addRow();

    // Add 3 output ports
    oscConfigPanel.open();
    oscConfigPanel.setName(0, oo1);
    oscConfigPanel.setAddress(0, 'localhost');
    oscConfigPanel.setPort(0, '1');

    // Add an output to the 2nd input.
    inputs.addOutput(1);

    // Add two outputs to the 3rd input.
    inputs.addOutput(2);
    inputs.addOutput(2);

    // We now have the following input structure:
    // 1 -> 1
    // 2 -> 1
    // 2 -> 2
    // 3 -> 1
    // 3 -> 2
    // 3 -> 3

    modulator.setupMidiRow(0, mi1, '1', ':', 'All');
    modulator.setupOSCRow(0, 0, oo1, '/in/1/out/1', []);

    modulator.setupMidiRow(1, mi1, '2', ':', 'All');
    modulator.setupOSCRow(1, 0, oo1, '/in/2/out/1', []);
    modulator.setupOSCRow(1, 1, oo1, '/in/2/out/2', []);

    modulator.setupMidiRow(2, mi1, '3', ':', 'All');
    modulator.setupOSCRow(2, 0, oo1, '/in/3/out/1', []);
    modulator.setupOSCRow(2, 1, oo1, '/in/3/out/2', []);
    modulator.setupOSCRow(2, 2, oo1, '/in/3/out/3', []);

    debugPanel.sendMidiMessage(1, '1', 'note', '22', 50);

    expect(debugPanel.getOutputs().count()).toBe(1);
    expect(debugPanel.getOutput(0).getText()).toBe('OSC -> /in/1/out/1?');

    debugPanel.clearOutput();
    debugPanel.sendMidiMessage(1, '2', 'CC', '32', 78);

    expect(debugPanel.getOutputs().count()).toBe(2);
    expect(debugPanel.getOutput(0).getText()).toBe('OSC -> /in/2/out/1?');
    expect(debugPanel.getOutput(1).getText()).toBe('OSC -> /in/2/out/2?');

    debugPanel.clearOutput();
    debugPanel.sendMidiMessage(1, '7', 'Note', '22', 68);

    expect(debugPanel.getOutputs().count()).toBe(0);

    debugPanel.sendMidiMessage(1, '3', 'Note', '22', 87);

    expect(debugPanel.getOutputs().count()).toBe(3);
  });

  // TODO Complete once the interface is ready to send parameters.
  xit('should be able to send OSC parameters.', function(){
    var mi1 = 'In 1',
      oo1 = 'Out 1';

    // Listen to all midi ports
    debugPanel.setMidiInputPorts([mi1]);
    midiConfigPanel.open();
    midiConfigPanel.selectPort(0);

    // Add 3 output ports
    oscConfigPanel.open();
    oscConfigPanel.setName(0, oo1);
    oscConfigPanel.setAddress(0, 'localhost');
    oscConfigPanel.setPort(0, '1');

    // Add an output to the 2nd input.
    inputs.addOutput(0);

    modulator.setupMidiRow(0, mi1, '1', ':', 'All');
    modulator.setupOSCRow(0, 0, oo1, '/in/1/out/1', [{'a':'foo'}, {'b':'fighters'}]);
    modulator.setupOSCRow(0, 1, oo1, '/in/1/out/2', [{'art':'blakey'}]);

    debugPanel.sendMidiMessage(1, '1', 'note', '22', 50);

    expect(debugPanel.getOutputs().count()).toBe(2);
    expect(debugPanel.getOutput(0).getText()).toBe('OSC -> /in/1/out/1?a=foo&b=fighters');
    expect(debugPanel.getOutput(1).getText()).toBe('OSC -> /in/1/out/2?art=blakey');
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