/**
 * The main controller is used to bootstrap our application and handle top level application control.
 */
angular.module('oscmodulatorApp')
  .controller('MainCtrl', function ($scope, $timeout, messageMiddleware, inputConfig) {
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

      if(!$scope.hideMIDIPanel){
        $scope.hideMIDIPanel = true;
      }
    };

    // Shows and hides the MIDI Config panel.
    $scope.hideMIDIPanel = true;

    /**
     * Change the open/closed state of the MIDI panel.
     */
    $scope.toggleMIDIPanel = function(){
      if($scope.hideMIDIPanel){
        messageMiddleware.updateAvailableMidiPorts();
      }

      $timeout(function(){
        $scope.hideMIDIPanel = !$scope.hideMIDIPanel;

        if(!$scope.hideOSCPanel){
          $scope.hideOSCPanel = true;
        }
      });
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

    messageMiddleware.init();
  }
);
