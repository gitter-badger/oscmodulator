'use strict';

describe('Directive: midiInput', function () {
  var element, rootScope, scope, compiledView;

  beforeEach(module('oscmodulatorApp'));
  beforeEach(module('views/midi-input.html'));

  beforeEach(inject(function ($rootScope, $compile /*, $templateCache*/) {
    // Store the rootScope so we can run digests from within our tests.
    rootScope = $rootScope;

    // Create a DOM fragment to turn into a directive instance.
    element = angular.element(
      '<div data-midi-input id="{{input.id}}" data-midi-input-config="input" data-osc-hosts="hosts">' +
        '<select></select>' +
      '</div>'
    );

    // Create a fresh scope for this test.
    scope = $rootScope.$new();
    scope.config = {
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
    };

    scope.hosts = [];

//    $compile(element)(scope);

    // Compile the DOM fragment into an Angular view.
    compiledView = $compile(element);

    // Instantiate the Angular view with our test scope.
    compiledView(scope);

    // Start the Angular digest cycle from the root scope.
    $rootScope.$digest();
  }));

  it('Should have an unconfigured select object for setting the OSC Hosts.', function() {
    var selectElement = element.find('select.oscHost');

    // There should be a select object.
    expect(selectElement.length).toEqual(1);
    // With one option.
    expect(selectElement.find('option').length).toEqual(1);
    // That is unconfigured.
    expect(selectElement.find('option').attr('value')).toBe('?');
  });

  it('Should be configurable through the hosts property on its scope but should not set a default.', function () {
    // Configure the scope.
    scope.hosts = [
      {
        name : 'host 1',
        port : 1
      },
      {
        name : 'host 2',
        port : 2
      },
      {
        name : 'host 3',
        port : 3
      }
    ];
    rootScope.$digest();

    // Should have the 3 options set in the scope and an empty option.
    expect(element.find('select.oscHost option').length).toEqual(4);
  });

  // TODO For some reason, the configuration is not read from the scope during instantiation.
//  it('should be possible to set the default host through config.', function () {
//    // Configure the scope.
//    scope.hosts = [
//      {
//        name : 'host 1',
//        port : 1
//      },
//      {
//        name : 'host 2',
//        port : 2
//      },
//      {
//        name : 'host 3',
//        port : 3
//      }
//    ];
//    // Configure the default host.
//    scope.config.osc.host = {name : 'host 2', port : 3};
//
//    rootScope.$digest();
//
//    // Should only have the 3 options specified in the scope.
//    expect(element.find('select.oscHost option').length).toEqual(3);
//  });
});
