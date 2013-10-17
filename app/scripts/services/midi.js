'use strict';

angular.module('oscmodulatorApp').factory('midi', function (legato) {

  var L = legato;

  return {
    start: function() {
      debugger;
      L['in']('/midi1', L.midi.In('0', true));
      L.on('/midi1/:/note/62', function() {
        return console.log(this.path + ' - ' + this.val);
      });
      L.on('', function() {
        return console.log(this.path, this.val);
      });
    }
  };

});
