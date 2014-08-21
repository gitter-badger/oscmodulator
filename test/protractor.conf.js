exports.config = {
  capabilities:{
    browserName: "phantomjs",
    'phantomjs.binary.path': './node_modules/karma-phantomjs-launcher/node_modules/phantomjs/bin/phantomjs'
  },

  specs: ["protractor/*spec.coffee","protractor/*spec.js"]
};