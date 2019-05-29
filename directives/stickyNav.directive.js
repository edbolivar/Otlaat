(function () {
    'use strict';
    angular
        .module('hotelApp')
        .directive('stickyNav', stickyNav);

    stickyNav.$inject = ['$timeout'];

    function stickyNav($timeout) {
        return {
            template: '<span style="color: grey;" class="hidden-xs">{{"hotelDetails.goto" | translate}} </span>\n' +
            '        <div class="hotel-details-nav hotel-details-navs__details" data-id="details" ng-click="goTo(\'details\')">{{\'HotelSummaryTitle1\' | translate}}</div>\n' +
            '        <div class="hotel-details-nav hotel-details-navs__rooms" data-id="rooms" ng-click="goTo(\'rooms\')" translate="hotelDetails.roomRates"></div>\n' +
            '        <div class="hotel-details-nav hotel-details-navs__amenities" data-id="amenities" ng-click="goTo(\'amenities\')">{{\'hotelDetails.amenities\' | translate}}\n' +
            '        </div>',
            link: function (scope, element, attrs) {
                var navTabContents = $('.nav-tab-content');
                var windowElement = $(window);
                var tabs = $('.hotel-details-nav');
                var initialNavTop;
               /* $timeout(function () {
                    initialNavTop = $(element).offset().top;
                }, 1000);*/
                scope.elementHeight = $(element).height();

                windowElement.scroll(scrollCallback);
                tabs.on('click', activateTab);

                function scrollCallback() {
                    // if (!$(element).offset().top) return;

                    if (windowElement.scrollTop() < initialNavTop) {
                        $(element).removeClass('sticky-nav');
                        $('.sticky-nav-helper').remove();
                    }

                    if ((windowElement.scrollTop() >= $(element).offset().top)) {
                        initialNavTop = $(element).offset().top;
                        autoTabbing();
                        $(element).addClass('sticky-nav');
                        if ($('.sticky-nav-helper').length) return;
                        $('<div class="sticky-nav-helper" style="height:70px"></div>').insertAfter(element);
                    }
                }

                function activateTab() {
                    tabs.removeClass('active');
                    $(this).addClass('active');
                }

                function autoTabbing() {
                    _.each(navTabContents, function (tab) {
                        if (scope.goToCall) return;
                        var elementTop = $(tab).offset().top - windowElement.scrollTop();
                        var elementBottom = $(tab).offset().top + $(tab).height() - windowElement.scrollTop();
                        if (elementTop < 57 && elementBottom > 37) {
                            $('.hotel-details-navs__' + tab.id).addClass('active');
                        } else {
                            $('.hotel-details-navs__' + tab.id).removeClass('active');
                        }
                    });
                }
            },
            controller: function ($scope, $timeout) {
                $scope.goTo = goTo;
                var delay = 1000; //ms
                function goTo(idSelector) {
                    $scope.goToCall = true;
                    $timeout(function () {
                       $scope.goToCall = false;
                    }, delay + 100);
                    $('html, body').animate({
                        scrollTop: $("#" + idSelector).offset().top - $scope.elementHeight - 10
                    }, delay);
                }
            }
        }
    }
})();

