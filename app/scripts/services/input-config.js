/**
 * This service provides the input and output configuration for the application. It is a scope object
 * so its properties can be $watch-ed.
 */
angular.module('oscmodulatorApp').factory('inputConfig', function($rootScope, jq, $log) {
  'use strict';

  var service, inputRules, midiRules, portRules, outputRules;

  service = $rootScope.$new();

  inputRules = {
    valid: {type:'boolean', default:false, force:true},
    name: {type:'string', default:null},
    collapsed: {type:'boolean', default:false},
    mute: {type:'boolean', default:false},
    solo: {type:'boolean', default:false},
    midi: {type:'object', default:{}},
    outputs: {type:'object', default:{}}
  };

  midiRules = {
    name: {type:'string', default:null},
    note: {type:'string', default:null},
    type: {type:'string', default:'All'},
    port: {type:'object', default:{}},
    channel: {type:'string', default:'All'}
  };

  portRules = {
    name: {type:'string', default:'All'},
    id: {type:'string', default:'/:'},
    index: {type:'number', default:null},
    enabled: {type:'boolean', default:true}
  };

  outputRules = {
    valid:{type:'boolean', default:false, force:true},
    host:{type:'string', default:null},
    path:{type:'string', default:null},
    parameters:{type:'array', default:[]}
  };

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
   *   routeId: null,
   *   midi: {
   *     note: null,
   *     type: null,
   *     port: {
   *       name: 'All',
   *       id: '/:'
   *     },
   *     channel: 'All'
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
   * Validate the input object using the given validation rules. If properties are missing or invalid
   * the input will be modified.
   * @param input {Object} The object to validate.
   * @param rules {Object} An object with the properties expected to be on input.
   * TODO Test this method. Be sure to test that objects are copied and not referenced.
   */
  service.validate = function(input, rules){
    var prop;
    for(prop in rules){
      var useType = rules[prop].type === 'array' ? 'object' : rules[prop].type;

      // If forcing the default value of this property, then do so.
      if(rules[prop].force){
        if(typeof(rules[prop].default) === 'object'){
          input[prop] = jq.extend({}, rules[prop].default);
        }
        else{
          input[prop] = rules[prop].default;
        }
      }
      // If we are not forcing the value of this property, then test to see if the configured
      // property is of the correct type and if it is not, then use the default.
      else if(typeof(input[prop]) !== useType){
        $log.warn( prop + ' ' + input[prop] + ' is not a ' + rules[prop].type);

        if(rules[prop].type === 'array'){
          if(Object.prototype.toString.call(input[prop]) !== '[object Array]'){
            input[prop] = jq.extend({}, rules[prop].default);
          }
        }
        else{
          if(rules[prop].type === 'object'){
            input[prop] = jq.extend({}, rules[prop].default);
          }
          else{
            input[prop] = rules[prop].default;
          }
        }
      }
    }

    return input;
  };

  /**
   * The default midi port that all midi inputs listen on by default.
   * @type {Object} Matches the rules defiled in portRules.
   */
  service.defaultMidiPort = service.validate({}, portRules);

  /**
   * Validate all of the properties of an input object. This will be used to make sure that input configurations
   * from external files are valid. Any invalid properties will be logged and reset to a default state.
   * @param {Object} input The input configuration to validate. Ex: { name: {type:'string', default:'foo'}}
   */
  service.validateInput = function(input){
    service.validate(input, inputRules);
    service.validate(input.midi, midiRules);
    service.validate(input.midi.port, portRules);
    return input;
  };

  /**
   * Validate all of the properties of an output object. This is used to make sure that output objects read
   * from configuration are valid. Any invalid properties will be logged and reset to a default state.
   * @param {Object} output The output configuration to validate.
   */
  service.validateOutput = function(output){
    service.validate(output, outputRules);
    return output;
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
      newOutput = {};
    }
    else{
      newOutput = jq.extend({}, output);
    }

    // Setup the output object.
    newOutput = service.validateOutput(newOutput);
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
    var prop, newInput;

    ++service.inputsCreated;
    if(!input){
      newInput = {};
    }
    else{
      newInput = jq.extend({}, input);
    }

    // Setup the input object.
    service.validateInput(newInput);
    newInput.id = {
      input: service.inputsCreated
    };

    // Store the initialized input.
    service.inputs[service.inputsCreated] = newInput;

    // Setup all of the outputs.
    if(Object.keys(newInput.outputs).length === 0){
      service.addOutput(newInput.id);
    }
    else{
      for(prop in newInput.outputs){
        service.addOutput(newInput.id, newInput.outputs[prop]);
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
