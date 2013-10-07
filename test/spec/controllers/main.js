describe('Controller: MainCtrl', function () {
  'use strict';
//  var element, template, parentScope, isolatedScope;

  // load the controller's module
  beforeEach(module('oscmodulatorApp'));
  beforeEach(module('views/input-list.html'));
  beforeEach(module('views/midi-input.html'));
  beforeEach(module('views/osc-output.html'));

//  beforeEach(inject(function($rootScope, $controller) {
//    scope = $rootScope.$new();
//    var ctrl = $controller(myController, {$scope: scope});
//  }));

//  // Initialize the controller and a mock scope
//  beforeEach(inject(function($rootScope) {
//    template = angular.element('<div class="header">' +
//      '<button class="btn" ng-click="addMidiInput()">' +
//      '<icon class="icon-plus"></icon> Midi Input</button>' +
//      '</div>' +
//      '<div data-input-list data-inputs="inputs"></div>');
//
//    parentScope = $rootScope.$new();
//
//    parentScope.items = [
//      {
//        name: 'Button 1',
//        collapsed: false,
//        mute: false,
//        solo: false,
//        midi: {
//          note: 'c1',
//          type: 'on'
//        },
//        osc: [{
//          host: 'Live',
//          path: '/osc/server/path',
//          parameters: [
//            {value:10},
//            {value:'foo'}
//          ]
//        }]
//      }
//    ];
//  }));
//
//  it('should be possible to add new inputs.', inject(function($compile) {
//    // Compile the DOM into an Angular view using using our test scope.
//    element = $compile(template)(parentScope);
//    isolatedScope = element.scope();
//    isolatedScope.$apply();
//
//    expect(isolatedScope.inputs.length).toBe(1);
//
//    parentScope.addMidiInput();
//    parentScope.$apply();
//
//    expect(isolatedScope.inputs.length).toBe(2);
//  }));
});
