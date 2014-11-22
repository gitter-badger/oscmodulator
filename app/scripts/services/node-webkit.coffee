angular.module 'oscmodulatorApp'
  .service 'nodeWebkit', ($rootScope, $q, node) ->
    'use strict'

    # Expose gui and main window
    gui = @gui = node.require 'nw.gui'
    @window = @gui?.Window.get()

    createMenuItems = (menu, items) ->
      _.each items, (i) ->
        console.log 'Creating item', i.label

        # Shortcut to integrate menu with Angular event system when click represents an eventName
        if _.isString(i.click)
          i.click = ((menu, $rootScope, eventName) ->
            -> $rootScope.$broadcast eventName, menu, this
          )(menu, $rootScope, i.click)

        # Create a sub-menu if items are provided
        if i.items
          i.submenu = new gui.Menu()
          createMenuItems i.submenu, i.items

        # Append the menu item to the provided menu
        console.log 'appending item %s to menu', i.label
        menu.append new gui.MenuItem(i)

    ###
    Create a context or window menu.
    @param menuStructure The actual structure of the menu.

    This is a shortcut to avoid calling all append methods after creation.
    Just provide an object with the following supported properties:

    root:
      type: "context|menubar"
      items:[
        label: "My Menu Label"
        type: "normal|separator|checkbox"
        enabled: true|false
        tooltip: "This is my tooltip"
        icon: "path-to-icon"
        items: [{recursive}]
      ]
    @returns {gui.Menu}
    ###
    @createMenu = (menuStructure) ->
      menu = new gui.Menu(menuStructure.root)
      if menuStructure.root and menuStructure.root.items
        console.log 'Creating %d menu items for root menu', menuStructure.root.items.length
        createMenuItems menu, menuStructure.root.items
      @window.menu = menu  if menu.type is "menubar"
      menu

    @openFileDialog = (cfg) ->
      cfg = cfg ? {}
      result = $q.defer()
      $dlg = $ '#fileDialog'
      $dlg = $('body').append('<input style="display:none;" id="fileDialog" type="file" />')  unless $dlg
      $dlg.attr 'accept', cfg.accept  if cfg.accept
      $dlg.one 'change', (evt) ->
        result.resolve $(this).val()
        evt.preventDefault()

      $dlg.one 'cancel', (evt) ->
        console.log 'Cancel was called'
        evt.preventDefault()
        result.resolve false

      $dlg.one 'close', (evt) ->
        console.log 'Close was called'
        evt.preventDefault()
        result.resolve false

      $dlg.trigger 'click'
      result.promise
