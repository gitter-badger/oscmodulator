'use strict'

var
  selectors = {
    panel:'.oscPanel',
    header:'.oscPanel h2',
    button:'button[name=showOSCPanel]',
    addHostButton:'button[name=addOSCHost]',
    hostName:'input[name=oscHostName]',
    hostAddress:'input[name=oscHostAddress]',
    hostPort:'input[name=oscHostPort]',
    configPanelRow:'.configRow'
  },
  output;

output = {
  isOpen:function(){
    return $(selectors.header).isDisplayed();
  },

  open: function(){
    $(selectors.button).click();

    browser.wait(function(){
      return output.isOpen();
    }, 1000, 'Failed to find the open osc port form.');
  },

  getRows:function(){
    return $(selectors.panel).$$(selectors.configPanelRow);
  },

  getRow:function(index){
    if(index >= 0){
      return output.getRows().get(index);
    }
    else{
      return output.getRows().last();
    }
  },

  getPort: function(index){
    return output.getRow(index).$(selectors.hostPort);
  },

  getAddress: function(index){
    return output.getRow(index).$(selectors.hostAddress);
  },

  getName: function(index){
    return output.getRow(index).$(selectors.hostName);
  },

  addPort: function(name, address, port){
    output.setName(-1, name);
    output.setAddress(-1, address);
    output.setPort(-1, port);
  },

  setName: function(index, name){
    output.getName(-1).sendKeys(name);
  },

  setPort: function(index, port){
    output.getPort(index).sendKeys(port);
  },

  setAddress: function(index, address){
    output.getAddress(-1).sendKeys(address);
  }
};

module.exports = output;