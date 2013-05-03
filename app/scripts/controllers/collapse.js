'use strict';

angular.module('oscmodulatorApp')
  .controller('CollapseCtrl', function ($scope) {
    $scope.isCollapsed = false;
    $scope.toggleCollapsed = function() {
      this.isCollapsed = !this.isCollapsed;
    };
  });
