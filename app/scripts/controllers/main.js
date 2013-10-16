'use strict';

angular.module('oscmodulatorApp').controller('MainCtrl',
  function ($scope /*, $document*/, midi) {
    $scope.addMidiInput = function () {
    };

    midi.start();
  }
);


