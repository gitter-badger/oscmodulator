'use strict';

angular.module('oscmodulatorApp').directive('midiInput', function () {
  return {
    templateUrl : 'views/midi-input.html',
    restrict : 'A',
    replace : true,
    scope : {
      config : '=midiInputConfig',
      id : '@id'
    },
    controller : function midiInputCtrl(/*$scope, $element, $attrs*/) {
    },
    link : function postLink(scope, element /*, attrs, controllers*/) {
      // TODO Validate the config object on the scope.

//      var nestedSortableCtrl = controllers[0];
      var jqElement = angular.element(element);
      var selectors = {
        // The selector used to find the collapse/expand button of a Midi Input.
        collapseButtonSelector : '.collapseButton',
        // The selector used to find the midi input header area.
        headerSelector : '.midiInputHeader',
        // The selector used to find the collapsible area that contains osc output configurations.
        oscCollapsorSelector : '.oscCollapsor',
        // The icon class used to show the expanded state of the Midi Input.
        collapsedIconClass : 'icon-chevron-right',
        // The icon class used to show the collapsed state of the Midi Input.
        expandedIconClass : 'icon-chevron-down',
        // The selector used to find the collapse/expand icon inside the collapse button.
        collapseIconSelector : '.collapseButton i'
      };
      var vCollapseTarget = selectors.headerSelector + ' ' + selectors.collapseButtonSelector;
      var vCollapseButton = jqElement.find(vCollapseTarget);
      //var vCollapseButtonIcon = jqElement.find(selectors.collapseIconSelector);

      var vId = scope.config.id;
      var vTargetSelector = '#' + vId + ' ' + selectors.oscCollapsorSelector;

      // Set the container that will collapse.
      vCollapseButton.attr('data-target', vTargetSelector);
    }
  };
});
