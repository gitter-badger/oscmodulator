'use strict';

angular.module('oscmodulatorApp', []).config(['$routeProvider', '$httpProvider', function ($routeProvider /*, $httpProvider*/) {
  $routeProvider.when('/', {
    templateUrl : 'views/main.html',
    controller : 'MainCtrl'
  }).otherwise({
      redirectTo : '/'
    });
}]);
