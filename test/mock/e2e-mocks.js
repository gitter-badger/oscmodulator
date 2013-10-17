'use strict';

angular.module('e2e-mocks', ['ngMockE2E']).value('midi', {
  start : function(){
    console.log('mock midi class called.');
    debugger;
  }
});

angular.module('oscmodulatorApp', []).requires.push('e2e-mocks');