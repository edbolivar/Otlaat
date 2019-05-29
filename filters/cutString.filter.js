'use strict';

(function () {
    angular
        .module('hotelApp')
        .filter('cutString', cutString);
    function cutString() {
        return function (item, cutToCharacters) {
            if (item.length < cutToCharacters) return item;
            if (!item.length) return ' ';

            return item.substr(0, cutToCharacters) + '...';
        };
    }
})();

