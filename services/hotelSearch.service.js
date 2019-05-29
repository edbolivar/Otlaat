(function () {
    'use strict';
    angular
        .module('hotelApp')
        .factory('HotelSearchService', HotelSearchService);

    HotelSearchService.$inject = ['$http', 'objToQuery', 'constants', '$timeout'];

    function HotelSearchService($http, objToQuery, constants, $timeout) {
        return {
            getLocation: getLocation,
            hotelSearch: hotelSearch,
            hotelDetailSearch: hotelDetailSearch,
            fetchBrokenImage: fetchBrokenImage,
            //getCancellation: getCancellation
        };

        function getLocation(params) {
            //return $http.get('/otlaat/autoSearch' + objToQuery.convert(params));
            return $http.get('/otlaat/fakes/autosearchResultSuccess.json');
        }

        function hotelSearch(params, isFilters) {
            //var url = isFilters ? '/otlaat/searchHotelsFilters' : '/otlaat/searchHotels';
            //return $http.post(url + params);
            return $http.get(isFilters ? '/otlaat/fakes/hotelListsFilter.json' : '/otlaat/fakes/hotelList.json');
            /*var url = isFilters ? '/hotels/searchHotelsFilters' : '/hotels/searchHotels';
            return $http.post(url + params);*/
        }

        function hotelDetailSearch(params) {
            //return $http.post('/otlaat/singleDetailHotels' + params); //use this
            //return $http.post('/hotels/singleDetailHotels' + params); //use this
            return $http.get('/otlaat/fakes/hotelDetail1.json');
        }

        /*function getCancellation() {
            return $http.get('fakes/policy.json')
        }*/

        function fetchBrokenImage(params){ //console.log('Params found here', params);
           
            $timeout(function(){
                return $http.post(constants.requestUrls.fetchBrokenImage, params);
            });
        }
    }


})();



