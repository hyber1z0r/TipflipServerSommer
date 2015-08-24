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
            })
            .when('/admin/offers/:id', {
                templateUrl: '/app/admin/offerdetail.html',
                controller: 'AdminOfferDetailCtrl'
            })
            .when('/admin/users', {
                templateUrl: '/app/admin/user.html',
                controller: 'AdminUserCtrl'
            });
    }])

    .controller('AdminCtrl', ['$scope', '$location', 'apiFactory', function ($scope, $location, apiFactory) {
        $scope.go = function (path) {
            $location.path(path);
        };
        $scope.categories = 0;
        $scope.centers = 0;
        $scope.stores = 0;
        $scope.offers = 0;

        var getCounts = function () {
            apiFactory.getCount('categories')
                .success(function (data, status, headers, config) {
                    $scope.categories = data.count;
                });
            apiFactory.getCount('centers')
                .success(function (data, status, headers, config) {
                    $scope.centers = data.count;
                });
            apiFactory.getCount('stores')
                .success(function (data, status, headers, config) {
                    $scope.stores = data.count;
                });
            apiFactory.getCount('offers')
                .success(function (data, status, headers, config) {
                    $scope.offers = data.count;
                });
        };

        getCounts();
    }])
    .controller('AdminCategoryCtrl', ['$scope', 'apiFactory', 'toastr', function ($scope, apiFactory, toastr) {
        $scope.categories = [];

        apiFactory.getCategories()
            .success(function (data, status, headers, config) {
                if (status === 204) {
                    toastr.info('No categories are created yet! Why don\'t you create one?', 'Information');
                    $('#categoryName').focus();
                } else {
                    $scope.categories = data;
                }
            })
            .error(function (data, status, headers, config) {
                // Can only be status 500
                toastr.error('Internal error!', 'Error!');
                console.log('Error in getCategories: ' + data);
            });

        var getNewCategory = function (url) {
            apiFactory.getNewEntity(url)
                .success(function (data, status, headers, config) {
                    $scope.categories.push(data);
                })
                .error(function (data, status, headers, config) {
                    if (status === 500) {
                        toastr.error('System failure', 'Error!');
                        console.log('Error in getNewCategory: ' + data);
                    } else {
                        // This is triggered when 400, or 404
                        toastr.warning(data.message, 'Warning!');
                    }
                });
        };

        $scope.createCategory = function () {
            apiFactory.createCategory($scope.categoryName, $scope.categoryImage)
                .success(function (data, status, headers, config) {
                    toastr.success(data.message, 'Success!');
                    $scope.categoryName = '';
                    $('.fileinput').fileinput('clear');
                    getNewCategory(headers('Location'));
                })
                .error(function (data, status, headers, config) {
                    if (status === 500) {
                        toastr.error('System failure', 'Error!');
                        console.log('Error in createCategory: ' + data);
                    } else {
                        // This is triggered when 400, or 409
                        toastr.warning(data.message, 'Warning!');
                        $('#categoryName').focus()
                    }
                });
        };
    }])
    .controller('AdminCenterCtrl', ['$scope', 'apiFactory', '$modal', 'toastr', function ($scope, apiFactory, $modal, toastr) {
        $scope.centers = [];

        apiFactory.getCenters()
            .success(function (data, status, headers, config) {
                if (status === 204) {
                    toastr.info('No centers are created yet! Why don\'t you create one?', 'Information');
                    $('#centerName').focus();
                } else {
                    $scope.centers = data;
                }
            })
            .error(function (data, status, headers, config) {
                // Can only be status 500
                toastr.error('Internal error!', 'Error!');
                console.log('Error in getCenters: ' + data);
            });


        var getNewCenter = function (url) {
            apiFactory.getNewEntity(url)
                .success(function (data, status, headers, config) {
                    $scope.centers.push(data);
                })
                .error(function (data, status, headers, config) {
                    if (status === 500) {
                        toastr.error('System failure', 'Error!');
                        console.log('Error in getNewCenter: ' + data);
                    } else {
                        // This is triggered when 400, or 404
                        toastr.warning(data.message, 'Warning!');
                    }
                });
        };

        $scope.createCenter = function () {
            apiFactory.createCenter($scope.centerName, $scope.centerLocation, $scope.centerImage)
                .success(function (data, status, headers, config) {
                    toastr.success(data.message, 'Success!');
                    $scope.centerName = '';
                    $scope.centerLocation = '';
                    $('.fileinput').fileinput('clear');
                    getNewCenter(headers('Location'));
                })
                .error(function (data, status, headers, config) {
                    if (status === 500) {
                        toastr.error('System failure', 'Error!');
                        console.log('Error in createCenter: ' + data);
                    } else {
                        // This is triggered when 400, or 409
                        toastr.warning(data.message, 'Warning!');
                        $('#centerName').focus();
                    }
                });
        };

        // TODO pass whole center object, if possible, to splice from the array instead of refetching.
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
    }])
    .controller('CenterMapModalCtrl', ['$scope', '$modalInstance', 'name', 'location',
        function ($scope, $modalInstance, name, location) {
            $scope.name = name;
            $scope.location = location;
            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        }])
    .controller('AdminStoreCtrl', ['$scope', 'apiFactory', 'toastr', function ($scope, apiFactory, toastr) {
        $scope.stores = [];
        $scope.centers = [];

        apiFactory.getStores()
            .success(function (data, status, headers, config) {
                if (status === 204) {
                    toastr.info('No stores are created yet! Why don\'t you create one?', 'Information');
                    $('#storeName').focus();
                } else {
                    $scope.stores = data;
                }
            })
            .error(function (data, status, headers, config) {
                // Can only be status 500
                toastr.error('System failure', 'Error!');
                console.log('Error in getStores' + data);
            });

        var getNewStore = function (url) {
            apiFactory.getNewEntity(url)
                .success(function (data, status, headers, config) {
                    $scope.stores.push(data);
                })
                .error(function (data, status, headers, config) {
                    if (status === 500) {
                        toastr.error('System failure', 'Error!');
                        console.log('Error in getNewStore: ' + data);
                    } else {
                        // This is triggered when 400, or 404
                        toastr.warning(data.message, 'Warning!');
                    }
                });
        };

        apiFactory.getCenters()
            .success(function (data, status, headers, config) {
                if (status === 204) {
                    toastr.info('No centers are created yet! You need to create one to proceed!', 'Information');
                } else {
                    $scope.centers = data;
                }
            })
            .error(function (data, status, headers, config) {
                // Can only be status 500
                toastr.error('Internal error!', 'Error!');
                console.log('Error in getCenters: ' + data);
            });

        $scope.createStore = function () {
            apiFactory.createStore($scope.storeName, $scope.storeCenter, $scope.storeImage)
                .success(function (data, status, headers, config) {
                    toastr.success(data.message, 'Success!');
                    $scope.storeName = '';
                    $('#storeCenter').val('');
                    $('.fileinput').fileinput('clear');
                    getNewStore(headers('Location'));
                })
                .error(function (data, status, headers, config) {
                    if (status === 500) {
                        toastr.error('System failure', 'Error!');
                        console.log('Error in createStore: ' + data);
                    } else {
                        // This is triggered when 400, or 409
                        toastr.warning(data.message, 'Warning!');
                        $('#storeName').focus();
                    }
                });
        }
    }])
    .controller('AdminOfferCtrl', ['$scope', 'apiFactory', 'toastr', function ($scope, apiFactory, toastr) {
        $scope.offers = [];

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

    }])
    .controller('AdminOfferDetailCtrl', ['$scope', 'apiFactory', 'toastr', '$routeParams', '$location',
        function ($scope, apiFactory, toastr, $routeParams, $location) {
            var offerID = $routeParams.id;
            apiFactory.getOffer(offerID)
                .success(function (data, status, headers, config) {
                    $scope.offer = data;
                    var expiration = Date.parse($scope.offer.expiration);
                    $scope.isExpired = expiration < Date.now();
                })
                .error(function (data, status, headers, config) {
                    if (status === 500) {
                        toastr.error('System failure', 'Error!');
                    } else {
                        toastr.warning(data.message, 'Warning!');
                    }
                    $location.path('/admin/offers');
                });
        }])
    .controller('AdminUserCtrl', ['$scope', 'apiFactory', 'toastr', function ($scope, apiFactory, toastr) {

    }]);