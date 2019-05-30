
(function () {
    angular
        .module('hotelApp')
        .filter('byHotelName', byHotelName);
    function byHotelName() {
        return function (items, params) {
            if (_.isEmpty(params)) {
                return items;
            } else {
                var activeServices = [],
                    // filteredItems = [];
                _.each(params, function (item, index) {
                    if (item) {
                        activeServices.push((index));
                    }
                });
                if (_.isEmpty(activeServices)) {
                    return items;
                } else {
                    filteredItems = _.sortBy(items, 'hotelName', params);
                    return filteredItems;
                }
            }
        };
    }
})();

