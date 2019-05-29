'use strict';
(function () {
    angular
        .module('hotelApp')
        .service('confirmErrorModalService', confirmErrorModalService);

    confirmErrorModalService.$inject = ['$uibModal', '$document', 'modalsStackService'];

    function confirmErrorModalService($uibModal, $document, modalsStackService) {

        return {
            open: open
        };

        function open(closeCallback, errorcatch) {
            var parentSelector;
            var animationsEnabled = true;
            var backdrop = true;
            var parentElem = parentSelector ?
                angular.element($document[0].querySelector(parentSelector)) : undefined;
            var modalInstance = $uibModal.open({
                animation: animationsEnabled,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'templates/modal/confirmErrorModal.html',
                controller: function ($scope, $uibModalInstance, errorcatch) {
                    $scope.ok = ok;
                    $scope.errorcatch = errorcatch;
                    modalsStackService.addNew(function () {
                        $uibModalInstance.dismiss();
                    });
                    function ok() {
                        $uibModalInstance.close();
                        closeCallback();
                    }
                },
                size: 'md',
                backdrop: 'static',
                appendTo: parentElem,
                resolve: {
                    errorcatch: function () {
                        return errorcatch;
                    }
                }
            });

            return modalInstance.result;
        }
    }
})();