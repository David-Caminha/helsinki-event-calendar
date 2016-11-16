'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
controller('AppCtrl', function($scope, $http) {

    $http({
        method: 'GET',
        url: '/api/name'
    }).
    success(function(data, status, headers, config) {
        $scope.name = data.name;
    }).
    error(function(data, status, headers, config) {
        $scope.name = 'Error!';
    });

}).
controller('MainCtrl', ['$scope', function($scope) {
    $scope.months = [];
    $scope.months.push("February");
    $scope.months.push("March");
    $scope.months.push("April");
    $scope.months.push("May");
    $scope.months.push("June");
    $scope.months.push("July");
    $scope.months.push("August");
    $scope.months.push("September");
    $scope.months.push("October");
    $scope.months.push("November");
    $scope.months.push("December");


    $scope.myInterval = 3000;
    $scope.slides = [{
        image: 'http://lorempixel.com/400/200/'
    }, {
        image: 'http://lorempixel.com/400/200/food'
    }, {
        image: 'http://lorempixel.com/400/200/sports'
    }, {
        image: 'http://lorempixel.com/400/200/people'
    }];
}]).
controller('MyCtrl1', function($scope) {
    // write Ctrl here

}).
controller('Controller', ['$scope', function($scope) {
    $scope.customer = {
        name: 'Naomi',
        address: '1600 Amphitheatre'
    };
}]);
