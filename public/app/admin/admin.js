/**
 * Created by jakobgaardandersen on 10/07/15.
 */
'use strict';

angular.module('tipflip.admin', ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/admin', {
            templateUrl: '/app/admin/admin.html',
            controller: 'AdminCtrl'
        });
    }])

    .controller('AdminCtrl', function ($scope) {
        $scope.hello = 'Hello from admin';
    });