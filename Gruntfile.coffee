'use strict'

LIVERELOAD_PORT = 35729
lrSnippet = require('connect-livereload')(port: LIVERELOAD_PORT)
mountFolder = (connect, dir) ->
  connect.static require('path').resolve(dir)

# # Globbing
# for performance reasons we're only matching one level down:
# 'test/spec/{,*/}*.js'
# use this if you want to recursively match all subfolders:
# 'test/spec/**/*.js'
module.exports = (grunt) ->

  require('load-grunt-tasks') grunt
  require('time-grunt') grunt
  path = require 'path'
  appPkg = require './app/package.json'
  coffeelint = require './coffeelint.json'

  # configurable paths
  yeomanConfig =
    app: 'app'
    dist: 'dist'

  try
    yeomanConfig.app = require('./bower.json').appPath or yeomanConfig.app

  ###
  Determines the build type which is later used to load the correct node-webkit build.
  ###
  platform = (->
    buildType = 'unknown'
    switch process.platform
      when 'darwin' then buildType = 'osx'
      when 'linux' then buildType = 'linux'
      else
        buildType = 'windows' if platform.match /^win/
    buildType
  )()

  nwConfig =
    root: 'node-webkit'
    version: '0.8.5'
    osx:
      nwpath: 'node-webkit.app/Contents/MacOS/node-webkit'

  grunt.initConfig
    yeoman: yeomanConfig
    watch:
      coffee:
        files: ['<%= yeoman.app %>/scripts/{,*/}*.coffee']
        tasks: ['coffee:dist']
      coffeeTest:
        files: ['test/spec/{,*/}*.coffee']
        tasks: ['coffee:test']
      styles:
        files: ['<%= yeoman.app %>/styles/{,*/}*.css']
        tasks: ['copy:styles', 'autoprefixer']
      livereload:
        options:
          livereload: LIVERELOAD_PORT
        files: [
          '<%= yeoman.app %>/{,*/}*.html'
          '.tmp/styles/{,*/}*.css'
          '{.tmp,<%= yeoman.app %>}/scripts/{,*/}*.js'
          '<%= yeoman.app %>/img/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]

    autoprefixer:
      options: ['last 1 version']
      dist:
        files: [
          expand: true
          cwd: '.tmp/styles/'
          src: '{,*/}*.css'
          dest: '.tmp/styles/'
        ]

    connect:
      options:
        port: 9000
        # Change this to '0.0.0.0' to access the server from outside.
        hostname: 'localhost'
      livereload:
        options:
          middleware: (connect) -> [
            lrSnippet
            mountFolder(connect, '.tmp')
            mountFolder(connect, yeomanConfig.app)
            mountFolder(connect, 'test')
          ]
      dist:
        options:
          port: 9001
          middleware: (connect) -> [
            mountFolder(connect, yeomanConfig.dist)
            mountFolder(connect, 'test')
          ]

    open:
      server:
        url: 'http://localhost:<%= connect.options.port %>'

    clean:
      dist:
        files: [
          dot: true
          src: [
            '.tmp'
            "<%= yeoman.dist %>/*"
            '!<%= yeoman.dist %>/.git*'
          ]
        ]
      server: '.tmp'
      deps:
        files: [
          dot: true
          src: [
            '<%= yeoman.app %>/node_modules'
            '<%= yeoman.app %>/components'
            'node_modules'
          ]
        ]


    jshint:
      options:
        jshintrc: '.jshintrc'
      all: ['<%= yeoman.app %>/scripts/{,*/}*.js']

    coffee:
      options:
        sourceMap: true
        sourceRoot: ''
      dist:
        files: [
          expand: true
          cwd: '<%= yeoman.app %>/scripts'
          src: '{,*/}*.coffee'
          dest: '.tmp/scripts'
          ext: '.js'
        ]
      test:
        files: [
          expand: true
          cwd: 'test/spec'
          src: '{,*/}*.coffee'
          dest: '.tmp/spec'
          ext: '.js'
        ]

    coffeelint:
      options: coffeelint
      dist:
        files:
          src: [
            '<%= yeoman.app %>/scripts/{,*/}*.coffee'
            'Gruntfile.coffee'
            'test/{,*/}*.coffee'
          ]

    # not used since Uglify task does concat,
    # but still available if needed
    #concat: {
    #      dist: {}
    #    },
    rev:
      dist:
        files:
          src: [
            '<%= yeoman.dist %>/scripts/{,*/}*.js'
            '<%= yeoman.dist %>/styles/{,*/}*.css'
            '<%= yeoman.dist %>/img/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
            '<%= yeoman.dist %>/styles/fonts/*'
          ]

    useminPrepare:
      html: '<%= yeoman.app %>/index.html'
      options:
        dest: '<%= yeoman.dist %>'

    usemin:
      html: ['<%= yeoman.dist %>/{,*/}*.html']
      css: ['<%= yeoman.dist %>/styles/{,*/}*.css']
      options:
        dirs: ['<%= yeoman.dist %>']

    imagemin:
      dist:
        files: [
          expand: true
          cwd: '<%= yeoman.app %>/img'
          src: '{,*/}*.{png,jpg,jpeg}'
          dest: '<%= yeoman.dist %>/img'
        ]

    svgmin:
      dist:
        files: [
          expand: true
          cwd: '<%= yeoman.app %>/img'
          src: '{,*/}*.svg'
          dest: '<%= yeoman.dist %>/img'
        ]

    cssmin: {}

    # By default, your `index.html` <!-- Usemin Block --> will take care of
    # minification. This option is pre-configured if you do not wish to use
    # Usemin blocks.
    # dist: {
    #   files: {
    #     '<%= yeoman.dist %>/styles/main.css': [
    #       '.tmp/styles/{,*/}*.css',
    #       '<%= yeoman.app %>/styles/{,*/}*.css'
    #     ]
    #   }
    # }
    htmlmin:
      dist:
        options: {}

        #removeCommentsFromCDATA: true,
        #          // https://github.com/yeoman/grunt-usemin/issues/44
        #          //collapseWhitespace: true,
        #          collapseBooleanAttributes: true,
        #          removeAttributeQuotes: true,
        #          removeRedundantAttributes: true,
        #          useShortDoctype: true,
        #          removeEmptyAttributes: true,
        #          removeOptionalTags: true
        files: [
          expand: true
          cwd: '<%= yeoman.app %>'
          src: ['*.html', 'views/*.html']
          dest: '<%= yeoman.dist %>'
        ]

    # Put files not handled in other tasks here
    copy:
      dist:
        files: [
          expand: true
          dot: true
          cwd: '<%= yeoman.app %>'
          dest: '<%= yeoman.dist %>'
          src: [
            '*.{ico,png,txt}'
            '.htaccess'
            "components/**/*"
            'img/{,*/}*.{gif,webp}'
            'styles/fonts/*'
            'package.json'
            'node_modules/**/*'
          ]
        ,
          expand: true
          cwd: '.tmp/img'
          dest: '<%= yeoman.dist %>/img'
          src: ['generated/*']
        ]

      debug:
        files: [
          expand: true
          cwd: '<%= yeoman.app %>'
          dest: '<%= yeoman.dist %>'
          src: '**/*'
        ]

      styles:
        files: [
          expand: true
          cwd: '<%= yeoman.app %>/styles'
          dest: '.tmp/styles/'
          src: '{,*/}*.css'
        ,
          expand: true
          cwd: '<%= yeoman.app %>/components'
          dest: '.tmp/components/'
          src: '**/bootstrap.css'
        ]

    concurrent:
      server: [
        'coffee:dist'
        'copy:styles'
      ]
      test: [
        'coffee'
        'copy:styles'
      ]
      dist: [
        'coffee'
        'copy:styles'
        'imagemin'
        'svgmin'
        'htmlmin'
      ]
      init: [
        'shell:init-node'
        'shell:init-nw'
      ]

    karma:
      unit:
        configFile: 'test/karma.conf.coffee'
        singleRun: true

      'unit-ci':
        configFile: 'test/karma.conf.coffee'
        singleRun: true
        reporters: ['spec', 'coverage']
        coverageReporter:
          type: 'lcov'
          dir: '.tmp/coverage/'

      'unit-watch':
        configFile: 'test/karma.conf.coffee'
        autoWatch: true
        browsers: ['Chrome']

      e2e:
        configFile: 'test/karma-e2e.conf.coffee'
        singleRun: true
        proxies:
          '/': 'http://localhost:9001/'

      'e2e-watch':
        configFile: 'test/karma-e2e.conf.coffee'
        autoWatch: true
        browsers: ['Chrome']

    protractor:
      options:
        keepAlive: true
        configFile: 'test/protractor.conf.coffee'
        debug: false
        args:
          baseUrl: '<%= open.server.path %>'
      start:{}
      debug:
        options:
          debug: true
          args:
            browser: 'chrome'

    protractor_webdriver:
      start:
        options:
          path: 'node_modules/protractor/bin/'

    ngmin:
      dist:
        files: [
          expand: true
          cwd: '<%= yeoman.dist %>/scripts'
          src: '*.js'
          dest: '<%= yeoman.dist %>/scripts'
        ]

    uglify:
      dist:
        files:
          '<%= yeoman.dist %>/scripts/scripts.js': ['<%= yeoman.dist %>/scripts/scripts.js']

    shell:
      options:
        stderr: true
        stdout: true
      'init-node':
        command: [
          'npm install -g bower@1.3.8 nw-gyp@0.12.2'
          'bower install'
        ].join '&&'
      'init-nw':
        command: [
          'cd app'
          'npm install --arch=ia32' # Force 32 bit until Chromium supports 64 bit.
        ].join '&&'

      'nw-open-mac':
        command: "open #{nwConfig.root}/releases/#{appPkg.name}/mac/#{appPkg.name}.app"

      'stop-selenium':
        command:'curl http://localhost:4444/selenium-server/driver/?cmd=shutDownSeleniumServer'

      'start-element-finder':
        command:'node node_modules/protractor/bin/elementexplorer.js http://localhost:9001'

    replace:
      dist:
        options:
          patterns: [
            match: /<!-- MOCKS -->[\s\S]+<!-- ENDMOCKS -->/gi,
            replacement: ''
            expression: true
          ]
        files: [
          expand: false
          flatten: true
          src: '<%= yeoman.dist %>/index.html'
          dest: '<%= yeoman.dist %>/index.html'
        ]

    nodewebkit:
      options:
        version: nwConfig.version
        build_dir: nwConfig.root
        mac: true
        win: false
        linux32: false
        linux64: false
      src: ["#{yeomanConfig.dist}/**/*"]

  grunt.registerTask 'server', (target) ->
    return grunt.task.run(['build', 'open', 'connect:dist:keepalive']) if target is 'dist'
    grunt.task.run [
      'clean:server'
      'concurrent:server'
      'autoprefixer'
      'connect:livereload'
      'open'
      'watch'
    ]

  grunt.registerTask 'nw-build', [
    'default'
    'replace:dist'
    'nodewebkit'
  ]

  grunt.registerTask 'nw-build-debug', [
    'clean:dist'
    'copy:debug'
    'replace:dist'
    'nodewebkit'
  ]

  grunt.registerTask 'nw-run', (target)  ->
    buildTask = if target is 'debug' then 'nw-build-debug' else 'nw-build'
    grunt.task.run [
      buildTask
      #TODO Add support for running on Windows and Linux
      'shell:nw-open-mac'
    ]

  #TODO Add support for running on Windows and Linux
  grunt.registerTask 'nw-open', ['shell:nw-open-mac']

  grunt.registerTask 'nw-prep', ->
    # Recompile any native Node modules to run in Node Webkit.
    grunt.file.expand('app/node_modules/**/package.json').forEach (filePath) ->
      config = grunt.file.readJSON filePath
      return if not config?.gypfile
      dir = path.dirname filePath
      grunt.config 'shell.nwgyp.command', [
        "cd #{dir}"
        "nw-gyp rebuild --target=#{nwConfig.version}"
      ].join('&&')
      grunt.task.run 'shell:nwgyp'

  grunt.registerTask 'unit-prep', [
    'clean:server'
    'concurrent:test'
    'autoprefixer'
  ]

  grunt.registerTask 'unit', [
    'unit-prep'
    'karma:unit'
  ]

  grunt.registerTask 'unit-ci', [
    'unit-prep'
    'karma:unit-ci'
  ]

  grunt.registerTask 'unit-watch', [
    'unit-prep'
    'karma:unit-watch'
  ]

  grunt.registerTask 'e2e', [
    'build'
    'connect:dist'
    'karma:e2e'
  ]

  grunt.registerTask 'e2e-protractor', [
#    'build'
    'concurrent:server'
    'autoprefixer'
    'connect:livereload'
    'protractor:start'
  ]

  grunt.registerTask 'e2e-protractor-debug', [
#    'build'
    'concurrent:server'
    'autoprefixer'
    'connect:livereload'
    'protractor:debug'
  ]

  grunt.registerTask 'e2e-protractor-element-finder', [
    'build'
    'connect:dist'
    'protractor_webdriver:start'
    'shell:start-element-finder'
  ]

  grunt.registerTask 'e2e-watch', [
    'clean:server'
    'concurrent:server'
    'autoprefixer'
    'connect:livereload'
    'open'
    'karma:e2e-watch'
  ]

  grunt.registerTask 'test', [
    'unit'
    'e2e'
  ]

  grunt.registerTask 'lint', [
    'jshint'
    'coffeelint'
  ]

  grunt.registerTask 'build', [
    'clean:dist'
    'useminPrepare'
    'concurrent:dist'
    'autoprefixer'
    'concat'
    'copy:dist'
    'ngmin'
    'cssmin'
    'uglify'
    'rev'
    'usemin'
  ]

  grunt.registerTask 'default', [
    'lint'
    'test'
  ]

  grunt.registerTask 'init', [
    'concurrent:init'
    'nw-prep'
  ]
