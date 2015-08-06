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
    })
    .directive('fileModel', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var model = $parse(attrs.fileModel);
                var modelSetter = model.assign;

                element.bind('change', function () {
                    scope.$apply(function () {
                        modelSetter(scope, element[0].files[0]);
                    });
                });
            }
        };
    }])
    .directive('widgetPanel', function () {
        return {
            restrict: 'E',
            replace: 'true',
            scope: {
                image: '@image',
                title: '@title',
                comment: '@comment'
            },
            templateUrl: '/app/directives/widgetpanel.html'
        }
    });
