'use strict';

// Declare app level module which depends on views, and components
angular.module('tipflip', [
    'ngRoute',
    'ngAnimate',
    'mgcrea.ngStrap', // angular-strap
    'ui.bootstrap', // angular bootstrap
    'ngMap',
    'toastr',
    'tipflip.controllers',
    'tipflip.directives',
    'tipflip.factories',
    'tipflip.filters',
    'tipflip.services',
    'tipflip.home',
    'tipflip.login',
    'tipflip.admin'
])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.otherwise({redirectTo: '/'});
    }])

    .config(['$httpProvider', function ($httpProvider) {
        $httpProvider.interceptors.push('authInterceptor');
    }]);