/**
 * The main controller is used to bootstrap our application and handle top level application control.
 */
angular.module('oscmodulatorApp').controller('MainCtrl', function ($scope, backend, inputConfig) {
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

  // Initialize the backend service.
  backend.init();
});
