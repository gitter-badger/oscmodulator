'use strict';

angular.module('oscmodulatorApp').factory('midi', function () {
  return {
    start: function() {
      console.log('MOCK midi service called.');
    }
  };
});

angular.module('oscmodulatorApp').factory('legato', function (node) {
  return {};
});

// TODO Do we actually need this mock?
angular.module('oscmodulatorApp').factory('node', function (node) {
  return {
    require : function(){
      return {};
    }
  };
});

//debugger;
//angular.module('e2e-mocks', ['oscmodulatorApp']).config(function(){
//  debugger;
//  angular.module('oscmodulatorApp').factory('midi', function () {
//    return {
//      start: function() {
//        console.log('MOCK midi service called.');
//      }
//    };
//  });
//
//  angular.module('oscmodulatorApp').factory('legato', function (node) {
//    return {};
//  });
//
//  // TODO Do we actually need this mock?
//  angular.module('oscmodulatorApp').factory('node', function (node) {
//    return {
//      require : function(){
//        return {};
//      }
//    };
//  });
//});

//debugger;
//angular.module('oscmodulatorApp').requires.push('e2e-mocks');