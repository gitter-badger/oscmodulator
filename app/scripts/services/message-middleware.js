/**
 * The backend service is used to communicate between the javascript UI running
 * in the browser and the code running outside of the browser (Node or C code).
 */
angular.module('oscmodulatorApp')
  .factory('messageMiddleware', function ($rootScope, legato, $log) {
    'use strict';

    var service, config, inputsCreated, outputHostsCreated, outputHosts;

    service = $rootScope.$new();

    /**
     * The list of midi ports available to the system.
     * @type {{inputs: Array[{String}], outputs: Array[{String}]}}
     */
    service.availableMidiPorts = {
      inputs: [],
      outputs: []
    };

    // Used to create ids for the hosts to which output messages will be sent.
    outputHostsCreated = 0;

    // Used to create ids for input objects.
    inputsCreated = 0;

    /**
     * The list of configurations that match the valid configurations from the UI.
     * Each entry has the following structure:
     * {
     *   routeId:'/1', // this is the id returned from legato.on()
     *   outputs:[{
     *     hostId:1, // this maps to one of the items in outputHosts.
     *     path:'/my/path',
     *     parameters:[]
     *   }]
     * }
     * @type {Object}
     */
    config = {};

    /**
     * The list of objects that can be used to send output messages. Each property is
     * a callback function returned from legato.osc.Out().
     * @type {Object}
     */
    outputHosts = {};

    /**
     * Initialize the messageMiddleware and any services used by the messageMiddleware.
     */
    service.init = function () {
      legato.init();
      // Initialize the midi ports
      service.updateAvailableMidiPorts();
    };

    /**
     * Get the list of available midi ports.
     */
    service.updateAvailableMidiPorts = function () {
      service.availableMidiPorts.inputs = legato.midi.ins();
      service.availableMidiPorts.outputs = legato.midi.outs();
    };

    /**
     * Start listening to a midi input port.
     * @param index {String} The id of the port to listen to. This is returned from
     * updateAvailableMidiPorts().
     * @return The id of the midi port created so it can be removed at a later point.
     */
    service.listenToMidiPort = function (index) {
      return legato.in(legato.midi.In(index));
    };

    /**
     * Stop listening to a midi port.
     * @param id {int} The id of the port returned from listenToMidiPort.
     */
    service.removeMidiPort = function (id) {
      legato.removeInput(id);
    };

    /**
     * Create a legato path string using the elements provided.
     * @param portId {String} The id of the port to receive messages from.
     * @param channel {String} The channel on which to listen. If ':' then any channel.
     * @param noteType {String} The type of note to listen to. ex: 'note' or 'cc'
     * @param note {String} The note name to listen for. ex: c3
     */
    service.getPath = function (portId, channel, noteType, note) {
      portId = portId === 'All' ? ':' : portId;
      channel = channel === 'All' ? ':' : channel;
      note = note === 'All' ? ':' : note;
      noteType = noteType === 'All' ? ':' : noteType.toLowerCase();

      return [portId, channel, noteType, note].join('/');
    };

    /**
     * Create a new input on the messageMiddleware.
     * @param id {int} The id of input being registered.
     * @param port {int} The id of the midi port returned by listenToMidiPort() or the id for "all ports".
     * @param note {string} The note number for or 'All' for all notes.
     * @param noteType {string} either 'All', 'Note' or 'CC'
     * @param channel {string} The channel number to listen to or 'All' for all channels.
     * @returns {number} The id of the newly created input.
     */
    service.setMidiInput = function (id, port, note, noteType, channel) {
      var path = service.getPath(port, channel, noteType, note);

      ++inputsCreated;
      config[id] = {routeId: null, outputs: {}};
      service.createRoute(path, id);
    };

    service.createRoute = function (path, id) {
      // Configure a new note listener for the specified config.
      config[id].routeId = legato.on(path, function () {
        var output, property;

        $log.info('Backend midi input callback, Jack!');

        for (property in config[id].outputs) {
          output = config[id].outputs[property];

          outputHosts[output.hostId](output.path, output.parameters);
        }
      });
    };

    service.updateMidiInput = function (id, port, note, noteType, channel) {
      var path = service.getPath(port, channel, noteType, note);
      legato.removeRoute(config[id].routeId);
      service.createRoute(path, id);
    };

    /**
     * Change the mute setting of a midi input.
     * @param inputId The id of the input that was muted/unmuted.
     * @param muted True = input is muted.
     */
    service.muteInput = function (inputId, muted) {
      $log.info('Updating mute for input ' + inputId.input + ': ' + muted);
      // TODO Test this method.
    };

    /**
     * Change the solo setting of an input.
     * @param inputId The id of the input that was soloed/unsoloed.
     * @param solo True = input is soloed.
     */
    service.soloInput = function (inputId, solo) {
      $log.info('Updating solo for input ' + inputId.input + ': ' + solo);
      // TODO Test this method.
    };

    /**
     * Remove an input.
     * @param inputId The id of the input to be removed.
     */
    service.removeInput = function (id) {
      legato.removeRoute(config[id].routeId);

      delete config[id];
    };

    /**
     * Add an OSC Output host.
     * @param address {String} The address to which OSC messages will be sent.
     * @param port {String} The port of the OSC Host to which messages will be sent.
     * @return {int} The id of the newly created OSC Host.
     */
    service.addOSCOutputHost = function (address, port) {
      ++outputHostsCreated;
      outputHosts[outputHostsCreated] = legato.osc.Out(address, port);
      return outputHostsCreated;
    };

    /**
     * Update the properties of an existing OSC output host.
     * @param id {int} The id of the host to modify.
     * @param address {String} The new address of the host.
     * @param port {String} The new port of the host.
     */
    service.updateOSCOutputHost = function (id, address, port) {
      var removed = this.removeOSCOutputHost(id);
      if (removed) {
        outputHosts[id] = legato.osc.Out(address, port);
        return true;
      }
      else {
        return false;
      }
    };

    /**
     * Remove an OSC Output host object.
     * @param id {int} The id of the OSC Output object returned by legato.
     * @return {boolean} True = the output was successfully removed.
     *     False = could not find an output associated to the id specified.
     */
    service.removeOSCOutputHost = function (id) {
      if (outputHosts[id] !== undefined) {
        $log.info('Removing OSC Output Host ' + id);
        delete outputHosts[id];

        return true;
      }
      else {
        return false;
      }
    };

    /**
     * Add/update an OSC output.
     * @param inputId {int} The id of the input that will trigger this output (returned from listenToMidiPort)
     * @param outputId {int} The id of the output that will send this message.
     * @param outputHostId {int} The output host to which to send messages (retrieved from oscHostConfig)
     * @param path {String} The OSC path to send to.
     * @param parameters {String} The list of parameters to send.
     * @returns {number} The id of this OSC output object for later removal.
     */
    service.setOSCOutput = function (inputId, outputId, outputHostId, path, parameters) {
      $log.info('Set OSC Output: ' + inputId + '|' + outputHostId + '|' + path + '|' + parameters);

      // TODO Should we be storing a reference to the output host rather than the id?
      config[inputId].outputs[outputId] = {
        hostId: outputHostId,
        path: path,
        parameters: parameters
      };

      return outputId;
    };

    /**
     * Update the properties of an OSC output.
     * @param inputId The id of the input who's output will be modified.
     * @param outputId The id of the output to modify.
     * @param outputHostId The updated outputHostId to use to send output messages.
     * @param path The updated path to send output messages on.
     * @param parameters The list of parameters to send in the output message.
     * @returns {boolean} True = the output was updated. False = the output doesn't exist or couldn't be updated.
     */
    service.updateOSCOutput = function (inputId, outputId, outputHostId, path, parameters) {
      if (config[inputId].outputs[outputId]) {
        this.setOSCOutput(inputId, outputId, outputHostId, path, parameters);
        return true;
      }
      else {
        return false;
      }
    };

    /**
     * Remove an OSC output configuration.
     * @param id {Object} The id of the output to set/add. ex: {input:1, output:1}
     */
    service.removeOSCOutput = function (inputId, outputId) {
      $log.info('Remove OSC Output: ' + inputId + '|' + outputId);

      if (config[inputId].outputs[outputId]) {
        delete config[inputId].outputs[outputId];
        return true;
      }
      else {
        return false;
      }
    };

    return service;
  }
);
