/**
 * The main controller is used to bootstrap our application and handle top level application control.
 */
angular.module('oscmodulatorApp').controller('MainCtrl', function ($scope, $timeout, backend, inputConfig) {
  'use strict';

  // Make the inputConfig accessible to the DOM.
  $scope.inputConfig = inputConfig;

  // Shows and hides the OSC Config panel.
  $scope.hideOSCPanel = true;

  /**
   * Change the open/closed state of the OSC Hosts panel.
   */
  $scope.toggleOSCPanel = function(){
    $scope.hideOSCPanel = !$scope.hideOSCPanel;
  };

  //TODO This will be moving to a directive
  $scope.midiActivity = false;
  var promise;
  $scope.$on('midi:activity', function() {
    $scope.midiActivity = true;
    $scope.$apply();
    if (promise) {
      $timeout.cancel(promise);
    }
    promise = $timeout(function() {
      $scope.midiActivity = false;
      promise = null;
    }, 100);
  });

  backend.init();
});
