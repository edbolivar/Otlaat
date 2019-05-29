(function () {
    'use strict';
    angular
        .module('hotelApp')
        .service('errorsService', errorsService);

    errorsService.$inject = [];

    function errorsService() {

        return {
           handleErrors: handleErrors
        };

        /**
         * @param serverResponse
         * @param responseType {'error'|'success'}
         */
        function  handleErrors(serverResponse, responseType) {
            var errors = {};
            console.log(serverResponse);

            if (responseType === 'success') {
                handleSuccessResponse();
            } else {
                handleErrorResponse();
            }

            return errors;

            function handleSuccessResponse() {
                if (serverResponse.data.error) {
                    try {
                        var parsedErrors = JSON.parse(serverResponse.data.error);
                    } catch (e) {
                        console.log('Wrong JSON format received from server');
                        console.log(e);
                        return errors = {
                            serverError: 'Please, try again later.'
                        };
                    }
                    _.each(parsedErrors, function (error) {
                        errors[error] = error;
                    })
                } else if (!_.isArray(serverResponse.data.err_msg)) {
                    errors = {
                        single: serverResponse.data.err_msg
                    }
                } else if (_.isArray(serverResponse.data.err_msg)) {
                    _.each(serverResponse.data.err_msg, function (error) {
                        errors[error] = error;
                    })
                } else {
                    errors = {
                        serverError: 'Please, try again later.'
                    };
                }
            }

            function handleErrorResponse() {
                errors = {
                    serverError: 'Please, try again later.'
                };
            }
        }

    }
})();

