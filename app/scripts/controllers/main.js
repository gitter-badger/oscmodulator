/**
 * The main controller is used to bootstrap our application and handle top level application control.
 */
angular.module('oscmodulatorApp').controller('MainCtrl', function ($scope, backend) {
  'use strict';

  // The list of inputs to configure the application with. This should come from external
  // configuration or default to an empty state. This object will be kept in sync with the
  // UI and will be used as the configuration for midi and osc services.
  // Each input has the following structure:
  //    {
  //      name: null,
  //      collapsed: false,
  //      mute: false,
  //      solo: false,
  //      midi: {
  //        note: null,
  //        type: null
  //      },
  //      osc: [{
  //        host: null,
  //        path: null,
  //        parameters: []
  //      }]
  //    }
  // TODO Since we're no longer going to $watch the inputs list for changes, we should remove the two way binding.
  $scope.inputs = [];

  // Shows and hides the OSC Config panel.
  $scope.hideOSCPanel = true;

  $scope.toggleOSCPanel = function(){
    $scope.hideOSCPanel = !$scope.hideOSCPanel;
  };

  $scope.addMidiInput = function(){
    $scope.$broadcast('create:input');
  };

  backend.init();
});
