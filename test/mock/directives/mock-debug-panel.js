angular.module('oscmodulatorApp')
  .directive('mockDebugPanel', function () {
    'use strict';

    return {
      templateUrl: 'mock/views/mock-debug-panel.html',
      restrict: 'A',
      replace: true,
      scope: true,
      controller: function($scope, legato){
				$scope.midi_inputs = '';

        $scope.messages = legato.messages;

        $scope.clearOutput = function(){
          legato.messages.length = 0;
        };

				$scope.setMidiInputs = function(){
					var inputs = [];

					if($scope.midi_inputs !== ''){
						inputs = $scope.midi_inputs.split(',');

						inputs.forEach(function(item){
							item.trim();
						});
					}

					legato.midi.inputs = inputs;
				};

				$scope.fakeMidiEvent = function () {
					if($scope.input_id && $scope.channel && $scope.note_type && $scope.note && $scope.value ){
						var route = [$scope.channel, $scope.note_type, $scope.note].join('/'),
							input = $scope.input_id;

						if(input.indexOf('/') != 0){
							input = '/' + input;
						}

						if(route.indexOf('/') > 0){
							route = '/' + route;
						}

            route = route.toLowerCase();

						legato.receiveMidi(input, route, $scope.value);
					}
					else{
						var errors = [];
						if(!$scope.input_id) errors.push('input id');
						if(!$scope.channel) errors.push('channel');
						if(!$scope.note_type) errors.push('note type');
						if(!$scope.note) errors.push('note');
						if(!$scope.value) errors.push('value');
						console.error('You must configure ' + errors.join(', ') + ' in order to fake midi messages.');
					}
				};
      }
    };
  });
