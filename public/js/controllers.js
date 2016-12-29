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
controller('MainCtrl', ['$scope', '$http', function($scope, $http) {

    //get all events
    $http({
        method: 'GET',
        url: '/api/events'
    }).
    success(function(data, status, headers, config) {
        $scope.events = data;
        console.log(data);
    }).
    error((error) => {
        $scope.events = [];
        console.log('Error: ' + error);
    });

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
    
    $scope.hoverIn = function(){
        this.hoverEdit = true;
    };

    $scope.hoverOut = function(){
        this.hoverEdit = false;
    };

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
controller('MyCtrl2', function($scope) {
    // write Ctrl here

}).
controller('Controller', ['$scope', function($scope) {
    $scope.customer = {
        name: 'Naomi',
        address: '1600 Amphitheatre'
    };
}]);
