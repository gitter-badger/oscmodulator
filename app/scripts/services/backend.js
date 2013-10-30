/**
 * The backend service is used to communicate between the javascript UI running
 * in the browser and the code running outside of the browser (Node or C code).
 */
angular.module('oscmodulatorApp').factory('backend', function($rootScope, midi) {
  'use strict';
  var backend = {};

//  backend.updateMidiListener = function(inputId){
//    var input = this.findInput(inputId);
//
//    if(this.inputIsReady(input)){
//      midi.removeMidiListener(inputId);
//      midi.addMidiListener(inputId, input);
//    }
//  };

  /**
   * Initialize the backend and any services used by the backend.
   */
  backend.init = function(){
    midi.start();
  };

  /**
   * Create a new input on the backend.
   */
  backend.newInput = function(/*inputConfig*/){
    console.log('Creating new backend input.');
    // Check that input has all the required properties.
    // if(this.inputIsReady(inputConfig.id))
    // Connect the input based on config.
    // midi.createInput(inputConfig);
    // otherwise, wait for the updates
    // TODO Test this method.
  };

  /**
   * Change the midi note information for a specific input.
   * @param inputId The id of the input who's midi note changed.
   * @param newNote The new midi note to use.
   */
  backend.updateInputMidiNote = function(inputId, newNote){
    console.log('Updating midi note for input ' + inputId + ': ' + newNote);
    // this.updateMidiListener(inputId)
    // TODO Test this method.
  };

  /**
   * Change the midi note type information for a specific input.
   * @param inputId The id of the input that was updated.
   * @param newType The new midi note type.
   */
  backend.updateInputMidiNoteType = function(inputId, newType){
    console.log('Updating midi note type for input ' + inputId + ': ' + newType);
    // TODO Test this method.
  };

  /**
   * Change the mute setting of a midi input.
   * @param inputId The id of the input that was muted/unmuted.
   * @param muted True = input is muted.
   */
  backend.updateInputMute = function(inputId, muted){
    console.log('Updating mute for input ' + inputId + ': ' + muted);
    // if( muted )
    // this.findInput(inputId)
    // midi.addMidiListener(input)
    // else
    // midi.removeMidiListener(inputId)
    // TODO Test this method.
  };

  /**
   * Change the solo setting of an input.
   * @param inputId The id of the input that was soloed/unsoloed.
   * @param solo True = input is soloed.
   */
  backend.updateInputSolo = function(inputId, solo){
    console.log('Updating solo for input ' + inputId + ': ' + solo);
    // midi.solo(inputId)
    // TODO Test this method.
  };

  /**
   * Remove an input.
   * @param inputId The id of the input to be removed.
   */
  backend.removeInput = function(inputId){
    console.log('Removing input ' + inputId);
    // midi.removeMidiListener(inputId)
    // TODO Test this method.
  };

  /**
   * Add/update an OSC output.
   * @param config An object with the structure
   * {
   *   id:{input:1, output:1},
   *   host:'a',
   *   path:'/path',
   *   parameters:[{value:'value'}]
   * }
   */
  backend.setOSCOutput = function(/*config*/){
    // TODO Test this method.
  };

  /**
   * Remove an OSC output configuration.
   * @param id {Object} The id of the output to set/add. ex: {input:1, output:1}
   */
  backend.removeOSCOutput = function(/*id*/){
    // TODO Test this method.
  };

  /**
   * Update the OSC path for an existing output object.
   * @param path {String} The path to set.
   */
  backend.setOSCPath = function(/*id, path*/){
    // TODO Test this method.
  };

  /**
   * Update the OSC host for an existing output object.
   * @param id {Object} The id of the output to set/add. ex: {input:1, output:1}
   * @param host {String} The id of the host to use with this output.
   */
  backend.setOSCHost = function(/*id, host*/){
    // TODO Test this method.
  };

  /**
   * Set the OSC parameters for the specified OSC output.
   * @param id The id of the output to modify. {input:x, output:y}
   * @param params The list of parameters to send with the specified output.
   */
  backend.setOSCParameters = function(/*id, params*/){
    // TODO Test this method.
  };

  return backend;
});
