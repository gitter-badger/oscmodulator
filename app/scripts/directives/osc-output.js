/**
 * The osc-output directive creates a single OSC output in the DOM and manages communciation with the backend service.
 * TODO Should communication with the backend be moved into the midi-input directive? This would resolve issues
 * where the output becomes valid and tells the backend service about it before the input becomes valid. If we don't
 * move that communication down, then the backend service can inspect the midi config to see if it's valid.
 */
angular.module('oscmodulatorApp').directive('oscOutput', function () {
    'use strict';

    return {
      templateUrl: 'views/osc-output.html',
      restrict: 'A',
      replace: true,
      scope: {
        config: '=oscOutputConfig',
        removeOSCOutput: '&remove'
      },
      controller: function($scope, oscHostConfig, backend){
        if(!$scope.config.host){
          $scope.config.host = null;
        }

        if(!$scope.config.path){
          $scope.config.path = null;
        }

        if(!$scope.config.parameters){
          $scope.config.parameters = [];
        }

        /**
         * True = This output has enough information to send messages.
         * False = This output is missing required information for sending messages.
         * @type {boolean}
         */
        $scope.valid = false;

        /**
         * Expose the host config so that the DOM can call it directly.
         * @type {oscHostConfig}
         */
        $scope.hosts = oscHostConfig;

        /**
         * Add an empty parameter to the list of OSC parameters. The backend service will not be updated
         * until the parameter becomes valid.
         *
         * @internal The backend service will be updated by the watch expression.
         */
        $scope.addOSCParameter = function(){
          $scope.config.parameters.push({value:null});
        };

        /**
         * Remove a parameter from the list of OSC parameters.
         * @param index The index of the parameter to remove.
         *
         * @internal The backend service will be updated by the watch expression.
         */
        $scope.removeOSCParameter = function(index){
          $scope.config.parameters.splice(index, 1);
        };

        /**
         * Watch changes to the osc path and pass those changes to the backend service.
         * Only when the path is valid and this output already exists on the backend will the backend be notified.
         */
        $scope.$watch('config.path', function(newValue){
          // Reset the path if it was previously valid and is still valid. Otherwise, the isValid call will
          // add the output to the backend for us.
          var wasValid = $scope.valid;
          if($scope.isValid()){
            if(wasValid){
              // TODO Should we replace this level of backend management with just setOSCOutput calls?
              backend.setOSCPath($scope.config.id, newValue);
            }
          }
        });

        /**
         * Watch changes to the osc host and pass those to the backend service.
         * Only when the path is valid and this output already exists on the backend will the backend be notified.
         */
        $scope.$watch('config.host', function(newValue){
          // Reset the path if it was previously valid and is still valid. Otherwise, the isValid call will
          // add the output to the backend for us.
          var wasValid = $scope.valid;
          if($scope.isValid()){
            if(wasValid){
              // TODO Should we replace this level of backend management with just setOSCOutput calls?
              backend.setOSCHost($scope.config.id, newValue);
            }
          }
        });

        /**
         * Watch changes to the individual osc parameters and pass those changes to the backend service.
         * Only parameters that are non-Null will be sent to the backend service.
         */
        $scope.$watch('config.parameters', function(newValue, oldValue){
          var newParams, oldParams, n, validParameters, paramsChanged;

          // Get the list of valid parameters as an array of values (not objects).
          validParameters = function(inList){
            var outList, i;
            outList = [];

            for(i = 0; i < inList.length; i++){
              if(inList[i].value){
                outList.push(inList[i].value);
              }
            }

            return outList;
          };

          newParams = validParameters(newValue);
          oldParams = validParameters(oldValue);

          // Make sure that only the valid parameters are passed through so the backend doesn't need to worry about
          // filtering incomplete parameter objects.
          paramsChanged = false;
          for(n = 0; n < newParams.length; n++){
            if(newParams[n] !== oldParams[n]){
              paramsChanged = true;
              break;
            }
          }

          if(paramsChanged && $scope.valid){
            backend.setOSCParameters($scope.config.id, newParams);
          }
        }, true);

        /**
         * Determine if the output is valid and can send OSC messages. This method will update
         * the valid property on the scope.
         */
        $scope.isValid = function(){
          if($scope.config.path && $scope.config.host){
            if(!$scope.valid){
              $scope.valid = true;
              backend.setOSCOutput($scope.config);
            }
          }
          else if($scope.valid){
            backend.removeOSCOutput($scope.config.id);
            $scope.valid = false;
          }

          return $scope.valid;
        };

        /**
         * Listen to remove events in order to make sure this output's host is nullified if its osc host is removed
         * from the config. Unfortunately, Angular will not take care of this for us automatically.
         */
        $scope.$on('oscHostConfig:remove', function(event, id){
          if(id === $scope.config.host){
            $scope.config.host = null;
            $scope.isValid();
          }
        });
      }
    };
  });
