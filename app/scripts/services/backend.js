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
  };

  /**
   * Change the midi note information for a specific input.
   * @param inputId The id of the input who's midi note changed.
   * @param newNote The new midi note to use.
   */
  backend.updateInputMidiNote = function(inputId, newNote){
    console.log('Updating midi note for input ' + inputId + ': ' + newNote);
    // this.updateMidiListener(inputId)
  };

  /**
   * Change the midi note type information for a specific input.
   * @param inputId The id of the input that was updated.
   * @param newType The new midi note type.
   */
  backend.updateInputMidiNoteType = function(inputId, newType){
    console.log('Updating midi note type for input ' + inputId + ': ' + newType);
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
  };

  /**
   * Change the solo setting of an input.
   * @param inputId The id of the input that was soloed/unsoloed.
   * @param solo True = input is soloed.
   */
  backend.updateInputSolo = function(inputId, solo){
    console.log('Updating solo for input ' + inputId + ': ' + solo);
    // midi.solo(inputId)
  };

  /**
   * Remove an input.
   * @param inputId The id of the input to be removed.
   */
  backend.removeInput = function(inputId){
    console.log('Removing input ' + inputId);
    // midi.removeMidiListener(inputId)
  };

  // TODO Should the event names be specified in a central location so they're
  // easy to change and lookup?
  // TODO Do we want one event per piece of info that can change or do we want more generic
  // event names (ex. input:new, input:remove and input:update)?
  // TODO Is it ok to place these event listeners on the rootScope? It might be more
  // efficient (a guess) but it breaks encapsulation.
  $rootScope.$on('input:new', function(event, input){
    backend.newInput(input);
  });

  $rootScope.$on('input:update:midi:note', function(event, id, note){
    backend.updateInputMidiNote(id, note);
  });
  $rootScope.$on('input:update:midi:type', function(event, id, type){
    backend.updateInputMidiNoteType(id, type);
  });
  $rootScope.$on('input:update:mute', function(event, id, muted){
    backend.updateInputMute(id, muted);
  });
  $rootScope.$on('input:update:solo', function(event, id, solo){
    backend.updateInputSolo(id, solo);
  });
  $rootScope.$on('input:remove', function(event, id){
    backend.removeInput(id);
  });
//  $scope.$on('output:new');
//  $scope.$on('output:update:host');
//  $scope.$on('output:update:path');
//  $scope.$on('output:update:parameters');
//  $scope.$on('output:remove');

  return backend;
});
