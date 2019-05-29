(function () {
    'use strict';
    angular
        .module('hotelApp')
        .directive('sliderFix', sliderFix);

    sliderFix.$inject = ['$window', '$timeout'];

    function sliderFix($window, $timeout) {
        return {
            restrict: 'E',
            scope: {
                slides: '=slides',
                preLoaded: '=preLoaded'
            },
            template: '<img class="hidden" ng-src="{{slide}}" slide ng-repeat="slide in slides" ng-if="slides">',
            controller: function ($scope) {
                var noImage = 'http://tartmus.ee/wp-content/uploads/2016/07/no-image-wide.jpg';
                var preLoaded = [];
                var slidesCount = $scope.slides.length;

                if (!slidesCount || (slidesCount === 1 && !$scope.slides[0])) {
                    $scope.preLoaded.push(noImage);
                }

                $scope.count = {images: 0};
                this.addSlide = function (slide) {
                    preLoaded.push(slide);
                };
                this.increaseCount = function () {
                    $scope.count.images++;
                    $scope.$apply();
                };

                $scope.$watch('count.images', function (newVal) {
                    if (newVal && newVal === slidesCount) {
                        if (slidesCount === 0) return $scope.preLoaded.push(noImage);
                        $timeout(function () {
                            $scope.preLoaded = preLoaded;
                            $scope.$apply();
                        })
                    }
                }) 
            }
        }
    }

    angular
        .module('hotelApp')
        .directive('slide', slide);

    slide.$inject = [];

    function slide() {
        return {
            restrict: 'A',
            require: '^sliderFix',
            link: function (scope, element, attrs, $ctrl) {
                element[0].addEventListener('load', function (event) {
                   $ctrl.addSlide(event.target.src);
                   $ctrl.increaseCount();
                });
                element[0].addEventListener('error', function() {
                    $ctrl.increaseCount();
                })
            }
        }
    }
})();

