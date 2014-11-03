'use strict'

var
  selectors = {
    setMidiInputs:'#mock-debug-panel button.setMidiInputs',
    midiInputs:'#mock-debug-panel .midi-inputs',
    sendMidi:'#mock-debug-panel button.fakeMidiEvent',
    clearOutput: '#mock-debug-panel button.clearOutput',
    output:'#mock-debug-panel .output',
    inputId:'#mock-debug-panel .input-id',
    channel:'#mock-debug-panel .channel',
    noteType:'#mock-debug-panel .note-type',
    note:'#mock-debug-panel .note',
    value:'#mock-debug-panel .value'
  },
  output;

output = {
  sendMidiMessage: function(input, channel, type, note, value){
    if(input){
      $(selectors.inputId).clear().sendKeys(input);
      $(selectors.channel).clear().sendKeys(channel);
      $(selectors.noteType).clear().sendKeys(type);
      $(selectors.note).clear().sendKeys(note);
      $(selectors.value).clear().sendKeys(value);
    }

    $(selectors.sendMidi).click();
  },

  getOutputs:function(){
    return $$(selectors.output + ' p');
  },

  getOutput:function(index){
    var outputs = output.getOutputs();

    if(index >= 0){
      return outputs.get(index);
    }
    else{
      return outputs.last();
    }
  },

  clearOutput:function(){
    $(selectors.clearOutput).click();
  },

  setMidiInputPorts: function(inputs){
    var string = inputs.join(',');
    $(selectors.midiInputs).sendKeys(string);
    $(selectors.setMidiInputs).click();
  }
};

module.exports = output;