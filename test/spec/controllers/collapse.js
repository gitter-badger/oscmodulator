'use strict';

describe('Controller: CollapseCtrl', function () {

  // load the controller's module
  beforeEach(module('oscmodulatorApp'));

  var CollapseCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller) {
    scope = {};
    CollapseCtrl = $controller('CollapseCtrl', {
      $scope: scope
    });
  }));
});
