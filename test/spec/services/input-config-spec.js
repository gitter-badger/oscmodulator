describe('Service: inputConfig', function () {
  'use strict';

  // load the service's module
  beforeEach(module('oscmodulatorApp'));

  // instantiate service
  var inputConfig;
  beforeEach(inject(function (_inputConfig_) {
    inputConfig = _inputConfig_;
  }));

  it('should be able to validate the properties of an object,', function(){
    var emptyInput = {},
      invalidInput = {
        string:false,
        number:'b',
        boolean:5,
        object:true,
        array:{}
      },
      validInput = {
        string:'c',
        number:10,
        boolean:false,
        object:{name:'foo'},
        array:['bar','baz']
      },
      rules = {
        string:{type:'string', default:'a'},
        number:{type:'number', default:1},
        boolean:{type:'boolean', default:true},
        object:{type:'object', default:{}},
        array:{type:'array', default:[]}
      };

    inputConfig.validate(emptyInput, rules);

    expect(emptyInput.string).toBe('a');
    expect(emptyInput.number).toBe(1);
    expect(emptyInput.boolean).toBe(true);
    expect(emptyInput.object).toEqual({});
    expect(emptyInput.object).not.toBe(rules.object, 'The input should receive a fresh object.');
    expect(emptyInput.array).toEqual([]);
    expect(emptyInput.array).not.toBe(rules.array, 'The input should receive a fresh array.');

    inputConfig.validate(invalidInput, rules);

    expect(invalidInput.string).toBe('a');
    expect(invalidInput.number).toBe(1);
    expect(invalidInput.boolean).toBe(true);
    expect(invalidInput.object).toEqual({});
    expect(invalidInput.array).toEqual([]);

    inputConfig.validate(validInput, rules);

    expect(validInput.string).toBe('c');
    expect(validInput.number).toBe(10);
    expect(validInput.boolean).toBe(false);
    expect(validInput.object).toEqual({name:'foo'});
    expect(validInput.array).toEqual(['bar','baz']);
  });

  it('should be able to force the default values of an object.', function(){
    var emptyInput = {},
      rules = {
        string:{type:'string', default:'a', force:true},
        number:{type:'number', default:1, force:true},
        boolean:{type:'boolean', default:true, force:true},
        object:{type:'object', default:{}, force:true},
        array:{type:'array', default:[], force:true}
      };

    inputConfig.validate(emptyInput, rules);

    expect(emptyInput.string).toBe('a');
    expect(emptyInput.number).toBe(1);
    expect(emptyInput.boolean).toBe(true);
    expect(emptyInput.object).toEqual({});
    expect(emptyInput.object).not.toBe(rules.object);
    expect(emptyInput.array).toEqual([]);
    expect(emptyInput.array).not.toBe(rules.array);
  });

  it('should be able to validate an output configuration.', function(){
    var config = {
      host:1,
      path:false,
      parameters:false
    };

    inputConfig.validateOutput(config);

    expect(config.host).toBeNull('The host should have been reset.');
    expect(config.path).toBeNull('The path should have been reset.');
    expect(config.parameters).toEqual([], 'The parameters should have been reset.');
  });

  it('should be able to validate an input configuration.', function(){
    var config = {
      name:3,
      collapsed:'a',
      solo:'b',
      mute:'c',
      midi:{
        note:3,
        type:2
      },
      outputs:[]
    };

    inputConfig.validateInput(config);

    expect(config.name).toBeNull('The name should have been reset.');
    expect(config.collapsed).toBe(false, 'The collapsed state should have been reset.');
    expect(config.solo).toBe(false, 'The solo state should have been reset.');
    expect(config.mute).toBe(false, 'The mute state should have been reset.');
    expect(config.midi.note).toBeNull('The midi note should have been reset.');
    expect(config.midi.type).toBe('All', 'The midi note event should have been reset.');
    expect(config.outputs).toEqual({}, 'The outputs should have been reset.');
  });

  it('should default to one input.', function(){
    expect(Object.keys(inputConfig.inputs).length).toBe(1, 'One input should exist by default.');
    expect(inputConfig.inputs[1]).not.toBeNull('The default input should have an id.');
    expect(inputConfig.inputs[1].id.input).toBe(1, 'The default input id should be the number of inputs created.');
    expect(Object.keys(inputConfig.inputs[1].outputs).length).toBe(1, 'It should have a default output.');
  });

  it('should be able to add a default output to an input object.', function(){
    inputConfig.inputs[1] = inputConfig.validateInput({});
    inputConfig.inputs[1].id = {input:1};

    var id = inputConfig.addOutput({input:1});

    expect(Object.keys(inputConfig.inputs[1].outputs).length).toBe(1, 'The input should have a single output.');
    expect(inputConfig.inputs[1].outputs[inputConfig.outputsCreated].host)
      .toBeNull('The output should have a default host.');
    expect(inputConfig.inputs[1].outputs[inputConfig.outputsCreated].id)
      .toBe(id, 'The id of the new input should be returned.');
  });

  it('should be able to add a blank input to the inputConfig.', function(){
    expect(Object.keys(inputConfig.inputs).length).toBe(1, 'It should start with a single input.');

    var id = inputConfig.addInput();

    expect(Object.keys(inputConfig.inputs).length).toBe(2, 'It should have added a new input.');
    expect(inputConfig.inputs[2].name).toBeNull('It should have a default name.');
    expect(inputConfig.inputs[2].collapsed).toBe(false, 'It should default to being open.');
    expect(inputConfig.inputs[2].solo).toBe(false, 'It should not be soloed by default.');
    expect(Object.keys(inputConfig.inputs[2].outputs).length).toBe(1, 'It should have created a default output.');
    expect(inputConfig.inputs[2].outputs[2].host).toBeNull('The host property on this input/output should exist.');
    expect(inputConfig.inputs[2].id).toBe(id, 'The id of the input created should be returned.');
  });

  it('should be able to add configured inputs.', function(){
    expect(Object.keys(inputConfig.inputs).length).toBe(1, 'By default there should be a single input.');

    inputConfig.addInput({
      id:{input:20},
      name:'foo',
      collapsed: true,
      solo: true,
      midi:{
        note: 'c3',
        type: 'off'
      },
      outputs:{
        1:{
          path:'/path',
          host:'a',
          parameters:[1,'a',false]
        }
      }
    });

    expect(Object.keys(inputConfig.inputs).length).toBe(2, 'A second input should be added.');
    expect(inputConfig.inputs[2].id.input).not.toEqual(20, 'The id should have been reset.');
    expect(inputConfig.inputs[2].name).toBe('foo', 'The input should keep the name specified.');
    expect(inputConfig.inputs[2].collapsed).toBe(true, 'The input should be collapsed.');
    expect(inputConfig.inputs[2].solo).toBe(true, 'The input should be soloed.');
    expect(inputConfig.inputs[2].midi.note).toBe('c3', 'The input note should be configured.');
    expect(inputConfig.inputs[2].midi.type).toBe('off', 'The input note event should be configured.');
    expect(inputConfig.inputs[2].outputs[2].path).toBe('/path', 'The output path should be configured.');
    expect(inputConfig.inputs[2].outputs[2].host).toBe('a', 'The output host should be configured.');
    expect(inputConfig.inputs[2].outputs[2].parameters.length).toBe(3, 'The output parameters should be configured.');
    expect(inputConfig.inputs[2].outputs[2].parameters[2]).toBe(false, 'The last parameter should be configured.');
  });

  it('should be able to re-initialize the list of inputs.', function(){
    var list = [{id:{input:10}, name:'a'},{id:{input:11}, name:'b'},{id:{input:12}, name:'c'}];

    expect(Object.keys(inputConfig.inputs).length).toBe(1, 'By default there should be a single input.');

    inputConfig.init(list);

    expect(Object.keys(inputConfig.inputs).length).toBe(3, 'Initializing the inputs with 3 objects should result in 3 inputs.');
    expect(inputConfig.inputs[1].id.input).not.toBe(10, 'The id of the first input should have been reset.');
    expect(inputConfig.inputs[2].name).toBe('b', 'The name of the second input should have been kept.');
    expect(inputConfig.inputs[3].id.input).not.toBe(12, 'The id of the last input should have been reset.');
    expect(Object.keys(inputConfig.inputs[3].outputs).length).toBe(1, 'The last input should have a default output.');
  });

  it('should be able to create a copy of an existing input.', function(){
    expect(Object.keys(inputConfig.inputs).length).toBe(1, 'The default input should exist');

    inputConfig.inputs[1].name = 'a';
    inputConfig.inputs[1].note = 'c1';

    inputConfig.duplicateInput(inputConfig.inputs[1].id);

    expect(Object.keys(inputConfig.inputs).length).toBe(2, 'There should be a second input after duplicating the first.');
    expect(inputConfig.inputs[1].id.input).not
      .toEqual(inputConfig.inputs[2].id.input, 'The inputs should not have the same id.');
    expect(inputConfig.inputs[1].name).toEqual(inputConfig.inputs[2].name, 'The names should match between inputs.');
    expect(inputConfig.inputs[1].note).toEqual(inputConfig.inputs[2].note, 'The notes should match between inputs.');
  });

  it('should be possible to remove an input.', function(){
    var list = [{name:'a'},{name:'b'},{name:'c'}];
    inputConfig.init(list);

    expect(Object.keys(inputConfig.inputs).length).toBe(3, 'There should be 3 inputs after adding two new ones.');

    inputConfig.removeInput({input:2});

    expect(Object.keys(inputConfig.inputs).length).toBe(2, 'There should be two inputs after removing input b.');
    expect(inputConfig.inputs[1].name).toBe('a', 'The first input should be named a.');
    expect(inputConfig.inputs[3].name).toBe('c', 'The last input should be named c.');
  });

  it('should be possible to remove an output.', function(){
    expect(Object.keys(inputConfig.inputs[1].outputs).length).toBe(1, 'There should be an output by default.');

    inputConfig.removeOutput({input:1,output:1});

    expect(Object.keys(inputConfig.inputs[1].outputs).length).toBe(0, 'There should not be any outputs left.');
  });
});
