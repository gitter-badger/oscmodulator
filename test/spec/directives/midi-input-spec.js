'use strict';

describe('Directive: midiInput', function (){
  var element, parentScope, isolatedScope, template, defaultConfig, messageMiddlewareMock,
    setupEventListeners, inputConfigMock, midiPortConfigMock;

  beforeEach(module('oscmodulatorApp'));
  beforeEach(module('views/midi-input.html'));
  beforeEach(module('views/osc-output.html'));

  beforeEach(function(){
    var portA = {
      name:'a',
      id: '/a',
      index: 0,
      enabled: true
    }, portB = {
      name:'b',
      id:'/b',
      index:1,
      enabled:false
    }, portAll = {
      name:'All',
      id:'/:',
      index:null,
      enabled:true
    };

    // Create a DOM fragment to turn into a directive instance.
    template = angular.element(
      '<div data-midi-input data-midi-input-config="input"></div>'
    );

    midiPortConfigMock = {
      ports: [portA,portB],
      enabledPorts: [portAll,portA],
      defaultMidiPort: portAll
    };

    messageMiddlewareMock = {
      availableMidiPorts: {
        inputs:[],
        outputs:[]
      },
      setOSCParameters: function(){},
      setOSCPath: function(){},
      removeOSCOutput: function(){},
      soloInput: function(){},
      muteInput: function(){},
      setMidiInput: function(){},
      removeInput: function(){}
    };

    inputConfigMock = {
      defaultMidiPort: portAll
    };

    module(function($provide){
      $provide.value('messageMiddleware', messageMiddlewareMock);
      $provide.value('inputConfig', inputConfigMock);
      $provide.value('midiPortConfig', midiPortConfigMock);
    });

    // Create a fresh scope for this test.
    defaultConfig = {
      id: {input:1},
      name: null,
      collapsed: false,
      mute: false,
      solo: false,
      midi: {
        name: null,
        note: null,
        type: 'note',
        port: {
          name:'All',
          id:'/:',
          index: null,
          enabled: true
        },
        channel: 'All'
      },
      osc: [{
        id:{input:1, output:1},
        host: null,
        path: null,
        parameters: []
      }]
    };
  });

  // Replicate the event listening that will happen in the app.
  setupEventListeners = function(parentScope){
    parentScope.add = function(){};
    parentScope.delete = function(){};
    parentScope.update = function(){};
    parentScope.remove = function(){};
    parentScope.duplicate = function(){};
    parentScope.create = function(){};
    parentScope.$on('input:midi:add',function(event, id){
      parentScope.add(id);
    });
    parentScope.$on('input:midi:delete',function(event, id){
      parentScope.delete(id);
    });
    parentScope.$on('input:midi:update', function(event, id){
      parentScope.update(id);
    });
    parentScope.$on('input:midi:disable', function(event, id){
      parentScope.remove(id);
    });
    parentScope.$on('input:midi:duplicate', function(event, id){
      parentScope.duplicate(id);
    });
    parentScope.$on('output:osc:create', function(event){
      parentScope.create();
    });
  };

  it('should have a map of midi note names to numbers.', inject(function($compile, $rootScope){
    parentScope = $rootScope.$new();
    parentScope.input = defaultConfig;
    parentScope.input.id = {input:10};

    // Compile the DOM into an Angular view using using our test scope.
    element = $compile(template)(parentScope);
    isolatedScope = element.scope();
    isolatedScope.$apply();

    expect(isolatedScope.midiNoteMap.c0).toBe(0);
    expect(isolatedScope.midiNoteMap['c#0']).toBe(1);
    expect(isolatedScope.midiNoteMap.d0).toBe(2);
    expect(isolatedScope.midiNoteMap['f#4']).toBe(54);
    expect(isolatedScope.midiNoteMap.g10).toBe(127);
    expect(isolatedScope.midiNoteMap['g#10']).not.toBeDefined();
  }));

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

  it('should default to the All midi port.', inject(function($rootScope, $compile){
    parentScope = $rootScope.$new();
    parentScope.input = defaultConfig;
    parentScope.input.id = {input:10};

    // Compile the DOM into an Angular view using using our test scope.
    element = $compile(template)(parentScope);
    isolatedScope = element.scope();
    isolatedScope.$apply();

    expect(isolatedScope.config.midi.port)
      .toBe(inputConfigMock.defaultMidiPort, 'The input needs to reference the default midi port on the inputConfig.');
  }));

  it('should send an update event when the midi note type changes.', inject(function($compile, $rootScope){
    parentScope = $rootScope.$new();
    parentScope.input = defaultConfig;
    parentScope.input.midi.name = 'c7';

    setupEventListeners(parentScope);

    spyOn(parentScope, 'add');
    spyOn(parentScope, 'update');

    // Compile the DOM into an Angular view using using our test scope.
    element = $compile(template)(parentScope);
    isolatedScope = element.scope();
    isolatedScope.$apply();

    expect(isolatedScope.config.midi.type)
      .toBe('note', 'The input should start with a midi note type of on.');
    expect(parentScope.add).toHaveBeenCalledWith({input:1});
    expect(parentScope.update).not.toHaveBeenCalled();

    isolatedScope.config.midi.type = 'cc';
    isolatedScope.$apply();

    expect(parentScope.add.calls.length).toBe(1, 'The input should only have been added once.');
    expect(parentScope.update).toHaveBeenCalledWith({input:1});
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

    expect(isolatedScope.config.midi.name).toBeNull();
    expect(isolatedScope.config.midi.note).toBeNull();
    expect(element.find('input[name=midiInNote]').val()).toBe('');
  }));

  it('should be able to configure the midi note through the scope.', inject(function($compile, $rootScope){
    parentScope = $rootScope.$new();
    parentScope.input = defaultConfig;
    parentScope.input.midi.name = 'c0';

    // Compile the DOM into an Angular view using using our test scope.
    element = $compile(template)(parentScope);
    isolatedScope = element.scope();
    isolatedScope.$apply();

    expect(isolatedScope.config.midi.name).toBe('c0');
    expect(isolatedScope.config.midi.note).toBe(0);
    expect(element.find('input[name=midiInNote]').val()).toBe('c0');
  }));

  it('should handle invalid midi note names.', inject(function($compile, $rootScope){
    parentScope = $rootScope.$new();
    parentScope.input = defaultConfig;
    parentScope.input.midi.name = 'c50';

    // Compile the DOM into an Angular view using using our test scope.
    element = $compile(template)(parentScope);
    isolatedScope = element.scope();
    isolatedScope.$apply();

    expect(isolatedScope.config.midi.name).toBe('c50');
    expect(isolatedScope.config.midi.note).toBeNull();

    isolatedScope.config.midi.name = 'c0';
    isolatedScope.$apply();

    expect(isolatedScope.config.midi.note).toBe(0);

    isolatedScope.config.midi.name = null;
    isolatedScope.$apply();

    expect(isolatedScope.config.midi.note).toBeNull();

    isolatedScope.config.midi.name = '';
    isolatedScope.$apply();

    expect(isolatedScope.config.midi.note).toBeNull();
  }));

  it('should handle midi note numbers as the name.', inject(function($compile, $rootScope){
    parentScope = $rootScope.$new();
    parentScope.input = defaultConfig;
    parentScope.input.midi.name = '0';

    // Compile the DOM into an Angular view using using our test scope.
    element = $compile(template)(parentScope);
    isolatedScope = element.scope();
    isolatedScope.$apply();

    expect(isolatedScope.config.midi.note).toBe(0);

    isolatedScope.config.midi.name = '75';
    isolatedScope.$apply();

    expect(isolatedScope.config.midi.note).toBe(75);

    isolatedScope.config.midi.name = '128';
    isolatedScope.$apply();

    expect(isolatedScope.config.midi.note).toBeNull();

    isolatedScope.config.midi.name = 'two';
    isolatedScope.$apply();

    expect(isolatedScope.config.midi.note).toBeNull();
  }));

  it('should be able to listen to any midi note number.', inject(function($compile, $rootScope){
    parentScope = $rootScope.$new();
    parentScope.input = defaultConfig;
    parentScope.input.midi.name = ':';

    // Compile the DOM into an Angular view using using our test scope.
    element = $compile(template)(parentScope);
    isolatedScope = element.scope();
    isolatedScope.$apply();

    expect(isolatedScope.config.midi.note).toBe('All');

    isolatedScope.config.midi.name = 'all';
    isolatedScope.$apply();

    expect(isolatedScope.config.midi.note).toBe('All');

    isolatedScope.config.midi.name = 'any';
    isolatedScope.$apply();

    expect(isolatedScope.config.midi.note).toBe('All');
  }));

  it('should send update events when the midi note changes.', inject(function($compile, $rootScope){
    parentScope = $rootScope.$new();
    parentScope.input = defaultConfig;
    parentScope.input.midi.name = 'c7';

    setupEventListeners(parentScope);

    spyOn(parentScope, 'add');
    spyOn(parentScope, 'update');

    // Compile the DOM into an Angular view using using our test scope.
    element = $compile(template)(parentScope);
    isolatedScope = element.scope();
    isolatedScope.$apply();

    expect(isolatedScope.config.midi.name).toBe('c7', 'The midi note should be set correctly to start.');
    expect(parentScope.add).toHaveBeenCalledWith({input:1});
    expect(parentScope.update).not.toHaveBeenCalled();

    isolatedScope.config.midi.name = 'b3';
    isolatedScope.$apply();

    expect(parentScope.add.calls.length).toBe(1, 'The input should only have been added once.');
    expect(parentScope.update).toHaveBeenCalledWith({input:1});
  }));

  it('should be possible to configure the solo button through config',
    inject(function($compile, $rootScope){
      parentScope = $rootScope.$new();
      parentScope.input = defaultConfig;
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
    inject(function($compile, $rootScope){
      parentScope = $rootScope.$new();
      parentScope.input = defaultConfig;
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
    inject(function($compile, $rootScope){
      parentScope = $rootScope.$new();
      parentScope.input = defaultConfig;

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

      // Compile the DOM into an Angular view using using our test scope.
      element = $compile(template)(parentScope);
      isolatedScope = element.scope();
      isolatedScope.$apply();

      // The solo should be on and the mute off.
      expect(isolatedScope.config.mute).not.toEqual(isolatedScope.config.solo, 'The mute and solo states should not match.');
    })
  );

  it('should disable mute when soloed', inject(function($compile, $rootScope){
    parentScope = $rootScope.$new();
    parentScope.input = defaultConfig;
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

  it('should disable solo when muted', inject(function($compile, $rootScope){
    parentScope = $rootScope.$new();
    parentScope.input = defaultConfig;
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

  it('should start expanded by default.', inject(function($compile, $rootScope){
    parentScope = $rootScope.$new();
    parentScope.input = defaultConfig;

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

  it('should only be valid if note, type, port and channel are set.',
    inject(function($compile, $rootScope){
      parentScope = $rootScope.$new();
      parentScope.input = defaultConfig;
      parentScope.input.midi.note = null;
      parentScope.input.midi.port = {name:'foo',id:'/foo',index:3,enabled:true};
      parentScope.input.midi.channel = null;

      setupEventListeners(parentScope);

      spyOn(parentScope, 'add');

      element = $compile(template)(parentScope);
      isolatedScope = element.scope();
      isolatedScope.$apply();

      expect(parentScope.add).not.toHaveBeenCalled();

      isolatedScope.config.midi.name = 'c3';
      isolatedScope.$apply();

      expect(parentScope.add).not.toHaveBeenCalled();

      isolatedScope.config.midi.channel = '1';
      isolatedScope.$apply();

      expect(parentScope.add).not.toHaveBeenCalled();

      isolatedScope.config.midi.port = midiPortConfigMock.defaultMidiPort;
      isolatedScope.$apply();

      expect(parentScope.add).toHaveBeenCalledWith({input:1});
    }
  ));

  it('should send update events when the midi port changes.', inject(function($compile, $rootScope){
    parentScope = $rootScope.$new();
    parentScope.input = defaultConfig;
    parentScope.input.midi.name = 'c3';

    setupEventListeners(parentScope);

    spyOn(parentScope, 'add');
    spyOn(parentScope, 'update');

    element = $compile(template)(parentScope);
    isolatedScope = element.scope();
    isolatedScope.$apply();

    expect(parentScope.add).toHaveBeenCalled();
    expect(parentScope.update).not.toHaveBeenCalled();

    isolatedScope.config.midi.port = midiPortConfigMock.enabledPorts[1];
    isolatedScope.$apply();

    expect(parentScope.update).toHaveBeenCalledWith({input:1});
  }));

  it('should send update events when the midi channel changes.', inject(function($compile, $rootScope){
    parentScope = $rootScope.$new();
    parentScope.input = defaultConfig;
    parentScope.input.midi.name = 'c3';

    setupEventListeners(parentScope);

    spyOn(parentScope, 'add');
    spyOn(parentScope, 'update');

    element = $compile(template)(parentScope);
    isolatedScope = element.scope();
    isolatedScope.$apply();

    expect(parentScope.add).toHaveBeenCalled();
    expect(parentScope.update).not.toHaveBeenCalled();

    isolatedScope.config.midi.channel = 10;
    isolatedScope.$apply();

    expect(parentScope.update).toHaveBeenCalledWith({input:1});
  }));

  it('should send a remove event when it becomes invalid.', inject(function($compile, $rootScope){
    parentScope = $rootScope.$new();
    parentScope.input = defaultConfig;
    parentScope.input.midi.name = 'c3';

    setupEventListeners(parentScope);

    spyOn(parentScope, 'remove');

    element = $compile(template)(parentScope);
    isolatedScope = element.scope();
    isolatedScope.$apply();

    expect(parentScope.remove).not.toHaveBeenCalled();

    isolatedScope.config.mute = true;
    isolatedScope.$apply();

    expect(parentScope.remove).not.toHaveBeenCalled();

    isolatedScope.config.midi.name = null;
    isolatedScope.$apply();

    expect(parentScope.remove).toHaveBeenCalledWith({input:1});
  }));

  it('should send a remove event when the remove button is pressed.', inject(function($compile, $rootScope){
    parentScope = $rootScope.$new();
    parentScope.input = defaultConfig;

    setupEventListeners(parentScope);

    spyOn(parentScope, 'delete');

    element = $compile(template)(parentScope);
    isolatedScope = element.scope();
    isolatedScope.$apply();

    isolatedScope.deleteMe();
    isolatedScope.$apply();

    expect(parentScope.delete).toHaveBeenCalledWith({input:1});
  }));

  it('should send duplicate events.', inject(function($compile, $rootScope){
    parentScope = $rootScope.$new();
    parentScope.input = defaultConfig;

    setupEventListeners(parentScope);

    spyOn(parentScope, 'duplicate');

    element = $compile(template)(parentScope);
    isolatedScope = element.scope();
    isolatedScope.$apply();

    isolatedScope.duplicateMe();
    isolatedScope.$apply();

    expect(parentScope.duplicate).toHaveBeenCalledWith({input:1});
  }));

  it('should send OSC add events when the add output button is pressed.', inject(function($compile, $rootScope){
    parentScope = $rootScope.$new();
    parentScope.input = defaultConfig;

    setupEventListeners(parentScope);

    spyOn(parentScope, 'create');

    element = $compile(template)(parentScope);
    isolatedScope = element.scope();
    isolatedScope.$apply();

    expect(parentScope.create).not.toHaveBeenCalled();

    isolatedScope.addOSCOutput();

    expect(parentScope.create).toHaveBeenCalled();
  }));
});
