'use strict';

angular.module('oscmodulatorApp').config(function($provide){
  $provide.factory('legato', function ($log) {
    return {
      init: function() {
        $log.info('MOCK legato.init called.');
      }
    };
  });
});
