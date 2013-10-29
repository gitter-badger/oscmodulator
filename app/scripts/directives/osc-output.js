angular.module('oscmodulatorApp')
  .directive('oscOutput', function () {
    'use strict';

    return {
      templateUrl: 'views/osc-output.html',
      restrict: 'A',
      replace: true,
      scope: {
        config: '=oscOutputConfig',
        removeOSCOutput: '&remove'
      },
      controller: function($scope, oscHostConfig){
        if(!$scope.config.host){
          $scope.config.host = null;
        }

        if(!$scope.config.path){
          $scope.config.path = null;
        }

        if(!$scope.config.parameters){
          $scope.config.parameters = [];
        }

        // Expose the host config so that the DOM can call it directly.
        $scope.hosts = oscHostConfig;

        /**
         * Add an empty parameter to the list of OSC parameters.
         */
        $scope.addOSCParameter = function(){
          $scope.config.parameters.push({value:null});
          // TODO Notify the backend service that the parameters have changed.
        };
        /**
         * Remove a parameter from the list of OSC parameters.
         * @param index The index of the parameter to remove.
         */
        $scope.removeOSCParameter = function(index){
          $scope.config.parameters.splice(index, 1);
          // TODO Notify the backend service that the parameters have changed.
        };

        // TODO Watch changes to the individual osc parameters and pass those changes to the backend service.
      },
      link: function postLink(scope) {
        /**
         * Listen to remove events in order to make sure this output's host is nullified if its osc host is removed
         * from the config. Unfortunately, Angular will not take care of this for us automatically.
         */
        scope.$on('oscHostConfig:remove', function(event, id){
          if(id === scope.config.host){
            scope.config.host = null;
          }
        });
      }
    };
  });
