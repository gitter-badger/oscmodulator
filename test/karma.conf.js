/*jshint quotmark:single*/
// Karma configuration

// base path, that will be used to resolve files and exclude
basePath = '../app';


// list of files / patterns to load in the browser
files = [
  JASMINE,
  JASMINE_ADAPTER,
  'components/jquery/jquery.js',
  'components/angular/angular.js',
  'components/angular-mocks/angular-mocks.js',
  'components/angular-bootstrap/ui-bootstrap-tpls.js',
//  'app/config.js',
//  'app/config_overrides.js',
  'scripts/app.js',
  'scripts/**/*.js',
  '../test/spec/**/*.js',
  'views/*.html'
];

// The html2js preprossessor is used to load template files
// during testing so directives can be unit tested.
preprocessors = {
  '**/*.html': 'html2js'
};

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
singleRun = true;