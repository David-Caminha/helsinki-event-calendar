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
        templateUrl: '/partials/main.pug',
        controller: 'MainCtrl'
    }).
    when('/event/:event_id', {
        templateUrl: '/partials/event.pug',
        controller: 'EventPageCtrl'
    }).
    when('/create_event', {
        templateUrl: '/partials/createEvent.pug',
        controller: 'EventCreaterCtrl'
    }).
    when('/teste', {
        templateUrl: '/partials/teste.pug',
        controller: 'MainCtrl'
    }).
    otherwise({
        redirectTo: '/'
    });

    $locationProvider.html5Mode(true);
});
