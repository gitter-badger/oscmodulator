'use strict';

angular.module('oscmodulatorApp').config(function($provide){
  $provide.factory('legato', function ($log) {
    var inputsCreated = 0,
      routesCreated = 0;

    return {
      init: function() {
        $log.info('MOCK legato.init called.');
      },
      in: function(){
        $log.info('MOCK legato.in called.');
        return ++routesCreated;
      },
      removeInput: function(){
        $log.info('MOCK legato.removeInput called.');
      },
      removeRoute: function(){
        $log.info('MOCK legato.removeRoute called.');
      },
      midi:{
        In: function(){
          $log.info('MOCK legato.midi.In called');
          return ++inputsCreated;
        },
        ins: function(){
          $log.info('MOCK legato.midi.ins called');
          return ['USB Trigger Finger', 'Rig Kontrol'];
        },
        outs: function(){
          $log.info('MOCK legato.midi.outs called');
          return ['USB Trigger Finger', 'Rig Kontrol'];
        }
      }
    };
  });
});
