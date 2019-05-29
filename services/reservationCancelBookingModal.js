'use strict';
(function () { 
    angular
        .module('hotelApp')
        .service('reservationCancelBookingModalService', reservationCancelBookingModalService);

    reservationCancelBookingModalService.$inject = ['$uibModal', '$document', 'HotelSearchService', '$http', 'constants', 'userProfileService', '$state'
        ];

    function reservationCancelBookingModalService($uibModal, $document, HotelSearchService, $http, constants, userProfileService, $state
        ) {
        
        return {
            open: open,
            validateEmailCancellation: validateEmailCancellation
        };

        function open(size, parentSelector, roomId, payloadData) {
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
                        var url = constants.requestUrls.reservationCancelBooking +
                            '?clientId=' + payloadData.clientId +
                            '&bookingId=' + payloadData.bookingId +
                            '&cancelReason=' + encodeURI($scope.cancelReason) + 
                            '&fileNumber=' + payloadData.fileNumber +
                            '&cancellationDate=' + payloadData.cancellationDate;

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
                                    if(response.data && response.data.success === true){
                                        $scope.canceldetails = response.data;
                                        $scope.bookingCancelled = true;
                                    }
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

        function validateEmailCancellation(cid, bid, ctoken){
            return $http({
                url: constants.requestUrls.validateEmailCancellation 
                        + '?clientId=' + cid 
                        + '&bookingId=' + bid
                        + '&fileNumber=' + ctoken,
                method: "GET",
                data: {}
            });
        }


    }
})();

