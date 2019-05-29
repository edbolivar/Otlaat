(function () {
    'use strict';
    angular
        .module('hotelApp')
        .directive('initTrueModel', initTrueModel);

    function initTrueModel() {
        return {
            scope: {
                'model': '=ngModel'
            },
            link: function(scope, element, attrs) {
                return;
                scope.model = true;
            }
        }
    }
})();

