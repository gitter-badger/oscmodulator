#jshint quotmark:single

# Karma configuration
# http://karma-runner.github.io/0.12/config/configuration-file.html
module.exports = (config) ->
  'use strict'
  config.set
    # base path, that will be used to resolve files and exclude
    basePath: '../'

    # testing framework to use (jasmine/mocha/qunit/...)
    frameworks: ['jasmine']

    # list of files / patterns to load in the browser
    files: [
      # vendor
      'app/components/jquery/jquery.js'
      'app/components/lodash/dist/lodash.js'
      'app/components/angular/angular.js'
      'app/components/angular-lodash-module/angular-lodash-module.js'
      'app/components/angular-mocks/angular-mocks.js'
      'app/components/angular-bootstrap/ui-bootstrap-tpls.js'

      # application
      'app/scripts/**/*.js'
      '.tmp/scripts/**/*.js'

      # tests
      'test/spec/**/*.js'
      '.tmp/spec/**/*.js'

      # markup
      'app/views/**/*.html'
    ]

    preprocessors:
      'app/views/**/*.html': 'ng-html2js'

    # The html2js preprossessor is used to load template files
    # during testing so directives can be unit tested.
    ngHtml2JsPreprocessor:
      stripPrefix: 'app/'

    # list of files / patterns to exclude
    exclude: []

    # test results reporter to use
    # possible values: 'dots', 'progress'
    # available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['spec']

    # web server port
    port: 9876

    # level of logging
    # possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO

    # Start these browsers, currently available:
    # - Chrome
    # - ChromeCanary
    # - Firefox
    # - Opera
    # - Safari (only Mac)
    # - PhantomJS
    # - IE (only Windows)
    browsers: ['PhantomJS']

    # enable / disable watching file and executing tests whenever any file changes
    autoWatch: true

    # If browser does not capture in given timeout [ms], kill it
    captureTimeout: 5000

    # Continuous Integration mode
    # if true, it capture browsers, run tests and exit
    singleRun: false

