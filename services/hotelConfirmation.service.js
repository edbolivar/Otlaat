(function () {
    'use strict';
    angular
        .module('hotelApp')
        .factory('hotelConfirmationService', hotelConfirmationService);

    hotelConfirmationService.$inject = ['$http', 'constants'];
    

    function hotelConfirmationService($http, constants) {

        return {
            verifyConfirmationToken: verifyConfirmationToken,
            confirmationAftPaypal: confirmationAftPaypal,
            //getConfirmation: getConfirmation
            verifyTokenPaypal:verifyTokenPaypal
        };

        //confirming booking after 2checkout payment and redirects in the confirmation page
        function verifyConfirmationToken(options){
            return $http.post(constants.requestUrls.verifyConfirmationToken + options);
        }

        //this function is to verify the token generated by paypal
        //function confirmationAftPaypal(payload) { 
        function verifyTokenPaypal(payload){
            return $http.post(constants.requestUrls.verifyTokenPaypal + payload);
        }

        //These function for confirming booking after Paypal payment
        //function getConfirmation(payload) {
        function confirmationAftPaypal(payload){
            return $http.post(constants.requestUrls.confirmationAftPaypal, payload);
        }
        
    }

})();


