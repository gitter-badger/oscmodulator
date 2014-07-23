'use strict';

describe('Service: jq', function () {

  // load the service's module
  beforeEach(module('oscmodulatorApp'));

  it('should return the global jQuery object.', inject(function (jq) {
    expect(!!jq).toBe(true);
    expect(jq.extend).toBeDefined();
  }));

});
