(function () {
    'use strict';
    angular
        .module('hotelApp')
        .factory('objToQuery', objToQuery);

    objToQuery.$inject = [];
    function objToQuery() {
        return {
            convert: convert
        };

        function convert(obj) {
            var parts = [];
            for (var key in obj) { 
                if (obj.hasOwnProperty(key) && obj[key] != '' && obj[key]) {
                    parts.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]));
                }
            }
            return "?" + parts.join('&');
        }
    }
})();
