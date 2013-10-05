describe('Directive: inputList', function () {
  'use strict';
  var element, template, parentScope, isolatedScope;

  beforeEach(module('oscmodulatorApp'));
  beforeEach(module('views/input-list.html'));
  beforeEach(module('views/midi-input.html'));
  beforeEach(module('views/osc-output.html'));

  beforeEach(inject(function ($rootScope) {
    template = angular.element('<div data-input-list data-inputs="items"></div>');

    parentScope = $rootScope.$new();

    parentScope.items = [
      {
        id: 'midi-input-1',
        name: 'Button 1',
        collapsed: false,
        mute: false,
        solo: false,
        midi: {
          note: 'c1',
          type: 'on'
        },
        osc: [{
          host: 'Live',
          path: '/osc/server/path',
          parameters: [
            {value:10},
            {value:'foo'}
          ]
        }]
      }
    ];
  }));

  it('should be possible to configure the input list.', inject(function ($compile){
    parentScope.items = [{},{},{}];

    // Compile the DOM into an Angular view using using our test scope.
    element = $compile(template)(parentScope);
    isolatedScope = element.scope();
    isolatedScope.$apply();

    expect(isolatedScope.inputs.length).toBe(3);
  }));

  it('should start with one midi input if none are specified.', inject(function($compile){
    parentScope.items = [];

    // Compile the DOM into an Angular view using using our test scope.
    element = $compile(template)(parentScope);
    isolatedScope = element.scope();
    isolatedScope.$apply();

    expect(isolatedScope.inputs.length).toBe(1);
    expect(element.find('div[name=midiInputItem]').length).toBe(1);
  }));

  it('should be able to add new midi inputs to the list of inputs.', inject(function ($compile){
    // Compile the DOM into an Angular view using using our test scope.
    element = $compile(template)(parentScope);
    isolatedScope = element.scope();
    isolatedScope.$apply();

    expect(isolatedScope.inputs.length).toBe(1);

    isolatedScope.addMidiInput();
    isolatedScope.$apply();

    expect(isolatedScope.inputs.length).toBe(2);
    expect(isolatedScope.inputs[0].id).toBe('midi-input-1');
    expect(isolatedScope.inputs[1].id).toBe('midi-input-2');
    expect(element.find('div[name=midiInputItem]').length).toBe(2);
  }));

  it('should be able to create a copy of an existing input.', inject(function ($compile){
    // Compile the DOM into an Angular view using using our test scope.
    element = $compile(template)(parentScope);
    isolatedScope = element.scope();
    isolatedScope.$apply();

    expect(isolatedScope.inputs.length).toBe(1);

    isolatedScope.duplicateMidiInput('midi-input-1');
    isolatedScope.$apply();

    expect(isolatedScope.inputs.length).toBe(2);
    expect(element.find('div[name=midiInputItem]').last().attr('id')).toBe('midi-input-2');
    expect(element.find('div[id=midi-input-2] input[name=name]').val()).toBe('Button 1');
    expect(element.find('div[id=midi-input-2] input[name=midiInNote]').val()).toBe('c1');
  }));

  it('should be possible to remove a midi input.', inject(function ($compile){
    parentScope.items = [{},{},{}];

    // Compile the DOM into an Angular view using using our test scope.
    element = $compile(template)(parentScope);
    isolatedScope = element.scope();
    isolatedScope.$apply();

    expect(isolatedScope.inputs.length).toBe(3);

    isolatedScope.removeMidiInput('midi-input-2');
    isolatedScope.$apply();

    expect(isolatedScope.inputs.length).toBe(2);
    expect(element.find('div[name=midiInputItem]').first().attr('id')).toBe('midi-input-1');
    expect(element.find('div[name=midiInputItem]').last().attr('id')).toBe('midi-input-3');
  }));
});
