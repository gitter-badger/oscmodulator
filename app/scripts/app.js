angular.module('oscmodulatorApp', ['ui.bootstrap']).config(function ($routeProvider) {
  'use strict';

  $routeProvider.when('/', {
    templateUrl : 'views/main.html',
    controller : 'MainCtrl'
  }).otherwise({
    redirectTo : '/'
  });
});
