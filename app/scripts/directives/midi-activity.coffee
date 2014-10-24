'use strict'
angular.module('oscmodulatorApp').directive 'midiActivity', ($timeout, legato) ->
  TIMEOUT_DELAY = 100 #milliseconds

  templateUrl: 'views/midi-activity.html'
  restrict: 'A'
  replace: true
  scope: {}
  link: ($scope, $el) ->
    $scope.midiActivity = false
    promise = null
    legato.on '/:/:/:/:', ->
      console.log @path + ' - ' + @val
      $scope.midiActivity = true
      $timeout.cancel promise if promise
      promise = $timeout ->
        $scope.midiActivity = false
        promise = null
      ,
        TIMEOUT_DELAY
