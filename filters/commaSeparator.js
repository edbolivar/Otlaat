(function () {
    angular.module('hotelApp')
        .filter('commaSeparator', commaSeparator);

    commaSeparator.$inject = [];


    function commaSeparator() {
        return function (element) {

            return addCommas(element);

            function addCommas(nStr) {
                nStr += '';
                x = nStr.split('.');
                x1 = x[0];
                x2 = x.length > 1 ? '.' + x[1] : '';
                var rgx = /(\d+)(\d{3})/;
                while (rgx.test(x1)) {
                    x1 = x1.replace(rgx, '$1' + ',' + '$2');
                }
                return x1 + x2;
            }
        }
    }
})();