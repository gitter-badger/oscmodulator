'use strict';

angular.module('oscmodulatorApp').directive('nestedSortable', function () {
  return {
    templateUrl : 'views/nested-sortable.html',
    restrict : 'A',
    replace : true,
    //require:"^MainCtrl",
    controller : function nestedSortableCtrl($scope, $element, $attrs) {
      var jqElement = $($element);
      var templates = {
        // The template used to create a new midi input.
        midiInput : "<div x-midi-input id='midi-input-1'></div>",
        // The template used to create a new leaf node in the Nested Sortable.
        leafNode : "<li class='leaf'>"
      };
      // TODO Should this model be on the nested sortable scope, passed through the HTML
      // or stored on the MainCtrl?
      $scope.midiInputs = [
        {
          id : 'midi-input-1',
          name : 'Button 1',
          type : 'midi-to-osc',
          mute : false,
          solo : false,
          midi : {
            note : 'c1',
            type : 'on'
          },
          osc : {
            host : "live",
            path : "/osc/server/path",
            parameters : [
              10, "foo"
            ]
          }
        }
      ];

      /**
       * Create a new Midi Input.
       * @param props {Object} The configuration object defining the properties of the new MidiInput.
       */
      var createMidiInput = function (props) {
        jqElement.append($(templates.leafNode)).attr("id", props.id).append($(templates.midiInput));
      };

      /**
       * Create a new Input Group.
       */
      var createInputGroup = function () {

      };

      /**
       * Return the Nested Sortable DOM information as a string.
       * @return {String}
       */
      var serializeSortable = function () {
        return jqElement.nestedSortable('serialize');
      };

      /**
       * Return the Nested Sortable DOM information as an object.
       * @return {Object}
       */
      var sortableToHierarchy = function () {
        return jqElement.nestedSortable('toHierarchy', {startDepthCount : 0});
      };

      /**
       * Return the Nested Sortable DOM information as an array.
       * @return {Array}
       */
      var sortableToArray = function () {
        return jqElement.nestedSortable('toArray', {startDepthCount : 0});
      };

      // Public API for this controller.
      return {
        createMidiInput : createMidiInput,
        createInputGroup : createInputGroup
      };
    },
    link : function postLink(scope, element, attrs, controllers) {
      var jqElement = $(element);
      var nestedSortableCtrl = controllers;

      // Initialize the Nested Sortable functionality.
      jqElement.nestedSortable({
          forcePlaceholderSize : true,
          handle : 'div',
          helper : 'clone',
          items : 'li',
          opacity : 0.6,
          placeholder : 'placeholder',
          revert : 50,
          tabSize : 25,
          tolerance : 'pointer',
          //toleranceElement:'div',
          maxLevels : 3,
          isTree : true,
          expandOnHover : 700,
          startCollapsed : true,
          branchClass : "branch",
          collapsedClass : 'collapsed',
          disableNestingClass : 'no-nesting',
          errorClass : "error",
          expandedClass : 'expanded',
          hoveringClass : 'hovering',
          leafClass : 'leaf'
        });
    }
  };
});
