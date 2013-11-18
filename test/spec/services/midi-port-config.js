'use strict';

describe('Service: MidiPortConfig', function () {

  // load the service's module
  beforeEach(module('oscmodulatorApp'));

  // instantiate service
  var midiPortConfig;
  beforeEach(inject(function (_midiPortConfig_) {
    midiPortConfig = _midiPortConfig_;
  }));

  it('should do something', function () {
    expect(!!midiPortConfig).toBe(true);
  });

});
