'use strict';

angular.module('oscmodulatorApp').config(function($provide){
  $provide.factory('midi', function () {
    return {
      start: function() {
        console.log('MOCK midi service called.');
      }
    };
  });

  $provide.factory('legato', function (node) {
    return {};
  });

  // TODO Do we actually need this mock?
  $provide.factory('node', function (node) {
    return {
      require : function(){
        return {};
      }
    };
  });
});
