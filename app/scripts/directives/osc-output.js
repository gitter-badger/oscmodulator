/**
 * The osc-output directive creates a single OSC output in the DOM and manages communciation with the backend service.
 */
angular.module('oscmodulatorApp').directive('oscOutput', function () {
    'use strict';

    return {
      templateUrl: 'views/osc-output.html',
      restrict: 'A',
      replace: true,
      scope: {
        config: '=oscOutputConfig'
      },
      controller: function($scope, oscHostConfig){
        var i, eventNames;

        // The event names broadcast by this class.
        eventNames = {
          add: 'output:osc:add',
          update: 'output:osc:update',
          remove: 'output:osc:remove',
          disable: 'output:osc:disable'
        };

        /**
         * Expose the host config so that the DOM can call it directly.
         * @type {oscHostConfig}
         */
        $scope.hosts = oscHostConfig;

        /**
         * The list of parameter objects displayed in the form. This is separated from the
         * config.parameters property so we can keep invalid parameters from getting into the config.
         * @type {Array} Each element is an object structured as {value:'blah'}.
         */
        $scope.parameterInputs = [];

        // Synch the parameterInputs list with any parameters passed in.
        for(i = 0; i < $scope.config.parameters.length; i++){
          $scope.parameterInputs.push({
            value:$scope.config.parameters[i]
          });
        }

        /**
         * Broadcast a remove event when it's time to remove this output.
         */
        $scope.removeMe = function(){
          $scope.$emit(eventNames.remove, $scope.config.id);
        };

        /**
         * Add an empty parameter to the list of OSC parameters. The messageMiddleware service will not be updated
         * until the parameter becomes valid.
         */
        $scope.addOSCParameter = function(){
          $scope.parameterInputs.push({value:null});
          $scope.parametersChanged();
        };

        /**
         * Remove a parameter from the list of OSC parameters.
         * @param index The index of the parameter to remove.
         */
        $scope.removeOSCParameter = function(index){
          $scope.parameterInputs.splice(index, 1);
          $scope.parametersChanged();
        };

        /**
         * Update the config.parameters list with all of the valid input element values.
         */
        $scope.parametersChanged = function(){
          var i;

          // Filter out empty inputs.
          $scope.config.parameters = [];
          for(i = 0; i < $scope.parameterInputs.length; i++){
            if($scope.parameterInputs[i].value){
              $scope.config.parameters.push($scope.parameterInputs[i].value);
            }
          }
        };

        /**
         * If the parameter list changes, send an update event.
         */
        $scope.$watch('config.parameters', function(newValue, oldValue){
          // Ignore initialization.
          if(newValue !== oldValue){
            $scope.$emit(eventNames.update, $scope.config.id);
          }
        }, true);

        /**
         * Watch changes to the osc path and pass those changes to the messageMiddleware service.
         * Only when the path is valid and this output already exists on the messageMiddleware will the messageMiddleware be notified.
         */
        $scope.$watch('config.path', function(newValue, oldValue){
          // Ignore initialization
          if(newValue !== oldValue){
            $scope.save();
          }
        });

        /**
         * Watch changes to the osc host and pass those to the messageMiddleware service.
         * Only when the path is valid and this output already exists on the messageMiddleware will the messageMiddleware be notified.
         */
        $scope.$watch('config.host', function(newValue, oldValue){
          // Ignore initialization.
          if(newValue !== oldValue){
            $scope.save();
          }
        });

        /**
         * Determine if the output is valid and can send OSC messages. This method will update
         * the valid property on the scope and emit an event.
         */
        $scope.save = function(){
          if($scope.config.path && $scope.config.host){
            // If it just became valid, emit an add event.
            if(!$scope.config.valid){
              $scope.config.valid = true;
              $scope.$emit(eventNames.add, $scope.config.id);
            }
            // If it was previously valid, emit an update event.
            else{
              $scope.config.valid = true;
              $scope.$emit(eventNames.update, $scope.config.id);
            }
          }
          // If the scope was previously valid and just became invalid, emit an update event.
          else if($scope.config.valid){
            $scope.config.valid = false;
            $scope.$emit(eventNames.disable, $scope.config.id);
          }

          return $scope.config.valid;
        };

        /**
         * Listen to remove events in order to make sure this output's host is nullified if its osc host is removed
         * from the config. Unfortunately, Angular will not take care of this for us automatically.
         */
        $scope.$on('oscHostConfig:remove', function(event, id){
          if(id === $scope.config.host.name){
            $scope.config.host = null;
            $scope.save();
          }
        });

        // Initialize the output state.
        $scope.save();
      }
    };
  });
