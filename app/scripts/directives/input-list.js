/**
 * The inputList directive provides the HTML for the list of inputs.
 *
 * @internal This directive is intended to simplify the main.html file by moving the list code into a template. If we
 * feel this is unnecessary, we can put the html directly in the main.html file.
 */
angular.module('oscmodulatorApp').directive('inputList', function (){
  'use strict';

  return {
    templateUrl: 'views/input-list.html',
    restrict: 'A',
    replace: true,
    scope: true,
    controller: function($scope, inputConfig){
      // Expose the inputConfig on the scope so it can be accessed by the DOM.
      $scope.inputConfig = inputConfig;
    }
  };
});
