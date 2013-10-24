'use strict';

angular.module('oscmodulatorApp').factory('midi', function($rootScope, legato) {

  var L = legato;

  return {
    connect: function() {
      console.log('real midi service called.');

      L['in']('/midi1', L.midi.In('0', true));
      L.on('/midi1/:/note/62', function() {
        $rootScope.$broadcast('midi:activity');
        console.log(this.path + ' - ' + this.val);
      });
      L.on('', function() {
        console.log(this.path, this.val);
      });
    }
  };

});
