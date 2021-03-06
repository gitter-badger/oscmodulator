'use strict'

LIVERELOAD_PORT = 35729
SERVER_PORT = 9000
lrSnippet = require('connect-livereload')(port: LIVERELOAD_PORT)
rewriteRulesSnippet = require('grunt-connect-rewrite/lib/utils').rewriteRequest
mountFolder = (connect, dir) ->
  connect.static require('path').resolve(dir)

# Globbing
# for performance reasons we're only matching one level down:
# 'test/spec/{,*/}*.js'
# use this if you want to recursively match all subfolders:
# 'test/spec/**/*.js'
module.exports = (grunt) ->

  # This is not loaded by jit-grunt because it has no explicit task being called.
  grunt.loadNpmTasks 'grunt-notify'

  # Load grunt tasks JIT(Just In Time)
  require('jit-grunt') grunt,
    bower: 'grunt-bower-task'
    configureRewriteRules: 'grunt-connect-rewrite'
    nodewebkit: 'grunt-node-webkit-builder'
    protractor: 'grunt-protractor-runner'
    useminPrepare: 'grunt-usemin'

  # Time how long tasks take. Can help when optimizing build times
  require('time-grunt') grunt

  path = require 'path'
  appPkg = require './app/package.json'
  bowerrc = @file.readJSON './.bowerrc' #rc name breaks require

  # Define legato info for CI checkouts
  legatoPackage = "#{appPkg.devDependencies.legato}".replace('git+https', 'https').split('#')
  legatoURL = legatoPackage[0]
  legatoTag = legatoPackage[1]

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

  appDirectory = "#{nwConfig.root}/releases/#{appPkg.name}/osx/#{appPkg.name}"

  @initConfig

    # Project settings
    yeoman: yeomanConfig

    # Watches files for changes and runs tasks based on the changed files
    watch:
      bower:
        files: ['bower.json']
        tasks: ['wiredep']

      js:
        files: ['<%= yeoman.app %>/scripts/**/*.js']
        tasks: [
          'newer:jshint:dist'
          'karma:unit-watch:run'
        ]

      jsTest:
        files: ['test/{spec,mock}/**/*.js']
        tasks: [
          'newer:jshint:test'
          'karma:unit-watch:run'
        ]

      coffee:
        files: ['<%= yeoman.app %>/scripts/**/*.{coffee,litcoffee,coffee.md}']
        tasks: [
          'newer:coffeelint:dist'
          'newer:coffee:dist'
          'karma:unit-watch:run'
        ]

      coffeeTest:
        files: [
          'test/{spec,mock}/**/*.{coffee,litcoffee,coffee.md}'
        ]
        tasks: [
          'newer:coffeelint:test'
          'newer:coffee:test'
          'karma:unit-watch:run'
        ]

      less:
        files: ['<%= yeoman.app %>/styles/{,*/}*.less']
        tasks: ['less']

      styles:
        files: ['<%= yeoman.app %>/styles/{,*/}*.css']
        tasks: [
          'newer:copy:styles'
        ]

      gruntfile:
        files: ['Gruntfile.coffee']
        tasks: ['newer:coffeelint:dist']

      livereload:
        options:
          livereload: LIVERELOAD_PORT

        files: [
          '<%= yeoman.app %>/{,*/}*.html'
          '.tmp/styles/**/*.css'
          '.tmp/scripts/**/*.js'
          'test/mock/**/*.js'
          '<%= yeoman.app %>/scripts/**/*.js'
          '<%= yeoman.app %>/img/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]

      protractor:
        options:
          debounceDelay: 15000
        files: [
          '<%= yeoman.app %>/scripts/**/*.js'
          '<%= yeoman.app %>/scripts/**/*.coffee'
          'test/protractor/**/*spec.{js,coffee}'
        ]
        tasks: ['protractor:ci']

    # The actual grunt server settings
    connect:
      options:
        port: @option('port') or SERVER_PORT
        # Change this to '0.0.0.0' to access the server from outside.
        hostname: '0.0.0.0'

      rules: [
        from: '^/app/(.*)$', to: '/$1'
      ]

      dev:
        options:
          middleware: (connect) -> [
              lrSnippet
              rewriteRulesSnippet
              mountFolder connect, '.tmp'
              mountFolder connect, yeomanConfig.app
              mountFolder connect, 'test'
            ]

      dist:
        options:
          middleware: (connect) -> [
              mountFolder connect, yeomanConfig.dist
              mountFolder connect, 'test'
            ]


    open:
      server:
        path: 'http://localhost:<%= connect.options.port %>'

      test:
        path: 'http://localhost:9876'

      coverage:
        path: "file://#{__dirname}/.tmp/coverage/PhantomJS\ 1.9.7\ \(Mac\ OS\ X\)/lcov-report/index.html"


    # Empties folders to start fresh
    clean:
      dist:
        files: [
          dot: true
          src: [
            '.tmp'
            '<%= yeoman.dist %>/*'
            '<%= nodewebkit.options.buildDir %>'
            '!<%= yeoman.dist %>/.git*'
          ]
        ]

      server: '.tmp'
      modules:
        files:[
          dot: true
          src:[
            'node_modules'
            '<%= yeoman.app %>/node_modules'
          ]
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
          jshintrc: 'test/.jshintrc'
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
      legato:
        files: [
          expand: true
          cwd: '<%= yeoman.app %>/node_modules/legato/lib'
          src: ['**/{router,utils}.coffee']
          dest: '.tmp/scripts/'
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
      bootstrap:
        options:
          sourceMap: true
          sourceMapFilename: '.tmp/styles/bootstrap.css.map'
          sourceMapBasepath: '.tmp/'
          sourceMapRootpath: '/'
        files: [
          expand: true,
          cwd: '<%= yeoman.app %>/styles'
          src: ['**/bootstrap.less']
          dest: '.tmp/styles'
          ext: '.css'
        ]
      main:
        options:
          sourceMap: true
          sourceMapFilename: '.tmp/styles/main.css.map'
          sourceMapBasepath: '.tmp/'
          sourceMapRootpath: '/'
        files: [
          expand: true,
          cwd: '<%= yeoman.app %>/styles'
          src: ['**/main.less']
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
              js: ['concat']
              css: []

            post: {}


    # Performs rewrites based on rev and the useminPrepare configuration
    usemin:
      html: ['<%= yeoman.dist %>/index.html']
      js: ['<%= yeoman.dist %>/scripts/vendor.js']
      options:
        assetsDirs: ['<%= yeoman.dist %>', '<%= yeoman.dist %>/img']
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
              'scripts/**/*.{js,coffee}'
              'package.json'
              'node_modules/**/*'
            ]
          ,
            expand: true
            cwd: '.tmp'
            dest: '<%= yeoman.dist %>'
            src: [
              'scripts/**/*.{js,js.map}'
              'styles/**/*.{css,css.map}'
              '!styles/variables.css'
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
        'coffee:legato'
        'less'
        'copy:styles'
      ]
      test: [
        'coffee'
        'less'
        'copy:styles'
      ]
      dist: [
        'coffee'
        'less'
        'copy:styles'
        'svgmin'
      ]
      nw:
        options:
          logConcurrentOutput: true
        tasks: [
          'serve'
          'nw-dev'
        ]
      watch:
        options:
          limit: 10
          logConcurrentOutput: true
        tasks: [
          'watch:bower',
          'watch:js',
          'watch:jsTest',
          'watch:coffee',
          'watch:coffeeTest',
          'watch:less',
          'watch:styles',
          'watch:gruntfile',
          'watch:livereload'
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
      'unit-chrome':
        browsers: ['Chrome']
      'unit-ci':
        singleRun: true
        reporters: ['spec', 'coverage', 'coveralls']
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

    bower:
      install:
        options:
          targetDir: bowerrc.directory

    protractor:
      options:
        keepAlive: true
        configFile: 'test/protractor.conf.js'
        debug: false
        args:
          baseUrl: '<%= open.server.path %>'
      ci:{}
      debug:
        options:
          debug: true
          args:
            browser: 'chrome'

    shell:
      options:
        stderr: true
        stdout: true
      'init-nw':
        command: [
          'cd app'
          'npm install --arch=ia32' # Force 32 bit until Chromium supports 64 bit.
        ].join '&&'

      'init-ci':
        command: "git clone --branch #{legatoTag} #{legatoURL} ./#{yeomanConfig.app}/node_modules/legato"

      'nw-open-mac':
        command: "open #{appDirectory}.app"

      'nw-dev':
        command: "#{appDirectory}.app/Contents/MacOS/node-webkit --url=<%= open.server.path %>"

      'stop-selenium':
        command:'curl http://localhost:4444/selenium-server/driver/?cmd=shutDownSeleniumServer'

      'start-element-finder':
        command:'node node_modules/protractor/bin/elementexplorer.js <%= open.server.path %>'

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
      dev:
        options:
          patterns: [
            match: /<!-- MOCKS -->[\s\S]+<!-- ENDMOCKS -->/gi,
            replacement: ''
            expression: true
          ]
        files: [
          expand: false
          flatten: true
          src: '<%= yeoman.app %>/index.html'
          dest: '.tmp/index.html'
        ]

    nodewebkit:
      options:
        version: nwConfig.version
        buildDir: "#{nwConfig.root}/releases"
        cacheDir: "#{nwConfig.root}/cache"
        platforms: ['osx']
      src: ["#{yeomanConfig.dist}/**/*"]

    notify:
      default:
        options:
          message: 'Build finished successfully!'


  #TODO Add support for running on Windows and Linux
  @registerTask 'nw-open',
    '''
    Opens the fully packaged OSCModulator app.
    (Depends on having run `grunt`)
    '''
    ['shell:nw-open-mac']

  @registerTask 'nw',
    '''
    Run node-webkit in development mode, but with no mocks in place.
    '''
    =>
      @option 'nomocks', true
      @task.run ['concurrent:nw']

  @registerTask 'nw-dev',
    '''
      Download and run node-webkit configured to use the local web server.
      (Depends on having run `grunt serve` or `grunt serve:dist`)
    '''
    =>
      @task.run [
        'nodewebkit'
        'shell:nw-dev'
      ]

  @registerTask 'nw-prep',
    '''
    (internal use only)
    Recompiles native Node modules to run in Node Webkit.
    '''
    =>
      @file.expand('app/node_modules/**/package.json').forEach (filePath) =>
        config = @file.readJSON filePath
        return if not config?.gypfile
        dir = path.dirname filePath
        @config 'shell.nwgyp.command', [
          "cd #{dir}"
          "#{path.resolve('./node_modules/.bin/nw-gyp')} rebuild --target=#{nwConfig.version}"
        ].join('&&')
        @task.run 'shell:nwgyp'

  @registerTask 'pro',
    '''
    Run Protractor e2e tests against PhantomJS.
    '''
    ['protractor:ci']

  @registerTask 'pro-debug',
    '''
    Run Protractor e2e tests in debug mode against Chrome.
    '''
    ['protractor:debug']

  @registerTask 'pro-element-finder',
    '''
    Runs the Protractor element finder.
    '''
    [
      'protractor_webdriver:start'
      'shell:start-element-finder'
    ]

  @registerTask 'serve',
    '''
    Run and serve the development build at localhost:9000.
    '''
    (target) =>
      if target is 'dist'
        return @task.run [
          'clean:dist'
          'build'
          'replace:dist'
          'configureRewriteRules'
          'connect:dist:keepalive'
        ]
      tasks = [
        'clean:server'
        'copy:fonts'
        'concurrent:server'
        'configureRewriteRules'
        'connect:dev'
        'karma:unit-watch:start'
        'watch'
      ]
      tasks.splice 4, 0, 'replace:dev' if @option 'nomocks'
      @task.run tasks

  @registerTask 'test',
    '''
    Run unit or e2e tests.
    '''
    (target='unit', watch='') =>
      if target is 'e2e'
        if watch is 'watch'
          watch = '-watch'
        tasks = [
          "karma:e2e#{watch}"
        ]
      else
        tasks = [
          'clean:server'
          'concurrent:test'
          "karma:#{target}"
        ]

      @task.run tasks

  @registerTask 'lint',
    '''
    Run in code linting tasks.
    '''
    [
      'jshint'
      'coffeelint'
      'lesslint'
    ]

  @registerTask 'build',
    '''
    Create the "web app" build for packaging into node-webkit.
    '''
    [
      'useminPrepare'
      'concurrent:dist'
      'concat'
      'cssmin'
      'copy:dist'
      'usemin'
    ]

  @registerTask 'ci',
    '''
    Run the Continuous Integration(CI) build.
    '''
    [
      'clean:dist'
      'lint'
      'test:unit-ci'
      'build'
      'configureRewriteRules'
      'connect:dev'
      'test:e2e'
      'protractor:ci'
    ]

  @registerTask 'ci-init',
    '''
    Initialize the project for a CI build.
    '''
    [
      'bower:install',
      'shell:init-ci'
    ]

  @registerTask 'default',
    '''
    Create the fully packaged build ready for distribution.
    '''
    [
      'clean:dist'
      'lint'
      'test'
      'build'
      'replace:dist'
      'nodewebkit'
    ]

  @registerTask 'init',
    '''
    Initialize the project for development after checkout.
    '''
    [
      'bower:install'
      'shell:init-nw'
      'nw-prep'
    ]
