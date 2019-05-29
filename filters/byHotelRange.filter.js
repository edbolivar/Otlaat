(function () {
    angular
    .module('hotelApp')
    .filter('byHotelRange', Filter);

    Filter.$inject = [];

    function Filter() {
        return function (items, params) {
            if (params) {
                return _.filter(items, function (item) {
                    var price = item.price;
                    return price >= params.priceRange.minValue && price <= params.priceRange.maxValue;
                });
            } else {
                return items;
            }
        };
    }
})();
