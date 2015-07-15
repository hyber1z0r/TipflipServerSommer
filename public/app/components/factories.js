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

app.factory('apiFactory', function ($http) {
    var getCategories = function () {
        return $http.get('/api/categories');
    };

    var createCategory = function (name, image) {
        var fd = new FormData();
        fd.append('name', name);
        fd.append('image', image);
        return $http.post('/api/categories', fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        });
    };

    var getCenters = function () {
        return $http.get('/api/centers');
    };

    var createCenter = function (name, location, image) {
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
        return $http.delete('/api/centers/' + id);
    };

    var getStores = function () {
        return $http.get('/api/stores');
    };

    var getOffers = function () {
        return $http.get('/api/offers');
    };

    return {
        getCategories: getCategories,
        createCategory: createCategory,

        getCenters: getCenters,
        createCenter: createCenter,
        deleteCenter: deleteCenter,

        getStores: getStores,

        getOffers: getOffers
    }
});


