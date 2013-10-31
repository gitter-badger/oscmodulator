/**
 * The backend service is used to communicate between the javascript UI running
 * in the browser and the code running outside of the browser (Node or C code).
 * TODO Rename this class to message-middleware
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
  backend.setMidiInput = function(config){
    console.log('Creating new backend input: ' + config.id.input);
//    console.log(config);
    // TODO Test this method.
  };

//  /**
//   * Change the midi note information for a specific input.
//   * @param inputId The id of the input who's midi note changed.
//   * @param newNote The new midi note to use.
//   */
//  backend.updateInputMidiNote = function(inputId, newNote){
//    console.log('Updating midi note for input ' + inputId + ': ' + newNote);
//    // this.updateMidiListener(inputId)
//    // TODO Test this method.
//  };
//
//  /**
//   * Change the midi note type information for a specific input.
//   * @param inputId The id of the input that was updated.
//   * @param newType The new midi note type.
//   */
//  backend.updateInputMidiNoteType = function(inputId, newType){
//    console.log('Updating midi note type for input ' + inputId + ': ' + newType);
//    // TODO Test this method.
//  };

  /**
   * Change the mute setting of a midi input.
   * @param inputId The id of the input that was muted/unmuted.
   * @param muted True = input is muted.
   */
  backend.muteInput = function(inputId, muted){
    console.log('Updating mute for input ' + inputId.input + ': ' + muted);
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
  backend.soloInput = function(inputId, solo){
    console.log('Updating solo for input ' + inputId.input + ': ' + solo);
    // midi.solo(inputId)
    // TODO Test this method.
  };

  /**
   * Remove an input.
   * @param inputId The id of the input to be removed.
   */
  backend.removeInput = function(inputId){
    console.log('Removing input ' + inputId.input);
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
  backend.setOSCOutput = function(config){
    // TODO Test this method.
    // TODO Should we just pass the id into this method and do a direct lookup?
    console.log('Set OSC Output: ' + config.id.input + '|' + config.id.output);
  };

  /**
   * Remove an OSC output configuration.
   * @param id {Object} The id of the output to set/add. ex: {input:1, output:1}
   */
  backend.removeOSCOutput = function(id){
    // TODO Test this method.
    console.log('Remove OSC Output: ' + id.input + '|' + id.output);
  };

  /**
   * Update the OSC path for an existing output object.
   * TODO Remove the set path and set host methods. They feel like pre-mature optimization. The set osc parameters
   * method may also be pre-mature optimization.
   * @param path {String} The path to set.
   */
  backend.setOSCPath = function(id, path){
    // TODO Test this method.
    // TODO Should we just pass the id into this method and do a direct lookup?
    console.log('Set OSC Path: ' + id.input + '|' + id.output + ', path: ' + path);
  };

  /**
   * Update the OSC host for an existing output object.
   * @param id {Object} The id of the output to set/add. ex: {input:1, output:1}
   * @param host {String} The id of the host to use with this output.
   */
  backend.setOSCHost = function(id, host){
    // TODO Test this method.
    // TODO Should we just pass the id into this method and do a direct lookup?
    console.log('Set OSC Host: ' + id.input + '|' + id.output + ', host: ' + host);
  };

  /**
   * Set the OSC parameters for the specified OSC output.
   * @param id The id of the output to modify. {input:x, output:y}
   * @param params The list of parameters to send with the specified output.
   */
  backend.setOSCParameters = function(id, params){
    // TODO Test this method.
    // TODO Should we just pass the id into this method and do a direct lookup?
    console.log('Set OSC Parameters: ' + id.input + '|' + id.output + ', params: ' + params);
  };

  return backend;
});
