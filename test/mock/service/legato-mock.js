'use strict';

angular.module('oscmodulatorApp').config(function($provide){
  $provide.factory('legato', function ($log) {
    var inputsCreated = 0,
      routesCreated = 0,
      paths = {},
      legato;

    legato = {
      init: function() {
        $log.info('MOCK legato.init called.');
      },
      in: function(){
        $log.info('MOCK legato.in called.');
        ++inputsCreated;
        return '/' + inputsCreated;
      },
      on: function(path, callback){
        $log.info('MOCK legato.on called.');
        paths[path] = {};
        paths[path].callback = callback;
        return ++routesCreated;
      },
      sendMidi: function(path, value){
        $log.info('MOCK Midi sending ' + value + ' to ' + path);
        if(!paths[path]){
          $log.warn('MOCK legato could not find path ' + path);
        }
        else {
          paths[path].callback();
        }
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

    // Make the send function accessible to automated tests.
    window.sendMidi = legato.sendMidi;

    return legato;
  });
});
