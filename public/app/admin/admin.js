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
    .controller('AdminCenterCtrl', function ($scope, apiFactory, $modal, toastr) {
        $scope.centers = [];

        var getCenters = function () {
            apiFactory.getCenters()
                .success(function (data, status, headers, config) {
                    if (status === 204) {
                        toastr.info('No centers are created yet! Why don\'t you create one?', 'Information', {
                            tapToDismiss: true,
                            positionClass: 'toast-top-right',
                            progressBar: true
                        });
                        document.getElementById('centerName').focus();
                    } else {
                        $scope.centers = data;
                    }
                })
                .error(function (data, status, headers, config) {
                    // Can only be status 500
                    toastr.error('Internal error!', 'Error!', {
                        tapToDismiss: true,
                        positionClass: 'toast-top-right',
                        progressBar: true
                    });
                    console.log('Error in getCenters: ' + data);
                });
        };

        getCenters();

        $scope.createCenter = function () {
            apiFactory.createCenter($scope.centerName, $scope.centerLocation, $scope.centerImage)
                .success(function (data, status, headers, config) {
                    toastr.success(data.message, 'Success!', {
                        tapToDismiss: true,
                        positionClass: 'toast-top-right',
                        progressBar: true
                    });
                    getCenters();
                })
                .error(function (data, status, headers, config) {
                    if (status === 500) {
                        toastr.error('System failure', 'Error!', {
                            tapToDismiss: true,
                            positionClass: 'toast-top-right',
                            progressBar: true
                        });
                        console.log('Error in createCenter: ' + data);
                    } else {
                        // This is triggered when 400, or 409
                        toastr.warning(data.message, 'Warning!', {
                            tapToDismiss: true,
                            positionClass: 'toast-bottom-full-width',
                            progressBar: true
                        });
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

    .controller('AdminOfferCtrl', function ($scope, apiFactory) {
        $scope.offers = [];

        var getOffers = function () {
            apiFactory.getOffers()
                .success(function (data, status, headers, config) {
                    if (status === 204) {
                        toastr.info('No offers are created yet!', 'Information', {
                            tapToDismiss: true,
                            positionClass: 'toast-top-right',
                            progressBar: true
                        });
                    } else {
                        $scope.offers = data;
                    }
                })
                .error(function (data, status, headers, config) {
                    // Can only be status 500
                    toastr.error('System failure', 'Error!', {
                        tapToDismiss: true,
                        positionClass: 'toast-top-right',
                        progressBar: true
                    });
                    console.log('Error in getCenters' + data);
                });
        };
        getOffers();
    });