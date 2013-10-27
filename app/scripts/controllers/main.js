/**
 * The main controller is used to bootstrap our application and handle top level application control.
 */
angular.module('oscmodulatorApp').controller('MainCtrl', function ($scope, backend) {
  'use strict';

  // The list of inputs to configure the application with. This should come from external
  // configuration or default to an empty state. This object will be kept in sync with the
  // UI and will be used as the configuration for midi and osc services.
  // Each input has the following structure:
  //    {
  //      name: null,
  //      collapsed: false,
  //      mute: false,
  //      solo: false,
  //      midi: {
  //        note: null,
  //        type: null
  //      },
  //      osc: [{
  //        host: null,
  //        path: null,
  //        parameters: []
  //      }]
  //    }
  // TODO Since we're no longer going to $watch the inputs list for changes, should we remove the two way binding?
  $scope.inputs = [];

  // The list of oscHosts that the application can send messages to.
  // This list is nested in an object so we can watch the osc list for changes.
  // TODO Should move the OSC Host logic into a directive.
  // TODO Need to handle the case that a host is selected at the OSC output level and that host is removed from config.
  $scope.hosts = [];

  // Need to store the host ids as a separate list so that midi-input select element handles defaults correctly.
  // This list will be passed to the midi inputs so they know how to populate the available hosts.
  $scope.hostIds = [];

  // Keep the $scope.hosts list in sync with the oscHosts list.
  $scope.$watch('hosts', function(){
    var j;

    if($scope.hosts.length === 1 && !$scope.hosts[0].name ){
      $scope.hostIds = [];
    }
    else{
      $scope.hostIds = [];
      for(j = 0; j < $scope.hosts.length; j++){
        if($scope.hosts[j].name){
          $scope.hostIds.push($scope.hosts[j].name);
        }
      }
    }
  }, true);

  // Shows and hides the OSC Config panel.
  $scope.hideOSCPanel = true;

  /**
   * Change the open/closed state of the OSC Hosts panel.
   */
  $scope.toggleOSCPanel = function(){
    $scope.hideOSCPanel = !$scope.hideOSCPanel;
  };

  /**
   * Broadcast a request to add an input to the list of inputs.
   * We could modify the input list directly but the input-list object
   * has specific initialization that we wish to call.
   */
  $scope.addMidiInput = function(){
    $scope.$broadcast('create:input');
  };

  /**
   * Add an empty OSC Host configuration to the list of hosts.
   */
  $scope.addOSCHost = function(){
    $scope.hosts.push({name:null, address:null, port:null});
  };

  /**
   * TODO Should the OSC Host configuration be in its own directive?
   * Remove the OSC Host configuration at the specified index.
   * @param index
   */
  $scope.removeOSCHost = function(index){
    var removed = $scope.hosts.splice(index, 1);

    if($scope.hosts.length === 0){
      $scope.addOSCHost();
    }

    $scope.$broadcast('remove:oscHost', removed[0].name);
  };

  // Initialize the OSC Host list.
  $scope.addOSCHost();

  // Initialize the backend service.
  backend.init();
});
