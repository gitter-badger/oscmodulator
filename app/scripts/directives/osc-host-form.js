/**
 * The OSC Host Config directive is used to present the OSC Host configuration form for the application. It uses the
 * oscHostConfig object to manage the application configuration.
 */
angular.module('oscmodulatorApp').directive('oscHostForm', function () {
  'use strict';

  return {
    templateUrl: 'views/osc-host-form.html',
    restrict: 'A',
    replace: true,
    scope: true,
    controller: function($scope, oscHostConfig){
      // Expose the oscHostConfig on the scope so it can be referenced directly in the DOM.
      $scope.oscHostConfig = oscHostConfig;
    }
  };
});
