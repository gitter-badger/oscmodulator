describe('Controller: MainCtrl', function () {
  'use strict';
  var scope, messageMiddleware;

  // load the controller's module
  beforeEach(module('oscmodulatorApp'));

  beforeEach(inject(function($rootScope, $controller) {
    scope = $rootScope.$new();
    messageMiddleware = {
      init:function(){}
    };

    spyOn(messageMiddleware, 'init');

    $controller('MainCtrl', {$scope: scope, messageMiddleware: messageMiddleware});
  }));

  it('should initialize the messageMiddleware service.', function(){
    expect(messageMiddleware.init).toHaveBeenCalled();
  });

  it('should toggle the OSC Host panel.', function(){
    expect(scope.hideOSCPanel).toBe(true);

    scope.toggleOSCPanel();

    expect(scope.hideOSCPanel).toBe(false);

    scope.toggleOSCPanel();

    expect(scope.hideOSCPanel).toBe(true);
  });
});
