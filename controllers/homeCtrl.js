app.controller('homeController', ['$scope', '$rootScope', 'constants', '$http', '$state', 'homePageService', '$location', '$window', 'objToQuery',
	function($scope, $rootScope, constants, $http, $state, homePageService, $location, $window, objToQuery) {
    $rootScope.addGuestPicker = ''; 
    $scope.homesTop= {};
    //$scope.homesCenter= {};
    //$scope.homesBottom= {};
    $scope.goToHotelDetails= goToHotelDetails;

    formData();

    function formData(){
    	//getHomesBottom();
    	//getHomesCenter();
    	getHomesTop();
    }

    function getHomesTop(){
    	homePageService.topImageFetch()
    		.then(function(response){
    			$scope.homesTop= response.data.homePageTop;
    		}, function(error){
    			console.log('top error', error);
    		});
    }

    function goToHotelDetails(hotel_code, city_code, country_code, country_symbol){
    	var date= new Date();
    	var today= moment(date).add(1,'days').format('YYYYMMDD');
    	var tomorrow= moment(date).add(2, 'days').format('YYYYMMDD');
        var hotelDetails={
            //hotelId: hotel_code,
            cityId: city_code ,
            countryId: country_code,
            countryCode: country_symbol,
            checkInDate: today,
            checkOutDate: tomorrow,
            "roomCriteria[0][adultCount]": "1",
            "roomCriteria[0][roomCount]": "1",
            "roomCriteria[0][childCount]": "0"
        };
        var loc= $location.$$absUrl;
        //console.log('loc', loc);
        //console.log('absUrl', $location.$$absUrl);
        /*window.open( $location.$$absUrl.replace(loc.substr(loc.indexOf('?'),8), 'hotellist') 
            + objToQuery.convert(hotelDetails), '_blank'); */
        window.open('https://www.google.com');
    }


}]);