'use strict'

var
  midiConfigPanel = require('./midi-config-panel'),
  oscConfigPanel = require('./osc-config-panel'),
  inputs = require('./input'),

  modulator = {};

modulator = {
  setupMidiToOSC: function(midiRow, oscRow, midiHost, midiChannel, midiNote, midiNoteType, oscHost, oscPath, oscParams){
    modulator.setupMidiRow(midiRow, midiHost, midiChannel, midiNote, midiNoteType);
    modulator.setupOSCRow(midiRow, oscRow, oscHost, oscPath, oscParams);
  },

  setupMidiRow: function(index, host, channel, note, type){
    inputs.setNote(index, note);
    inputs.setPortByName(index, host);
    inputs.setChannelByName(index, channel);
    inputs.setNoteTypeByName(index, type);
  },

  setupOSCRow: function(row, index, host, path, parameters){
    inputs.setOSCHostOption(row, index, host);
    inputs.setOSCPath(row, index, path);

    // TODO Handle parameter lists.
  },

  basicMidiHostSetup: function(){
    midiConfigPanel.open();
    midiConfigPanel.selectPort(0);
  },

  basicOSCHostSetup: function(){
    oscConfigPanel.open();
    oscConfigPanel.addPort('live', 'localhost', '9090');
  },

  basicSetup: function(){
    var inputObject;

    modulator.basicMidiHostSetup();
    modulator.basicOSCHostSetup();

    modulator.setupMidiToOSC(0, 0, 'All', 'All', ':', 'All', 'live', '/', []);
  }
};

module.exports = modulator;