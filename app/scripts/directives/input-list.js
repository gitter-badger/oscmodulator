angular.module('oscmodulatorApp').directive('inputList', function (){
  'use strict';

  return {
    templateUrl: 'views/input-list.html',
    restrict: 'A',
    replace: true,
    scope:{
      inputs: '=inputs',
      hosts: '=hosts'
    },
    controller: function($scope, jq){
      if(!$scope.inputs){
        $scope.inputs = [];
      }

      /**
       * The number of inputs created since the application launched (used to assign ids).
       * @type {number}
       */
      $scope.inputsCreated = 0;

      // Make sure the id properties are always set by this class.
      for(var i = 0; i < $scope.inputs.length; i++){
        ++$scope.inputsCreated;
        $scope.inputs[i].id = $scope.inputsCreated;
      }

      /**
       * Add a Midi Input to the list of inputs.
       */
      $scope.addMidiInput = function(){
        ++$scope.inputsCreated;
        $scope.inputs.push({id:$scope.inputsCreated});
        $scope.$emit('input:new', $scope.inputs[$scope.inputs.length - 1]);
      };

      /**
       * Create a new midi input with all the same settings as the input with at the specified index.
       * @param index The index of the midi input to copy.
       */
      $scope.duplicateMidiInput = function(index){
        ++$scope.inputsCreated;
        $scope.inputs.push(jq.extend(true, {}, $scope.inputs[index]));
        $scope.inputs[$scope.inputs.length - 1].id = $scope.inputsCreated;
        $scope.$emit('input:new', $scope.inputs[$scope.inputs.length - 1]);
      };

      /**
       * Remove the specified midi input from the list of inputs.
       * @param index The index of the midi input to copy.
       */
      $scope.removeMidiInput = function(index){
        var removed = $scope.inputs.splice(index, 1);
        $scope.$emit('input:remove', removed[0].id);
      };

      // TODO Do we want to force the default of one input here or should that happen at the MainCtrl level?
      if($scope.inputs.length === 0){
        $scope.addMidiInput();
      }
    },
    link: function($scope){
      $scope.$on('create:input', function(){
        $scope.addMidiInput();
      });
    }
  };
});
