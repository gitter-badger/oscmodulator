'use strict';

angular.module('oscmodulatorApp').factory('midi', function($rootScope, legato) {

  var L = legato;

  return {
    connect: function() {
      console.log('real midi service called.');

      L['in']('/midi1', L.midi.In('0', true));

//      L.on('/midi1/:/note/62', function() {
//        return console.log(this.path + ' - ' + this.val);
//      });

//      L.on('/midi1/:/note/:', function() {
//        return console.log(this.path + ' - ' + this.val);
//      });

//      L.on('/midi1/:/:/:', function() {
//        return console.log(this.path + ' - ' + this.val);
////        return console.log(this.path, this.val);
//      });

      L.on('/:/:/:/:', function() {
        $rootScope.$broadcast('midi:activity');
        console.log(this.path + ' - ' + this.val);
      });
    },

    on: function(path/*, callback*/){
      // TODO How should we execute the callback? callback.apply()?
      L.on(path, function(){
        console.log('Midi.on callback should be executed!');
      });
    }
  };

});
