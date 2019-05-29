'use strict';

(function(){
    angular
        .module('hotelApp')
        .controller('emailBookingCancelCtrl', emailBookingCancelCtrl);

    emailBookingCancelCtrl.$inject= ['$scope','$http', '$stateParams','costants'];

    function emailBookingCancelCtrl($scope, $http, $stateParams, costants){
        console.log('data', $stateParams.cid);
    }

})();