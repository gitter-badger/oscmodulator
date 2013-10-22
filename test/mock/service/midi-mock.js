'use strict';

angular.module('oscmodulatorApp').config(function($provide){
  $provide.factory('midi', function () {
    return {
      start: function() {
        console.log('MOCK midi service called.');
      }
    };
  });
});
