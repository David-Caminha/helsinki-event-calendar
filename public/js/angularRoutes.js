'use strict';

// Declare app level module which depends on filters, and services

angular.module('myApp', [
    'myApp.controllers',
    'myApp.filters',
    'myApp.services',
    'myApp.directives',
    'ui.bootstrap'
]).
config(function($routeProvider, $locationProvider) {
    $routeProvider.
    when('/', {
        templateUrl: 'partials/main.pug',
        controller: 'MainCtrl'
    }).
    when('/event', {
        templateUrl: 'partials/event.pug',
        controller: 'MyCtrl1'
    }).
    when('/teste', {
        templateUrl: 'partials/teste.pug',
        controller: 'MyCtrl2'
    }).
    otherwise({
        redirectTo: '/teste',
        controller: 'MainCtrl'
    });

    $locationProvider.html5Mode(true);
});
