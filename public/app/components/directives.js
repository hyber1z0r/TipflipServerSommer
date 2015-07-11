'use strict';

/* Directives */

angular.module('tipflip.directives', [])
    .directive('footerTemplate', function () {
        return {
            restrict: 'E',
            replace: 'true',
            templateUrl: '/app/directives/footer.html'
        }
    })
    .directive('sideBar', function () {
        return {
            restrict: 'E',
            replace: 'true',
            templateUrl: '/app/directives/sidebar.html'
        }
    });
