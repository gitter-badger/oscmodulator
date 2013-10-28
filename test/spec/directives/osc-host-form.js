describe('Directive: oscHostForm', function () {
  'use strict';

  var element, parentScope, isolatedScope, template;

  // load the directive's module
  beforeEach(module('oscmodulatorApp'));
  beforeEach(module('views/osc-host-form.html'));

  beforeEach(inject(function ($rootScope){
    // Create a DOM fragment to turn into a directive instance.
    template = angular.element(
      '<div data-osc-host-config></div>'
    );

    // Create a fresh scope for this test.
    parentScope = $rootScope.$new();
  }));

//  it('should toggle the OSC Host panel.', inject(function($compile){
//    // Compile the DOM into an Angular view using using our test scope.
//    element = $compile(template)(parentScope);
//    isolatedScope = element.scope();
//    isolatedScope.$apply();
//
//    expect(isolatedScope.hideOSCPanel).toBe(true);
//
//    isolatedScope.toggleOSCPanel();
//    isolatedScope.$apply();
//
//    expect(isolatedScope.hideOSCPanel).toBe(false);
//
//    isolatedScope.toggleOSCPanel();
//    isolatedScope.$apply();
//
//    expect(isolatedScope.hideOSCPanel).toBe(true);
//  }));

//  it('should default to a single, un-configured OSC Host.', inject(function($compile){
//    // Compile the DOM into an Angular view using using our test scope.
//    element = $compile(template)(parentScope);
//    isolatedScope = element.scope();
//    isolatedScope.$apply();
//
//    expect(isolatedScope.hosts.length).toBe(1);
//    expect(isolatedScope.hosts[0].name).toBeNull();
//    expect(isolatedScope.hosts[0].address).toBeNull();
//    expect(isolatedScope.hosts[0].port).toBeNull();
//  }));
//
//  it('should be able to add OSC Host configurations.', inject(function($compile){
//    // Compile the DOM into an Angular view using using our test scope.
//    element = $compile(template)(parentScope);
//    isolatedScope = element.scope();
//    isolatedScope.$apply();
//
//    expect(isolatedScope.hosts.length).toBe(1);
//    expect(element.find('div.configRow').length).toBe(1);
//
//    isolatedScope.addOSCHost();
//    isolatedScope.$apply();
//
//    expect(isolatedScope.hosts.length).toBe(2);
//    expect(isolatedScope.hosts[1].name).toBeNull();
//    expect(isolatedScope.hosts[1].address).toBeNull();
//    expect(isolatedScope.hosts[1].port).toBeNull();
//    expect(element.find('div.configRow').length).toBe(2);
//  }));
//
//  it('should be able to remove OSC Host configurations.', inject(function($compile){
//    // Compile the DOM into an Angular view using using our test scope.
//    element = $compile(template)(parentScope);
//    isolatedScope = element.scope();
//    isolatedScope.$apply();
//
//    expect(isolatedScope.hosts.length).toBe(1);
//
//    isolatedScope.addOSCHost();
//    isolatedScope.addOSCHost();
//    isolatedScope.addOSCHost();
//    isolatedScope.$apply();
//
//    expect(isolatedScope.hosts.length).toBe(4);
//    expect(element.find('div.configRow').length).toBe(4);
//
//    isolatedScope.removeOSCHost(0);
//    isolatedScope.$apply();
//
//    expect(isolatedScope.hosts.length).toBe(3);
//    expect(element.find('div.configRow').length).toBe(3);
//
//    isolatedScope.removeOSCHost(0);
//    isolatedScope.$apply();
//
//    expect(isolatedScope.hosts.length).toBe(2);
//    expect(element.find('div.configRow').length).toBe(2);
//  }));
//
//  it('should always have at least one OSC Host.', inject(function($compile){
//    // Compile the DOM into an Angular view using using our test scope.
//    element = $compile(template)(parentScope);
//    isolatedScope = element.scope();
//    isolatedScope.$apply();
//
//    expect(isolatedScope.hosts.length).toBe(1);
//    expect(element.find('div.configRow').length).toBe(1);
//
//    isolatedScope.removeOSCHost(0);
//    isolatedScope.$apply();
//
//    expect(isolatedScope.hosts.length).toBe(1);
//    expect(element.find('div.configRow').length).toBe(1);
//  }));
//
//  it('should start with an empty list of OSC Host ids.', inject(function($compile){
//    // Compile the DOM into an Angular view using using our test scope.
//    element = $compile(template)(parentScope);
//    isolatedScope = element.scope();
//    isolatedScope.$apply();
//
//    expect(isolatedScope.ids.length).toBe(0);
//  }));
//
//  it('should keep the OSC Host ids in sync with the OSC Hosts.', inject(function($compile){
//    // Compile the DOM into an Angular view using using our test scope.
//    element = $compile(template)(parentScope);
//    isolatedScope = element.scope();
//    isolatedScope.$apply();
//
//    isolatedScope.hosts[0].name = 'a';
//    isolatedScope.$apply();
//
//    expect(isolatedScope.ids.length).toBe(1);
//    expect(isolatedScope.ids[0]).toBe('a');
//
//    isolatedScope.hosts.push({name:'b'});
//    isolatedScope.$apply();
//
//    expect(isolatedScope.ids.length).toBe(2);
//    expect(isolatedScope.ids[1]).toBe('b');
//
//    isolatedScope.removeOSCHost(0);
//    isolatedScope.$apply();
//
//    expect(isolatedScope.ids.length).toBe(1);
//    expect(isolatedScope.ids[0]).toBe('b');
//
//    isolatedScope.removeOSCHost(0);
//    isolatedScope.$apply();
//
//    expect(isolatedScope.ids.length).toBe(0);
//  }));
//
//  it('should handle invalid OSC Host ids.', inject(function($compile){
//    // Compile the DOM into an Angular view using using our test scope.
//    element = $compile(template)(parentScope);
//    isolatedScope = element.scope();
//    isolatedScope.$apply();
//
//    isolatedScope.hosts = [
//      {
//        name: ''
//      },
//      {
//        name: 'b'
//      }
//    ];
//    isolatedScope.$apply();
//
//    expect(isolatedScope.ids.length).toBe(1);
//    expect(isolatedScope.ids[0]).toBe('b');
//  }));
});
