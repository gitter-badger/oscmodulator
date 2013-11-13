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
    controller : function($scope) {
      var eventNames;

      // The list of events broadcast by this class.
      eventNames = {
        remove: 'input:midi:remove',
        add: 'input:midi:add',
        update: 'input:midi:update',
        duplicate: 'input:midi:duplicate',
        createOSC: 'output:osc:create'
      };

      /**
       * The list of midi note types displayed in the midi note type select box.
       * @type {Array}
       */
      $scope.midiTypes = ['on', 'off'];

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
      $scope.removeMe = function(){
        $scope.$emit(eventNames.remove, $scope.config.id);
      };

      /**
       * Duplicate this input.
       */
      $scope.duplicateMe = function(){
        $scope.$emit(eventNames.duplicate, $scope.config.id);
      };

      /**
       * Set the valid state of this input. If the state becomes valid, tell the messageMiddleware service about it.
       */
      $scope.save = function(){
        if($scope.config.midi.note && $scope.config.midi.type){
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
       * Update the messageMiddleware service when the midi note for this input changes.
       */
      $scope.$watch('config.midi.note', function(){
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
    }
  };
});
