# jshint quotmark:single

# Karma E2E configuration
# http://karma-runner.github.io/0.10/config/configuration-file.html
module.exports = (config) ->
  'use strict'
  config.set

    # base path, that will be used to resolve files and exclude
    basePath: '../'

    # testing framework to use (jasmine/mocha/qunit/...)
    frameworks: ['ng-scenario']

    reporters: ['spec']

    # list of files / patterns to load in the browser
    files: [
      pattern: 'app/scripts/**/*.*'
      watched: true
      included: false
      served: false
    ,
      pattern: 'app/views/**/*.html'
      watched: true
      included: false
      served: false
    ,
      pattern: 'test/mock/**/*.js'
      watched: true
      included: false
      served: false
    ,
      'test/e2e/**/*.js'
      'test/mock/**/*.js'
    ]

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

    # Needs to match the port on which the grunt connect task launches the server
    proxies:
      '/': 'http://localhost:9000/'

    # URL root prevent conflicts with the site root
    urlRoot: '_karma_'
