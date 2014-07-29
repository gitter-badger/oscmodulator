describe('angularjs homepage', function() {
  'use strict';

  var homepage = 'http://localhost:9001';

  beforeEach(function(){
    browser.get(homepage);
  });

  it('should start with one midi input.', function () {
    expect(element.all(by.css('div.midiInput')).count()).toBe(1);
  });
});