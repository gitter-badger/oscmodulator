/**
 * This service provides the input and output configuration for the application. It is a scope object
 * so its properties can be $watch-ed.
 */
angular.module('oscmodulatorApp').factory('inputConfig', function($rootScope, jq, $log) {
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
   *   outputs: {
   *     id:{
   *       id: {
   *         input: 1,
   *         output: 2
   *       },
   *       host: null,
   *       path: null,
   *       parameters: []
   *     }
   *   }
   * }
   * @type {Array}
   */
  service.inputs = {};

  /**
   * The number of inputs created since the application launched (used to assign ids).
   * @type {number}
   */
  service.inputsCreated = 0;

  /**
   * The number of outputs created since the application launched (used to assign ids).
   * @type {number}
   */
  service.outputsCreated = 0;

  /**
   * Make sure that the input has all of the required properties.
   * @param {Object} input The input object with some properties set.
   */
  service.initInput = function(input){
    var template = {
      name:null,
      collapsed:false,
      mute:false,
      solo:false,
      midi:{
        note:null,
        type:'on'
      },
      outputs:{}
    };
    service.validateInput(input);
    jq.extend(template, input);
    return template;
  };

  /**
   * Validate all of the properties of an input object. This will be used to make sure that input configurations
   * from external files are valid. Any invalid properties will be logged and reset to a default state.
   * @param {Object} input The input configuration to validate.
   */
  service.validateInput = function(input){
    if(typeof(input.name) !== 'string'){
      $log.warn('Input.name is not a string.');
      input.name = null;
    }

    if(typeof(input.collapsed) !== 'boolean'){
      $log.warn('Input.collapsed is not a boolean.');
      input.collapsed = false;
    }

    if(typeof(input.mute) !== 'boolean'){
      $log.warn('Input.mute is not a boolean.');
      input.mute = false;
    }

    if(typeof(input.solo) !== 'boolean'){
      $log.warn('Input.solo is not a boolean.');
      input.solo = false;
    }

    if(typeof(input.midi) !== 'object'){
      $log.warn('Input.midi is not an object.');
      input.midi = {};
    }

    if(typeof(input.midi.note) !== 'string'){
      $log.warn('Input.midi.note is not a string.');
      input.midi.note = null;
    }

    if(typeof(input.midi.type) !== 'string'){
      $log.warn('Input.midi.type is not a string.');
      input.midi.type = 'on';
    }

    if(typeof(input.outputs) !== 'object'){
      $log.warn('Input.outputs is not an object.');
      input.outputs = {};
    }
  };

  /**
   * Make sure that the output has all of the required properties.
   * @param {Object} output The output object with some properties set.
   */
  service.initOutput = function(output){
    var template = {
      host:null,
      path:null,
      parameters:[]
    };
    service.validateOutput(output);
    jq.extend(template, output);
    return template;
  };

  /**
   * Validate all of the properties of an output object. This is used to make sure that output objects read
   * from configuration are valid. Any invalid properties will be logged and reset to a default state.
   * @param {Object} output The output configuration to validate.
   */
  service.validateOutput = function(output){
    if(typeof(output.host) !== 'string'){
      $log.warn('Output.host is not a String.');
      output.host = null;
    }

    if(typeof(output.path) !== 'string'){
      $log.warn('Output.path is not a String.');
      output.path = null;
    }

    if(typeof(output.parameters) !== 'object' ||
      typeof(output.parameters) === 'object' && Object.prototype.toString.call(output.parameters) !== '[object Array]'){
      $log.warn('Output.parameters is not an Array.');
      output.parameters = [];
    }
  };

  /**
   * Add an output to the specified input.
   * @param {Object} id The id of the input to add to. ex: {input:1}
   * @param {Object} output An object used to initialize the output.
   * @return {Object} The id of the new output. ex:{input:1,output:2}
   */
  service.addOutput = function (id, output){
    var newOutput;

    ++service.outputsCreated;
    if(!output){
      output = {};
    }

    // Setup the output object.
    newOutput = service.initOutput(output);
    newOutput.id = {
      input: id.input,
      output: service.outputsCreated
    };

    // Store the initialized output.
    service.inputs[id.input].outputs[service.outputsCreated] = newOutput;

    return newOutput.id;
  };

  /**
   * Add a Midi Input to the list of inputs.
   */
  service.addInput = function(input){
    var newInput, prop;

    ++service.inputsCreated;
    if(!input){
      input = {};
    }

    // Setup the input object.
    newInput = service.initInput(input);
    newInput.id = {
      input: service.inputsCreated
    };

    // Store the initialized input.
    service.inputs[service.inputsCreated] = newInput;

    // Setup all of the output object.
    if(Object.keys(newInput.outputs).length === 0){
      service.addOutput(newInput.id);
    }
    else{
      for(prop in input.outputs){
        service.addOutput(newInput.id, input.outputs[prop]);
      }
    }

    return newInput.id;
  };

  /**
   * Initialize the list of inputs. This will replace the input list with the list passed in. It can be
   * called as many times as you want.
   * @param inputs {Array} The list of input objects to set as the inputs list.
   * @return {Object} The id of the new input. ex: {input:2}
   */
  service.init = function(inputs){
    var i;
    service.inputs = {};
    service.inputsCreated = 0;
    service.outputsCreated = 0;
    for(i = 0; i < inputs.length; i++){
      service.addInput(inputs[i]);
    }
  };

  /**
   * Create a new midi input with all the same settings as the input with at the specified index.
   * @param index The index of the midi input to copy.
   */
  service.duplicateInput = function(id){
    var newInput;

    ++service.inputsCreated;

    newInput = jq.extend(true, {}, service.inputs[id.input]);
    newInput.id = {
      input: service.inputsCreated
    };

    service.inputs[service.inputsCreated] = newInput;
  };

  /**
   * Remove the specified midi input from the list of inputs.
   * @param id The id of the midi input to remove. ex: {input:1}
   */
  service.removeInput = function(id){
    delete service.inputs[id.input];
  };

  /**
   * Remove an output object.
   * @param {Object} id formatted as {input:1, output:1}
   */
  service.removeOutput = function(id){
    delete service.inputs[id.input].outputs[id.output];
  };

  // Should always show the default input.
  service.addInput();

  return service;
});
