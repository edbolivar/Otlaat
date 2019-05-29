(function (){
	'use strict';
	angular
		.module('hotelApp') 
		.factory('homePageService', homePageService);

	homePageService.$inject= ['$http', 'constants'];

	function homePageService($http, constants){
		return {
			//bottomImageFetch: bottomImageFetch,
			//centerImageFetch: centerImageFetch,
			topImageFetch: topImageFetch
		};
		/*
		function bottomImageFetch(){
			return $http.get(constants.requestUrls.homePageBottom);
		}

		function centerImageFetch(){
			return $http.get(constants.requestUrls.homePageCenter);
		}
		*/

		function topImageFetch(){
			return $http.get(constants.requestUrls.homePageTop);
		}
	}

})();