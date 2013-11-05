angular.module('oscmodulatorApp').controller('MainCtrl', function ($scope, $timeout, midi) {
  'use strict';

  // The list of inputs to configure the application with. This should come from external
  // configuration or default to an empty state. This object will be kept in sync with the
  // UI and can be used as the configuration for node-webkit.
  $scope.inputs = [
    {
      name: null,
      collapsed: false,
      mute: false,
      solo: false,
      midi: {
        note: null,
        type: null
      },
      osc: [{
        host: null,
        path: null,
        parameters: []
      }]
    }
  ];

  /**
   * Add a Midi Input to the list of inputs.
   */
  $scope.addMidiInput = function(){
    $scope.inputs.push({});
  };

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
    }, 500);
  });

  midi.connect();
});
