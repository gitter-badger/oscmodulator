/**
 * The backend service is used to communicate between the javascript UI running
 * in the browser and the code running outside of the browser (Node or C code).
 * TODO Rename this class to message-middleware.
 * TODO Rename all directives and services to use ClassName style capitalization?
 */
angular.module('oscmodulatorApp').factory('messageMiddleware', function($rootScope, midi, inputConfig, $log) {
  'use strict';
  var backend, midiRouteName, midiChannel;

  backend = {};

  // TODO Configure these somehow.
  // Is the midiRouteName just an arbitrary identifier for the port we're listening on?
  // Do we want to allow the channel to be configured as part of the midi input directive?
  midiRouteName = 'midi1';
  midiChannel = ':';

  /**
   * Initialize the messageMiddleware and any services used by the messageMiddleware.
   */
  backend.init = function(){
    midi.connect();
  };

  /**
   * Create a legato path string using the elements provided.
   * @param channel The channel on which to listen. If ':' then any channel.
   * @param note The note name to listen for. ex: c3
   */
  backend.getPath = function(channel, note){
    return ['', midiRouteName, channel, 'note', note].join('/');
  };

  /**
   * Create a new input on the messageMiddleware.
   */
  backend.setMidiInput = function(id){
    var path, note;

    $log.info('Creating new messageMiddleware input: ' + id.input);

    note = inputConfig.inputs[id.input].midi.note;
    path = backend.getPath(midiChannel, note);

    // Configure a new note listener for the specified config.
    midi.on(path, function(){
      $log.info('Backend midi input callback, Jack!');
    });
  };

  /**
   * Change the mute setting of a midi input.
   * @param inputId The id of the input that was muted/unmuted.
   * @param muted True = input is muted.
   */
  backend.muteInput = function(inputId, muted){
    $log.info('Updating mute for input ' + inputId.input + ': ' + muted);
    // TODO Test this method.
  };

  /**
   * Change the solo setting of an input.
   * @param inputId The id of the input that was soloed/unsoloed.
   * @param solo True = input is soloed.
   */
  backend.soloInput = function(inputId, solo){
    $log.info('Updating solo for input ' + inputId.input + ': ' + solo);
    // TODO Test this method.
  };

  /**
   * Remove an input.
   * @param inputId The id of the input to be removed.
   */
  backend.removeInput = function(inputId){
    $log.info('Removing input ' + inputId.input);
    // TODO How do we remove the correct callback if the midi note is used in two inputs?
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
    $log.info('Set OSC Output: ' + config.id.input + '|' + config.id.output);
  };

  /**
   * Remove an OSC output configuration.
   * @param id {Object} The id of the output to set/add. ex: {input:1, output:1}
   */
  backend.removeOSCOutput = function(id){
    // TODO Test this method.
    $log.info('Remove OSC Output: ' + id.input + '|' + id.output);
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
    $log.info('Set OSC Path: ' + id.input + '|' + id.output + ', path: ' + path);
  };

  /**
   * Update the OSC host for an existing output object.
   * @param id {Object} The id of the output to set/add. ex: {input:1, output:1}
   * @param host {String} The id of the host to use with this output.
   */
  backend.setOSCHost = function(id, host){
    // TODO Test this method.
    // TODO Should we just pass the id into this method and do a direct lookup?
    $log.info('Set OSC Host: ' + id.input + '|' + id.output + ', host: ' + host);
  };

  /**
   * Set the OSC parameters for the specified OSC output.
   * @param id The id of the output to modify. {input:x, output:y}
   * @param params The list of parameters to send with the specified output.
   */
  backend.setOSCParameters = function(id, params){
    // TODO Test this method.
    // TODO Should we just pass the id into this method and do a direct lookup?
    $log.info('Set OSC Parameters: ' + id.input + '|' + id.output + ', params: ' + params);
  };

  return backend;
});
