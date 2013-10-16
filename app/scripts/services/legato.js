'use strict';

angular.module('oscmodulatorApp').factory('legato', function (node) {
  var legato = node.require('legato');
  //TODO figure out service mocks for e2e
  if (legato) {
    legato.init();
  }
  return legato;
});
