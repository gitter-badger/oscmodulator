/**
 * jq service
 * Allows injecting of jQuery so that the application does not
 * access the global jQuery (or $) object so it can be replaced
 * if necessary.
 */
angular.module('oscmodulatorApp').factory('jq', function() {
  'use strict';
  return window.jQuery;
});
