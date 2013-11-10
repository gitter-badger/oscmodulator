/**
 * Provides the list of OSC Hosts for consumers of that information.
 * The service is a scope object so its properties can be $watch-ed.
 */
angular.module('oscmodulatorApp').factory('oscHostConfig', function($rootScope) {
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
    service.hosts.push({name:null, address:null, port:null});
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
   * Keep the hosts list in sync with the oscHosts list.
   * TODO Need to validate that the host name is unique and prompt the user if it is not.
   * TODO Only add items to the ids list if they have a valid name, address and port.
   * TODO Update the messageMiddleware service when a new host is ready to be used.
   * TODO Can we remove this in favor of the list of objects?
   */
  service.$watch('hosts', function(){
    var j;

    if(service.hosts.length === 1 && !service.hosts[0].name ){
      service.ids = [];
    }
    else{
      service.ids = [];
      for(j = 0; j < service.hosts.length; j++){
        if(service.hosts[j].name){
          service.ids.push(service.hosts[j].name);
        }
      }
    }
  }, true);

  // Initialize the OSC Host list.
  service.addOSCHost();

  return service;
});
