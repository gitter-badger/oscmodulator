/**
 * This service provides the input and output configuration for the application. It is a scope object
 * so its properties can be $watch-ed.
 */
angular.module('oscmodulatorApp').factory('inputConfig', function($rootScope, jq) {
  'use strict';

  var service = $rootScope.$new();

  /**
   * The list of inputs for the application.
   * Each input has the following structure:
   * {
   *   id: {
   *     input: 1
   *   },
   *   name: null,
   *   collapsed: false,
   *   mute: false,
   *   solo: false,
   *   midi: {
   *     note: null,
   *     type: null
   *   },
   *   osc: [{
   *     id: {
   *       input: 1,
   *       output: 2
   *     },
   *     host: null,
   *     path: null,
   *     parameters: []
   *   }]
   * }
   * @type {Array}
   */
  service.inputs = [];

  /**
   * The number of inputs created since the application launched (used to assign ids).
   * @type {number}
   */
  service.inputsCreated = 0;

  /**
   * Add a Midi Input to the list of inputs.
   */
  service.addInput = function(input){
    ++service.inputsCreated;
    if(!input){
      input = {};
    }

    input.id = {
      input: service.inputsCreated
    };
    service.inputs.push(input);
  };

  /**
   * Initialize the list of inputs. This will replace the input list with the list passed in. It can be
   * called as many times as you want.
   * @param inputs {Array} The list of input objects to set as the inputs list.
   */
  service.init = function(inputs){
    var i;
    service.inputs = [];
    for(i = 0; i < inputs.length; i++){
      service.addInput(inputs[i]);
    }
  };

  /**
   * Create a new midi input with all the same settings as the input with at the specified index.
   * @param index The index of the midi input to copy.
   */
  service.duplicateInput = function(id){
    var index = service.findInputIndex(id);

    ++service.inputsCreated;

    service.inputs.push(jq.extend(true, {}, service.inputs[index]));
    service.inputs[service.inputs.length - 1].id = {
      input: service.inputsCreated
    };
  };

  /**
   * Remove the specified midi input from the list of inputs.
   * @param id The id of the midi input to remove. ex: {input:1}
   */
  service.removeInput = function(id){
    service.inputs.splice(service.findInputIndex(id), 1);
  };

  /**
   * Find the index of an input item given its id.
   * @param id {Object} The id of the item. ex: {input:1, output:2}
   */
  service.findInputIndex = function(id){
    var i;
    for(i = 0; i < service.inputs.length; i++){
      if(service.inputs[i].id.input === id.input){
        return i;
      }
    }
    return -1;
  };

  // Should always show the default input.
  service.addInput();

  return service;
});
