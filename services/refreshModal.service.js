'use strict';
(function () {
    angular
        .module('hotelApp')
        .service('refreshModalService', refreshModalService);

    refreshModalService.$inject = ['$uibModal', '$document', 'modalsStackService'];

    function refreshModalService($uibModal, $document, modalsStackService) {

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
                templateUrl: 'templates/modal/refreshModal.html',
                controller: function ($scope, $uibModalInstance) {
                    $scope.ok = ok;
                    modalsStackService.addNew(function () {
                        $uibModalInstance.dismiss();
                    });
                    function ok() {
                        $uibModalInstance.close($scope.policy);
                    }
                },
                size: size,
                backdrop: 'static',
                appendTo: parentElem
            });

            return modalInstance.result;
        }
    }
})();

