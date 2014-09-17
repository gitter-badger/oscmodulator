/**
 * The inputList directive provides the HTML for the list of inputs. It manages all events broadcast
 * from the inputs and outputs and then translates those into calles to the Message Middleware.
 */
angular.module('oscmodulatorApp').directive('inputList', function (){
  'use strict';

  return {
    templateUrl: 'views/input-list.html',
    restrict: 'A',
    replace: true,
    scope: true,
    controller: function($scope, inputConfig, messageMiddleware){
      // Expose the inputConfig on the scope so it can be accessed by the DOM.
      $scope.inputConfig = inputConfig;

      /**
       * Handle midi input add events when an input becomes valid.
       */
      $scope.$on('input:midi:add', function(event, id){
        var input = $scope.inputConfig.inputs[id.input],
          midi = input.midi,
          index;
        messageMiddleware.setMidiInput(midi.port.id, midi.note, midi.type, midi.channel);

        for(index in input.outputs){
          if(input.outputs[index].valid){
            $scope.addOSCOutput(input.outputs[index].id);
          }
        }
      });

      /**
       * Handle midi input duplicate events when an input asks to be duplicated.
       */
      $scope.$on('input:midi:duplicate', function(event, id){
        // No need to call the messageMiddleware because that will occur when the input becomes valid.
        $scope.inputConfig.duplicateInput(id);
      });

      /**
       * Handle midi update events when an input is modified.
       */
      $scope.$on('input:midi:update', function(event, id){
        var midi = $scope.inputConfig.inputs[id.input].midi;
        messageMiddleware.setMidiInput(midi.port.id, midi.note, midi.type, midi.channel);
      });

      /**
       * Handle midi input remove requests when an input wants to be removed.
       */
      $scope.$on('input:midi:disable', function(event, id){
        messageMiddleware.removeInput(id.input);
      });

      /**
       * Handle midi input remove requests when an input wants to be removed.
       */
      $scope.$on('input:midi:delete', function(event, id){
        // Tell the messageMiddleware before the input is removed from config.
        if(inputConfig.inputs[id.input].valid){
          messageMiddleware.removeInput(id.input);
        }

        $scope.inputConfig.removeInput(id);
      });

      /**
       * Handle output create events when an input asks to create a new output.
       */
      $scope.$on('output:osc:create', function(event, id){
        // No need to tell the messageMiddleware as it will be notified once the output becomes valid.
        $scope.inputConfig.addOutput(id);
      });

      /**
       * Add an OSC output to the message middleware.
       * @param id The id of the input to add to.
       */
      $scope.addOSCOutput = function(id){
        var output;

        // If the output's parent input is valid, tell the messageMiddleware.
        if($scope.inputConfig.inputs[id.input].valid){
          output = $scope.inputConfig.inputs[id.input].outputs[id.output];
          messageMiddleware.setOSCOutput(id.input, id.output, output.host.id, output.path, output.parameters);
        }
      };

      /**
       * Handle output add events when an output becomes valid.
       */
      $scope.$on('output:osc:add', function(event, id){
        $scope.addOSCOutput(id);
      });

      /**
       * Handle output update events when an output is modified.
       */
      $scope.$on('output:osc:update', function(event, id){
        var output;

        if($scope.inputConfig.inputs[id.input].valid){
          output = $scope.inputConfig.inputs[id.input].outputs[id.output];

          messageMiddleware.updateOSCOutput(
            id.input, id.output,
            output.host.id, output.path, output.parameters);
        }
      });

      /**
       * Handle output disable events when the output is disabled (invalidated).
       */
      $scope.$on('output:osc:disable', function(event, id){
        var output;

        if($scope.inputConfig.inputs[id.input].valid){
          output = $scope.inputConfig.inputs[id.input].outputs[id.output];

          messageMiddleware.removeOSCOutput(id.input, id.output);
        }
      });

      /**
       * Handle osc output remove events when an output asks to be removed.
       */
      $scope.$on('output:osc:remove', function(event, id){
        if($scope.inputConfig.inputs[id.input].valid){
          // Remove from the messageMiddleware before removing it from config.
          messageMiddleware.removeOSCOutput(id.input, id.output);
        }

        $scope.inputConfig.removeOutput(id);
      });
    }
  };
});
