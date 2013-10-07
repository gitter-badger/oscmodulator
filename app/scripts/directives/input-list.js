/*global $:false */
angular.module('oscmodulatorApp').directive('inputList', function (){
  'use strict';

  return {
    templateUrl: 'views/input-list.html',
    restrict: 'A',
    replace: true,
    scope:{
      inputs: '=inputs'
    },
    controller: function nestedSortableCtrl($scope/*, $element, $attrs*/){
      // TODO Need to make sure input ids are always unique. Or should we just remove the id until it becomes necessary?

      if($scope.inputs === undefined){
        $scope.inputs = [];
      }

      if($scope.inputs.length === 0){
        $scope.inputs.push({});
      }

      $scope.hosts = [
        {
          name: 'Live',
          port: 9000
        },
        {
          name: 'Resolume',
          port: 9001
        }
      ];

      // Need to store the host ids as a separate list so that midi-input select element handles defaults correctly.
      // This list will be passed to the midi inputs so they know how to populate the available hosts.
      $scope.hostIds = [];
      for(var j = 0; j < $scope.hosts.length; j++){
        $scope.hostIds.push($scope.hosts[j].name);
      }

      /**
       * Add a Midi Input to the list of inputs.
       */
      $scope.addMidiInput = function(){
        $scope.inputs.push({});
      };
      /**
       * Create a new midi input with all the same settings as the input with at the specified index.
       * @param index The index of the midi input to copy.
       */
      $scope.duplicateMidiInput = function(index){
        // TODO Is there a way to inject jquery so we can guarantee it's available?
        $scope.inputs.push($.extend(true, {}, $scope.inputs[index]));
      };
      /**
       * Remove the specified midi input from the list of inputs.
       * @param index The index of the midi input to copy.
       */
      $scope.removeMidiInput = function(index){
        $scope.inputs.splice(index, 1);
      };
    }
  };
});
