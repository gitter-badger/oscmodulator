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

      /**
       * Add an empty parameter to the list of OSC parameters.
       */
      $scope.addOSCParameter = function()
      {
        $scope.config.osc.parameters.push({value:null});
      };
      /**
       * Remove a parameter from the list of OSC parameters.
       * @param index The index of the parameter to remove.
       */
      $scope.removeOSCParameter = function(index)
      {
        $scope.config.osc.parameters.splice(index, 1);
      };
    }
  };
});
