'use strict';

angular.module('oscmodulatorApp').config(function($provide){
  $provide.factory('midi', function ($rootScope, $log) {
    return {
      connect: function() {
        $log.info('MOCK midi service called.');
      }
    };
  });
});
