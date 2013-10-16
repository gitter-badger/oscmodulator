'use strict';

angular.module('oscmodulatorApp').factory('legato', function (node) {
  var legato = node.require('legato');
  if (legato) {
    legato.init();
  }
  return legato;
});
