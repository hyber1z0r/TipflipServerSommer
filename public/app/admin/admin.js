/**
 * Created by jakobgaardandersen on 10/07/15.
 */
'use strict';

angular.module('tipflip.admin', ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/admin', {
            templateUrl: '/app/admin/admin.html',
            controller: 'AdminCtrl'
        })
            .when('/admin/store', {
                templateUrl: '/app/admin/store.html',
                controller: 'AdminStoreCtrl'
            })
            .when('/admin/category', {
                templateUrl: '/app/admin/category.html',
                controller: 'AdminCategoryCtrl'
            })
            .when('/admin/center', {
                templateUrl: '/app/admin/center.html',
                controller: 'AdminCenterCtrl'
            })
            .when('/admin/offer', {
                templateUrl: '/app/admin/offer.html',
                controller: 'AdminOfferCtrl'
            });
    }])

    .controller('AdminCtrl', function ($scope, $location) {
        $scope.go = function (path) {
            $location.path(path);
        };
        $scope.hello = 'Welcome to the main overview admin dashboard page';
    })
    .controller('AdminStoreCtrl', function ($scope) {
        $scope.hello = 'This is where you manage and create stores';
    })
    .controller('AdminCategoryCtrl', function ($scope) {
        $scope.hello = 'This is where you manage and create categoires';
    })
    .controller('AdminCenterCtrl', function ($scope) {
        $scope.hello = 'This is where you manage and create centres';
    })
    .controller('AdminOfferCtrl', function ($scope) {
        $scope.hello = 'This is where you manage and create offers';
    });