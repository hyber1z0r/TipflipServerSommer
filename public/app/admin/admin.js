/**
 * Created by jakobgaardandersen on 10/07/15.
 */
'use strict';

angular.module('tipflip.admin', ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/admin', {
                templateUrl: '/app/admin/overview.html',
                controller: 'AdminCtrl'
            })
            .when('/admin/categories', {
                templateUrl: '/app/admin/category.html',
                controller: 'AdminCategoryCtrl'
            })
            .when('/admin/centers', {
                templateUrl: '/app/admin/center.html',
                controller: 'AdminCenterCtrl'
            })
            .when('/admin/stores', {
                templateUrl: '/app/admin/store.html',
                controller: 'AdminStoreCtrl'
            })
            .when('/admin/offers', {
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
    .controller('AdminCategoryCtrl', function ($scope, apiFactory, toastr) {
        $scope.categories = [];

        var getCategories = function () {
            apiFactory.getCategories()
                .success(function (data, status, headers, config) {
                    if (status === 204) {
                        toastr.info('No categories are created yet! Why don\'t you create one?', 'Information');
                        document.getElementById('categoryName').focus();
                    } else {
                        $scope.categories = data;
                    }
                })
                .error(function (data, status, headers, config) {
                    // Can only be status 500
                    toastr.error('Internal error!', 'Error!');
                    console.log('Error in getCategories: ' + data);
                });
        };

        getCategories();

        $scope.createCategory = function () {
            apiFactory.createCategory($scope.categoryName, $scope.categoryImage)
                .success(function (data, status, headers, config) {
                    toastr.success(data.message, 'Success!');
                    $scope.categoryName = '';
                    angular.element($('.fileinput').fileinput('clear'));
                    getCategories();
                })
                .error(function (data, status, headers, config) {
                    if (status === 500) {
                        toastr.error('System failure', 'Error!');
                        console.log('Error in createCategory: ' + data);
                    } else {
                        // This is triggered when 400, or 409
                        toastr.warning(data.message, 'Warning!');
                        document.getElementById('categoryName').focus();
                    }
                });
        };


    })
    .controller('AdminCenterCtrl', function ($scope, apiFactory, $modal, toastr) {
        $scope.centers = [];

        var getCenters = function () {
            apiFactory.getCenters()
                .success(function (data, status, headers, config) {
                    if (status === 204) {
                        toastr.info('No centers are created yet! Why don\'t you create one?', 'Information');
                        document.getElementById('centerName').focus();
                    } else {
                        $scope.centers = data;
                    }
                })
                .error(function (data, status, headers, config) {
                    // Can only be status 500
                    toastr.error('Internal error!', 'Error!');
                    console.log('Error in getCenters: ' + data);
                });
        };

        getCenters();

        $scope.createCenter = function () {
            apiFactory.createCenter($scope.centerName, $scope.centerLocation, $scope.centerImage)
                .success(function (data, status, headers, config) {
                    toastr.success(data.message, 'Success!');
                    $scope.centerName = '';
                    $scope.centerLocation = '';
                    angular.element($('.fileinput').fileinput('clear'));
                    getCenters();
                })
                .error(function (data, status, headers, config) {
                    if (status === 500) {
                        toastr.error('System failure', 'Error!');
                        console.log('Error in createCenter: ' + data);
                    } else {
                        // This is triggered when 400, or 409
                        toastr.warning(data.message, 'Warning!');
                        document.getElementById('centerName').focus();
                    }
                });
        };

        $scope.deleteCenter = function (id) {
            alert('Function not implemented yet!');
            //apiFactory.deleteCenter(id)
            //    .success(function (data, status, headers, config) {
            //        alert('Success');
            //    })
            //    .error(function (data, status, headers, config) {
            //        // TODO make the error messages more convenient!
            //        alert('Error, check console')
            //        console.log(status);
            //        console.log(data);
            //    });
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
    .controller('AdminStoreCtrl', function ($scope, apiFactory, toastr) {
        $scope.stores = [];
        $scope.centers = [];

        var getStores = function () {
            apiFactory.getStores()
                .success(function (data, status, headers, config) {
                    if (status === 204) {
                        toastr.info('No stores are created yet! Why don\'t you create one?', 'Information');
                        document.getElementById('storeName').focus();
                    } else {
                        console.log(data);
                        $scope.stores = data;
                    }
                })
                .error(function (data, status, headers, config) {
                    // Can only be status 500
                    toastr.error('System failure', 'Error!');
                    console.log('Error in getStores' + data);
                });
        };
        getStores();

        var getCenters = function () {
            apiFactory.getCenters()
                .success(function (data, status, headers, config) {
                    $scope.centers = data;
                })
        };

        getCenters();

        $scope.alertIt = function () {
            alert($scope.storeCenter);
        }
    })
    .controller('AdminOfferCtrl', function ($scope, apiFactory, toastr) {
        $scope.offers = [];

        var getOffers = function () {
            apiFactory.getOffers()
                .success(function (data, status, headers, config) {
                    if (status === 204) {
                        toastr.info('No offers are created yet!', 'Information');
                    } else {
                        $scope.offers = data;
                    }
                })
                .error(function (data, status, headers, config) {
                    // Can only be status 500
                    toastr.error('System failure', 'Error!');
                    console.log('Error in getOffers' + data);
                });
        };
        getOffers();
    });