'use strict';

describe('Directive: midiInput', function (){
  var element, parentScope, isolatedScope, template;

  beforeEach(module('oscmodulatorApp'));
  beforeEach(module('views/midi-input.html'));
  beforeEach(module('views/osc-output.html'));

  beforeEach(inject(function ($rootScope){

    // Create a DOM fragment to turn into a directive instance.
    template = angular.element(
      '<div data-midi-input id="{{input.id}}" data-midi-input-config="input" data-osc-hosts="hostIds"></div>'
    );

    // Create a fresh scope for this test.
    parentScope = $rootScope.$new();
    parentScope.input = {
      id: 'midi-input-1',
      name: null,
      collapsed: false,
      mute: false,
      solo: false,
      midi: {
        note: null,
        type: 'on'
      },
      osc: [{
        host: null,
        path: null,
        parameters: []
      }]
    };
    parentScope.hostIds = [];
  }));

  it('should be able to set reasonable defaults when provided with an empty config.', inject(function($compile){
    parentScope.input = {id:'midi-input-1'};

    // Compile the DOM into an Angular view using using our test scope.
    element = $compile(template)(parentScope);
    isolatedScope = element.scope();
    isolatedScope.$apply();

    expect(isolatedScope.config.name).toBe(null);
    expect(isolatedScope.config.collapsed).toBe(false);
    expect(isolatedScope.config.solo).toBe(false);
    expect(isolatedScope.config.mute).toBe(false);
    expect(isolatedScope.config.midi.note).toBeNull();
    expect(isolatedScope.config.midi.type).toBe('on');
    expect(isolatedScope.config.osc.length).toBe(1);
  }));

  it('should start with a midi note type of ON.', inject(function ($compile){
    parentScope.input.midi.type = null;

    // Compile the DOM into an Angular view using using our test scope.
    element = $compile(template)(parentScope);
    isolatedScope = element.scope();
    isolatedScope.$apply();

    expect(isolatedScope.config.midi.type).toBe('on');
    expect(element.find('select.midiNoteType option[selected=selected]').text()).toBe('on');
  }));

  it('should default to having no name set.', inject(function($compile){
    // Compile the DOM into an Angular view using using our test scope.
    element = $compile(template)(parentScope);
    isolatedScope = element.scope();
    isolatedScope.$apply();

    expect(isolatedScope.config.name).toBeNull();
    expect(element.find('input[name=name]').val()).toBe('');
  }));

  it('should be able to configure the name through the scope.', inject(function($compile){
    parentScope.input.name = 'James';

    // Compile the DOM into an Angular view using using our test scope.
    element = $compile(template)(parentScope);
    isolatedScope = element.scope();
    isolatedScope.$apply();

    expect(isolatedScope.config.name).toBe('James');
    expect(element.find('input[name=name]').val()).toBe('James');
  }));

  it('should default to having no midi note set.', inject(function($compile){
    // Compile the DOM into an Angular view using using our test scope.
    element = $compile(template)(parentScope);
    isolatedScope = element.scope();
    isolatedScope.$apply();

    expect(isolatedScope.config.midi.note).toBeNull();
    expect(element.find('input[name=midiInNote]').val()).toBe('');
  }));

  it('should be able to configure the midi note through the scope.', inject(function($compile){
    parentScope.input.midi.note = 'c7';

    // Compile the DOM into an Angular view using using our test scope.
    element = $compile(template)(parentScope);
    isolatedScope = element.scope();
    isolatedScope.$apply();

    expect(isolatedScope.config.midi.note).toBe('c7');
    expect(element.find('input[name=midiInNote]').val()).toBe('c7');
  }));

  it('should be possible to configure the solo button through config',
    inject(function($compile){
      parentScope.input.solo = true;
      parentScope.input.mute = false;

      // Compile the DOM into an Angular view using using our test scope.
      element = $compile(template)(parentScope);
      isolatedScope = element.scope();
      isolatedScope.$apply();

      // The solo should be on and the mute off.
      expect(isolatedScope.config.solo).toBe(true);
      expect(isolatedScope.config.mute).toBe(false);
      expect(element.find('button[name=solo]').hasClass('active')).toBe(true);
      expect(element.find('button[name=mute]').hasClass('active')).toBe(false);
    })
  );

  it('should be possible to configure the mute button through config',
    inject(function($compile){
      parentScope.input.solo = false;
      parentScope.input.mute = true;

      // Compile the DOM into an Angular view using using our test scope.
      element = $compile(template)(parentScope);
      isolatedScope = element.scope();
      isolatedScope.$apply();

      // The solo should be on and the mute off.
      expect(isolatedScope.config.mute).toBe(true);
      expect(isolatedScope.config.solo).toBe(false);
      expect(element.find('button[name=mute]').hasClass('active')).toBe(true);
      expect(element.find('button[name=solo]').hasClass('active')).toBe(false);
    })
  );

  it('should default as neither muted nor soloed',
    inject(function($compile){
      parentScope.input.solo = null;
      parentScope.input.mute = null;

      // Compile the DOM into an Angular view using using our test scope.
      element = $compile(template)(parentScope);
      isolatedScope = element.scope();
      isolatedScope.$apply();

      expect(isolatedScope.config.mute).toBe(false);
      expect(isolatedScope.config.solo).toBe(false);
      expect(element.find('button[name=mute]').hasClass('active')).toBe(false);
      expect(element.find('button[name=solo]').hasClass('active')).toBe(false);
    })
  );

  it('should fix situations where the config is both soloed and muted',
    inject(function($compile){
      parentScope.input.solo = true;
      parentScope.input.mute = true;

      // Compile the DOM into an Angular view using using our test scope.
      element = $compile(template)(parentScope);
      isolatedScope = element.scope();
      isolatedScope.$apply();

      // The solo should be on and the mute off.
      expect(isolatedScope.config.mute).toBe(false);
      expect(isolatedScope.config.solo).toBe(false);
      expect(element.find('button[name=mute]').hasClass('active')).toBe(false);
      expect(element.find('button[name=solo]').hasClass('active')).toBe(false);
    })
  );

  it('should disable mute when soloed', inject(function($compile){
    parentScope.input.solo = false;
    parentScope.input.mute = true;

    // Compile the DOM into an Angular view using using our test scope.
    element = $compile(template)(parentScope);
    isolatedScope = element.scope();
    isolatedScope.$apply();

    // The solo should be on and the mute off.
    expect(isolatedScope.config.mute).toBe(true);
    expect(isolatedScope.config.solo).toBe(false);

    isolatedScope.config.solo = true;
    isolatedScope.$apply();

    // The mute button should now be turned off and the solo button on.
    expect(isolatedScope.config.mute).toBe(false);
    expect(element.find('button[name=mute]').hasClass('active')).toBe(false);
    expect(element.find('button[name=solo]').hasClass('active')).toBe(true);
  }));

  it('should disable solo when muted', inject(function($compile){
    parentScope.input.mute = false;
    parentScope.input.solo = true;

    // Compile the DOM into an Angular view using using our test scope.
    element = $compile(template)(parentScope);
    isolatedScope = element.scope();
    isolatedScope.$apply();

    // The solo should be on and the mute off.
    expect(isolatedScope.config.solo).toBe(true);
    expect(isolatedScope.config.mute).toBe(false);

    isolatedScope.config.mute = true;
    isolatedScope.$apply();

    // The mute button should now be turned off and the solo button on.
    expect(isolatedScope.config.solo).toBe(false);
    expect(element.find('button[name=solo]').hasClass('active')).toBe(false);
    expect(element.find('button[name=mute]').hasClass('active')).toBe(true);
  }));

  it('should start expanded by default.', inject(function($compile){
    parentScope.input.collapsed = null;

    // Compile the DOM into an Angular view using using our test scope.
    element = $compile(template)(parentScope);
    isolatedScope = element.scope();
    isolatedScope.$apply();

    expect(isolatedScope.config.collapsed).toBe(false);
    expect(element.find('button.collapseButton i').hasClass('icon-chevron-down')).toBe(true);
  }));

  it('should be possible to collapse through configuration.', inject(function($compile){
    parentScope.input.collapsed = true;

    // Compile the DOM into an Angular view using using our test scope.
    element = $compile(template)(parentScope);
    isolatedScope = element.scope();
    isolatedScope.$apply();

    expect(isolatedScope.config.collapsed).toBe(true);
    expect(element.find('button.collapseButton i').hasClass('icon-chevron-right')).toBe(true);
  }));

  it('should be possible to expand/collapse.', inject(function($compile){
    parentScope.input.collapsed = null;

    // Compile the DOM into an Angular view using using our test scope.
    element = $compile(template)(parentScope);
    isolatedScope = element.scope();
    isolatedScope.$apply();

    // Expect it to start out expanded.
    expect(isolatedScope.config.collapsed).toBe(false);
    expect(element.find('button.collapseButton i').hasClass('icon-chevron-down')).toBe(true);

    isolatedScope.toggleCollapsed();
    isolatedScope.$apply();

    // Expect it to collapse.
    expect(isolatedScope.config.collapsed).toBe(true);
    expect(element.find('button.collapseButton i').hasClass('icon-chevron-right')).toBe(true);

    isolatedScope.toggleCollapsed();
    isolatedScope.$apply();

    // Expect it to expand again.
    expect(isolatedScope.config.collapsed).toBe(false);
    expect(element.find('button.collapseButton i').hasClass('icon-chevron-down')).toBe(true);
  }));

  it('should default to one osc output.', inject(function($compile){
    // Compile the DOM into an Angular view using using our test scope.
    element = $compile(template)(parentScope);
    isolatedScope = element.scope();
    isolatedScope.$apply();

    expect(isolatedScope.config.osc.length).toBe(1);
    expect(element.find('div[name=oscOutputItem]').length).toBe(1);
  }));

  it('should be possible to configure the osc outputs.', inject(function($compile){
    parentScope.input.osc = [{},{}];

    // Compile the DOM into an Angular view using using our test scope.
    element = $compile(template)(parentScope);
    isolatedScope = element.scope();
    isolatedScope.$apply();

    expect(isolatedScope.config.osc.length).toBe(2);
    expect(element.find('div[name=oscOutputItem]').length).toBe(2);
  }));

  it('should be possible to add a new OSC output.', inject(function($compile){
    // Compile the DOM into an Angular view using using our test scope.
    element = $compile(template)(parentScope);
    isolatedScope = element.scope();
    isolatedScope.$apply();

    expect(isolatedScope.config.osc.length).toBe(1);

    isolatedScope.addOSCOutput();
    isolatedScope.$apply();

    expect(isolatedScope.config.osc.length).toBe(2);
    expect(parentScope.input.osc.length).toBe(2);
    expect(element.find('div[name=oscOutputItem]').length).toBe(2);
  }));

  it('should be possible to remove an OSC output.', inject(function($compile){
    parentScope.input.osc = [{path:'/a'},{path:'/b'},{path:'/c'}];

    // Compile the DOM into an Angular view using using our test scope.
    element = $compile(template)(parentScope);
    isolatedScope = element.scope();
    isolatedScope.$apply();

    expect(isolatedScope.config.osc.length).toBe(3);

    isolatedScope.removeOSCOutput(1);
    isolatedScope.$apply();

    expect(isolatedScope.config.osc.length).toBe(2);
    expect(parentScope.input.osc.length).toBe(2);
    expect(element.find('input[name=oscPath]').first().val()).toBe('/a');
    expect(element.find('input[name=oscPath]').last().val()).toBe('/c');
  }));
});
