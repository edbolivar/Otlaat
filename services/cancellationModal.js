'use strict';
(function () {
    angular
        .module('hotelApp')
        .service('cancellationModalService', cancellationModalService);

    cancellationModalService.$inject = ['$uibModal', '$document', 'HotelSearchService', '$http'];

    function cancellationModalService($uibModal, $document, HotelSearchService, $http) {

        return {
            open: open
        };

        function open(size, parentSelector, roomId) {
            var animationsEnabled = true;
            var backdrop = true;
            var parentElem = parentSelector ?
                angular.element($document[0].querySelector(parentSelector)) : undefined;
            var modalInstance = $uibModal.open({
                animation: animationsEnabled,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'templates/modal/cancellationModal.html',
                controller: function ($scope, $uibModalInstance) {
                    $scope.fetchingCancellation = true;
                    $scope.ok = ok;

                    formData();

                    function formData() {
                        HotelSearchService.getCancellation(roomId)
                            .then(function policyReceived(response) {
                                $scope.fetchingCancellation = false;
                                if (response.data.success === true) {
                                    $scope.policy = response.data.policy;
                                } else {
                                    if (response.data.err_msg) {
                                        $scope.errors = {
                                            serverError: response.data.err_msg
                                        };
                                    } else {
                                        $scope.errors = response.data.error;
                                    }
                                }
                            }, function errorReceivingPolicy(error) {
                                $scope.fetchingCancellation = false;
                                $scope.errors = {
                                    serverError: 'errorPolicy'
                                };
                            });
                    }

                    function ok() {
                        $uibModalInstance.close($scope.policy);
                    }
                },
                size: size,
                backdrop: backdrop,
                appendTo: parentElem
            });

            return modalInstance.result;
        }
    }
})();

