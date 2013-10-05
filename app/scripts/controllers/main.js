'use strict';

angular.module('oscmodulatorApp').controller('MainCtrl', ['$scope', '$document', function ($scope /*, $document*/) {
  // The list of inputs to configure the application with. This should come from external
  // configuration or default to an empty state. This object will be kept in sync with the
  // UI and can be used as the configuration for node-webkit.
  $scope.inputs = [
    {
      id: 'midi-input-1',
      name: 'Button 1',
      collapsed: false,
      mute: false,
      solo: false,
      midi: {
        note: 'c1',
        type: 'on'
      },
      osc: [{
        host: 'Live',
        path: '/osc/server/path',
        parameters: [
          {value:10},
          {value:'foo'}
        ]
      }]
    }
  ];

}]);


