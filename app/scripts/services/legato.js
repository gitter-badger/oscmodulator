'use strict';

angular.module('oscmodulatorApp').factory('legato', function (node) {
  var legato = node.require('legato');
  // TODO Should we throw an exception if legato isn't required correctly (ie. legato is not defined or the expected
  // legato methods don't exist) so we have more explicit information about what went wrong?
  if (legato) {
    legato.init();
  }
  return legato;
});
