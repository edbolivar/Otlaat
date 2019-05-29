'use strict';
(function () {
    angular
        .module('hotelApp')
        .service('modalsStackService', modalsStackService);

    modalsStackService.$inject = [];

    function modalsStackService($uibModal, $document) {

        var modalsCloseFunctionsArray = [];

        return {
            closeAll: closeAll,
            addNew: addNew
        };

        function closeAll() {
            _.each(modalsCloseFunctionsArray, function (close) {
                close();
            })
        }

        function addNew(closeModalFunc) {
            modalsCloseFunctionsArray.push(closeModalFunc);
        }

    }
})();