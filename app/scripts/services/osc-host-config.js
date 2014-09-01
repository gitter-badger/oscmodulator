/**
 * Provides the list of OSC Hosts for consumers of that information.
 * The service is a scope object so its properties can be $watch-ed.
 */
angular.module('oscmodulatorApp').factory('oscHostConfig', function($rootScope, messageMiddleware) {
  'use strict';

  // The service instance is a scope object so that its properties can be $watch-ed.
  var service = $rootScope.$new();

  // The list of OSC Host configurations. Each OSC Host object has the following structure:
  // {
  //     name: string,
  //     address: string,
  //     port: number
  // }
  service.hosts = [];

  // An array of OSC Host configuration ids (ie. names).
  // We need to store the host ids as a separate list so that midi-input select elements handle defaults correctly.
  service.ids = [];

  /**
   * Add an empty OSC Host configuration to the list of hosts.
   */
  service.addOSCHost = function(){
    service.hosts.push({name:null, address:null, port:null, id:null});
  };

  /**
   * Remove the OSC Host configuration at the specified index.
   * @param index The index of the host configuration in the hosts list to be removed.
   */
  service.removeOSCHost = function(index){
    var removed = service.hosts.splice(index, 1);

    if(service.hosts.length === 0){
      service.addOSCHost();
    }

    if(removed[0].name){
      // Broadcast from the root up so that any scope can be notified.
      $rootScope.$broadcast('oscHostConfig:remove', removed[0].name);
    }
  };

  /**
   * Handle update events from OSC Host inputs and create the OSC Host object when a host
   * configuration is ready.
   * @param index {int} The index of the host that was updated.
   */
  service.updateOSCHost = function(index){
    var host = service.hosts[index];

    if(host.name && host.address && host.port){
      if(host.id){
        messageMiddleware.updateOSCOutputHost(host.id, host.address, host.port);
      }
      else{
        host.id = messageMiddleware.addOSCOutputHost(host.address, host.port);
      }
    }
    else if(host.id){
      messageMiddleware.removeOSCOutputHost(host.id);
      host.id = null;
    }

    service.updateHostIds();
  };

  /**
   * Keep the hosts list in sync with the oscHosts list.
   * TODO Need to make the structure of service.ids include the name and id.
   * TODO Need to validate that the host name is unique and prompt the user if it is not?
   */
  service.updateHostIds = function(){
    var j, host;

    if(service.hosts.length === 1 && !service.hosts[0].name ){
      service.ids = [];
    }
    else{
      service.ids = [];
      for(j = 0; j < service.hosts.length; j++){
        host = service.hosts[j];
        if(host.name && host.address && host.port){
          service.ids.push({
            'name':host.name,
            'id':host.id
          });
        }
      }
    }
  };
  

  // Initialize the OSC Host list.
  service.addOSCHost();

  return service;
});
