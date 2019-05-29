(function () {
    'use strict';
    angular
        .module('hotelApp')
        .directive('loader', loader);

    loader.$inject = ['$window', '$timeout'];

    function loader($window, $timeout) {
        return {
            restrict: 'E',
            link: function(scope, element, attrs) {
                if (attrs.global) {
                    return angular.element(element).addClass('global');
                }

                if (attrs.center) {
                    element[0].querySelector(".spinner-container").style.top = "calc(50% - 62px)"
                }

                if (attrs.screenTop) {
                    var scrollTop     = $(window).scrollTop(),
                        elementOffset = $(element).find('.spinner-container').offset().top,
                        distance      = (elementOffset + scrollTop);
                    return $timeout(function () {
                        $(element).find('.spinner-container').css({top:  distance + 100})
                    })
                }

                if (!attrs.noJs) {
                    $timeout(function () {
                        var eTop = $(element).offset().top; //get the offset top of the element
                        $(element).find('.spinner-container').css({top:  eTop*(-1) + 350})
                    })
                }
            }
        }
    }
})();