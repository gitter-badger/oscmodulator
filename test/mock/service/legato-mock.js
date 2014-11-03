'use strict';

angular.module('oscmodulatorApp').config(function ($provide) {
  $provide.factory('legato', function ($log, _) {
    var legato = window.router,
      utils = window.utils,
      inputs = window.inputs = {},
      inputsCreated = 0;

    // Configure dependencies.
    utils.inject(_);
    legato.inject(utils);

    // Stores all of the output messages that have been sent.
    legato.messages = [];

    // Mock the midi interface.
    legato.midi = {
      inputs: ['USB Trigger Finger', 'Rig Kontrol'],
      ins: function () {
        $log.info('MOCK legato.midi.ins called');
        return legato.midi.inputs;
      },
      outs: function () {
      },
      In: function () {
        $log.info('MOCK legato.midi.In called');
        return function (messageRouter) {
          var makeClosure = function(id){
            return function () {
              $log.info('MOCK closing midi port.');
              delete inputs['/' + id];
            }
          };

          inputsCreated++;
          inputs['/' + inputsCreated] = messageRouter;

          return makeClosure(inputsCreated);
        }
      },
      Out: function () {
      }
    };

    // Mock the OSC interface.
    legato.osc = {
      In: function () {
      },
      Out: function () {
        $log.info('MOCK legato.osc.Out called');
        return function (path, parameters) {
          $log.info('MOCK legato.osc.Out sending OSC message to ' + path);
          legato.messages.push({
            path:path,
            parameters:parameters
          });
        };
      }
    };

    // TODO Do we want to place this on legato or is there a better place for it?
    legato.receiveMidi = function (input, path, value) {
      if (inputs[input]) {
        inputs[input](path, value);
      }
      else {
        $log.error('MOCK input ' + input + ' could not be found on window.inputs.');
      }
    };

    return legato;
  });
});
