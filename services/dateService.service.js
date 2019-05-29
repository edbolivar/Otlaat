(function () {
    'use strict';
    angular.module('hotelApp').service('DateService', function () {
        var service = this;

        service.getMomentTimestampDate = getMomentTimestampDate;
        service.formatDate = formatDate;
        service.formatDateForApi = formatDateForApi;
        service.getMoment = getMoment;
        service.addPeriodToDate = addPeriodToDate;
        service.parseDate = parseDate;

        function getMomentTimestampDate(date, isEmpty) {
            return isEmpty ? date ? moment(date).valueOf() : undefined
                : date ? moment(date).valueOf() : moment().valueOf();
        }

        function formatDateForApi(date) {
            return moment(date).format('YYYYMMDD');
        }

        function formatDate(date, format) {
            var defaultFormat = 'YYYYMMDD';
            format = format || defaultFormat;
            return date ? moment(date).format(format) : moment(date).format() ;
        }

        function getMoment(date) {
            return date ? moment(date) : moment(new Date().setHours(0, 0, 0, 0));
        }

        function addPeriodToDate(timeNumber, timePeriod, date) {
            return date
                ? moment(date).add(timeNumber, timePeriod).valueOf()
                : moment().add(timeNumber, timePeriod).valueOf();
        }

        function parseDate(str) {
            var y = str.substr(0, 4),
                m = str.substr(4, 2) - 1,
                d = str.substr(6, 2);
            var D = new Date(y, m, d); 
            return (D.getFullYear() == y && D.getMonth() == m && D.getDate() == d) ? D : 'invalid date';
        }
    });
})();

