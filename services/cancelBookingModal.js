'use strict';
(function () {
    angular
        .module('hotelApp')
        .service('cancelBookingModalService', cancelBookingModalService);

    cancelBookingModalService.$inject = ['$uibModal', '$document', 'HotelSearchService', '$http', 'constants', 'userProfileService',
        'authService', '$state'];

    function cancelBookingModalService($uibModal, $document, HotelSearchService, $http, constants, userProfileService,
        authService, $state) {
        var fileNumber;

        return {
            open: open,
            setFileNumber: setFileNumber,
            //authenticateCancellation: authenticateCancellation
        };

        function open(size, parentSelector, roomId, fileNumber, cancellationDate) {
            var animationsEnabled = true;
            var backdrop = 'static';
            var parentElem = parentSelector ?
                angular.element($document[0].querySelector(parentSelector)) : undefined;
            var modalInstance = $uibModal.open({
                animation: animationsEnabled,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'templates/modal/cancelBooking.html',
                controller: function ($scope, $uibModalInstance) {
                    $scope.ok = ok;
                    $scope.cancelBooking = cancelBooking;
                    $scope.goToBookingCancelledPage = goToBookingCancelledPage;

                    function cancelBooking() {
                        var url = constants.requestUrls.cancelBooking +
                            '?email=' + userProfileService.getEmail() +
                            '&api_token=' + authService.getToken() +
                            '&cancelReason=' + encodeURI($scope.cancelReason) + 
                            '&fileNumber=' + fileNumber +
                            '&cancellationDate=' + cancellationDate;

                        $scope.fetchingCancellation = true;
                        $http.post(url)
                            .then(function (response) { 
                                $scope.fetchingCancellation = false;
                                if (response.data && response.data.success === false) {
                                    if (response.data.err_msg) {
                                        $scope.errors = {
                                            serverError: response.data.err_msg
                                        };
                                    } else {
                                        $scope.errors = response.data.error;
                                    }
                                } else {
                                    $scope.canceldetails = response.data;
                                    $scope.bookingCancelled = true;
                                }
                            }, function () {
                                $scope.fetchingCancellation = true;
                                $scope.errors = {
                                    serverError: 'Please, try again later.'
                                };
                            });

                    }
                    //

                    function goToBookingCancelledPage() { 
                        $state.go('bookingCancelled', {canceldetails: $scope.canceldetails});
                        $uibModalInstance.close();
                    }

                    function ok() {
                        $uibModalInstance.close();
                    }
                },
                size: size,
                backdrop: backdrop,
                appendTo: parentElem
            });

            return modalInstance.result;
        }
        //

        function setFileNumber(fileNumber){
            return localStorage.setItem("otlaat.fileNumber", fileNumber);
        }

        function getFileNumber(){
            return localStorage.getItem("otlaat.fileNumber");
        }

        /*function authenticateCancellation(fileNumber){
            return $http({
                url: constants.requestUrls.authenticateCancellation 
                        + '&fileNumber=' + fileNumber,
                method: "GET",
                data: {}
            });
        }*/
    }
})();

