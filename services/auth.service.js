'use strict';

(function () {
    angular
        .module('hotelApp')
        .service('authService', authService);

    authService.$inject = ['$rootScope'];

    function authService($rootScope) {

        var userLoggedInCallbacks = [];

        function getToken() {
            return localStorage.getItem("otlaat.api_token");
        }

        function subscribeOnUserSignIn(callback) {
            userLoggedInCallbacks.push(callback)
        }

        function propagateUserSignedIn(userData) {
            angular.forEach(userLoggedInCallbacks, function (callback) {
                callback(userData);
            })
        }

        return {
            getToken: getToken,
            subscribeOnUserSignIn: subscribeOnUserSignIn,
            propagateUserSignedIn: propagateUserSignedIn
        };

    }
})();

