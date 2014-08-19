angular.module('oscmodulatorApp')
  .directive('mockDebugPanel', function () {
    'use strict';

    return {
      templateUrl: 'mock/views/mock-debug-panel.html',
      restrict: 'A',
      replace: true,
      scope: true,
//      link: function postLink(scope, element, attrs) {
//      },
      controller: function($scope, legato){
        $scope.fakeMidiEvent = legato.receiveMidi;
      }
    };
  });
