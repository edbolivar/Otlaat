(function () {
    'use strict';
    angular
        .module('hotelApp')
        .directive('maxSize', maxSize);

    maxSize.$inject = [];

    function maxSize() {
        return {
            link: function(scope, element, attrs) {
                var maxSize = attrs.maxSize;
                element.bind('keydown keypress keyup', function(e) {
                    if (e.target.value.length > maxSize && e.keyCode !== 8) return e.preventDefault();
                });
            }
        }
    }
})();

