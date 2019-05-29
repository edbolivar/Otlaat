(function () {
    'use strict';
    angular
        .module('hotelApp')
        .factory('notificationModalService', notificationModalService);

    notificationModalService.$inject = ['$uibModal'];

    function notificationModalService($uibModal) {

        return {
            open: open
        };

        function open(title, content) {
            var parentSelector;
            var animationsEnabled = true;
            var backdrop = true;
            var parentElem = parentSelector ?
                angular.element($document[0].querySelector('.modal-demo ' + parentSelector)) : undefined;
            var modalInstance = $uibModal.open({
                animation: animationsEnabled,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'templates/modal/notificationModal.html',
                controller: 'notificationModalController',
                size: 'md',
                backdrop: backdrop,
                resolve: {
                    title: function () {
                        return title;
                    },
                    content: function () {
                        return content
                    }
                }
            });

            return modalInstance.result;
        }
    }

    angular
        .module('hotelApp')
        .controller('notificationModalController', notificationModalController);

    notificationModalController.$inject = ['$scope', '$uibModalInstance', 'title', 'content'];

    function notificationModalController($scope, $uibModalInstance, title, content) {
        $scope.title = title;
        $scope.content = content;
        $scope.ok = ok;
        $scope.cancel = cancel;

        function ok() {
           $uibModalInstance.close();
        }

        function cancel() {
            $uibModalInstance.dismiss();
        }
    }
})();

