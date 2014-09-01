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
    midiInputOSCHost = 'select.oscHost',
    midiInputOSCPath = 'input[name=oscPath]',
    // Mock Output Debug
    mockDebugPanelSendMidi = '#mock-debug-panel button',
    mockDebugPanelOutput = '#mock-debug-panel .output',
    openOSCPanel,
    addOSCPort,
    openMidiPanel,
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

  basicSetup = function(){
    var inputObject;

    openMidiPanel();

    // turn on the first midi input port
    $(midiConfigPanel).$$(configPanelRow).first().$(midiConfigPortToggle).click();

    // open the osc panel
    openOSCPanel();

    // add an osc output port
    addOSCPort('live', 'localhost', '9090');

    inputObject = $$(midiInputRow).first();

    // specify a midi note
    inputObject.$(midiInputNote).sendKeys(':');

    // select the osc output port
    inputObject.$$(midiInputOSCHost + ' option').last().click();

    // set an osc output path
    inputObject.$(midiInputOSCPath).sendKeys('/');
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

  xit('should be able to send osc messages if the osc host is removed and re-added.', function(){
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

    browser.debugger();

    // Remove the current host.
    var hostRow = $(oscConfigPanel).$$(configPanelRow).last();
    hostRow.$(oscConfigHostPort).sendKeys('\b', '\b', '\b', '\b');

    browser.debugger();

    // Try to send another message.
    $(mockDebugPanelSendMidi).click();

    browser.debugger();

    // Make sure no new messages were sent since we don't have a host configured.
    expect($$(outputNodes).count()).toBe(1);

    // Make sure the osc output row host was updated and is now empty.
    var hostSelect = inputObject.$$(midiInputOSCHost + ' option');
    expect(hostSelect.count()).toBe(1);
    expect(hostSelect.last().getText()).toBe('');

    browser.debugger();

    // Fix the osc port.
    hostRow.$(oscConfigHostPort).sendKeys('8989');

    // Try to send another message.
    $(mockDebugPanelSendMidi).click();

    // Make sure nothing new was sent.
    expect($$(outputNodes).count()).toBe(1);

    // Select the updated host and change the path.

    // Send another message.

    // Make sure the message was sent this time.
  });

  it('should be able to send osc messages if the output hosts are configured before' +
    'the midi input is configured.', function(){
    // TODO
  });
});