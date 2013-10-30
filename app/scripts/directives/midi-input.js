angular.module('oscmodulatorApp').directive('midiInput', function () {
  'use strict';

  return {
    templateUrl : 'views/midi-input.html',
    restrict : 'A',
    replace : true,
    scope : {
      config : '=midiInputConfig',
      hosts : '=oscHosts',
      duplicate: '&duplicate',
      remove: '&remove'
    },
    controller : function($scope, backend) {
      var i;

      /**
       * The list of midi note types displayed in the midi note type select box.
       * @type {Array}
       * TODO Change this to a JSON object that can be used as an ENUM.
       */
      $scope.midiTypes = ['on', 'off', 'hold', 'double tap'];

      if(!$scope.config.name){
        $scope.config.name = null;
      }

      if(!$scope.config.collapsed){
        $scope.config.collapsed = false;
      }

      if(!$scope.config.osc){
        $scope.config.osc = [];
      }

      if($scope.config.osc.length === 0){
        $scope.config.osc.push({});
      }

      if(!$scope.config.midi){
        $scope.config.midi = {};
      }

      if(!$scope.config.midi.note){
        $scope.config.midi.note = null;
      }

      if(!$scope.config.midi.type){
        $scope.config.midi.type = $scope.midiTypes[0];
      }

      if(!$scope.config.mute){
        $scope.config.mute = false;
      }

      if(!$scope.config.solo){
        $scope.config.solo = false;
      }

      if($scope.config.mute === true && $scope.config.solo === true){
        $scope.config.mute = $scope.config.solo = false;
      }

      $scope.outputsCreated = 0;

      // Make sure all outputs have an id set by this class.
      for(i = 0; i < $scope.config.osc.length; i++){
        ++$scope.outputsCreated;

        $scope.config.osc[i].id = {
          input: $scope.config.id.input,
          output: $scope.outputsCreated
        };
      }

      /**
       * Change the collapsed/expanded state of the midi-input display.
       */
      $scope.toggleCollapsed = function () {
        $scope.config.collapsed = !$scope.config.collapsed;
      };

      /**
       * Add an OSC output to the list of outputs.
       *
       * @internal The osc-output directive is responsible for updating the backend service when it becomes valid.
       */
      $scope.addOSCOutput = function(){
        ++$scope.outputsCreated;

        $scope.config.osc.push({
          id: {
            input: $scope.config.id.input,
            output: $scope.outputsCreated
          }
        });
      };

      /**
       * Remove the OSC output object at the specified index.
       * @param index
       */
      $scope.removeOSCOutput = function(index){
        var removed = $scope.config.osc.splice(index, 1);
        // TODO Should we check to see if the input is valid before removing it? If it's not currently valid then it
        // will not exist in the backend.
        backend.removeOSCOutput(removed[0].id);
      };

      /**
       * Set the valid state of this input. If the state becomes valid, tell the backend service about it.
       * TODO Make this a private method?
       */
      $scope.updateValidity = function(){
        // TODO Is there a way to prevent initialization from calling setMidiInput twice? Or maybe
        // the backend should make sure things are changing before it adds midi listeners?
        if($scope.config.midi.note && $scope.config.midi.type){
          $scope.config.valid = true;
          backend.setMidiInput($scope.config);
        }
        else{
          // Remove the input if we go from valid to invalid.
          if($scope.config.valid){
            $scope.config.valid = false;
            backend.removeInput($scope.config.id);
          }
        }

        return $scope.config.valid;
      };

      /**
       * Update the mute setting when changing solo and make sure the backend is notified.
       */
      $scope.$watch('config.solo', function(newValue){
        // Make sure that if the solo button is enabled, that the mute button gets disabled.
        if( newValue === true ){
          $scope.config.mute = false;
        }

        backend.soloInput($scope.config.id, newValue);
      });

      /**
       * Update the solo setting when changing mute and make sure the backend is notified.
       */
      $scope.$watch('config.mute', function(newValue){
        // Make sure that if the mute button is enabled, that the solo button gets disabled.
        if( newValue === true ){
          $scope.config.solo = false;
        }

        backend.muteInput($scope.config.id, newValue);
      });

      /**
       * Update the backend service when the midi note for this input changes.
       */
      $scope.$watch('config.midi.note', function(){
        $scope.updateValidity();
      });

      /**
       * Update the backend service when the midi note type changes for this input.
       */
      $scope.$watch('config.midi.type', function(){
        $scope.updateValidity();
      });
    }
  };
});
