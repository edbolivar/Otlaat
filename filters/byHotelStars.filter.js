(function () {
    'use strict';

    angular
        .module('hotelApp')
        .filter('byHotelStars', Filter);

    function Filter() {
        return function (items, params) {
            var activeStars = [];

            _.each(params, function (item, index) {
                if(item) {
                    activeStars.push(index);
                }
            });

            if (activeStars.length === 0) {
                return items;
            } else {
                return _.filter(items, function (item) {
                    return _.includes(activeStars, item.category);
                    //return _.includes(activeStars, Math.round(parseFloat(item.stars) / 2));
                });
            }
        };
    }
})();
