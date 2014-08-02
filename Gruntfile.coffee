'use strict'

LIVERELOAD_PORT = 35729
SERVER_PORT = 9000
lrSnippet = require('connect-livereload')(port: LIVERELOAD_PORT)
mountFolder = (connect, dir) ->
  connect.static require('path').resolve(dir)

# Globbing
# for performance reasons we're only matching one level down:
# 'test/spec/{,*/}*.js'
# use this if you want to recursively match all subfolders:
# 'test/spec/**/*.js'
module.exports = (grunt) ->

  # Load grunt tasks automatically
  require('load-grunt-tasks') grunt

  # Time how long tasks take. Can help when optimizing build times
  require('time-grunt') grunt

  path = require 'path'
  appPkg = require './app/package.json'
  bowerrc = grunt.file.readJSON './.bowerrc' #rc name breaks require

  # Define the configuration for all the tasks
  yeomanConfig =
    app: require('./bower.json').appPath or 'app'
    dist: 'dist'

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

    # Project settings
    yeoman: yeomanConfig

    # Watches files for changes and runs tasks based on the changed files
    watch:
      bower:
        files: ['bower.json']
        tasks: ['wiredep']

      js:
        files: ['<%= yeoman.app %>/scripts/**/*.js']
        tasks: ['newer:jshint:dist']
        options:
          livereload: '<%= connect.options.dev %>'

      jsTest:
        files: ['test/spec/**/*.js'],
        tasks: [
          'newer:jshint:test'
          'karma:unit-watch:run'
        ]

      coffee:
        files: ['<%= yeoman.app %>/scripts/**/*.{coffee,litcoffee,coffee.md}']
        tasks: ['newer:coffeelint:dist', "newer:coffee:dist"]

      coffeeTest:
        files: [
          '.tmp/scripts/**/*.js'
          'test/spec/**/*.{coffee,litcoffee,coffee.md}'
        ]
        tasks: [
          'newer:coffeelint:test'
          'newer:coffee:test'
          'karma:unit-watch:run'
        ]

      less:
        files: ['<%= yeoman.app %>/styles/{,*/}*.less']
        tasks: ['less', "autoprefixer"]

      styles:
        files: ['<%= yeoman.app %>/styles/{,*/}*.css']
        tasks: [
          'newer:copy:styles'
          'autoprefixer'
        ]

      gruntfile:
        files: ['Gruntfile.coffee']
        tasks: ['newer:coffeelint:dist']

      livereload:
        options:
          livereload: LIVERELOAD_PORT
          spawn: false

        files: [
          '<%= yeoman.app %>/{,*/}*.html'
          '.tmp/styles/**/*.css'
          '.tmp/scripts/**/*.js'
          '<%= yeoman.app %>/scripts/**/*.js'
          '<%= yeoman.app %>/img/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]


    # The actual grunt server settings
    connect:
      options:
        port: grunt.option("port") or SERVER_PORT
        # Change this to '0.0.0.0' to access the server from outside.
        hostname: '0.0.0.0'

      dev:
        options:
          middleware: (connect) -> [
              lrSnippet
              mountFolder connect, '.tmp'
              mountFolder connect, yeomanConfig.app
              mountFolder(connect, 'test')
            ]

      dist:
        options:
          middleware: (connect) -> [
              mountFolder connect, yeomanConfig.dist
              mountFolder(connect, 'test')
            ]


    open:
      server:
        path: 'http://localhost:<%= connect.options.port %>'

      test:
        path: "http://localhost:9876"


    # Empties folders to start fresh
    clean:
      dist:
        files: [
          dot: true
          src: [
            '.tmp'
            '<%= yeoman.dist %>/*'
            '!<%= yeoman.dist %>/.git*'
          ]
        ]

      server: ".tmp"


    # Add vendor prefixed styles
    # see here: http://caniuse.com/#search
    autoprefixer:
      options:
        browsers: ['last 1 version']

      dist:
        files: [
          expand: true
          cwd: '.tmp/styles/'
          src: '{,*/}*.css'
          dest: '.tmp/styles/'
        ]


    # Automatically inject Bower components into the app
    wiredep:
      app:
        src: ['<%= yeoman.app %>/index.html']
        ignorePath: '<%= yeoman.app %>/'

      less:
        src: ['<%= yeoman.app %>/styles/{,*/}*.{less}']
        ignorePath: bowerrc.directory


    # Make sure code styles are up to par and there are no obvious mistakes
    jshint:
      options:
        jshintrc: '.jshintrc'
        reporter: require('jshint-stylish')

      dist:
        files:
          src: [
            '<%= yeoman.app %>/scripts/**/*.js'
            '!<%= yeoman.app %>/scripts/lib/*.js'
          ]

      test:
        options:
          jshintrc: "test/.jshintrc"
        files:
          src: [
            'test/spec/**/*.js'
          ]


    # Compiles CoffeeScript to JavaScript
    coffee:
      options:
        sourceMap: true
        sourceRoot: ''
      dist:
        files: [
          expand: true
          cwd: '<%= yeoman.app %>/scripts'
          src: '**/*.coffee'
          dest: '.tmp/scripts'
          ext: '.js'
        ]
      test:
        files: [
          expand: true
          cwd: 'test/spec'
          src: '**/*.coffee'
          dest: '.tmp/spec'
          ext: '.js'
        ]


    coffeelint:
      options:
        configFile: 'coffeelint.json'
      dist: [
        'Gruntfile.coffee'
        'karma*.conf.coffee'
        '<%= yeoman.app %>/scripts/**/*.coffee'
      ]
      test: ['test/**/*.coffee']


    less:
      dist:
        options:
          sourceMap: true
          sourceMapFilename: '.tmp/styles/main.css.map'
          sourceMapBasepath: '.tmp/'
          sourceMapRootpath: '/'
        files: [
          expand: true,
          cwd: '<%= yeoman.app %>/styles'
          src: ['**/*.less']
          dest: '.tmp/styles'
          ext: '.css'
        ]


    lesslint:
      options:
        csslint: require './lesslint.json'
      src: [
          '<%= yeoman.app %>/styles/**/*.less'
          '!<%= yeoman.app %>/styles/bootstrap.less'
          '!<%= yeoman.app %>/styles/variables.less'
        ]


    # Renames files for browser caching purposes
    rev:
      dist:
        files:
          src: [
            '<%= yeoman.dist %>/scripts/{,*/}*.js'
            '<%= yeoman.dist %>/styles/{,*/}*.css'
            '<%= yeoman.dist %>/img/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
            '<%= yeoman.dist %>/styles/fonts/*'
          ]


    # Reads HTML for usemin blocks to enable smart builds that automatically
    # concat, minify and revision files. Creates configurations in memory so
    # additional tasks can operate on them
    useminPrepare:
      html: '<%= yeoman.app %>/index.html'
      options:
        dest: '<%= yeoman.dist %>'
        flow:
          html:
            steps:
              js: [
                "concat"
                "uglifyjs"
              ]
              css: ["cssmin"]

            post: {}


    # Performs rewrites based on rev and the useminPrepare configuration
    usemin:
      html: ['<%= yeoman.dist %>/**/*.html', '!<%= yeoman.dist %>/node_modules/**/*.html']
      css: ['<%= yeoman.dist %>/styles/{,*/}*.css']
      js: ["<%= yeoman.dist %>/scripts/*.js"]
      options:
        assetsDirs: ["<%= yeoman.dist %>", '<%= yeoman.dist %>/img']
        patterns:
          js: [ [/(img\/.*?\.(?:gif|jpeg|jpg|png|webp))/gm, 'Update the JS to reference our revved images'] ]
          ###
          The following is required because relative path support is broken in 2.1.1
            https://github.com/yeoman/grunt-usemin/issues/184
            https://github.com/yeoman/grunt-usemin/issues/242
          ###
          css: [[
            /(?:src=|url\(\s*)['"]?([^'"\)(\?|#)]+)['"]?\s*\)?/gm
            'Fixing relative file paths...'
            (m) ->
              m.replace(/^.*?\.tmp\//, '').replace(/^.*?fonts\//, 'styles/fonts/')
            (m) ->
              m.replace(/^img/, '../img').replace(/^styles\//, '')
          ]]


    # The following *-min tasks produce minified files in the dist folder
    cssmin:
      options:
        root: '<%= yeoman.app %>'

    imagemin:
      dist:
        files: [
          expand: true
          cwd: '<%= yeoman.app %>/img'
          src: '{,*/}*.{png,jpg,jpeg,gif}'
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

    htmlmin:
      dist:
        options:
          collapseWhitespace: true
          collapseBooleanAttributes: true
          removeCommentsFromCDATA: true
          removeOptionalTags: true

        files: [
          expand: true
          cwd: '<%= yeoman.dist %>'
          src: [
            '*.html'
            'views/{,*/}*.html'
          ]
          dest: '<%= yeoman.dist %>'
        ]


    # ngmin tries to make the code safe for minification automatically by
    # using the Angular long form for dependency injection. It doesn't work on
    # things like resolve or inject so those have to be done manually.
    ngmin:
      dist:
        files: [
          expand: true
          cwd: '.tmp/concat/scripts'
          src: '*.js'
          dest: '.tmp/concat/scripts'
        ]


    # Replace Google CDN references
    cdnify:
      dist:
        html: ['<%= yeoman.dist %>/*.html']


    # Copies remaining files to places other tasks can use
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
              '*.html'
              'views/{,*/}*.html'
              'img/{,*/}*.{webp}'
              'styles/fonts/*'
              'package.json'
              'node_modules/**/*'
            ]
          ,
            expand: true
            cwd: '.tmp/img'
            dest: '<%= yeoman.dist %>/img'
            src: ['generated/*']
          ,
            expand: true
            dot: true
            flatten: true
            dest: '<%= yeoman.dist %>/styles/fonts'
            src: [
              "#{bowerrc.directory}/bootstrap/dist/fonts/*.*"
              "#{bowerrc.directory}/font-awesome/fonts/*.*"
            ]
        ]

      styles:
        expand: true
        cwd: '<%= yeoman.app %>/styles'
        dest: '.tmp/styles/'
        src: '{,*/}*.css'

      fonts:
        files: [
          expand: true
          dot: true
          flatten: true
          dest: '.tmp/styles/fonts'
          src: [
            "#{bowerrc.directory}/bootstrap/dist/fonts/*.*"
            "#{bowerrc.directory}/font-awesome/fonts/*.*"
          ]
        ]


    concurrent:
      server: [
        'coffee:dist'
        'less:dist'
        "copy:styles"
      ]
      test: [
        'coffee'
        'less'
        'copy:styles'
      ]
      dist: [
        'coffee'
        'less:dist'
        'copy:styles'
        'imagemin'
        'svgmin'
      ]
      init: [
        'shell:init-node'
        'shell:init-nw'
      ]


    karma:
      options:
        configFile: 'test/karma.conf.coffee'
      unit:
        singleRun: true
      'unit-watch':
        reporters: ['progress']
        background: true
        singleRun: false
      'unit-ci':
        singleRun: true
        reporters: ['spec', 'coverage']
        preprocessors:
          'app/views/*.html': 'ng-html2js'
          'app/scripts/**/*.js': ['coverage']
          '.tmp/scripts/**/*.js': ['coverage']
        coverageReporter:
          type: 'lcov'
          dir: '.tmp/coverage'
      e2e:
        configFile: 'test/karma-e2e.conf.coffee'
        singleRun: true
        proxies:
          '/':  '<%= open.server.path %>'
      'e2e-watch':
        configFile: 'test/karma-e2e.conf.coffee'
        autoWatch: true
        browsers: ['Chrome']

    'bower-install-simple':
      options:
        directory: bowerrc.directory

    shell:
      options:
        stderr: true
        stdout: true
      'init-node':
        command: 'npm install -g nw-gyp@0.12.2'
      'init-nw':
        command: [
          'cd app'
          'npm install --arch=ia32' # Force 32 bit until Chromium supports 64 bit.
        ].join '&&'

      'nw-open-mac':
        command: "open #{nwConfig.root}/releases/#{appPkg.name}/mac/#{appPkg.name}.app"

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

  grunt.registerTask 'serve', (target) ->
    if target is 'dist'
      return grunt.task.run([
        'clean:dist'
        'build'
        'connect:dist:keepalive'
      ])
    grunt.task.run [
      'clean:server'
      'copy:fonts'
      'concurrent:server'
      'autoprefixer'
      'connect:dev'
      'karma:unit-watch:start'
      'watch'
    ]

  grunt.registerTask 'test', (target='unit', env='dev') ->
    if target is 'e2e'
      watch = ''
      if env is 'dev'
        watch = '-watch'
      tasks = [
        "connect:#{env}"
        "karma:e2e#{watch}"
      ]
    else
      tasks = [
        'clean:server'
        'concurrent:test'
        "karma:#{target}"
      ]

    grunt.task.run tasks

  grunt.registerTask 'lint', [
    'jshint'
    'coffeelint'
    'lesslint'
  ]

  grunt.registerTask 'build', [
    'useminPrepare'
    'concurrent:dist'
    'autoprefixer'
    'concat'
    'ngmin'
    'copy:dist'
    'cdnify'
    'cssmin'
    'uglify'
    'rev'
    'usemin'
    'htmlmin'
  ]

  grunt.registerTask 'ci', [
    'clean:dist'
    'lint'
    'test:unit-ci'
    'build'
    'test:e2e:dist'
  ]

  grunt.registerTask 'default', [
    'clean:dist'
    'lint'
    'test'
    'build'
  ]

  grunt.registerTask 'init', [
    'bower-install-simple'
    'concurrent:init'
    'nw-prep'
  ]
