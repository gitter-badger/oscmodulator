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
   *   name: null,
   *   collapsed: false,
   *   mute: false,
   *   solo: false,
   *   midi: {
   *     note: null,
   *     type: null
   *   },
   *   osc: [{
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

  // Make sure the id properties are always set by this class.
//  for(var i = 0; i < service.inputs.length; i++){
//    ++service.inputsCreated;
//    service.inputs[i].id = service.inputsCreated;
//  }

  /**
   * Add a Midi Input to the list of inputs.
   * TODO Add a method to pass input configurations into this class?
   */
  service.addInput = function(input){
    ++service.inputsCreated;
    if(!input){
      input = {};
    }

    input.id = service.inputsCreated;
    service.inputs.push(input);
    // TODO Tell the backend service that we've changed.
//    $rootScope.$broadcast('input:new', service.inputs[service.inputs.length - 1]);
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
  service.duplicateInput = function(index){
    ++service.inputsCreated;
    service.inputs.push(jq.extend(true, {}, service.inputs[index]));
    service.inputs[service.inputs.length - 1].id = service.inputsCreated;
    // TODO Tell the backend service that we've changed.
//    service.$emit('input:new', service.inputs[service.inputs.length - 1]);
  };

  /**
   * Remove the specified midi input from the list of inputs.
   * @param index The index of the midi input to copy.
   */
  service.removeInput = function(index){
    var removed = service.inputs.splice(index, 1);
    // TODO Tell the backend service that we've changed.
//    service.$emit('input:remove', removed[0].id);
  };

  // Should always show the default input.
  service.addInput();

  return service;
});
