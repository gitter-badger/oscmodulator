// Testacular configuration


// Base path, that will be used to resolve files and excludes.
// Had to set this to the app folder so that template files
// could be loaded from within tests using the html2js preprocessor
// using the same path as the angular application.
basePath = 'app';


// List of files / patterns to load in the browser.
// Had to list these in the same order as the index file
// so dependencies could be loaded correctly. Hopefully
// using require.js will help remove the need for this.
files = [
  JASMINE,
  JASMINE_ADAPTER,
  'components/angular/angular.js',
  'components/angular-mocks/angular-mocks.js',
  'scripts/vendor/jquery-1.7.2.min.js',
  'scripts/vendor/jquery-ui-1.8.16.custom.min.js',
  'scripts/vendor/jquery.ui.touch-punch.js',
  'scripts/vendor/jquery.mjs.nestedSortable.js',
  'components/bootstrap/docs/assets/js/bootstrap.js',
  'scripts/app.js',
  'scripts/controllers/main.js',
  'scripts/directives/midi-input.js',
  'scripts/directives/nested-sortable.js',
  '../test/mock/**/*.js',
  '../test/spec/**/*.js',
  'views/*.html'
];

// The html2js preprossessor is used to load template files
// during testing so directives can be unit tested.
preprocessors = {
    '**/*.html': 'html2js'
};

// list of files to exclude
exclude = [
    'scripts/vendor/otherVersions/*.js'
];

// test results reporter to use
// possible values: dots || progress
reporter = 'progress';

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
// - Safari
// - PhantomJS
browsers = ['PhantomJS'];

// Continuous Integration mode
// if true, it capture browsers, run tests and exit
singleRun = false;
