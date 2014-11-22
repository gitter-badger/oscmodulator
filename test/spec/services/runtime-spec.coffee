'use strict'
describe 'Service: runtime', ->

  beforeEach module 'oscmodulatorApp'

  runtime = null
  beforeEach ->
    inject (_runtime_) ->
      runtime = _runtime_

  it 'should do something', ->
    expect(runtime).not.toBe null
