'use strict';

(function () {
    angular
        .module('hotelApp')
        .filter('filterBookings', filterBookings);

    filterBookings.$inject = [];

    function filterBookings() {
        return function (items, param) {
            if (!param) {
                return items;
            } else if (param === 'upcoming') {
                return filterUpcoming(items);
            } else if (param === 'completed') {
                return filterCompleted(items)
            } else if(param === 'cancelled'){
                return filterCancelled(items)
            }

            function filterCancelled(items){ 
                return _
                    .chain(items)
                    .orderBy(orderByDate, 'desc')
                    .filter(function (item) {
                        return item.booking_flag == '2'
                    })
                    .value();
            }

            function filterUpcoming(items) { 
                return _
                    .chain(items)
                    .orderBy(orderByDate, 'desc')
                    .filter(function (item) {
                        var toDate = formatDate(item.toDate).getTime();
                        var today = new Date().getTime();
                        return (today < toDate) && (item.booking_flag != '2');
                    })
                    .value();
            }

            function filterCompleted(items) {
                return _
                    .chain(items)
                    .orderBy(orderByDate, 'desc')
                    .filter(function (item) {
                        var toDate = formatDate(item.toDate).getTime();
                        var today = new Date().getTime();
                        return (today > toDate) && (item.booking_flag != '2');;
                    })
                    .value();
            }

            function formatDate(date) {
                date = date.toString();
                return new Date(date.substring(0, 4), date.substring(4, 6) - 1, date.substring(6, 8));
            }

            function orderByDate(item) {
                return formatDate(item.fromDate).getTime();
            }
        };
    }
})();

