/* jshint quotmark:single */
// Karma E2E configuration

// base path, that will be used to resolve files and exclude
basePath = '../';

// list of files / patterns to load in the browser
files = [
//  JASMINE, // TODO I don't believe we need these jasmine files.
//  JASMINE_ADAPTER,
  ANGULAR_SCENARIO,
  ANGULAR_SCENARIO_ADAPTER,
  {pattern:'app/scripts/**/*.js', watched:true, included:false, served:false},
  {pattern:'app/views/**/*.html', watched:true, included:false, served:false},
  'test/e2e/**/*.js'
];

// list of files to exclude
exclude = [];

// test results reporter to use
// possible values: dots || progress || growl
reporters = ['progress'];

// web server port
port = 8080;

// cli runner port
runnerPort = 9100;

// enable / disable colors in the output (reporters and logs)
colors = true;

// level of logging
// possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
logLevel = LOG_INFO;

// enable / disable watching file and executing tests whenever any file changes
autoWatch = false;

// Start these browsers, currently available:
// - Chrome
// - ChromeCanary
// - Firefox
// - Opera
// - Safari (only Mac)
// - PhantomJS
// - IE (only Windows)
browsers = ['Chrome'];

// If browser does not capture in given timeout [ms], kill it
captureTimeout = 5000;

// Continuous Integration mode
// if true, it capture browsers, run tests and exit
singleRun = false;

// Needs to match the port on which the grunt connect task launches the server
proxies = {
  '/' : 'http://localhost:9002/'
};

urlRoot = '/karma/';