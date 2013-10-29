describe('Service: inputConfig', function () {
  'use strict';

  // load the service's module
  beforeEach(module('oscmodulatorApp'));

  // instantiate service
  var inputConfig;
  beforeEach(inject(function (_inputConfig_) {
    inputConfig = _inputConfig_;
  }));

  it('should default to one input.', function(){
    expect(inputConfig.inputs.length).toBe(1, 'By default there should be a single input.');
    expect(inputConfig.inputs[0].id).not.toBeNull('The default input should have an id.');
    expect(inputConfig.inputs[0].id.input).toBe(1, 'The default input id should be the number of inputs created.');
  });

  it('should be able to add un-configured inputs.', function(){
    expect(inputConfig.inputs.length).toBe(1, 'The default input should exist.');

    inputConfig.addInput();

    expect(inputConfig.inputs.length).toBe(2, 'A second input should be added.');
    expect(inputConfig.inputs[1].id).not.toBeNull('The second input should have a valid id.');
    expect(inputConfig.inputs[0].id.input).not
      .toEqual(inputConfig.inputs[1].id.input, 'The ids should be distinct between inputs.');
  });

  it('should be able to add configured inputs.', function(){
    expect(inputConfig.inputs.length).toBe(1, 'By default there should be a single input.');

    inputConfig.addInput({id:{input:20}, name:'foo'});

    expect(inputConfig.inputs.length).toBe(2, 'A second input should be added.');
    expect(inputConfig.inputs[1].id.input).not.toEqual(20, 'The id should have been reset.');
    expect(inputConfig.inputs[1].name).toBe('foo', 'The input should keep the name specified.');
  });

  it('should be able to re-initialize the list of inputs.', function(){
    var list = [{id:{input:10}, name:'a'},{id:{input:11}, name:'b'},{id:{input:12}, name:'c'}];

    expect(inputConfig.inputs.length).toBe(1, 'By default there should be a single input.');

    inputConfig.init(list);

    expect(inputConfig.inputs.length).toBe(3, 'Initializing the inputs with 3 objects should result in 3 inputs.');
    expect(inputConfig.inputs[0].id.input).not.toBe(10, 'The id of the first input should have been reset.');
    expect(inputConfig.inputs[1].name).toBe('b', 'The name of the second input should have been kept.');
    expect(inputConfig.inputs[2].id.input).not.toBe(12, 'The id of the last input should have been reset.');
  });

  it('should be able to create a copy of an existing input.', function(){
    expect(inputConfig.inputs.length).toBe(1, 'The default input should exist');

    inputConfig.inputs[0].name = 'a';
    inputConfig.inputs[0].note = 'c1';

    inputConfig.duplicateInput(0);

    expect(inputConfig.inputs.length).toBe(2, 'There should be a second input after duplicating the first.');
    expect(inputConfig.inputs[0].id.input).not
      .toEqual(inputConfig.inputs[1].id.input, 'The inputs should not have the same id.');
    expect(inputConfig.inputs[0].name).toEqual(inputConfig.inputs[1].name, 'The names should match between inputs.');
    expect(inputConfig.inputs[0].note).toEqual(inputConfig.inputs[1].note, 'The notes should match between inputs.');
  });

  it('should be possible to remove an input.', function(){
    expect(inputConfig.inputs.length).toBe(1, 'The default input should exist');

    inputConfig.inputs[0].name = 'a';
    inputConfig.addInput();
    inputConfig.inputs[1].name = 'b';
    inputConfig.addInput();
    inputConfig.inputs[2].name = 'c';

    expect(inputConfig.inputs.length).toBe(3, 'There should be 3 inputs after adding two new ones.');

    inputConfig.removeInput(1);

    expect(inputConfig.inputs.length).toBe(2, 'There should be two inputs after removing input b.');
    expect(inputConfig.inputs[0].name).toBe('a', 'The first input should be named a.');
    expect(inputConfig.inputs[1].name).toBe('c', 'The last input should be named c.');
  });
});
