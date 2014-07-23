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
        ++inputsCreated;
        return '/' + inputsCreated;
      },
      on: function(){
        $log.info('MOCK legato.on called.');
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
        },
        ins: function(){
          $log.info('MOCK legato.midi.ins called');
          return ['USB Trigger Finger', 'Rig Kontrol'];
        },
        outs: function(){
          $log.info('MOCK legato.midi.outs called');
          return ['USB Trigger Finger', 'Rig Kontrol'];
        }
      },
      osc:{
        In: function(){
          $log.info('MOCK legato.osc.In called');
        },
        Out: function(){
          $log.info('MOCK legato.osc.Out called');
          return function(){};
        }
      }
    };
  });
});
