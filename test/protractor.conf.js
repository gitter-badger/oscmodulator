exports.config = {
  capabilities:{
    browserName: "phantomjs",
    'phantomjs.binary.path': './node_modules/karma-phantomjs-launcher/node_modules/phantomjs/bin/phantomjs'
  },

  specs: ["protractor/*spec.coffee","protractor/*spec.js"],

  jasmineNodeOpts: {
      silent: true
  },

  onPrepare: function() {
    require('jasmine-spec-reporter');
    jasmine.getEnv().addReporter(new jasmine.SpecReporter({displayStacktrace: false}));
  }

};
