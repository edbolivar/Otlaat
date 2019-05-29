'use strict'; 

(function () {
    angular.
        module('hotelApp').
        controller('myReservationCtrl', myReservationCtrl);

    myReservationCtrl.$inject = ['$scope', '$http', '$stateParams', 'constants', 
         'notificationModalService', 'reservationCancelBookingModalService', 'globalSpinner', 'objToQuery', '$timeout', '$translate', '$filter'];

    function myReservationCtrl($scope, $http, $stateParams, constants,  
                                   notificationModalService, reservationCancelBookingModalService, globalSpinner, objToQuery, $timeout, $translate, $filter) {
        var clientId = $stateParams.cid;
        var bookingId = $stateParams.bid;
        var fileNumber = $stateParams.ctoken;

        var payloadData= {
            clientId: clientId,
            bookingId: bookingId,
            fileNumber: fileNumber
        };

        //console.log('logging');
        //return false;

        $scope.myReservation= {
            hotelName: '',
            hotelImage: '',
            hotelPrice: '',
            fileNumber: '',
            referenceNumber: '',
            fromDate: '',
            toDate: '',
            cancellationPolicy: '',
            lat: "",
            lng: "",
            rooms: [],
            leader: {
                firstName: '',
                lastName: ''
            },
            hotelAddress: "",
            rating: "",
            category: "0",
            cancellation: ""
        };

        $scope.cancelBooking= cancelBooking; 
        $scope.downloadVoucherInvoice= downloadVoucherInvoice;
        
        formData();

        function formData(){
            getMyResevationDetails();
            cancelBookingFormdata(); 
        }

        function getMyResevationDetails(){
            //globalSpinner.run();
            $scope.isFetching = true;
            var url= constants.requestUrls.myReservationBookingDetails +
                    '?fileNumber=' + fileNumber + '&clientId=' + clientId + '&bookingId=' + bookingId;
            $http
                .post(url)
                .then(function (response){
                    if(response.data && response.data.success === false){
                        $scope.isFetching = false;
                        if(response.data.err_msg){
                            $scope.errors={
                                serverError: response.data.err_msg
                            };
                        }else{
                            $scope.errors= response.data.error;
                        }
                    }else{
                        $scope.isFetching = false; 
                        $scope.myReservation.hotelImage = response.data.myReservationRes.image;
                        $scope.myReservation.lat = response.data.myReservationRes.coordinate1;
                        $scope.myReservation.lng = response.data.myReservationRes.coordinate2;
                        $scope.myReservation.currency= response.data.myReservationRes.Currency;
                        $scope.myReservation.hotelPrice = (response.data.myReservationRes.Price.Amount).replace(',','.');
                        $scope.myReservation.toDate = moment(response.data.myReservationRes.ToDate, "D.M.YYYY hh:mm:ss").format("MMM D YYYY");
                        $scope.myReservation.fromDate = moment(response.data.myReservationRes.FromDate, "D.M.YYYY hh:mm:ss").format("MMM D YYYY");
                        var hotelDetail = response.data.myReservationRes.HotelDetailItem.HotelDetailDTO.HotelDetailItem.HotelDetailItemDTO.Hotels.DetailHotelDTO;
                        //$scope.viewBooking.hotelName = hotelDetail.HotelName;
                        $scope.myReservation.hotelName = response.data.myReservationRes.hotelName;
                        $scope.myReservation.fileNumber = response.data.myReservationRes.FileNumber;
                        $scope.myReservation.referenceNumber = response.data.myReservationRes.referenceNumber;

                        if(hotelDetail.AvailableRoom.DetailAvailableRoomDTO['0']){
                            var htDtlCncl= hotelDetail.AvailableRoom.DetailAvailableRoomDTO['0'].HotelRoom.DetailHotelRoomDTO.CancellationPolicy.CancellationPolicyDTO;
                        }else{
                            var htDtlCncl= hotelDetail.AvailableRoom.DetailAvailableRoomDTO.HotelRoom.DetailHotelRoomDTO.CancellationPolicy.CancellationPolicyDTO;
                        }
                        //Give more condition to not allow 'cancellation' section visible. 
                        //like booking_flag as 2 and penalty date is passed ie. today date is greater than cancellation date.
                        var cancellationDate= htDtlCncl.StringDateTimeFrom;
                        $scope.cancellationDate= moment(cancellationDate).format('YYYYMMDD');

                        var cancelDt= new Date(moment(cancellationDate).format('DD-MM-YYYY'));
                        var toDt= new Date(moment().format('DD-MM-YYYY'));
                        
                        $scope.hideCancellation = (response.data.myReservationRes.booking_flag === '2'
                         || response.data.myReservationRes.booking_flag === 2) 
                         || (cancelDt < toDt);
                         
                        $scope.myReservation.hotelAddress = response.data.myReservationRes.address;
                        $scope.myReservation.rating = response.data.myReservationRes.rating;
                        $scope.myReservation.category = response.data.myReservationRes.category || "0";
                        
                        //price in respective currency
                        $scope.myReservation.payment_customer= response.data.myReservationRes.payment_customer;
                        $scope.myReservation.currency_code= response.data.myReservationRes.currency_code; //the actula payment currency

                        $scope.myReservation.otlaat_currency= response.data.myReservationRes.otlaat_currency;
                        $scope.myReservation.saudiRate = response.data.myReservationRes.saudiRate;
                        $scope.myReservation.cancellation = generateCancellationPolicy(htDtlCncl, $scope.myReservation.currency_code, $scope.myReservation.saudiRate);
                        //console.log('can', $scope.myReservation.cancellation);
                         if (!_.isArray(hotelDetail.AvailableRoom.DetailAvailableRoomDTO)) {
                            hotelDetail.AvailableRoom.DetailAvailableRoomDTO = [hotelDetail.AvailableRoom.DetailAvailableRoomDTO];
                         }
                        $scope.myReservation.rooms = hotelDetail.AvailableRoom.DetailAvailableRoomDTO.map(function (room) {
                            var roomDetails = room.HotelRoom.DetailHotelRoomDTO;
                            
                            return {
                                board: roomDetails.Board.Name,
                                characteristics: roomDetails.RoomType.Characteristic,
                                adults: getAdultsArray(room.HotelOccupancy.Occupancy.AdultCount),
                                passengers: getPassengers(room.HotelOccupancy.Occupancy.Passengers.PassengerDTO)
                            }
                        });
                        
                    }
                    globalSpinner.stop();
                }, function (error){
                    $scope.isFetching= false;
                    $scope.errors= {
                        serverError: 'Please, try again later.'
                    }
                    globalSpinner.stop();
                });
        }


        function roomDetails(room){
            var roomDetails = room.HotelRoom.DetailHotelRoomDTO;
            return {
                board: roomDetails.Board.Name,
                characteristics: roomDetails.RoomType.Characteristic,
                adults: getAdultsArray(room.HotelOccupancy.Occupancy.AdultCount),
                passengers: getPassengers(room.HotelOccupancy.Occupancy.Passengers.PassengerDTO)
            };
        } 

        function generateCancellationPolicy(cancellation, payment_currency_code, saudiRate) {
            //console.log('Data', cancellation );
            return getText(cancellation.StringDateTimeFrom, cancellation.Amount);

            function getText(dateFrom, amount) {    
                if (!amount || amount === '0') {
                    return 'Cancellation is Free for this room.'
                }
                /*return $translate.instant("payment.cancellationMessage", {
                    //price: $filter('currencyConverterFilter')(parseFloat(amount.replace(',', '.')), $scope.myReservation.otlaat_currency.currencyPrice, $scope.myReservation.otlaat_currency.currency ) ,
                    price: $scope.myReservation.hotelPrice +' '+ $scope.myReservation.currency, 
                    date: moment(dateFrom).format('DD/MM/YYYY')
                });*/
                if(payment_currency_code === 'SAR'){ 
                    return $translate.instant("payment.cancellationMessage", {
                        price: $filter('currencyConverterFilter')(parseFloat(amount.replace(',', '.')), saudiRate, $filter('lowercase')(payment_currency_code), false, false) ,
                        date: moment(dateFrom).format('DD/MM/YYYY')
                    });
                }else{ 
                    return $translate.instant("payment.cancellationMessage", {
                        price: $filter('currencyConverterFilter')(parseFloat(amount.replace(',', '.')), 1, $filter('lowercase')(payment_currency_code), false, false) ,
                        date: moment(dateFrom).format('DD/MM/YYYY')
                    });
                }
            }
        }

        function getAdultsArray(adultsCount) {
            return Array.apply(null, {length: adultsCount}).map(Number.call, Number);
        }

        function getPassengers(passengers) {
            if (Array.isArray(passengers)) {
                if (!$scope.myReservation.leader.firstName) {
                    $scope.myReservation.leader.firstName = passengers
                        .filter(function (passenger) {
                            return passenger.IsLeader == 'true';
                        })[0].Name;
                    $scope.myReservation.leader.lastName = passengers
                        .filter(function (passenger) {
                            return passenger.IsLeader == 'true';
                        })[0].LastName;
                }
                return passengers;
            } else {
                if (!$scope.myReservation.leader.firstName) {
                    $scope.myReservation.leader.firstName = passengers.Name;
                    $scope.myReservation.leader.lastName = passengers.LastName;
                }
                return [passengers];
            }
        }

        function cancelBookingFormdata(){
            //$scope.isFetching= true;
            $timeout(function(){
                if(!$scope.hideCancellation && $scope.cancellationDate){ 
                    payloadData.cancellationDate= $scope.cancellationDate;
                    $scope.cancl= $scope.cancellationDate;
                    reservationCancelBookingModalService.open(null, null, null, payloadData);
                    //$scope.isFetching= false;
                }
            }, 4000);
        }

        function cancelBooking(){
            reservationCancelBookingModalService.open(null, null, null, payloadData); 
        }

        function downloadVoucherInvoice(type){
            var downloadType= type.toUpperCase(type);
            var errors; 
            type= type + '=true';
            var url= constants.requestUrls.reservationDownloadPdf 
                + objToQuery.convert(payloadData)
                + '&' + type;
            $http
                .get(url)
                .then(function(response){
                    if(response.data && response.data.success === false){
                        if(response.data.err_msg){
                            errors= {
                                serverError: response.data.err_msg
                            }
                        }else{
                            errors= response.data.error;
                        }
                        notificationModalService.open(downloadType, errors);
                    }else{
                        var iframe = document.createElement("iframe");
                        iframe.setAttribute("src", url);
                        iframe.setAttribute("style","display: none;");
                        document.body.appendChild(iframe);
                    }
                }, function(error){
                    $scope.fetchingDownload = false;
                    var errors= {
                        serverError: 'Please, try again later.'
                    };
                    notificationModalService.open(downloadType, errors);
                });

        }

    }

})();