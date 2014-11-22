angular.module 'oscmodulatorApp'
  .service 'runtime', (_, node, nodeWebkit) ->
    'use strict'

    if node.isNodeEnvironment
      service = nodeWebkit
    else
      service =
        createMenu: ->
        openFileDialog: ->

    console.log _
    _.forOwn service, (val, key) ->
      @.key = val
    ,
      this

