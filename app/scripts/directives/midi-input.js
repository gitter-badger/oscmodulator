'use strict';

angular.module('oscmodulatorApp').directive('midiInput', function () {
  return {
    templateUrl : 'views/midi-input.html',
    restrict : 'A',
    replace : true,
    scope : {
      config : '=midiInputConfig',
      hosts : '=oscHosts',
      id : '@id'
    },
    controller : function midiInputCtrl($scope/*, $element, $attrs*/) {
      /**
       * The list of midi note types displayed in the midi note type select box.
       * @type {Array}
       */
      $scope.midiTypes = ['on', 'off', 'hold', 'double tap'];
      if( $scope.config.midi.type === null || $scope.config.midi.type === 0 || $scope.config.midi.type === '' ){
        $scope.config.midi.type = 'on';
      }

      if($scope.config.mute === true && $scope.config.solo === true){
        $scope.config.mute = $scope.config.solo = false;
      }

      /**
       * Add an empty parameter to the list of OSC parameters.
       */
      $scope.addOSCParameter = function(){
        $scope.config.osc.parameters.push({value:null});
      };
      /**
       * Remove a parameter from the list of OSC parameters.
       * @param index The index of the parameter to remove.
       */
      $scope.removeOSCParameter = function(index){
        $scope.config.osc.parameters.splice(index, 1);
      };
    },
    link : function link($scope/*, $element, $attrs, $controller*/){
      // Make sure that if the solo button is enabled, that the mute button gets disabled.
      $scope.$watch('config.solo', function(newValue, oldValue){
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
    }
  };
});
