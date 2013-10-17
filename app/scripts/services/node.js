'use strict';

angular.module('oscmodulatorApp').factory('node', function () {
  return {
    require: function(module) {
      // TODO If we can mock out the node dependencies, do we actually need this case statement?
      // TODO If we keep this statement, should we throw an exception if require doesn't exist so it's easier to
      // tell what happened?
      if (typeof require !== 'function') {
        return;
      }
      return require(module);
    }
  };
});
