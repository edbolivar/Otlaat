(function () {
    'use strict';
    angular
        .module('hotelApp')
        .factory('twoCheckoutModalService', twoCheckoutModalService);

    twoCheckoutModalService.$inject = ['$uibModal', '$http', 'modalsStackService', 'constants'];
    

    function twoCheckoutModalService($uibModal, $http, modalsStackService, constants) {

        return {
            open: open,
            addToPayment: addToPayment
        };

        function addToPayment(options){
            return $http.post(constants.requestUrls.addToPayment, options);
        }

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
                templateUrl: 'templates/modal/twoCheckoutModal.html',
                controller: function ($scope, $uibModalInstance) {
                    $scope.submit = function () {
                        $scope.fetching2Checkout = true;
                    };

                    modalsStackService.addNew(function () {
                        $uibModalInstance.dismiss();
                    });

                    $scope.ok = ok;

                    function ok() {
                        $uibModalInstance.close($scope.policy);
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


