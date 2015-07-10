'use strict';

// Declare app level module which depends on views, and components
angular.module('tipflip', [
    'ngRoute',
    'tipflip.controllers',
    'tipflip.directives',
    'tipflip.factories',
    'tipflip.filters',
    'tipflip.services',
    'tipflip.home',
    'tipflip.login'
])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.otherwise({redirectTo: '/'});
    }])

    .config(function ($httpProvider) {
        $httpProvider.interceptors.push('authInterceptor');
    });