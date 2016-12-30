'use strict';

/* Directives */

angular.module('myApp.directives', []).
directive('scroll', function($window) {
    return function(scope, element, attrs) {
        angular.element($window).bind("scroll", function() {
            var winTop = $(this).scrollTop();
            var $sections = $('section');
            var $navBar = $('.navElement');

            var top = $.grep($sections, function(item) {
                return $(item).position().top <= winTop + 200;
            });

            var topId = $(top).last().attr("id");
            var navBarHighLight = $('.' + topId);

            $navBar.removeClass('active');
            $(navBarHighLight).addClass('active');
            scope.$apply();
        });
    };
}).
directive('fileInput', ['$parse', function($parse){
  return {
    restrict:'A',
    link:function(scope, elm, attrs){
      elm.bind('change', function(){
        $parse(attrs.fileInput)
        .assign(scope, elm[0].files[0])
        scope.$apply();
      })
    }
  }
}]);;









// .directive('appVersion', function(version) {
//     return function(scope, elm, attrs) {
//         elm.text(version);
//     };
// });
