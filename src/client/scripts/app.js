'use strict';

var oscmodulatorUIApp = angular.module('oscmodulatorUIApp', [])
    .config(['$routeProvider', '$httpProvider', function ($routeProvider, $httpProvider)
{
    $routeProvider
        .when('/', {
            templateUrl:'views/main.html',
            controller:'MainCtrl'
        })
        .otherwise({
            redirectTo:'/'
        });

    //delete $httpProvider.defaults.headers.common["X-Requested-With"];
}]);
