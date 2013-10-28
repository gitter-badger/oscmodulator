describe('Service: oscHostConfig', function () {
  'use strict';

  // load the service's module
  beforeEach(module('oscmodulatorApp'));

  // instantiate service
  var oscHostConfig;
  beforeEach(inject(function (_oscHostConfig_) {
    oscHostConfig = _oscHostConfig_;
  }));

  it('should default to a single, un-configured OSC Host.', function(){
    expect(oscHostConfig.hosts.length).toBe(1);
    expect(oscHostConfig.hosts[0].name).toBeNull();
    expect(oscHostConfig.hosts[0].address).toBeNull();
    expect(oscHostConfig.hosts[0].port).toBeNull();
  });

  it('should be able to add OSC Host configurations.', function(){
    expect(oscHostConfig.hosts.length).toBe(1);

    oscHostConfig.addOSCHost();
    oscHostConfig.$apply();

    expect(oscHostConfig.hosts.length).toBe(2);
    expect(oscHostConfig.hosts[1].name).toBeNull();
    expect(oscHostConfig.hosts[1].address).toBeNull();
    expect(oscHostConfig.hosts[1].port).toBeNull();
  });

  it('should be able to remove OSC Host configurations.', function(){
    expect(oscHostConfig.hosts.length).toBe(1);

    oscHostConfig.addOSCHost();
    oscHostConfig.hosts[0].name = 'a';
    oscHostConfig.addOSCHost();
    oscHostConfig.hosts[1].name = 'b';
    oscHostConfig.addOSCHost();
    oscHostConfig.hosts[2].name = 'c';
    oscHostConfig.$apply();

    expect(oscHostConfig.hosts.length).toBe(4);

    oscHostConfig.removeOSCHost(0);

    expect(oscHostConfig.hosts.length).toBe(3);

    oscHostConfig.removeOSCHost(0);

    expect(oscHostConfig.hosts.length).toBe(2);
  });

  it('should send a remove event when a configuration is removed.', inject(function($rootScope){
    expect(oscHostConfig.hosts.length).toBe(1, 'The hosts list should start with the default host.');

    oscHostConfig.addOSCHost();
    oscHostConfig.hosts[0].name = 'a';
    oscHostConfig.addOSCHost();
    oscHostConfig.hosts[1].name = 'b';
    oscHostConfig.$apply();

    expect(oscHostConfig.ids.length).toBe(2, 'Adding two host configs should result in two host ids.');

    var listener = $rootScope.$new();
    listener.change = function(id){};
    listener.$on('oscHostConfig:remove', function(event,id){
      listener.change(id);
    });
    spyOn(listener, 'change');

    oscHostConfig.removeOSCHost(0);

    expect(listener.change.mostRecentCall.args[0]).toBe('a', 'Removing config a should result in an remove event for config a.');

    oscHostConfig.removeOSCHost(0);

    expect(listener.change.calls.length).toBe(2, 'Removing both configs should result in two remove events.');
    expect(listener.change.mostRecentCall.args[0]).toBe('b', 'The second remove event should pass b as the config id.');
  }));

  it('should not emit remove events when removing un-configured hosts.', inject(function($rootScope){
    var listener = $rootScope.$new();
    listener.change = function(id){};
    listener.$on('oscHostConfig:remove', function(event,id){
      listener.change(id);
    });
    spyOn(listener, 'change');

    oscHostConfig.removeOSCHost(0);

    expect(listener.change).not.toHaveBeenCalled();
  }));

  it('should always have at least one OSC Host.', function(){
    expect(oscHostConfig.hosts.length).toBe(1);

    oscHostConfig.removeOSCHost(0);
    oscHostConfig.$apply();

    expect(oscHostConfig.hosts.length).toBe(1);
  });

  it('should start with an empty list of OSC Host ids.', function(){
    expect(oscHostConfig.ids.length).toBe(0);
  });

  it('should keep the OSC Host ids in sync with the OSC Hosts.', function(){
    oscHostConfig.hosts[0].name = 'a';
    oscHostConfig.$apply();

    expect(oscHostConfig.ids.length).toBe(1);
    expect(oscHostConfig.ids[0]).toBe('a');

    oscHostConfig.hosts.push({name:'b'});
    oscHostConfig.$apply();

    expect(oscHostConfig.ids.length).toBe(2);
    expect(oscHostConfig.ids[1]).toBe('b');

    oscHostConfig.removeOSCHost(0);
    oscHostConfig.$apply();

    expect(oscHostConfig.ids.length).toBe(1);
    expect(oscHostConfig.ids[0]).toBe('b');

    oscHostConfig.removeOSCHost(0);
    oscHostConfig.$apply();

    expect(oscHostConfig.ids.length).toBe(0);
  });

  it('should handle invalid OSC Host ids.', function(){
    oscHostConfig.hosts = [
      {
        name: ''
      },
      {
        name: 'b'
      }
    ];
    oscHostConfig.$apply();

    expect(oscHostConfig.ids.length).toBe(1);
    expect(oscHostConfig.ids[0]).toBe('b');
  });
});
