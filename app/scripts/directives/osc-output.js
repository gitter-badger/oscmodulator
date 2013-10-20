angular.module('oscmodulatorApp')
  .directive('oscOutput', function () {
    'use strict';

    return {
      templateUrl: 'views/osc-output.html',
      restrict: 'A',
      replace: true,
      scope: {
        config: '=oscOutputConfig',
        hosts: '=oscHosts',
        removeOSCOutput: '&remove'
      },
      controller: function oscOutputCtrl($scope/*, $element, $attrs*/){
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
         * Add an empty parameter to the list of OSC parameters.
         */
        $scope.addOSCParameter = function(){
          $scope.config.parameters.push({value:null});
        };
        /**
         * Remove a parameter from the list of OSC parameters.
         * @param index The index of the parameter to remove.
         */
        $scope.removeOSCParameter = function(index){
          $scope.config.parameters.splice(index, 1);
        };
      },
      link: function postLink(/*scope, element, attrs*/) {
      }
    };
  });
