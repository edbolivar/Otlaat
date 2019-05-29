(function () {
    angular
    .module('hotelApp')
    .filter('byHotelPreferences', byHotelPreferences);
    function byHotelPreferences() {
        return function (items, params) {
            if (_.isEmpty(params)) {
                return items;
            } else {
                var activeServices = [],
                    filteredItems = [];
                _.each(params, function (item, index) {
                    if (item) {
                        activeServices.push((index));
                    }
                });
                if (_.isEmpty(activeServices)) {
                    return items;
                } else {
                    _.each(items, function (item) {
                        var isIncludeAll = true;
                        _.each(activeServices, function (code) {
                            if (!_.includes(item.preferences, code)) {
                                isIncludeAll = false;
                            }

                        });
                        if (isIncludeAll) {
                            filteredItems.push(item);
                        }
                    });
                    return _.uniq(filteredItems);
                }
            }
        };
    }
})();
