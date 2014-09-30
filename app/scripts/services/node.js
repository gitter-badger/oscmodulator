angular.module('oscmodulatorApp').factory('node', function () {
  'use strict';

  var isNodeEnvironment = false;
  if (typeof require === 'function') {
    isNodeEnvironment = true;
    // Enables support for .coffee files in node modules
    // https://github.com/rogerwang/node-webkit/wiki/about-node.js-server-side-script-in-node-webkit
    require('coffee-script/register');
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
