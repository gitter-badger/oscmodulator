angular.module('oscmodulatorApp').directive('midiInput', function () {
  'use strict';

  return {
    templateUrl : 'views/midi-input.html',
    restrict : 'A',
    replace : true,
    scope : {
      config : '=midiInputConfig',
      hosts : '=oscHosts',
      id : '@id',
      duplicate: '&duplicate',
      remove: '&remove'
    },
    controller : function midiInputCtrl($scope/*, $element, $attrs*/) {
      /**
       * The list of midi note types displayed in the midi note type select box.
       * @type {Array}
       */
      $scope.midiTypes = ['on', 'off', 'hold', 'double tap'];

      if(!$scope.config.name){
        $scope.config.name = null;
      }

      if(!$scope.config.collapsed){
        $scope.config.collapsed = false;
      }

      if(!$scope.config.osc){
        $scope.config.osc = [{}];
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

      /**
       * Change the collapsed/expanded state of the midi-input display.
       */
      $scope.toggleCollapsed = function () {
        $scope.config.collapsed = !$scope.config.collapsed;
      };
      /**
       * Add an OSC output to the list of outputs.
       */
      $scope.addOSCOutput = function(){
        $scope.config.osc.push({});
      };
      /**
       * Remove the OSC output object at the specified index.
       * @param index
       */
      $scope.removeOSCOutput = function(index){
        $scope.config.osc.splice(index, 1);
      };
    },
    link : function link($scope/*, $element, $attrs, $controller*/){
      // Make sure that if the solo button is enabled, that the mute button gets disabled.
      $scope.$watch('config.solo', function(newValue/*, oldValue*/){
        if( newValue === true ){
          $scope.config.mute = false;
        }
      });
      // Make sure that if the mute button is enabled, that the solo button gets disabled.
      $scope.$watch('config.mute', function(newValue/*, oldValue*/){
        if( newValue === true ){
          $scope.config.solo = false;
        }
      });
      // Dispatch an event if the midi note changes.
      $scope.$watch('config.midi.note', function(newValue){
        $scope.$emit('input:update:midi:note', $scope.id, newValue);
      });
      // Dispatch an event if the midi note type changes.
      $scope.$watch('config.midi.type', function(newValue){
        $scope.$emit('input:update:midi:type', $scope.id, newValue);
      });
      // Dispatch an event if the solo changes.
      $scope.$watch('config.solo', function(newValue){
        $scope.$emit('input:update:solo', $scope.id, newValue);
      });
      // Dispatch an event if the mute changes.
      $scope.$watch('config.mute', function(newValue){
        $scope.$emit('input:update:mute', $scope.id, newValue);
      });
    }
  };
});
