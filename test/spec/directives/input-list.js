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
    parentScope.items = [
      {
        name:'a',
        collapsed:true,
        mute:true,
        solo:false,
        midi:{
          note:'b#3',
          type:'off'
        },
        osc:[{}]
      },
      {name:'b'},
      {name:'c'}
    ];

    // Compile the DOM into an Angular view using using our test scope.
    element = $compile(template)(parentScope);
    isolatedScope = element.scope();
    isolatedScope.$apply();

    expect(isolatedScope.inputs.length).toBe(3);
    expect(element.find('div[name=midiInputItem]').first().find('input[name=name]').val()).toBe('a');
    expect(element.find('div[name=midiInputItem]').first().find('input[name=midiInNote]').val()).toBe('b#3');
    expect(element.find('div[name=midiInputItem]').first().find('select[name=midiNoteType] option[selected=selected]').text()).toBe('off');
    expect(element.find('div[name=midiInputItem]').first().find('button[name=mute]').hasClass('active')).toBe(true);
    expect(element.find('div[name=midiInputItem]').first().find('input[name=solo]').hasClass('active')).toBe(false);
    expect(element.find('div[name=midiInputItem]').last().find('input[name=name]').val()).toBe('c');
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
    expect(element.find('div[name=midiInputItem]').length).toBe(2);
  }));

  it('should be able to create a copy of an existing input.', inject(function ($compile){
    // Compile the DOM into an Angular view using using our test scope.
    element = $compile(template)(parentScope);
    isolatedScope = element.scope();
    isolatedScope.$apply();

    expect(isolatedScope.inputs.length).toBe(1);

    isolatedScope.duplicateMidiInput(0);
    isolatedScope.$apply();

    expect(isolatedScope.inputs.length).toBe(2);
    expect(element.find('div[name=midiInputItem]').first().find('input[name=name]').val()).toBe('Button 1');
    expect(element.find('div[name=midiInputItem]').first().find('input[name=midiInNote]').val()).toBe('c1');
    expect(element.find('div[name=midiInputItem]').last().find('input[name=name]').val()).toBe('Button 1');
    expect(element.find('div[name=midiInputItem]').last().find('input[name=midiInNote]').val()).toBe('c1');
  }));

  it('should be possible to remove a midi input.', inject(function ($compile){
    parentScope.items = [{name:'a'},{name:'b'},{name:'c'}];

    // Compile the DOM into an Angular view using using our test scope.
    element = $compile(template)(parentScope);
    isolatedScope = element.scope();
    isolatedScope.$apply();

    expect(isolatedScope.inputs.length).toBe(3);

    isolatedScope.removeMidiInput(1);
    isolatedScope.$apply();

    expect(isolatedScope.inputs.length).toBe(2);
    expect(element.find('div[name=midiInputItem]').first().find('input[name=name]').val()).toBe('a');
    expect(element.find('div[name=midiInputItem]').last().find('input[name=name]').val()).toBe('c');
  }));
});
