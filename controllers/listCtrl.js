app.controller('listController', ['$scope', '$http', '$location', '$window', function ($scope, $http, $location, $window) {

    $scope.bookNow = bookNow;
    $scope.changePageCallback = changePageCallback;

    function bookNow(hotel) {
        $scope.hotelsSearchParams.hotelId = hotel.hotelCode;
        $window.open($location.search($scope.hotelsSearchParams).$$absUrl.replace('hotellist', 'hoteldetails'), '_blank');
    }

    function changePageCallback() {
        document.body.scrollTop = 0; // For Chrome, Safari and Opera
        document.documentElement.scrollTop = 0; // For IE and Firefox
    }

}]);