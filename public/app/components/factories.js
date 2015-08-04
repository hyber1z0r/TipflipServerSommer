'use strict';

/* Factories */

var app = angular.module('tipflip.factories', []);

app.factory('authInterceptor', function ($rootScope, $q, $window) {
    return {
        request: function (config) {
            config.headers = config.headers || {};
            if ($window.sessionStorage.token) {
                config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
            }
            return config;
        },
        responseError: function (rejection) {
            if (rejection.status === 401) {
                // handle the case where the user is not authenticated
            }
            return $q.reject(rejection);
        }
    };
});

app.factory('apiFactory', function ($http, $cacheFactory) {
    var getCategories = function () {
        return $http.get('/api/categories', {cache: true});
    };

    var createCategory = function (name, image) {
        // invalidate the cache when doing a post request
        $cacheFactory.get('$http').remove('/api/categories');
        var fd = new FormData();
        fd.append('name', name);
        fd.append('image', image);
        return $http.post('/api/categories', fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        });
    };

    var getCenters = function () {
        return $http.get('/api/centers', {cache: true});
    };

    var createCenter = function (name, location, image) {
        $cacheFactory.get('$http').remove('/api/centers');
        var fd = new FormData();
        fd.append('name', name);
        fd.append('location', location);
        fd.append('image', image);
        return $http.post('/api/centers', fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        });
    };

    var deleteCenter = function (id) {
        $cacheFactory.get('$http').remove('/api/centers');
        return $http.delete('/api/centers/' + id);
    };

    var getStores = function () {
        return $http.get('/api/stores', {cache: true});
    };

    var createStore = function (name, center, image) {
        $cacheFactory.get('$http').remove('/api/stores');
        var fd = new FormData();
        fd.append('name', name);
        fd.append('_center', center);
        fd.append('image', image);
        return $http.post('/api/stores', fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        });
    };

    var getOffers = function () {
        return $http.get('/api/offers', {cache: true});
    };

    // TODO when someone updates an offer, we should invalidate cache
    var getOffer = function (offerID) {
        return $http.get('/api/offers/' + offerID);
    };

    var getCount = function (model) {
        return $http.get('api/count/' + model);
    };

    return {
        getCategories: getCategories,
        createCategory: createCategory,

        getCenters: getCenters,
        createCenter: createCenter,
        deleteCenter: deleteCenter,

        getStores: getStores,
        createStore: createStore,

        getOffers: getOffers,
        getOffer: getOffer,

        getCount: getCount
    }
});


