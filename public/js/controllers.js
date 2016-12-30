'use strict';

//Utility
function pad(number) {
    var r = String(number);
    if (r.length === 1) {
        r = '0' + r;
    }
    return r;
}

function dateForDB(date) {
    return date.getUTCFullYear() +
        '-' + pad(date.getUTCMonth() + 1) +
        '-' + pad(date.getUTCDate()) +
        'T' + pad(date.getUTCHours()) +
        ':' + pad(date.getUTCMinutes()) +
        'Z';
}

/* Controllers */

angular.module('myApp.controllers', []).
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
    $scope.formData.date = new Date("2017-01-01T00:00:00Z");

    console.log(dateForDB($scope.formData.date));

    // Create a new event
    $scope.createEvent = () => {
        var fd = new FormData();
        fd.append('mainImage', $scope.mainImage);
        fd.append('eventImage', $scope.eventImage);
        fd.append('locationImage', $scope.locationImage);
        fd.append('speakers', $scope.speakerImage1);
        fd.append('speakers', $scope.speakerImage2);
        fd.append('speakers', $scope.speakerImage3);
        fd.append('speakers', $scope.speakerImage4);
        fd.append('speakers', $scope.speakerImage5);
        fd.append('speakers', $scope.speakerImage6);
        fd.append('speakers', $scope.speakerImage7);
        fd.append('speakers', $scope.speakerImage8);
        fd.append('speakers', $scope.speakerImage9);
        fd.append('title', $scope.formData.title);
        fd.append('category', $scope.formData.category);
        fd.append('date', dateForDB($scope.formData.date));
        fd.append('infoWhat', $scope.formData.infoWhat);
        fd.append('price', $scope.formData.price);
        fd.append('infoWho', $scope.formData.infoWho);
        fd.append('location', $scope.formData.location);
        fd.append('timeline', $scope.formData.timeline);
        console.log($scope.formData);
        console.log($scope.mainImage);
        console.log(fd);
        $http.post('/api/events', fd, {
                transformRequest: angular.identity,
                headers: {
                    'Content-Type': undefined
                }
            })
            .then(function successCallback(response) {
                $scope.formData = {};
            }, function errorCallback(response) {
                console.log('Error: ' + response.data);
            });
    };

}).
controller('EventPageCtrl', function($scope, $http, $routeParams) {

    console.log("route params: " + $routeParams.event_id);
    //get info for one event
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
    //get images for the same event
    $http({
        method: 'GET',
        url: '/api/images/' + $routeParams.event_id
    }).
    then(function successCallback(response) {
        $scope.images = response.data;
        console.log($scope.images);
    }, function errorCallback(response) {
        $scope.images = {};
        console.log('Error: ' + response.data);
    });

}).
controller('Controller', ['$scope', function($scope) {
    $scope.customer = {
        name: 'Naomi',
        address: '1600 Amphitheatre'
    };
}]);
