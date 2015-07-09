angular.module('tipflip.controllers', []).
    controller('AppCtrl', function ($scope, $location) {
        $scope.isActive = function (viewLocation) {
            return viewLocation === $location.path();
        };
        // WHEN IT COMES TO LOGIN, CHECK THE SAMPLE CREATED IN SEMESTERPROJECT

    });