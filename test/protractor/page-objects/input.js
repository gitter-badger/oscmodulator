'use strict'

var
  selectors = {
    midiInputs:{
      row:'div.midiInput',
      portSelect:'select[name=midiPort]',
      note:'input[name=midiInNote]',
      noteTypeSelect:'select[name=midiNoteType]',
      channelSelect:'select[name=midiChannel]',
      add:'button[name=addOSCOutput]'
    },
    oscOutputs:{
      host:'select.oscHost',
      path:'input[name=oscPath]',
      row:'.oscOutputItem'
    }
  },
  output;

output = {
  getRows:function(){
    return $$(selectors.midiInputs.row);
  },

  getRow:function(index){
    var rows = output.getRows();

    if(index >= 0){
      return rows.get(index);
    }
    else{
      return rows.last();
    }
  },

  getPortOptions:function(index){
    return output.getRow(index).$$(selectors.midiInputs.portSelect + ' option');
  },

  getPortOption:function(input, option){
    var options = output.getPortOptions(input);
    if(option >= 0){
      return options.get(option);
    }
    else{
      return options.last();
    }
  },

  getChannelOptions:function(index){
    return output.getRow(index).$$(selectors.midiInputs.channelSelect + ' option');
  },

  getChannelOption:function(index, option){
    var options = output.getChannelOptions(index);

    if(option >= 0){
      return options.get(option);
    }
    else{
      return options.last();
    }
  },

  getNoteTypeOptions:function(index){
    return output.getRow(index).$$(selectors.midiInputs.noteTypeSelect + ' option');
  },

  getNoteTypeOption:function(index, option){
    var options = output.getNoteTypeOptions(index);

    if(options >= 0){
      return options.get(option);
    }
    else{
      return options.last();
    }
  },

  setPort:function(index, option){
    output.getPortOption(index, option).click();
  },

  setPortByName:function(index, name){
    output.getRow(index)
      .element(by.cssContainingText(selectors.midiInputs.portSelect + ' option', name))
      .click();
  },

  setChannel:function(index, option){
    output.getChannelOption(index, option).click();
  },

  setChannelByName:function(index, name){
    output.getRow(index)
      .element(by.cssContainingText(selectors.midiInputs.channelSelect + ' option', name))
      .click();
  },

  setNoteType:function(index, option){
    output.getNoteTypeOption(index, option).click();
  },

  setNoteTypeByName:function(index, name){
    output.getRow(index)
      .element(by.cssContainingText(selectors.midiInputs.noteTypeSelect + ' option', name))
      .click();
  },

  getNote:function(index){
    return output.getRow(index).$(selectors.midiInputs.note);
  },

  setNote:function(index, note){
    output.getNote(index).sendKeys(note);
  },

  getOutputs:function(input){
    return output.getRow(input).$$(selectors.oscOutputs.row);
  },

  getOutput:function(input, index){
    var outputs = output.getOutputs(input);

    if(index >= 0){
      return outputs.get(index);
    }
    else{
      return outputs.last();
    }
  },

  addOutput:function(input){
    output.getRow(input).$(selectors.midiInputs.add).click();
  },

  getOSCHostOptions:function(input, index){
    return output.getOutput(input, index).$$(selectors.oscOutputs.host + ' option');
  },

  getOSCHostOption:function(input, index, option){
    var options = output.getOSCHostOptions(input, index);

    if(option >= 0){
      return options.get(option);
    }
    else{
      return options.last();
    }
  },

  getOSCPath:function(input, index){
    return output.getOutput(input, index).$(selectors.oscOutputs.path);
  },

  setOSCHostOption:function(input, index, option){
    output.getOSCHostOption(input, index, option).click();
  },

  setOSCHostOptionByName:function(input, index, name){
    output.getRow(input)
      .element(by.cssContainingText(selectors.oscOutputs.host + ' option', name))
      .click();
  },

  setOSCPath:function(input, index, path){
    output.getOSCPath(input, index).sendKeys(path);
  }
};

module.exports = output;