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

    var getOffers = function () {
        return $http.get('/api/offers');
    };

    return {
        getCategories: getCategories,

        getCenters: getCenters,
        createCenter: createCenter,
        deleteCenter: deleteCenter,

        getOffers: getOffers
    }
});


