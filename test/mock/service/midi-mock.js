'use strict';

angular.module('oscmodulatorApp').config(function($provide){
  $provide.factory('midi', function ($rootScope) {
    return {
      connect: function() {
        console.log('MOCK midi service called.');
        $rootScope.$broadcast('midi:activity');
      }
    };
  });
});
