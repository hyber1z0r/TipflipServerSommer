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
        $scope.hello = 'This is where you manage and create categories';
    })
    .controller('AdminCenterCtrl', function ($scope, apiFactory, $modal) {
        $scope.hello = 'This is where you manage and create centres';

        var getAllCenters = function () {
            apiFactory.getAllCenters()
                .success(function (data, status, headers, config) {
                    $scope.centers = data;
                })
                .error(function (data, status, headers, config) {

                })
        };

        getAllCenters();

        $scope.createCenter = function () {
            apiFactory.createCenter($scope.centerName, $scope.centerLocation, $scope.centerImage)
                .success(function (data, status, headers, config) {
                    alert('Success!');
                    getAllCenters();
                })
                .error(function (data, status, headers, config) {
                    alert('Error, status: ' + status);
                    console.log(status);
                    console.log(data);
                })
        };

        $scope.open = function (name, location) {
            $modal.open({
                animation: true,
                templateUrl: 'templates/centermapmodal.html',
                controller: 'CenterMapModalCtrl',
                size: 'lg',
                resolve: {
                    name: function () {
                        return name;
                    },
                    location: function () {
                        return location;
                    }
                }

            });
        };

    })
    .controller('CenterMapModalCtrl', function ($scope, $modalInstance, name, location) {
        $scope.name = name;
        $scope.location = location;
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    })

    .controller('AdminOfferCtrl', function ($scope) {
        $scope.hello = 'This is where you manage and create offers';
    });