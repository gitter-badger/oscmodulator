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

      for(var i = 0; i < $scope.inputs.length; i++){
        $scope.inputs[i].id = 'midi-input-' + (i + 1);
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
       * Get the index of the item identified by id.
       * @param id The id of the input item you are looking for.
       * @returns {int} The index of the item in the list of inputs.
       */
      var getItemIndexById = function(id){
        for(var i = 0; i < $scope.inputs.length; i++){
          if($scope.inputs[i].id === id){
            return i;
          }
        }

        return null;
      };

      /**
       * Add a Midi Input to the list of inputs.
       */
      $scope.addMidiInput = function(){
        $scope.inputs.push({id:'midi-input-' + ($scope.inputs.length + 1)});
      };
      /**
       * Create a new midi input with all the same settings as the input with the specified id.
       * @param id The id of the midi input to copy.
       */
      $scope.duplicateMidiInput = function(id){
        var index, newIndex;
        index = getItemIndexById(id);

        if(index !== null){
          // TODO Is there a way to inject jquery so we can guarantee it's available?
          $scope.inputs.push($.extend(true, {}, $scope.inputs[index]));

          newIndex = $scope.inputs.length - 1;
          $scope.inputs[newIndex].id = 'midi-input-' + $scope.inputs.length;
        }
      };
      /**
       * Remove the specified midi input from the list of inputs.
       * @param id The id of the midi input to copy.
       */
      $scope.removeMidiInput = function(id){
        $scope.inputs.splice(getItemIndexById(id), 1);
      };
    }
  };
});
