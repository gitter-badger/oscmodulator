describe('e2e: midiInputs', function () {
  'use strict';

  describe('on first load', function () {
    beforeEach(function () {
      browser().navigateTo('/');
    });

    it('should start with one midi input.', function () {
      expect(element('div.midiInput').count(), "all treeItems on the page").toEqual(1);
    });

    it('should start out expanded.', function() {
      expect(element('div.oscCollapsor').height()).toBeGreaterThan(1);
      expect(element('i.icon-chevron-down').count()).toBe(1);
    });
  });
});
