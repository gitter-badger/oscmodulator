/**
 * The Midi Port Config service manages midi ports that can be listened to by the application.
 */
angular.module('oscmodulatorApp').factory('midiPortConfig', function($rootScope) {
  'use strict';

  // The service is a scope so it's properties can be $watch-ed.
  var service = $rootScope.$new();

  // The list of midi ports available to the system.
  service.ports = [
    {
      name: 'USB Trigger Finger',
      enabled: false,
      id: '/port1'
    },{
      name: 'Saffire 30',
      enabled: false,
      id: '/port2'
    },{
      name: 'RigKontrol',
      enabled: false,
      id: '/port3'
    }
  ];

  /**
   * Force the service to update its midi port list.
   */
  service.updateAvailablePorts = function(){
    // Ask the message middleware for the available input and output ports.
  };

  service.$watch('ports', function(){
    // When the enabled state of any of the ports changes, tell the messageMiddleware to start or stop
    // listening on that port.
  }, true);

  return service;
});
