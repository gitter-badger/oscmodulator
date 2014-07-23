/**
 * Manages the form used to open midi ports for listening and sending midi messages.
 */
angular.module('oscmodulatorApp').directive('midiForm', function () {
  'use strict';

  return {
    templateUrl: 'views/midi-form.html',
    restrict: 'A',
    replace: true,
    scope: true,
    controller: function($scope, midiPortConfig){
      $scope.midiPortConfig = midiPortConfig;
    }
  };
});
