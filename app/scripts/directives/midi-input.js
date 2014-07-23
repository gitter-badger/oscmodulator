/**
 * The midi-input directive creates a single midi input item in the DOM and manages communication with the backend
 * service.
 */
angular.module('oscmodulatorApp').directive('midiInput', function () {
  'use strict';

  return {
    templateUrl : 'views/midi-input.html',
    restrict : 'A',
    replace : true,
    scope : {
      config : '=midiInputConfig'
    },
    controller : function($scope, $log, midiPortConfig) {
      var eventNames;

      // The list of events broadcast by this class.
      eventNames = {
        add: 'input:midi:add',
        delete: 'input:midi:delete',
        update: 'input:midi:update',
        duplicate: 'input:midi:duplicate',
        remove: 'input:midi:disable',
        createOSC: 'output:osc:create'
      };

      /**
       * Maps midi note names like c#3 to their midi note. ex: {c0:0, c#0:1, ...}
       * @type {Object}
       */
      $scope.midiNoteMap = {};

      // Generate the map of midi notes to numbers.
      (function(){
        var j = 0,
          i = 0,
          notesCreated = 0,
          totalNotes = 128,
          noteNames = ['c','c#','d','d#','e','f','f#','g','g#','a','a#','b'];

        while(notesCreated < totalNotes){
          for(j = 0; j < noteNames.length; j++){
            var noteName = noteNames[j] + i;
            $scope.midiNoteMap[noteName] = notesCreated;

            ++notesCreated;
            if(notesCreated >= totalNotes){
              break;
            }
          }

          ++i;
        }
      })();

      /**
       * The list of midi note types displayed in the midi note type select box.
       * @type {Array}
       */
      $scope.midiTypes = ['All', 'Note', 'CC'];

      /**
       * The list of possible midi channels.
       * @internal Hard coded for efficiency.
       * @type {Array}
       */
      $scope.midiChannels = ['All','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16'];

      /**
       * Expose the midi port configuration on the scope so it can be bound in the DOM.
       * @type {midiPortConfig}
       */
      $scope.midiPortConfig = midiPortConfig;

      // If this input uses the default midi port, make sure it references the object on
      // midiPortConfig so that the select object is set correctly.
      if($scope.config.midi.port.name === 'All'){
        $scope.config.midi.port = midiPortConfig.defaultMidiPort;
      }

      /**
       * Change the collapsed/expanded state of the midi-input display.
       */
      $scope.toggleCollapsed = function () {
        $scope.config.collapsed = !$scope.config.collapsed;
      };

      /**
       * Add new outputs to this input.
       */
      $scope.addOSCOutput = function(){
        $scope.$emit(eventNames.createOSC, $scope.config.id);
      };

      /**
       * Remove this input from this input.
       */
      $scope.deleteMe = function(){
        $scope.$emit(eventNames.delete, $scope.config.id);
      };

      /**
       * Duplicate this input.
       */
      $scope.duplicateMe = function(){
        $scope.$emit(eventNames.duplicate, $scope.config.id);
      };

      /**
       * Set the valid state of this input. If the state becomes valid,
       * dispatch an event letting the inputList know.
       */
      $scope.save = function(){
        var i, portIsValid = false;

        // Check that the port is enabled in case this input intends to connect to a midi device
        // that hasn't been plugged in and enabled yet.
        for(i = 0; i < midiPortConfig.enabledPorts.length; i++){
          if(midiPortConfig.enabledPorts[i].name === $scope.config.midi.port.name){
            portIsValid = true;
            break;
          }
        }

        if($scope.config.midi.note && $scope.config.midi.type &&
          $scope.config.midi.channel && portIsValid){
          if($scope.config.valid){
            $scope.config.valid = true;
            $scope.$emit(eventNames.update, $scope.config.id);
          }
          else{
            $scope.config.valid = true;
            $scope.$emit(eventNames.add, $scope.config.id);
          }
        }
        else{
          // Remove the input if we go from valid to invalid.
          if($scope.config.valid){
            $scope.config.valid = false;
            $scope.$emit(eventNames.remove, $scope.config.id);
          }
        }

        return $scope.config.valid;
      };

      /**
       * Update the mute setting when changing solo and make sure the messageMiddleware is notified.
       */
      $scope.$watch('config.solo', function(newValue, oldValue){
        // Make sure that if the solo button is enabled, that the mute button gets disabled.
        if(newValue){
          $scope.config.mute = false;
        }

        // Ignore initialization.
        if(newValue !== oldValue){
          $scope.save();
        }
      });

      /**
       * Update the solo setting when changing mute and make sure the messageMiddleware is notified.
       */
      $scope.$watch('config.mute', function(newValue, oldValue){
        // Make sure that if the mute button is enabled, that the solo button gets disabled.
        if(newValue){
          $scope.config.solo = false;
        }

        // Ignore initialization.
        if(newValue !== oldValue){
          $scope.save();
        }
      });

      /**
       * Save the state of the input whenever the midi port name changes.
       */
      $scope.$watch('config.midi.port.name', function(newValue, oldValue){
        if(newValue !== oldValue){
          $scope.save();
        }
      });

      /**
       * Save the state of the input whenever the midi channel changes.
       */
      $scope.$watch('config.midi.channel', function(newValue, oldValue){
        if(newValue !== oldValue){
          $scope.save();
        }
      });

      /**
       * Update the messageMiddleware service when the midi note for this input changes.
       * Midi name value may be 0 - 127, 'c0' - 'g10', ':', 'any' or 'all'.
       */
      $scope.$watch('config.midi.name', function(newValue){
        var valueAsNumber = parseInt(newValue, 10),
          valueAsLower;

        if(!isNaN(valueAsNumber)){
          if(valueAsNumber >= 0 && valueAsNumber < Object.keys($scope.midiNoteMap).length){
            $scope.config.midi.note = valueAsNumber;
          }
          else{
            $scope.config.midi.note = null;
          }
        }
        else if(newValue === '' || newValue === null){
          $scope.config.midi.note = null;
        }
        else{
          valueAsLower = newValue !== null ? newValue.toLowerCase() : newValue;
          if(valueAsLower === ':' || valueAsLower === 'all' || valueAsLower === 'any'){
            $scope.config.midi.note = 'All';
          }
          else if($scope.midiNoteMap[newValue] === undefined){
            $scope.config.midi.note = null;
            $log.warn('Midi note ' + newValue + ' is not a valid midi note. ' +
              'Notes must be between c0 and g10.');
          }
          else{
            $scope.config.midi.note = $scope.midiNoteMap[newValue];
          }
        }
        $scope.save();
      });

      /**
       * Update the messageMiddleware service when the midi note type changes for this input.
       */
      $scope.$watch('config.midi.type', function(newValue, oldValue){
        // Ignore initialization so that only one update event is emitted.
        if(newValue !== oldValue){
          $scope.save();
        }
      });

      /**
       * Handle midi port config disable events in order to make sure the midi port property
       * is correctly reset.
       */
      $scope.$on('midiPortConfig:remove', function(event, name){
        if(name === $scope.config.midi.port.name){
          $scope.config.midi.port = midiPortConfig.defaultMidiPort;
        }
      });
    }
  };
});
