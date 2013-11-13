angular.module('oscmodulatorApp').factory('node', function () {
  'use strict';

  var isNodeEnvironment = false;
  if (typeof require === 'function') {
    isNodeEnvironment = true;
    // Enables support for .coffee files in node modules
    require('coffee-script');
  }

  return {
    require: function(module) {
      // tell what happened?
      if (isNodeEnvironment) {
        return require(module);
      }
    }
  };
});
