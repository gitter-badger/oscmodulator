'use strict';

describe('Directive: midiInput', function (){
  var element, parentScope, isolatedScope, template, defaultConfig, backendMock;

  beforeEach(module('oscmodulatorApp'));
  beforeEach(module('views/midi-input.html'));
  beforeEach(module('views/osc-output.html'));

  beforeEach(function(){

    // Create a DOM fragment to turn into a directive instance.
    template = angular.element(
      '<div data-midi-input data-midi-input-config="input" data-duplicate="duplicateInput" data-remove="removeInput"></div>'
    );

    backendMock = {
      setOSCParameters: function(){},
      setOSCPath: function(){},
      removeOSCOutput: function(){},
      soloInput: function(){},
      muteInput: function(){},
      setMidiInput: function(){},
      removeInput: function(){}
    };

    module(function($provide){
      $provide.value('backend', backendMock);
    });

    // Create a fresh scope for this test.
    defaultConfig = {
      id: {input:1},
      name: null,
      collapsed: false,
      mute: false,
      solo: false,
      midi: {
        note: null,
        type: 'on'
      },
      osc: [{
        id:{input:1, output:1},
        host: null,
        path: null,
        parameters: []
      }]
    };
  });

  it('should be able to set reasonable defaults when provided with an empty config.',
    inject(function($compile, $rootScope){
      parentScope = $rootScope.$new();
      parentScope.input = defaultConfig;

      // Compile the DOM into an Angular view using using our test scope.
      element = $compile(template)(parentScope);
      isolatedScope = element.scope();
      isolatedScope.$apply();

      expect(isolatedScope.config.name).toBe(null, 'The input should have an un-configured name.');
      expect(isolatedScope.config.collapsed).toBe(false, 'The input should start out expanded.');
      expect(isolatedScope.config.solo).toBe(false, 'The input should start out un-soloed.');
      expect(isolatedScope.config.mute).toBe(false, 'The input should start out un-muted.');
      expect(isolatedScope.config.midi.note).toBeNull('The output should start out with no midi note assigned.');
      expect(isolatedScope.config.midi.type).toBe('on', 'The output should default to accepting midi on events.');
      expect(isolatedScope.config.osc.length).toBe(1, 'The output should start with a single output.');
    })
  );

  it('should use the id passed from its parent.', inject(function($compile, $rootScope){
    parentScope = $rootScope.$new();
    parentScope.input = defaultConfig;
    parentScope.input.id = {input:10};

    // Compile the DOM into an Angular view using using our test scope.
    element = $compile(template)(parentScope);
    isolatedScope = element.scope();
    isolatedScope.$apply();

    expect(isolatedScope.config.id).toBeDefined('The input should have an id property.');
    expect(isolatedScope.config.id.input).toBe(10, 'The input should use the id value specified by the parent.');
  }));

  it('should start with a midi note type of ON.', inject(function ($compile, $rootScope){
    parentScope = $rootScope.$new();
    parentScope.input = defaultConfig;
    parentScope.input.midi.type = null;

    spyOn(backendMock, 'removeInput');
    spyOn(backendMock, 'setMidiInput');

    // Compile the DOM into an Angular view using using our test scope.
    element = $compile(template)(parentScope);
    isolatedScope = element.scope();
    isolatedScope.$apply();

    expect(isolatedScope.config.midi.type).toBe('on');    expect(element.find('select.midiNoteType option[selected=selected]').text()).toBe('on');
    expect(backendMock.removeInput).not.toHaveBeenCalled();
    expect(backendMock.setMidiInput).not.toHaveBeenCalled();
  }));

  it('should call the backend service when the midi note type changes.', inject(function($compile, $rootScope){
    parentScope = $rootScope.$new();
    parentScope.input = defaultConfig;
    parentScope.input.midi.type = 'on';
    parentScope.input.midi.note = 'c7';

    // Compile the DOM into an Angular view using using our test scope.
    element = $compile(template)(parentScope);
    isolatedScope = element.scope();
    isolatedScope.$apply();

    expect(isolatedScope.config.midi.type).toBe('on', 'The input should start with a midi note type of on.');

    spyOn(backendMock, 'removeInput');
    spyOn(backendMock, 'setMidiInput');

    isolatedScope.config.midi.type = 'off';
    isolatedScope.$apply();

    expect(backendMock.removeInput).not.toHaveBeenCalled();
    expect(backendMock.setMidiInput).toHaveBeenCalledWith(isolatedScope.config);
  }));

  it('should default to having no name set.', inject(function($compile, $rootScope){
    parentScope = $rootScope.$new();
    parentScope.input = defaultConfig;

    // Compile the DOM into an Angular view using using our test scope.
    element = $compile(template)(parentScope);
    isolatedScope = element.scope();
    isolatedScope.$apply();

    expect(isolatedScope.config.name).toBeNull();
    expect(element.find('input[name=name]').val()).toBe('');
  }));

  it('should be able to configure the name through the scope.', inject(function($compile, $rootScope){
    parentScope = $rootScope.$new();
    parentScope.input = defaultConfig;
    parentScope.input.name = 'James';

    // Compile the DOM into an Angular view using using our test scope.
    element = $compile(template)(parentScope);
    isolatedScope = element.scope();
    isolatedScope.$apply();

    expect(isolatedScope.config.name).toBe('James');
    expect(element.find('input[name=name]').val()).toBe('James');
  }));

  it('should default to having no midi note set.', inject(function($compile, $rootScope){
    parentScope = $rootScope.$new();
    parentScope.input = defaultConfig;

    // Compile the DOM into an Angular view using using our test scope.
    element = $compile(template)(parentScope);
    isolatedScope = element.scope();
    isolatedScope.$apply();

    expect(isolatedScope.config.midi.note).toBeNull();
    expect(element.find('input[name=midiInNote]').val()).toBe('');
  }));

  it('should be able to configure the midi note through the scope.', inject(function($compile, $rootScope){
    parentScope = $rootScope.$new();
    parentScope.input = defaultConfig;
    parentScope.input.midi.note = 'c7';

    spyOn(backendMock, 'removeInput');
    spyOn(backendMock, 'setMidiInput');

    // Compile the DOM into an Angular view using using our test scope.
    element = $compile(template)(parentScope);
    isolatedScope = element.scope();
    isolatedScope.$apply();

    expect(isolatedScope.config.midi.note).toBe('c7');
    expect(element.find('input[name=midiInNote]').val()).toBe('c7');
    expect(backendMock.removeInput).not.toHaveBeenCalled();
    expect(backendMock.setMidiInput).toHaveBeenCalledWith(isolatedScope.config);
  }));

  it('should update the backend when the midi note changes.', inject(function($compile, $rootScope){
    parentScope = $rootScope.$new();
    parentScope.input = defaultConfig;
    parentScope.input.midi.note = 'c7';

    spyOn(backendMock, 'removeInput');
    spyOn(backendMock, 'setMidiInput');

    // Compile the DOM into an Angular view using using our test scope.
    element = $compile(template)(parentScope);
    isolatedScope = element.scope();
    isolatedScope.$apply();

    expect(isolatedScope.config.midi.note).toBe('c7', 'The midi note should be set correctly to start.');
    expect(backendMock.removeInput).not.toHaveBeenCalled();
    expect(backendMock.setMidiInput).toHaveBeenCalledWith(isolatedScope.config);

    isolatedScope.config.midi.note = 'b3';
    isolatedScope.$apply();

    expect(backendMock.setMidiInput).toHaveBeenCalledWith(isolatedScope.config);
  }));

  it('should be possible to configure the solo button through config',
    inject(function($compile, $rootScope){
      parentScope = $rootScope.$new();
      parentScope.input = defaultConfig;
      parentScope.input.solo = true;
      parentScope.input.mute = false;

      spyOn(backendMock, 'soloInput');

      // Compile the DOM into an Angular view using using our test scope.
      element = $compile(template)(parentScope);
      isolatedScope = element.scope();
      isolatedScope.$apply();

      // The solo should be on and the mute off.
      expect(isolatedScope.config.solo).toBe(true);
      expect(isolatedScope.config.mute).toBe(false);
      expect(element.find('button[name=solo]').hasClass('active')).toBe(true);
      expect(element.find('button[name=mute]').hasClass('active')).toBe(false);
      expect(backendMock.soloInput).toHaveBeenCalledWith({input:1}, true);
    })
  );

  it('should be possible to configure the mute button through config',
    inject(function($compile, $rootScope){
      parentScope = $rootScope.$new();
      parentScope.input = defaultConfig;
      parentScope.input.solo = false;
      parentScope.input.mute = true;

      spyOn(backendMock, 'muteInput');

      // Compile the DOM into an Angular view using using our test scope.
      element = $compile(template)(parentScope);
      isolatedScope = element.scope();
      isolatedScope.$apply();

      // The solo should be on and the mute off.
      expect(isolatedScope.config.mute).toBe(true);
      expect(isolatedScope.config.solo).toBe(false);
      expect(element.find('button[name=mute]').hasClass('active')).toBe(true);
      expect(element.find('button[name=solo]').hasClass('active')).toBe(false);
      expect(backendMock.muteInput).toHaveBeenCalledWith({input:1}, true);
    })
  );

  it('should default as neither muted nor soloed',
    inject(function($compile, $rootScope){
      parentScope = $rootScope.$new();
      parentScope.input = defaultConfig;
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
    inject(function($compile, $rootScope){
      parentScope = $rootScope.$new();
      parentScope.input = defaultConfig;
      parentScope.input.solo = true;
      parentScope.input.mute = true;

      spyOn(backendMock, 'soloInput');
      spyOn(backendMock, 'muteInput');

      // Compile the DOM into an Angular view using using our test scope.
      element = $compile(template)(parentScope);
      isolatedScope = element.scope();
      isolatedScope.$apply();

      // The solo should be on and the mute off.
      expect(isolatedScope.config.mute).toBe(false);
      expect(isolatedScope.config.solo).toBe(false);
      expect(element.find('button[name=mute]').hasClass('active')).toBe(false);
      expect(element.find('button[name=solo]').hasClass('active')).toBe(false);
      expect(backendMock.soloInput).toHaveBeenCalledWith({input:1}, false);
      expect(backendMock.muteInput).toHaveBeenCalledWith({input:1}, false);
    })
  );

  it('should disable mute when soloed', inject(function($compile, $rootScope){
    parentScope = $rootScope.$new();
    parentScope.input = defaultConfig;
    parentScope.input.solo = false;
    parentScope.input.mute = true;

    spyOn(backendMock, 'soloInput');
    spyOn(backendMock, 'muteInput');

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
    expect(backendMock.soloInput).toHaveBeenCalledWith({input:1}, true);
    expect(backendMock.muteInput).toHaveBeenCalledWith({input:1}, false);
  }));

  it('should disable solo when muted', inject(function($compile, $rootScope){
    parentScope = $rootScope.$new();
    parentScope.input = defaultConfig;
    parentScope.input.mute = false;
    parentScope.input.solo = true;

    spyOn(backendMock, 'soloInput');
    spyOn(backendMock, 'muteInput');

    // Compile the DOM into an Angular view using using our test scope.
    element = $compile(template)(parentScope);
    isolatedScope = element.scope();
    isolatedScope.$apply();

    // The solo should be on and the mute off.
    expect(isolatedScope.config.solo).toBe(true);
    expect(isolatedScope.config.mute).toBe(false);
    expect(backendMock.soloInput).toHaveBeenCalledWith({input:1}, true);
    expect(backendMock.muteInput).toHaveBeenCalledWith({input:1}, false);

    isolatedScope.config.mute = true;
    isolatedScope.$apply();

    // The mute button should now be turned off and the solo button on.
    expect(isolatedScope.config.solo).toBe(false);
    expect(element.find('button[name=solo]').hasClass('active')).toBe(false);
    expect(element.find('button[name=mute]').hasClass('active')).toBe(true);
    expect(backendMock.soloInput).toHaveBeenCalledWith({input:1}, false);
    expect(backendMock.muteInput).toHaveBeenCalledWith({input:1}, true);
  }));

  it('should start expanded by default.', inject(function($compile, $rootScope){
    parentScope = $rootScope.$new();
    parentScope.input = defaultConfig;
    parentScope.input.collapsed = null;

    // Compile the DOM into an Angular view using using our test scope.
    element = $compile(template)(parentScope);
    isolatedScope = element.scope();
    isolatedScope.$apply();

    expect(isolatedScope.config.collapsed).toBe(false);
    expect(element.find('button.collapseButton i').hasClass('icon-chevron-down')).toBe(true);
  }));

  it('should be possible to collapse through configuration.', inject(function($compile, $rootScope){
    parentScope = $rootScope.$new();
    parentScope.input = defaultConfig;
    parentScope.input.collapsed = true;

    // Compile the DOM into an Angular view using using our test scope.
    element = $compile(template)(parentScope);
    isolatedScope = element.scope();
    isolatedScope.$apply();

    expect(isolatedScope.config.collapsed).toBe(true);
    expect(element.find('button.collapseButton i').hasClass('icon-chevron-right')).toBe(true);
  }));

  it('should be possible to expand/collapse.', inject(function($compile, $rootScope){
    parentScope = $rootScope.$new();
    parentScope.input = defaultConfig;
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

  it('should default to one osc output.', inject(function($compile, $rootScope){
    parentScope = $rootScope.$new();
    parentScope.input = defaultConfig;

    // Compile the DOM into an Angular view using using our test scope.
    element = $compile(template)(parentScope);
    isolatedScope = element.scope();
    isolatedScope.$apply();

    expect(isolatedScope.config.osc.length).toBe(1, 'The input should start with one output.');
    expect(isolatedScope.config.osc[0].id).toBeDefined('The default output should have an id.');
    expect(isolatedScope.config.osc[0].id.input)
      .toEqual(parentScope.input.id.input, 'The output should have the same input id as its parent.');
    expect(isolatedScope.config.osc[0].id.output).toBe(1, 'The output should have its own output id.');
    expect(element.find('div[name=oscOutputItem]').length).toBe(1, 'The DOM should show the default output.');
  }));

  it('should be possible to configure the osc outputs.', inject(function($compile, $rootScope){
    parentScope = $rootScope.$new();
    parentScope.input = defaultConfig;
    parentScope.input.osc = [{},{}];

    // Compile the DOM into an Angular view using using our test scope.
    element = $compile(template)(parentScope);
    isolatedScope = element.scope();
    isolatedScope.$apply();

    expect(isolatedScope.config.osc.length).toBe(2, 'The input should create two outputs.');
    expect(isolatedScope.config.osc[0].id.output).toBe(1, 'The input should create a unique id for each output.');
    expect(element.find('div[name=oscOutputItem]').length).toBe(2, 'The DOM should show both outputs.');
  }));

  it('should be possible to add a new OSC output.', inject(function($compile, $rootScope){
    parentScope = $rootScope.$new();
    parentScope.input = defaultConfig;

    // Compile the DOM into an Angular view using using our test scope.
    element = $compile(template)(parentScope);
    isolatedScope = element.scope();
    isolatedScope.$apply();

    expect(isolatedScope.config.osc.length).toBe(1, 'The input should start with a single output.');

    isolatedScope.addOSCOutput();
    isolatedScope.$apply();

    expect(isolatedScope.config.osc.length).toBe(2, 'The input should create a second output.');
    expect(parentScope.input.osc.length).toBe(2, 'The parent scope should reflect that a second output was added.');
    expect(isolatedScope.config.osc[0].id.output).not
      .toEqual(isolatedScope.config.osc[1].id.output, 'The input should create a unique id for each output.');
    expect(element.find('div[name=oscOutputItem]').length).toBe(2, 'The DOM should show two outputs.');
  }));

  it('should be possible to remove an OSC output.', inject(function($compile, $rootScope){
    parentScope = $rootScope.$new();
    parentScope.input = defaultConfig;
    parentScope.input.osc = [{path:'/a'},{path:'/b'},{path:'/c'}];

    spyOn(backendMock, 'removeOSCOutput');

    // Compile the DOM into an Angular view using using our test scope.
    element = $compile(template)(parentScope);
    isolatedScope = element.scope();
    isolatedScope.$apply();

    expect(isolatedScope.config.osc.length).toBe(3, 'The input should start with 3 outputs.');

    isolatedScope.removeOSCOutput(1);
    isolatedScope.$apply();

    expect(isolatedScope.config.osc.length).toBe(2);
    expect(parentScope.input.osc.length).toBe(2);
    expect(element.find('input[name=oscPath]').first().val()).toBe('/a');
    expect(element.find('input[name=oscPath]').last().val()).toBe('/c');
    expect(backendMock.removeOSCOutput).toHaveBeenCalledWith({input:1, output:2});
  }));

  it('should remove the input from the backend when it becomes invalid.', inject(function($compile, $rootScope){
    var setMidiInputCalls = 0;

    parentScope = $rootScope.$new();
    parentScope.input = defaultConfig;
    parentScope.input.midi.note = 'c3';

    spyOn(backendMock, 'removeInput');
    spyOn(backendMock, 'setMidiInput');

    element = $compile(template)(parentScope);
    isolatedScope = element.scope();
    isolatedScope.$apply();

    expect(backendMock.removeInput).not.toHaveBeenCalled();
    expect(backendMock.setMidiInput).toHaveBeenCalledWith(isolatedScope.config);

    setMidiInputCalls = backendMock.setMidiInput.calls.length;
    isolatedScope.config.midi.note = '';
    isolatedScope.$apply();

    expect(backendMock.setMidiInput.calls.length).toBe(setMidiInputCalls, 'The input should not have been set again.');
    expect(backendMock.removeInput).toHaveBeenCalledWith({input:1});
  }));

  it('should be able to remove itself.', inject(function($compile, $rootScope){
    parentScope = $rootScope.$new();
    parentScope.input = defaultConfig;
    parentScope.removeInput = function(){};

    spyOn(backendMock, 'removeInput');
    spyOn(parentScope, 'removeInput');

    element = $compile(template)(parentScope);
    isolatedScope = element.scope();
    isolatedScope.$apply();

    isolatedScope.removeMe();

    expect(parentScope.removeInput).toHaveBeenCalledWith({input:1});
    expect(backendMock.removeInput).toHaveBeenCalledWith({input:1});
  }));

  it('should be able to duplicate itself.', inject(function($compile, $rootScope){
    parentScope = $rootScope.$new();
    parentScope.input = defaultConfig;
    parentScope.duplicateInput = function(){};

    spyOn(parentScope, 'duplicateInput');

    element = $compile(template)(parentScope);
    isolatedScope = element.scope();
    isolatedScope.$apply();

    isolatedScope.duplicateMe();

    expect(parentScope.duplicateInput).toHaveBeenCalledWith({input:1});
  }));
});
