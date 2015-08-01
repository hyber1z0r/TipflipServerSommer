'use strict';

angular.module('tipflip.controllers', []).
    controller('AppCtrl', function ($scope, $location) {
        $scope.isActive = function (viewLocation) {
            return viewLocation === $location.path();
        };
    });