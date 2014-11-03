'use strict'

var
  midiConfigPanel = require('./midi-config-panel'),
  oscConfigPanel = require('./osc-config-panel'),
  inputs = require('./input'),

  modulator = {};

modulator = {
  firstUpper: function(string){
    return string.charAt(0).toUpperCase() + string.slice(1);
  },

  setupMidiToOSC: function(midiRow, oscRow, midiHost, midiChannel, midiNote, midiNoteType, oscHost, oscPath, oscParams){
    modulator.setupMidiRow(midiRow, midiHost, midiChannel, midiNote, midiNoteType);
    modulator.setupOSCRow(midiRow, oscRow, oscHost, oscPath, oscParams);
  },

  setupMidiRow: function(index, host, channel, note, type){
    type = modulator.firstUpper(type);

    inputs.setNote(index, note);
    inputs.setPortByName(index, host);
    inputs.setChannelByName(index, channel);
    inputs.setNoteTypeByName(index, type);
  },

  setupOSCRow: function(row, index, host, path, parameters){
    inputs.setOSCHostOption(row, index, host);
    inputs.setOSCPath(row, index, path);

    // TODO Handle parameter lists.
    parameters.forEach(function(param){
      inputs.addOSCParameter(row, index, param);
    });
  },

  basicMidiHostSetup: function(){
    midiConfigPanel.open();
    midiConfigPanel.selectPort(0);
  },

  basicOSCHostSetup: function(){
    oscConfigPanel.open();
    oscConfigPanel.setName(0, 'live');
    oscConfigPanel.setAddress(0, 'localhost');
    oscConfigPanel.setPort(0, '9090');
  },

  basicSetup: function(){
    var inputObject;

    modulator.basicMidiHostSetup();
    modulator.basicOSCHostSetup();

    modulator.setupMidiToOSC(0, 0, 'All', 'All', ':', 'All', 'live', '/', []);
  }
};

module.exports = modulator;