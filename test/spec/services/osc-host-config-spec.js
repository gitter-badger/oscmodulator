describe('Service: oscHostConfig', function () {
  'use strict';

  // load the service's module
  beforeEach(module('oscmodulatorApp'));

  // instantiate service
  var oscHostConfig, messageMiddlewareMock;
  beforeEach(function(){
    messageMiddlewareMock = {
      removeOSCOutputHost:function(){},
      addOSCOutputHost:function(){},
      updateOSCOutputHost:function(){}
    };

    module(function($provide){
      $provide.value('messageMiddleware', messageMiddlewareMock);
    });

    inject(function (_oscHostConfig_) {
      oscHostConfig = _oscHostConfig_;
    });
  });

  it('should default to a single, un-configured OSC Host.', function(){
    expect(oscHostConfig.hosts.length).toBe(1);
    expect(oscHostConfig.hosts[0].name).toBeNull();
    expect(oscHostConfig.hosts[0].address).toBeNull();
    expect(oscHostConfig.hosts[0].port).toBeNull();
  });

  it('should be able to add OSC Host configurations.', function(){
    expect(oscHostConfig.hosts.length).toBe(1);

    oscHostConfig.addOSCHost();
//    oscHostConfig.$apply();

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
//    oscHostConfig.$apply();

    expect(oscHostConfig.hosts.length).toBe(4);

    oscHostConfig.removeOSCHost(0);

    expect(oscHostConfig.hosts.length).toBe(3);

    oscHostConfig.removeOSCHost(0);

    expect(oscHostConfig.hosts.length).toBe(2);
  });

  it('should send a remove event when a configuration is removed.', inject(function($rootScope){
    expect(oscHostConfig.hosts.length).toBe(1, 'The hosts list should start with the default host.');

    oscHostConfig.addOSCHost();
    oscHostConfig.hosts[0] = {name:'a', address:'localhost', port:'9000'};
    oscHostConfig.addOSCHost();
    oscHostConfig.hosts[1] = {name:'b', address:'localhost', port:'9001'};
    oscHostConfig.updateHostIds();

    expect(oscHostConfig.ids.length).toBe(2, 'Adding two host configs should result in two host ids.');
    expect(oscHostConfig.hosts.length).toBe(3);

    var listener = $rootScope.$new();
    listener.change = function(){};
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
    listener.change = function(){};
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
//    oscHostConfig.$apply();

    expect(oscHostConfig.hosts.length).toBe(1);
  });

  it('should start with an empty list of OSC Host ids.', function(){
    expect(oscHostConfig.ids.length).toBe(0);
  });

  it('should keep the OSC Host ids in sync with the OSC Hosts.', function(){
    oscHostConfig.hosts[0] = {name:'a', address:'localhost', port:'9000', id:0};
    oscHostConfig.updateHostIds();

    expect(oscHostConfig.ids.length).toBe(1);
    expect(oscHostConfig.ids[0]).toEqual({name:'a',id:0});

    oscHostConfig.hosts.push({name:'b'});
    oscHostConfig.updateHostIds();

    expect(oscHostConfig.ids.length).toBe(1, 'Only valid hosts should make it into the list.');

    oscHostConfig.hosts[1].address = 'localhost';
    oscHostConfig.hosts[1].port = '9001';
    oscHostConfig.hosts[1].id = 1;
    oscHostConfig.updateHostIds();

    expect(oscHostConfig.ids.length).toBe(2, 'Now the host is fully configured it should be in the list.');
    expect(oscHostConfig.ids[1]).toEqual({name:'b',id:1});

    oscHostConfig.removeOSCHost(0);
    oscHostConfig.updateHostIds();

    expect(oscHostConfig.ids.length).toBe(1);
    expect(oscHostConfig.ids[0]).toEqual({name:'b',id:1});

    oscHostConfig.removeOSCHost(0);
    oscHostConfig.updateHostIds();

    expect(oscHostConfig.ids.length).toBe(0);
  });

  it('should handle invalid OSC Hosts.', function(){
    oscHostConfig.hosts = [
      {
        name: '',
        address: 'localhost',
        port: '9000',
        id: null
      },
      {
        name: 'b',
        address: 'localhost',
        port: '9001',
        id: null
      }
    ];
    oscHostConfig.updateHostIds();

    expect(oscHostConfig.ids.length).toBe(1);
    // TODO We shouldn't allow items with no id in the ids property.
    expect(oscHostConfig.ids[0]).toEqual({name:'b',id:null});
  });

  it('should tell the messageMiddleware when hosts become valid.', function(){
    spyOn(messageMiddlewareMock, 'removeOSCOutputHost');
    spyOn(messageMiddlewareMock, 'addOSCOutputHost').andReturn(10);
    spyOn(messageMiddlewareMock, 'updateOSCOutputHost').andReturn(true);
    spyOn(oscHostConfig, 'updateHostIds').andCallThrough();

    oscHostConfig.hosts[0].name = 'a';
    oscHostConfig.hosts[0].address = 'localhost';
    oscHostConfig.updateOSCHost(0);

    expect(messageMiddlewareMock.addOSCOutputHost).not.toHaveBeenCalled();

    oscHostConfig.hosts[0].port = '9000';
    oscHostConfig.updateOSCHost(0);

    expect(messageMiddlewareMock.addOSCOutputHost).toHaveBeenCalledWith('localhost', '9000');
    expect(messageMiddlewareMock.removeOSCOutputHost).not.toHaveBeenCalled();
    expect(oscHostConfig.updateHostIds.calls.length).toBe(2);

    oscHostConfig.hosts[0].port = '9001';
    oscHostConfig.updateOSCHost(0);

    expect(oscHostConfig.updateHostIds.calls.length).toBe(3);
    expect(messageMiddlewareMock.updateOSCOutputHost).toHaveBeenCalledWith(10, 'localhost', '9001');
  });

  it('should tell the messageMiddleware to remove hosts that become invalid.', function(){
    spyOn(messageMiddlewareMock, 'removeOSCOutputHost');
    spyOn(messageMiddlewareMock, 'addOSCOutputHost').andReturn(11);

    oscHostConfig.hosts[0] = {name:'a', address:'localhost', port:'9000'};
    oscHostConfig.updateOSCHost(0);

    expect(messageMiddlewareMock.removeOSCOutputHost).not.toHaveBeenCalled();

    oscHostConfig.hosts[0].port = '';
    oscHostConfig.updateOSCHost(0);

    expect(messageMiddlewareMock.removeOSCOutputHost).toHaveBeenCalledWith(11);
    expect(oscHostConfig.hosts[0].id).toBeNull();
  });
});
