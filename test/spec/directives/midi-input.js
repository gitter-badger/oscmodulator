'use strict';

describe('Directive: midiInput', function (){
  var element, parentScope, template;

  beforeEach(module('oscmodulatorApp'));
  beforeEach(module('views/midi-input.html'));

  beforeEach(inject(function ($rootScope){

    // Create a DOM fragment to turn into a directive instance.
    template = angular.element(
      '<div data-midi-input id="{{input.id}}" data-midi-input-config="input" data-osc-hosts="hostIds">' +
        '</div>'
    );

    // Create a fresh scope for this test.
    parentScope = $rootScope.$new();
    parentScope.input = {
      id: 'midi-input-1',
      name: null,
      type: 'midi-to-osc',
      collapsed: false,
      mute: false,
      solo: false,
      midi: {
        note: null,
        type: 'on'
      },
      osc: {
        host: null,
        path: null,
        parameters: []
      }
    };
    parentScope.hostIds = [];
  }));

  it('Should have an unconfigured select object for setting the OSC Hosts.',
    inject(function ($compile){
      var selectElement;

      // Compile the DOM into an Angular view using using our test scope.
      element = $compile(template)(parentScope);

      // Kick off the digest cycle on our directive's isolated scope.
      element.scope().$apply();

      selectElement = element.find('select.oscHost');

      // There should be a select object.
      expect(selectElement.length).toEqual(1);
      // With one option.
      expect(selectElement.find('option').length).toEqual(1);
      // That is unconfigured.
      expect(selectElement.find('option').attr('value')).toBe('');
    })
  );

  it('Should be configurable through the hosts property on its scope but should not set a default.',
    inject(function ($compile){
      // Configure the scope.
      parentScope.hostIds = ['host 1', 'host 2', 'host 3'];

      // Compile the DOM into an Angular view using using our test scope.
      element = $compile(template)(parentScope);

      // Kick off the digest cycle on our directive's isolated scope.
      element.scope().$apply();

      // Should have the 3 options set in the scope and an empty option.
      expect(element.find('select.oscHost option').length).toEqual(4);
      // Where the first element is unconfigured.
      expect(element.find('select.oscHost option').first().attr('value')).toBe('');
    })
  );

  it('should be possible to set the default host through config.',
    inject(function ($compile) {
      // Configure the scope.
      parentScope.hostIds = ['host 1', 'host 2', 'host 3'];
      // Configure the default host.
      parentScope.input.osc.host = 'host 2';

      // Compile the DOM into an Angular view using using our test scope.
      element = $compile(template)(parentScope);

      // Kick off the digest cycle on our directive's isolated scope.
      element.scope().$apply();

      // Should only have the 3 options specified in the scope.
      expect(element.find('select.oscHost option').length).toEqual(3);
    })
  );

  it('should start with a midi note type of ON.', inject(function ($compile){
    parentScope.input.midi.type = null;

    // Compile the DOM into an Angular view using using our test scope.
    element = $compile(template)(parentScope);

    // Kick off the digest cycle on our directive's isolated scope.
    element.scope().$apply();

    expect(element.find('select.midiNoteType option[selected=selected]').text()).toBe('on');
  }));

  it('should default to having no name set.', inject(function($compile){
    // Compile the DOM into an Angular view using using our test scope.
    element = $compile(template)(parentScope);
    element.scope().$apply();

    expect(element.find('input[name=name]').val()).toBe('');
  }));

  it('should be able to configure the name through the scope.', inject(function($compile){
    parentScope.input.name = 'James';

    // Compile the DOM into an Angular view using using our test scope.
    element = $compile(template)(parentScope);
    element.scope().$apply();

    expect(element.find('input[name=name]').val()).toBe('James');
  }));

  it('should default to having no midi note set.', inject(function($compile){
    // Compile the DOM into an Angular view using using our test scope.
    element = $compile(template)(parentScope);
    element.scope().$apply();

    expect(element.find('input[name=midiInNote]').val()).toBe('');
  }));

  it('should be able to configure the midi note through the scope.', inject(function($compile){
    parentScope.input.midi.note = 'c7';

    // Compile the DOM into an Angular view using using our test scope.
    element = $compile(template)(parentScope);
    element.scope().$apply();

    expect(element.find('input[name=midiInNote]').val()).toBe('c7');
  }));

  it('should default to having no osc path set.', inject(function($compile){
    // Compile the DOM into an Angular view using using our test scope.
    element = $compile(template)(parentScope);
    element.scope().$apply();

    expect(element.find('input[name=oscPath]').val()).toBe('');
  }));

  it('should be able to configure the osc path through the scope.', inject(function($compile){
    parentScope.input.osc.path = '/path/to/object';

    // Compile the DOM into an Angular view using using our test scope.
    element = $compile(template)(parentScope);
    element.scope().$apply();

    expect(element.find('input[name=oscPath]').val()).toBe('/path/to/object');
  }));

  it('should default to having no osc parameters set.', inject(function($compile){
    // Compile the DOM into an Angular view using using our test scope.
    element = $compile(template)(parentScope);
    element.scope().$apply();

    expect(element.find('div[name=oscParam]').length).toEqual(0);
  }));

  it('should be able to configure the osc path through the scope.', inject(function($compile){
    parentScope.input.osc.parameters = [1,'foo',3];

    // Compile the DOM into an Angular view using using our test scope.
    element = $compile(template)(parentScope);
    element.scope().$apply();

    expect(element.find('div[name=oscParam]').length).toEqual(3);
  }));

  it('should allow adding new parameters.', inject(function($compile){
    var isolatedScope;

    // Compile the DOM into an Angular view using using our test scope.
    element = $compile(template)(parentScope);
    isolatedScope = element.scope();
    isolatedScope.$apply();

    // Expect to start with no parameters.
    expect(isolatedScope.config.osc.parameters.length).toEqual(0);
    expect(element.find('div[name=oscParam]').length).toEqual(0);

    isolatedScope.addOSCParameter();

    // End then have one parameter.
    expect(isolatedScope.config.osc.parameters.length).toEqual(1);

    isolatedScope.$apply();

    // Expect to find one param in the DOM with an empty input.
    expect(element.find('div[name=oscParam]').length).toEqual(1);
    expect(element.find('div[name=oscParam] input').val()).toBe('');

    // And expect the parent scope to be updated.
    expect(parentScope.input.osc.parameters.length).toEqual(1);
  }));

  it('should allow removing existing parameters.', inject(function($compile){
    var isolatedScope;

    // Make sure there are some parameters to remove.
    parentScope.input.osc.parameters = [{value:'a'},{value:'b'}];

    // Compile the DOM into an Angular view using using our test scope.
    element = $compile(template)(parentScope);
    isolatedScope = element.scope();
    isolatedScope.$apply();

    // There should be two parameters per our config.
    expect(isolatedScope.config.osc.parameters.length).toEqual(2);
    expect(element.find('div[name=oscParam]').length).toEqual(2);

    // Remove parameter b.
    isolatedScope.removeOSCParameter(1);

    // Expect the isolated scope and the parent scope to have removed parameter b.
    expect(isolatedScope.config.osc.parameters.length).toEqual(1);
    expect(isolatedScope.config.osc.parameters[0].value).toBe('a');
    expect(parentScope.input.osc.parameters.length).toEqual(1);
    expect(parentScope.input.osc.parameters[0].value).toBe('a');

    isolatedScope.$apply();

    // Expect to be able to find only parameter a in the DOM.
    expect(element.find('div[name=oscParam]').length).toEqual(1);
    expect(element.find('div[name=oscParam] input').val()).toBe('a');
  }));
});
