'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
controller('AppCtrl', function($scope, $http) {

    // $http({
    //   method: 'GET',
    //   url: '/api/name'
    // }).
    // success(function(data, status, headers, config) {
    //   $scope.name = data.name;
    // }).
    // error(function(data, status, headers, config) {
    //   $scope.name = 'Error!';
    // });

}).
controller('MainCtrl', ['$scope', '$http', function($scope, $http) {

    //get all events
    $http({
        method: 'GET',
        url: '/api/events'
    }).
    then(function successCallback(response) {
        $scope.events = response.data;
        console.log($scope.events);
    }, function errorCallback(response) {
        $scope.events = [];
        console.log('Error: ' + response.data);
    });


    // success((data, status, headers, config) => {
    //   $scope.events = data;
    // }).
    // error((error) => {
    //   $scope.events = [];
    //   console.log('Error: ' + error);
    //});
    $scope.tags = [{
            text: 'Tag1'
        },
        {
            text: 'Tag2'
        },
        {
            text: 'Tag3'
        }
    ];
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

    $scope.hoverIn = function() {
        this.hoverEdit = true;
    };

    $scope.hoverOut = function() {
        this.hoverEdit = false;
    };

    $scope.myFilter = function(e) {
        var isMatch = false;
        var words = [];

        if ($scope.inputText) {
            for (var obj in $scope.inputText) {
                words.push($scope.inputText[obj].text);
            }
            if (words.length == 0)
                isMatch = true;
            words.forEach(function(word) {
                if (e.category != null)
                    if (new RegExp(word.toUpperCase()).test(e.category.toUpperCase())) {
                        isMatch = true;
                    }
                if (e.location != null)
                    if (new RegExp(word.toUpperCase()).test(e.location.toUpperCase())) {
                        isMatch = true;
                    }
                if (e.title != null)
                    if (new RegExp(word.toUpperCase()).test(e.title.toUpperCase())) {
                        isMatch = true;
                    }
            });
            // words.forEach(function(part)){
            //   if(new RefExp(part).test(e))
            //     isMatch = true;
            // }
            //  parts.forEach(function(part) {
            //    if (new RegExp(part).test(post)) {
            //      isMatch = true;
            //    }
            //  });
        } else {
            isMatch = true;
        }
        return isMatch;
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
controller('EventCreaterCtrl', function($scope, $http) {

    $scope.formData = {};
    $scope.formData.price = 0;

    // Create a new event
    $scope.createEvent = () => {
        $http.post('/api/events', $scope.formData)
            .then(function successCallback(response) {
                $scope.formData = {};
            }, function errorCallback(response) {
                console.log('Error: ' + response.data);
            });

        // .success((data) => {
        //   $scope.formData = {};
        // })
        // .error((error) => {
        //   console.log('Error: ' + error);
        // });
    };

}).
controller('EventPageCtrl', function($scope, $http, $routeParams) {

    console.log("route params: " + $routeParams.event_id);
    //get one event
    $http({
        method: 'GET',
        url: '/api/events/' + $routeParams.event_id
    }).
    then(function successCallback(response) {
        $scope.event = response.data[0];
        console.log($scope.event);
    }, function errorCallback(response) {
        $scope.event = {};
        console.log('Error: ' + response.data);
    });
    // success((data, status, headers, config) => {
    //   $scope.event = data[0];
    //   console.log($scope.event);
    // }).
    // error((error) => {
    //   $scope.event = {};
    //   console.log('Error: ' + error);
    //});

}).
controller('Controller', ['$scope', function($scope) {
    $scope.customer = {
        name: 'Naomi',
        address: '1600 Amphitheatre'
    };
}]);
