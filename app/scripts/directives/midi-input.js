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
      $scope.midiTypes = ['on', 'off', 'hold', 'double tap'];
    },
    link : function postLink(/*$scope, element, attrs, controllers*/) {
    }
  };
});
