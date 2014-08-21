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
    openMidiPanel;

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
//    $(oscConfigPanelAddHostButton).click();

    var hostRow = $(oscConfigPanel).$$(configPanelRow).last();
    hostRow.$(oscConfigHostName).sendKeys(name);
    hostRow.$(oscConfigHostAddress).sendKeys(address);
    hostRow.$(oscConfigHostPort).sendKeys(port);
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

    openMidiPanel();

    // turn on the first midi input port
    $(midiConfigPanel).$$(configPanelRow).first().$(midiConfigPortToggle).click();

    // open the osc panel
    openOSCPanel();

    // add an osc output port
    addOSCPort('live', 'localhost', '9');

    inputObject = $$(midiInputRow).first();

    // specify a midi note
    inputObject.$(midiInputNote).sendKeys(':');

    // select the osc output port
    inputObject.$$(midiInputOSCHost + ' option').last().click();

    // set an osc output path
    inputObject.$(midiInputOSCPath).sendKeys('/');

    outputNodes = mockDebugPanelOutput + ' p';
    expect($$(outputNodes).count()).toBe(0);

    $(mockDebugPanelSendMidi).click();

    expect($$(outputNodes).count()).toBe(1);
    expect($(outputNodes).getText()).toEqual('OSC -> /?');
  });
});