angular.module('oscmodulatorApp').directive('midiInput', function () {
  'use strict';

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

      if($scope.config.name === undefined || $scope.config.name === ''){
        $scope.config.name = null;
      }

      if($scope.config.collapsed === undefined || $scope.config.collapsed === null){
        $scope.config.collapsed = false;
      }

      if($scope.config.osc === undefined){
        $scope.config.osc = [];
      }

      if($scope.config.midi === undefined){
        $scope.config.midi = {};
      }

      if($scope.config.midi.note === undefined){
        $scope.config.midi.note = null;
      }

      if($scope.config.midi.type === undefined || $scope.config.midi.type === null || $scope.config.midi.type === 0 || $scope.config.midi.type === '' ){
        $scope.config.midi.type = 'on';
      }

      if($scope.config.mute === undefined || $scope.config.mute === null){
        $scope.config.mute = false;
      }

      if($scope.config.solo === undefined || $scope.config.solo === null){
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
    }
  };
});
