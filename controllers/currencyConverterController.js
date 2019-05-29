app.controller("currencyConverterController", ['$scope', 'currencyConverterService', '$location',
	function ($scope, currencyConverterService, $location) {
	$scope.currencyConverter= currencyConverterService.currencyConverter;
	if($location.$$path == "/myReservation"){
		$scope.isCurrencyShow= true;
	}else{
		$scope.isCurrencyShow= false;
	}
	//console.log('cc', $scope.isCurrencyShow);
	//http://www.apilayer.net/api/convert?access_key=2e4cbcd76f696299f54821f3febc8d9e&from=USD&to=SAR&amount=1&format=1
}]);	

