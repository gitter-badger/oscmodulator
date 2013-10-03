angular.module('oscmodulatorApp')
  .directive('oscOutput', function () {
    'use strict';

    return {
      templateUrl: 'views/osc-output.html',
      restrict: 'A',
      replace: true,
      scope: {
        config: '=oscOutputConfig',
        hosts: '=oscHosts'
      },
      controller: function oscOutputCtrl($scope/*, $element, $attrs*/){

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
