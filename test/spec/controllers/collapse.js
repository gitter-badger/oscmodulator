'use strict';

describe('Controller: CollapseCtrl', function () {

  // load the controller's module
  beforeEach(module('oscmodulatorApp'));

  var CollapseCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller) {
    scope = {};
    CollapseCtrl = $controller('CollapseCtrl', { $scope: scope });
  }));

  it('should be able to toggle the current value of isCollapsed.', function() {
    // Force isCollapsed to true in case the default changes.
    scope.isCollapsed = true;

    scope.toggleCollapsed();
    expect(scope.isCollapsed).toBe(false);
    scope.toggleCollapsed();
    expect(scope.isCollapsed).toBe(true);
  });
});
