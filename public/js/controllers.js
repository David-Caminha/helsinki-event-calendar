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
  success((data, status, headers, config) => {
    $scope.events = data;
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
controller('EventCreaterCtrl', function($scope, $http) {

  $scope.image =
  $scope.formData = {};
  $scope.formData.price = 0;

  // Create a new event
  $scope.createEvent = () => {
    var fd = new FormData();
    fd.append('mainImage', $scope.mainImage);
    fd.append('eventImage', $scope.eventImage);
    fd.append('locationImage', $scope.locationImage);
    fd.append('title', $scope.formData.title);
    fd.append('category', $scope.formData.category);
    fd.append('date', $scope.formData.date);
    fd.append('infoWhat', $scope.formData.infoWhat);
    fd.append('price', $scope.formData.price);
    fd.append('infoWho', $scope.formData.infoWho);
    fd.append('location', $scope.formData.location);
    fd.append('timeline', $scope.formData.timeline);
    console.log($scope.formData);
    console.log($scope.mainImage);
    console.log(fd);
    // $http.post('/api/img/upload', fd, {
    //   transformRequest: angular.identity,
    //   headers: {'Content-Type': undefined}
    // })
    // .success((data) => {
    //   $scope.formData = {};
    //   console.log('Success');
    // })
    // .error((error) => {
    //   console.log('Error: ' + error);
    // });
    $http.post('/api/events', fd, {
      transformRequest: angular.identity,
      headers: {'Content-Type': undefined}
    })
    .success((data) => {
      $scope.formData = {};
    })
    .error((error) => {
      console.log('Error: ' + error);
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
  success((data, status, headers, config) => {
    $scope.event = data[0];
    console.log($scope.event);
  }).
  error((error) => {
    $scope.event = {};
    console.log('Error: ' + error);
  });
  //get images for the same event
  $http({
    method: 'GET',
    url: '/api/images/' + $routeParams.event_id
  }).
  success((data, status, headers, config) => {
    $scope.images = data;
    console.log($scope.images);
  }).
  error((error) => {
    $scope.event = {};
    console.log('Error: ' + error);
  });

}).
controller('Controller', ['$scope', function($scope) {
  $scope.customer = {
    name: 'Naomi',
    address: '1600 Amphitheatre'
  };
}]);
