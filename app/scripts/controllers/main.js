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

  /**
   * The number of inputs created since the application launched (used to assign ids).
   * @type {number}
   */
  $scope.inputsCreated = 0;

  /**
   * Add a Midi Input to the list of inputs.
   * TODO Find a way to put this functionality in the input-list directive?
   */
  $scope.addMidiInput = function(){
    ++$scope.inputsCreated;
    $scope.inputs.push({id:$scope.inputsCreated});
    $scope.$emit('input:new', $scope.inputs[$scope.inputs.length - 1]);
  };

//  $scope.$watch('inputs', function(newValue){
//    console.log('input list changed: ');
//    console.log(oldValue);
//    console.log(newValue);
//  });

  backend.init();

  $scope.addMidiInput();
});
