(function () {
    'use strict';
    angular
        .module('hotelApp')
        .factory('paypalService', paypalService);

    paypalService.$inject = ['$uibModal', '$http', 'modalsStackService', 'constants'];
    

    function paypalService($uibModal, $http, modalsStackService, constants) {

        return {
            open: open
        };

        
        function open(size, parentSelector, animationsEnabled, items) {
            animationsEnabled = animationsEnabled || true;
            if (!items || !items.length) {
                items  = [];
            }

            var parentElem = parentSelector ?
                angular.element($document[0].querySelector('.modal-demo ' + parentSelector)) : undefined;
            var modalInstance = $uibModal.open({
                animation: animationsEnabled,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'templates/modal/paypalPopup.html',
                controller: function ($scope, $uibModalInstance) {
                    $scope.close= close;
                    $scope.dismiss = dismiss;

                    function close(){
                        $uibModalInstance.close(true);
                    }

                    function dismiss() {
                        $uibModalInstance.dismiss(true);
                    }
                },
                size: 'sm',
                windowClass: 'two-checkout-modal-size',
                appendTo: parentElem,
                resolve: {
                },
                backdrop: 'static'
            });

            return modalInstance.result;
        }
    }

    

})();


