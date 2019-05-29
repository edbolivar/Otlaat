angular
.module('hotelApp')
.directive('sliderDetails', function() {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      angular.element(element).myPlugin(scope.$eval(attrs.sliderDetails));

      scope.$on("$destroy", function(){
        // Remove jQuery plugin from element to prevent memory leaks
        // If your plugin doesn't have a remove function its probably not well suited to persistent javascript environments
        element.myPlugin("destroy");
      });
    }
  };
});