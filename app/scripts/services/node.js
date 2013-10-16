'use strict';

angular.module('oscmodulatorApp').factory('node', function () {
  return {
    require: function(module) {
      if (typeof require !== 'function') {
        return;
      }
      return require(module);
    }
  };
});
