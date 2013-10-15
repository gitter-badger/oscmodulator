#jshint quotmark:single

# Karma configuration
# http://karma-runner.github.io/0.10/config/configuration-file.html
module.exports = (config) ->
  'use strict'
  config.set

    # base path, that will be used to resolve files and exclude
    basePath: '../'

    # testing framework to use (jasmine/mocha/qunit/...)
    frameworks: ['jasmine']
    reporters: ['spec', 'coverage']

    coverageReporter:
      type: 'html'
      dir: '.tmp/coverage'

    # list of files / patterns to load in the browser
    files: [
      'app/components/jquery/jquery.js'
      'app/components/angular/angular.js'
      'app/components/angular-mocks/angular-mocks.js'
      'app/components/angular-bootstrap/ui-bootstrap-tpls.js'
      'app/scripts/**/*.js'
      'app/scripts/**/*.coffee'
      'test/mock/**/*.js'
      'test/spec/**/*.js'
      'test/spec/**/*.coffee'
      'app/views/*.html'
    ]

    # The html2js preprossessor is used to load template files
    # during testing so directives can be unit tested.
    preprocessors:
      'app/scripts/**/*.js': 'coverage'
      'app/scripts/**/*.coffee': ['coffee', 'coverage']
      'test/spec/**/*.coffee': 'coffee'
      '**/*.html': 'ng-html2js'

    ngHtml2JsPreprocessor:
      stripPrefix: 'app/'

    # list of files / patterns to exclude
    exclude: []

    # web server port
    port: 8080

    # level of logging
    # possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO

    # enable / disable watching file and executing tests whenever any file changes
    autoWatch: false

    # Start these browsers, currently available:
    # - Chrome
    # - ChromeCanary
    # - Firefox
    # - Opera
    # - Safari (only Mac)
    # - PhantomJS
    # - IE (only Windows)
    browsers: ['PhantomJS']

    # If browser does not capture in given timeout [ms], kill it
    captureTimeout: 5000

    # Continuous Integration mode
    # if true, it capture browsers, run tests and exit
    singleRun: false

