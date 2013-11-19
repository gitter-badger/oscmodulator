describe('e2e: OSC Modulator', function () {
  'use strict';

  beforeEach(function () {
    browser().navigateTo('/');
  });

  it('should start with one midi input.', function () {
    expect(element('div.midiInput').count()).toBe(1);
  });

  it('should be possible to add new midi inputs.', function(){
    element('button[name=addInput]').click();
    expect(element('div.midiInput').count()).toBe(2);
  });

  it('should be possible to remove midi inputs', function(){
    element('button[name=removeMidiInput]').click();
    expect(element('div.midiInput').count()).toBe(0);
  });

  it('should start out expanded.', function() {
    expect(element('div.oscCollapsor').height()).toBeGreaterThan(1);
    expect(element('button.collapseButton i.icon-chevron-down').count()).toBe(1);
    expect(element('button.collapseButton i.icon-chevron-right').count()).toBe(0);
  });

  it('should be possible to collapse a midi input.', function(){
    element('button.collapseButton').click();
    expect(element('button.collapseButton i.icon-chevron-right').count()).toBe(1);

    // Give the animation a second to run.
    sleep(0.5);

    expect(element('div.oscCollapsor').height()).toBeLessThan(1);
  });

  it('should be possible to solo an input.', function(){
    expect(element('button[name=solo].active').count()).toBe(0);
    expect(element('button[name=mute].active').count()).toBe(0);
    element('button[name=solo]').click();
    expect(element('button[name=solo].active').count()).toBe(1);
    expect(element('button[name=mute].active').count()).toBe(0);
  });

  it('should be possible to un-solo an input.', function(){
    expect(element('button[name=solo].active').count()).toBe(0);
    expect(element('button[name=mute].active').count()).toBe(0);
    element('button[name=solo]').click();
    expect(element('button[name=solo].active').count()).toBe(1);
    expect(element('button[name=mute].active').count()).toBe(0);
    element('button[name=solo]').click();
    expect(element('button[name=solo].active').count()).toBe(0);
    expect(element('button[name=mute].active').count()).toBe(0);
  });

  it('should disable the mute button if a solo button is pressed.', function(){
    expect(element('button[name=solo].active').count()).toBe(0);
    expect(element('button[name=mute].active').count()).toBe(0);
    element('button[name=mute]').click();
    expect(element('button[name=solo].active').count()).toBe(0);
    expect(element('button[name=mute].active').count()).toBe(1);
    element('button[name=solo]').click();
    expect(element('button[name=solo].active').count()).toBe(1);
    expect(element('button[name=mute].active').count()).toBe(0);
  });

  it('should be possible to mute an input.', function(){
    expect(element('button[name=solo].active').count()).toBe(0);
    expect(element('button[name=mute].active').count()).toBe(0);
    element('button[name=mute]').click();
    expect(element('button[name=solo].active').count()).toBe(0);
    expect(element('button[name=mute].active').count()).toBe(1);
  });

  it('should be possible to un-mute an input.', function(){
    expect(element('button[name=solo].active').count()).toBe(0);
    expect(element('button[name=mute].active').count()).toBe(0);
    element('button[name=mute]').click();
    expect(element('button[name=solo].active').count()).toBe(0);
    expect(element('button[name=mute].active').count()).toBe(1);
    element('button[name=mute]').click();
    expect(element('button[name=solo].active').count()).toBe(0);
    expect(element('button[name=mute].active').count()).toBe(0);
  });

  it('should be un-solo the input when pressing the mute button.', function(){
    expect(element('button[name=solo].active').count()).toBe(0);
    expect(element('button[name=mute].active').count()).toBe(0);
    element('button[name=solo]').click();
    expect(element('button[name=solo].active').count()).toBe(1);
    expect(element('button[name=mute].active').count()).toBe(0);
    element('button[name=mute]').click();
    expect(element('button[name=solo].active').count()).toBe(0);
    expect(element('button[name=mute].active').count()).toBe(1);
  });

  it('should be possible to duplicate an input.', function(){
    input('config.name').enter('Fred');
    expect(element(['input[name=name]']).val()).toBe('Fred');
    element('button[name=duplicate]').click();
    expect(element('div.midiInput').count()).toBe(2);
    expect(element('input[name=name]').val()).toBe('Fred');
  });

  it('should be possible to remove an input.', function(){
    element('button[name=removeMidiInput]').click();
    expect(element('div.midiInput').count()).toBe(0);
  });

  it('should be possible to add an OSC output.', function(){
    expect(element('div[name=oscOutputItem]').count()).toBe(1);
    element('button[name=addOSCOutput]').click();
    expect(element('div[name=oscOutputItem]').count()).toBe(2);
  });

  it('should be possible to remove an OSC output.', function(){
    expect(element('div[name=oscOutputItem]').count()).toBe(1);
    element('button[name=removeOSCOutput]').click();
    expect(element('div[name=oscOutputItem]').count()).toBe(0);
  });

  it('should start with no OSC parameters.', function(){
    expect(element('input.oscParamInput').count()).toBe(0);
  });

  it('should be possible to add osc parameters.', function(){
    expect(element('input.oscParamInput').count()).toBe(0);
    element('button[name=addOSCParam]').click();
    expect(element('input.oscParamInput').count()).toBe(1);
    element('button[name=addOSCParam]').click();
    expect(element('input.oscParamInput').count()).toBe(2);
  });

  it('should be possible to remove osc parameters.', function(){
    expect(element('input.oscParamInput').count()).toBe(0);
    element('button[name=addOSCParam]').click();
    expect(element('input.oscParamInput').count()).toBe(1);
    element('button[name=addOSCParam]').click();
    expect(element('input.oscParamInput').count()).toBe(2);
    element('button[name=removeOSCParam0]').click();
    expect(element('input.oscParamInput').count()).toBe(1);
    element('button[name=removeOSCParam0]').click();
    expect(element('input.oscParamInput').count()).toBe(0);
  });

  it('should be possible to expand the OSC Host panel.', function(){
    expect(element('div.oscPanel').height()).toBeLessThan(1);

    element('button[name=showOSCPanel]').click();

    // Give the animation a second to run.
    sleep(0.2);

    expect(element('div.oscPanel').height()).toBeGreaterThan(1);

    element('button[name=showOSCPanel]').click();

    // Give the animation a second to run.
    sleep(0.5);

    expect(element('div.oscPanel').height()).toBeLessThan(1);
  });

  it('should be possible to add OSC Host configurations.', function(){
    expect(element('.oscPanel div.configRow').count()).toBe(1);

    element('button[name=addOSCHost]').click();

    expect(element('.oscPanel div.configRow').count()).toBe(2);
  });

  it('should be possible to remove OSC Host configurations.', function(){
    expect(element('.oscPanel div.configRow').count()).toBe(1);

    element('button[name=addOSCHost]').click();
    element('button[name=addOSCHost]').click();

    expect(element('.oscPanel div.configRow').count()).toBe(3);

    element('button[name=removeConfigItem1]').click();

    expect(element('.oscPanel div.configRow').count()).toBe(2);
  });

  it('should be possible to expand the Midi Port panel.', function(){
    expect(element('div.midiPanel').height()).toBeLessThan(1);

    element('button[name=showMidiPanel]').click();

    // Give the animation a second to run.
    sleep(0.2);

    expect(element('div.midiPanel').height()).toBeGreaterThan(1);

    element('button[name=showMidiPanel]').click();

    // Give the animation a second to run.
    sleep(0.5);

    expect(element('div.midiPanel').height()).toBeLessThan(1);
  });

  // TODO Test adding a host and verifying that it shows up in the list of hosts for an OSC Output row.
  // Wasn't able to get this working but it looks like e2e testing may be changing in future versions of Angular
  // and maybe this test will get easier.

  // TODO Test adding a host, selecting it in an output, removing that host, verify that the output host is null,
  // add a new host with the same name, verify that the output host is still null.
});
