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
  // TODO Since we're no longer going to $watch the inputs list for changes, should we remove the two way binding?
  $scope.inputs = [];

  // Shows and hides the OSC Config panel.
  $scope.hideOSCPanel = true;

  /**
   * Change the open/closed state of the OSC Hosts panel.
   */
  $scope.toggleOSCPanel = function(){
    $scope.hideOSCPanel = !$scope.hideOSCPanel;
  };

  /**
   * Broadcast a request to add an input to the list of inputs.
   * We could modify the input list directly but the input-list object
   * has specific initialization that we wish to call.
   * TODO Would it be better to provide a service that can call the remove input method directly? Or if we add an empty
   * item to the inputs list, will the input-list directive take care of setting the correct defaults? We could remove
   * a level of binding if there was a service that allowed injection of inputs and allowed reading of the input list.
   */
  $scope.addMidiInput = function(){
    $scope.$broadcast('create:input');
  };

  // Initialize the backend service.
  backend.init();
});
