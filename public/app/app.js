'use strict';

// Declare app level module which depends on views, and components
angular.module('tipflip', [
    'ngRoute',
    'ngAnimate',
    'ui.bootstrap',
    'ngMap',
    'toastr',
    'mgcrea.ngStrap',
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