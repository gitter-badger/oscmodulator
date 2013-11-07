'use strict';

angular.module('oscmodulatorApp').factory('node', function () {

  var isNodeEnvironment = false;
  if (typeof require === 'function') {
    isNodeEnvironment = true;
    // Enables support for .coffee files in node modules
    require('coffee-script');
  }

  return {
    require: function(module) {
      // TODO If we can mock out the node dependencies, do we actually need this case statement?
      // TODO If we keep this statement, should we throw an exception if require doesn't exist so it's easier to
      // tell what happened?
      if (isNodeEnvironment) {
        return require(module);
      }
    }
  };
});
