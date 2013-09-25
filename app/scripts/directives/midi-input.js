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
    controller : function midiInputCtrl($scope /*, $element, $attrs*/) {
      $scope.oscHost = '';
    },
    link : function postLink(/*scope, element, attrs, controllers*/) {
    }
  };
});
