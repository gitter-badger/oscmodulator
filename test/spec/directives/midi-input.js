'use strict';

describe('Directive: midiInput', function () {
  var element, scope; //, compiledView;

  beforeEach(module('oscmodulatorApp'));
  beforeEach(module('views/midi-input.html'));

  beforeEach(inject(function ($rootScope, $compile /*, $templateCache*/) {
    // Create a DOM fragment to turn into a directive instance.
    element = angular.element(
      '<div data-midi-input id="{{input.id}}" data-midi-input-config="input" data-osc-hosts="hosts">' +
        '<select></select>' +
      '</div>'
    );

    // Create a fresh scope for this test.
    scope = $rootScope.$new();
    scope.inputs = [
      {
        id : 'midi-input-1',
        name : 'Button 1',
        type : 'midi-to-osc',
        collapsed : false,
        mute : false,
        solo : false,
        midi : {
          note : 'c1',
          type : 'on'
        },
        osc : {
          host : null,
          path : '/osc/server/path',
          parameters : [
            10,
            'foo'
          ]
        }
      }
    ];

    scope.hosts = [
      {
        name : 'Live',
        port : 9000
      },
      {
        name : 'Resolume',
        port : 9001
      }
    ];

    $compile(element)(scope);

    // Compile the DOM fragment into an Angular view.
//    compiledView = $compile(element);
//
//    // Instantiate the Angular view with our test scope.
//    compiledView(scope);

    // Start the Angular digest cycle.
    scope.$digest();
  }));

  it('Should have a select object for setting the OSC Hosts.', function() {
//    expect(element.find("select").length).toBeGreaterThan(0);
  });
});
