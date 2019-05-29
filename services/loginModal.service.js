(function () {
    'use strict';
    angular
        .module('hotelApp')
        .factory('loginModalService', loginModalService);

    loginModalService.$inject = ['$uibModal'];

    function loginModalService($uibModal) {

        return {
            open: open
        };

        function open(size, parentSelector, animationsEnabled, items, isTokenInvalid) {
            animationsEnabled = animationsEnabled || true;
            if (!items || !items.length) {
                items  = [];
            }

            var backdrop = true;

            if (isTokenInvalid) {
                backdrop = 'static'
            }

            var parentElem = parentSelector ?
                angular.element($document[0].querySelector('.modal-demo ' + parentSelector)) : undefined;
            var modalInstance = $uibModal.open({
                animation: animationsEnabled,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'templates/modal/login.html',
                controller: 'ModalInstanceCtrl',
                controllerAs: '$ctrl',
                size: size,
                backdrop: backdrop,
                appendTo: parentElem,
                resolve: {
                    items: function () {
                        return items;
                    },
                    isTokenInvalid: function () {
                        return isTokenInvalid
                    }
                }
            });

            return modalInstance.result;
        }
    }
})();

