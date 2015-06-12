/**
 * Created by jakobgaardandersen on 12/06/15.
 */
'use strict';

angular.module('tipflip.home', ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: '/app/home/home.html',
            controller: 'HomeCtrl'
        });
    }])

    .controller('HomeCtrl', function ($scope) {
        $scope.hello = 'Hello from homeCtrl'
    });