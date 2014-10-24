'use strict'

var
  selectors = {
    panel:'.midiPanel',
    header:'.midiPanel h2',
    openButton:'button[name=showMidiPanel]',
    portToggle:'input[name=midiPortEnabled]',
    configPanelRow:'.configRow'
  },
  output;

output = {
  isOpen:function(){
    return $(selectors.header).isDisplayed();
  },

  open: function(){
    $(selectors.openButton).click();

    browser.wait(function(){
      return output.isOpen();
    }, 1000, 'Failed to find the open midi port form.');
  },

  getAvailablePorts:function(){
    return $$(selectors.portToggle);
  },

  getRow:function(index){
    return $(selectors.panel).$$(selectors.configPanelRow).get(index);
  },

  getPort:function(index){
    return output.getRow(index).$(selectors.portToggle);
  },

  selectPort:function(index){
    output.getPort(index).click();
  }
};

module.exports = output;