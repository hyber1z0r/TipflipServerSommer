module.exports = function (config) {
    config.set({

        basePath: '../',

        files: [
            'public/vendor/angular/angular.js',
            'public/vendor/angular-route/angular-route.js',
            'public/vendor/angular-mocks/angular-mocks.js',
            'public/vendor/angular-loader/angular-loader.js',
            'public/app/*.js',
            'public/app/components/**/*.js',
            'public/app/components/*.js',
            'test/frontend/app/components/*.js'
        ],

        autoWatch: true,

        frameworks: ['jasmine'],

        browsers: ['Chrome'],

        plugins: [
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-jasmine'
        ],

        junitReporter: {
            outputFile: 'test_out/unit.xml',
            suite: 'unit'
        }

    });
};