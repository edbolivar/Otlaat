'use strict';

(function () {
    angular
        .module('hotelApp')
        .service('globalSpinner', globalSpinner);

    globalSpinner.$inject = ['$rootScope'];

    function globalSpinner($rootScope) {

        return {
            run: run,
            stop: stop
        };

        function run(globalSpinnerText, notTransparent) {
            $rootScope.globalSpinnerNotTransparent = notTransparent || false;
            $rootScope.globalSpinnerText = globalSpinnerText;
            $rootScope.globalSpinner = true;
        }

        function stop() {
            $rootScope.globalSpinnerText = null;
            $rootScope.globalSpinner = false;
        }

    }


})();

