
(function () {
    angular
        .module('hotelApp')
        .filter('noZero', noZero);
    function noZero() {
        return function (item) {
        	if(!item) return;
            return item.replace('.00', '');
        };
    }
})();

