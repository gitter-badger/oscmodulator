describe('angularjs homepage', function() {
  'use strict';

  var homepage = 'http://localhost:9000',
    // TODO Convert these into PageObjects
    // http://www.thoughtworks.com/insights/blog/using-page-objects-overcome-protractors-shortcomings
    // Config Panels
    configPanelRow = '.configRow',
    midiConfigPanel = '.midiPanel',
    midiConfigPanelHeader = '.midiPanel h2',
    midiConfigPanelButton = 'button[name=showMidiPanel]',
    midiConfigPortToggle = 'input[name=midiPortEnabled]',
    firstMidiPortName = 'USB Trigger Finger',
    oscConfigPanel = '.oscPanel',
    oscConfigPanelHeader = '.oscPanel h2',
    oscConfigPanelButton = 'button[name=showOSCPanel]',
    oscConfigPanelAddHostButton = 'button[name=addOSCHost]',
    oscConfigHostName = 'input[name=oscHostName]',
    oscConfigHostAddress = 'input[name=oscHostAddress]',
    oscConfigHostPort = 'input[name=oscHostPort]',
    // Midi Input rows
    midiInputRow = 'div.midiInput',
    midiInputPortSelect = 'select[name=midiPort]',
    midiInputNote = 'input[name=midiInNote]',
    midiInputNoteTypeSelect = 'select[name=midiNoteType]',
    midiInputChannelSelect = 'select[name=midiChannel]',
    midiInputOSCHost = 'select.oscHost',
    midiInputOSCPath = 'input[name=oscPath]',
    // Mock Output Debug
    mockDebugPanelSendMidi = '#mock-debug-panel button',
    mockDebugPanelOutput = '#mock-debug-panel .output',
    openOSCPanel,
    addOSCPort,
    openMidiPanel,
    setupMidiRow,
    setupOSCRow,
    setupMidiToOSC,
    basicMidiHostSetup,
    basicOSCHostSetup,
    basicSetup;

  openMidiPanel = function(){
    $(midiConfigPanelButton).click();

    browser.wait(function(){
      return $(midiConfigPanelHeader).isDisplayed();
    }, 1000, 'Failed to find the open midi port form.');
  };

  openOSCPanel = function(){
    $(oscConfigPanelButton).click();

    browser.wait(function(){
      return $(oscConfigPanelHeader).isDisplayed();
    }, 1000, 'Failed to find the open osc port form.');
  };

  addOSCPort = function(name, address, port){
    var hostRow = $(oscConfigPanel).$$(configPanelRow).last();
    hostRow.$(oscConfigHostName).sendKeys(name);
    hostRow.$(oscConfigHostAddress).sendKeys(address);
    hostRow.$(oscConfigHostPort).sendKeys(port);
  };

  setupMidiToOSC = function(row, midiHost, midiChannel, midiNote, midiNoteType, oscHost, oscPath, oscParams){
    setupMidiRow(row, midiHost, midiChannel, midiNote, midiNoteType);
    setupOSCRow(row, oscHost, oscPath, oscParams);
  };

  setupMidiRow = function(row, host, channel, note, type){
    // specify a midi note
    row.$(midiInputNote).sendKeys(note);

    // Specify the host.
    row.element(by.cssContainingText(midiInputPortSelect + ' option', host)).click();

    // Specify the channel.
    row.element(by.cssContainingText(midiInputChannelSelect + ' option', channel)).click();

    // Specify the note type.
    row.element(by.cssContainingText(midiInputNoteTypeSelect + ' option', type)).click();
  };

  setupOSCRow = function(row, host, path, parameters){
    // select the osc output port
    row.element(by.cssContainingText(midiInputOSCHost + ' option', host)).click();

    // set an osc output path
    row.$(midiInputOSCPath).sendKeys(path);

    // TODO Handle parameter lists.
  };

  basicMidiHostSetup = function(){
    openMidiPanel();

    // turn on the first midi input port
    $(midiConfigPanel).$$(configPanelRow).first().$(midiConfigPortToggle).click();
  };

  basicOSCHostSetup = function(){
    // open the osc panel
    openOSCPanel();

    // add an osc output port
    addOSCPort('live', 'localhost', '9090');
  }

  basicSetup = function(){
    var inputObject;

    basicMidiHostSetup();
    basicOSCHostSetup();

    inputObject = $$(midiInputRow).first();

    setupMidiToOSC(inputObject, 'All', 'All', ':', 'All', 'live', '/', []);
  };

  beforeEach(function(){
    browser.get(homepage);
  });

  it('should start with one midi input.', function () {
    expect($$(midiInputRow).count()).toBe(1);
  });

  it('should be able to open the midi panel.', function(){
    expect($(midiConfigPanelHeader).isDisplayed()).toBe(false);

    openMidiPanel();

    expect($(midiConfigPanelHeader).isDisplayed()).toBe(true);
  });

  it('should be able to open the osc panel.', function(){
    expect($(oscConfigPanelHeader).isDisplayed()).toBe(false);

    openOSCPanel();

    expect($(oscConfigPanelHeader).isDisplayed()).toBe(true);
  });

  it('should be able to select a midi input port.', function(){
    var options;

    openMidiPanel();

    // Turn on the first midi input
    $(midiConfigPanel).$$(configPanelRow).first().$(midiConfigPortToggle).click();

    // Check that the first midi input object includes this port in the midi drop down.
    options = $$(midiInputRow).first().$$(midiInputPortSelect + ' option');
    expect(options.count()).toBe(2);
    expect(options.first().getText()).toBe('All');
    expect(options.last().getText()).toBe(firstMidiPortName);
  });

  it('should be able to setup an osc port.', function(){
    var options;

    openOSCPanel();

    addOSCPort('name', 'localhost', '9050');

    options = $(midiInputRow).$$('.oscHost option');
    expect(options.count()).toBe(2);
    expect(options.last().getText()).toBe('name');
  });

  it('should be able to receive midi events.', function(){
    var inputObject, outputNodes;

    basicSetup();

    inputObject = $$(midiInputRow).first();

    outputNodes = mockDebugPanelOutput + ' p';
    expect($$(outputNodes).count()).toBe(0);

    $(mockDebugPanelSendMidi).click();

    expect($$(outputNodes).count()).toBe(1);
    expect($(outputNodes).getText()).toEqual('OSC -> /?');

    inputObject.$(midiInputOSCPath).clear();

    var hostRow = $(oscConfigPanel).$$(configPanelRow).last();
    hostRow.$(oscConfigHostPort).sendKeys('33');

    inputObject.$(midiInputOSCPath).sendKeys('/some/path');

    $(mockDebugPanelSendMidi).click();

    expect($$(outputNodes).count()).toBe(2);
    expect($$(outputNodes).last().getText()).toBe('OSC -> /some/path?');
  });

  it('should be able to send osc messages if the osc host is removed and re-added.', function(){
    var inputObject, outputNodes;

    basicSetup();

    inputObject = $$(midiInputRow).first();

    // Make sure no messages have been sent yet.
    outputNodes = mockDebugPanelOutput + ' p';
    expect($$(outputNodes).count()).toBe(0);

    $(mockDebugPanelSendMidi).click();

    // Make sure we can send messages.
    expect($$(outputNodes).count()).toBe(1);
    expect($(outputNodes).getText()).toEqual('OSC -> /?');

    // Remove the current host.
    var hostRow = $(oscConfigPanel).$$(configPanelRow).last();
    hostRow.$(oscConfigHostPort).sendKeys('\b', '\b', '\b', '\b');

    // Try to send another message.
    $(mockDebugPanelSendMidi).click();

    // Make sure no new messages were sent since we don't have a host configured.
    expect($$(outputNodes).count()).toBe(1);

    // Make sure the osc output row host was updated and is now empty.
    var hostSelect = inputObject.$$(midiInputOSCHost + ' option');
    expect(hostSelect.count()).toBe(1);
    expect(hostSelect.last().getText()).toBe('');

    // Fix the osc port.
    hostRow.$(oscConfigHostPort).sendKeys('8989');

    // Try to send another message.
    $(mockDebugPanelSendMidi).click();

    // Make sure nothing new was sent.
    expect($$(outputNodes).count()).toBe(1);

    // Select the updated host and change the path.
    hostSelect.last().click();

    // Send another message.
    $(mockDebugPanelSendMidi).click();

    // Make sure the message was sent this time.
    expect($$(outputNodes).count()).toBe(2);
    expect($$(outputNodes).last().getText()).toEqual('OSC -> /?');
  });

  it('should be able to send osc messages if the output hosts are configured before' +
    'the midi input is configured.', function(){
    var inputObject, outputNodes;

    basicMidiHostSetup();
    basicOSCHostSetup();

    inputObject = $$(midiInputRow).first();

    // Setup midi to OSC.
    setupOSCRow(inputObject, 'live', '/', []);

    // Make sure no messages have been sent yet.
    outputNodes = mockDebugPanelOutput + ' p';
    expect($$(outputNodes).count()).toBe(0);

    // Send a fake midi message
    $(mockDebugPanelSendMidi).click();

    // Make sure we can send messages.
    expect($$(outputNodes).count()).toBe(0);

    // Activate a midi host.
    setupMidiRow(inputObject, 'All', 'All', ':', 'All');

    // Send a fake midi message
    $(mockDebugPanelSendMidi).click();

    // Make sure we can send messages.
    expect($$(outputNodes).count()).toBe(1);
    expect($$(outputNodes).last().getText()).toEqual('OSC -> /?');
  });

  it('should be able to disable the midi input row when a midi host is removed.', function(){
     // Basic setup
     // Disable the midi host
     // Make sure midi messages are nolonger handled and that no errors occur.

      // TODO Mock out the midi and osc ends of legato rather than legato itself so
      // we don't need to re-implement the routing aspects of legato.
  });

  it('should be able to trigger multiple OSC outputs from a single midi event.', function(){});

  it('should be able to route the correct midi input to the correct OSC output.', function(){});

  it('should be able to automatically re-select an OSC output host if the OSC host becomes invalid and then valid again.',
    function(){});

  it('should be able to automatically re-select a midi input host if the midi host is de-selected and then reselected.',
    function(){});
});