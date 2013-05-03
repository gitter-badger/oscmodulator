'use strict';

describe('e2e: midiInputs', function () {
  describe('on first load', function () {
    beforeEach(function () {
      browser().navigateTo('/');
    });

    it('should start with one midi input', function () {
      expect(element('div.treeItem').count(), "all treeItems on the page").toEqual(1);
    });

    it('should be expanded', function() {
      expect(element('div.oscCollapsor').height()).toBeGreaterThan(1);
      expect(element('i.icon-chevron-down').count()).toBe(1);
    });
  });
});
