/**
 * The Midi Port Config service manages midi ports that can be listened to by the application.
 */
angular.module('oscmodulatorApp').factory('midiPortConfig', function($rootScope, messageMiddleware, inputConfig) {
  'use strict';

  // The service is a scope so it's properties can be $watch-ed.
  var service = $rootScope.$new();

  /**
   * The midi port that all midi inputs should default to. When selected, midi messages on any
   * port will be dispatched to the input.
   * @type {{name: string, id: string, index: null, enabled: boolean}}
   */
  service.defaultMidiPort = inputConfig.defaultMidiPort;

  /**
   * The list of midi ports available to the system.
   * @type {Array}
   */
  service.ports = [];
  /**
   * The list of midi ports which the user has enabled for listening.
   * @type {Array}
   */
  service.enabledPorts = [];

  /**
   * The messageMiddleware is exposed so it can be watched for changes.
   * @type {messageMiddleware}
   */
  service.messageMiddleware = messageMiddleware;

  /**
   * When the list of available midi ports changes, update the view.
   */
  service.$watch('messageMiddleware.availableMidiPorts', function(){
    var i, j, currPort,
      newPorts = [],
      newEnabledPorts = [service.defaultMidiPort];

    for(i = 0; i < messageMiddleware.availableMidiPorts.inputs.length; i++){
      currPort = {
        name: messageMiddleware.availableMidiPorts.inputs[i],
        enabled: false,
        index: i,
        id: null
      };

      // If we currently have one of these ports enabled, get its settings.
      for(j = 0; j < service.ports.length; j++){
        if(currPort.name === service.ports[j].name){
          currPort.enabled = service.ports[j].enabled;
          currPort.id = service.ports[j].id;
          break;
        }
      }

      newPorts.push(currPort);
      if(currPort.enabled){
        newEnabledPorts.push(currPort);
      }
    }

    service.ports = newPorts;
    service.enabledPorts = newEnabledPorts;
  }, true);

  /**
   * Update the list of enabled ports.
   */
  service.updateEnabledPorts = function(){
    var i, newEnabledPorts = [service.defaultMidiPort];
    for(i = 0; i < service.ports.length; i++){
      if(service.ports[i].enabled){
        newEnabledPorts.push(service.ports[i]);
      }
    }

    service.enabledPorts = newEnabledPorts;
  };

  /**
   * Handle changes to the midi input checkboxes.
   * @param index
   */
  service.toggleMidiInput = function(index){
    if(service.ports[index].enabled){
      // Add a midi input through the messageMiddleware.
      service.ports[index].id = messageMiddleware.listenToMidiPort(index);
      service.updateEnabledPorts();
    } else {
      // Remove this input from the middleware.
      messageMiddleware.removeMidiPort(service.ports[index].id);
      service.ports[index].id = null;
      service.updateEnabledPorts();
      // TODO Broadcast a disabled event so the midi-input can nullify it's select value.
      $rootScope.$broadcast('midiPortConfig:remove', service.ports[index].name);
    }
  };

  return service;
});
