'use strict';

angular.module('oscmodulatorApp').directive('midiInput', function () {
  return {
    templateUrl : 'views/midi-input.html',
    restrict : 'A',
    replace : true,
    scope : {
      config : '=midiInputConfig',
      id : '@id'
    },
    controller : function midiInputCtrl(/*$scope, $element, $attrs*/) {
    },
    link : function postLink(/*scope, element, attrs, controllers*/) {
    }
  };
});
