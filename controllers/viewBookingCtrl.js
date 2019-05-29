'use strict';

(function () {
    angular.module('hotelApp').controller('viewBookingController', viewBookingController);

    viewBookingController.$inject = ['$scope', '$http', '$stateParams', 'constants', 'userProfileService',
        'authService', 'notificationModalService', 'cancelBookingModalService', 'globalSpinner', "$translate", '$filter'];

    function viewBookingController($scope, $http, $stateParams, constants, userProfileService, authService,
                                   notificationModalService, cancelBookingModalService, globalSpinner, $translate, $filter) {

        var fileNumber = $stateParams.fileNumber;

        $scope.viewBooking = {
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
            ReferenceNumber:'',
            category: "0",
            cancellation: ""
        };


        $scope.cancelBooking = cancelBooking;
        $scope.downloadVoucherInvoice = downloadVoucherInvoice;

        formData(); 

        function formData() {
            requestBookingDetails();
            setFileNumber(); 
            //requestBookingPriceFromDb();
        }

        function requestBookingDetails() {
            //globalSpinner.run(); 
            $scope.isFetching = true;
            var url = constants.requestUrls.bookingDetails +
                '?email=' + userProfileService.getEmail() +
                '&api_token=' + authService.getToken() +
                '&fileNumber=' + fileNumber;
            $http
                .post(url)
                .then(function (response) { 
                    if (response.data && response.data.success === false) {
                        $scope.isFetching = false;
                        if (response.data.err_msg) {
                            $scope.errors = {
                                serverError: response.data.err_msg
                            };
                        } else {
                            $scope.errors = response.data.error;
                        }
                    } else {
                        $scope.isFetching = false;
                        $scope.viewBooking.hotelImage = response.data.myBookingDetailsRes.image;
                        $scope.viewBooking.lat = response.data.myBookingDetailsRes.coordinate1;
                        $scope.viewBooking.lng = response.data.myBookingDetailsRes.coordinate2; 
                        $scope.viewBooking.hotelPrice = (response.data.myBookingDetailsRes.Price.Amount).replace(',','.');
                        $scope.viewBooking.toDate = moment(response.data.myBookingDetailsRes.ToDate, "D.M.YYYY hh:mm:ss").format("MMM D YYYY");
                        $scope.viewBooking.fromDate = moment(response.data.myBookingDetailsRes.FromDate, "D.M.YYYY hh:mm:ss").format("MMM D YYYY");
                        var hotelDetail = response.data.myBookingDetailsRes.HotelDetailItem.HotelDetailDTO.HotelDetailItem.HotelDetailItemDTO.Hotels.DetailHotelDTO;
                        //$scope.viewBooking.hotelName = hotelDetail.HotelName;
                        $scope.viewBooking.hotelName = response.data.myBookingDetailsRes.hotelName;
                        $scope.viewBooking.fileNumber = response.data.myBookingDetailsRes.FileNumber;
                        //$scope.viewBooking.referenceNumber = response.data.myBookingDetailsRes.ReferenceNumber;
                        $scope.viewBooking.referenceNumber = response.data.myBookingDetailsRes.referenceNumber;
                        $scope.viewBooking.ReferenceNumber = response.data.myBookingDetailsRes.ReferenceNumber;

                        if(hotelDetail.AvailableRoom.DetailAvailableRoomDTO['0']){
                            var htDtlCncl= hotelDetail.AvailableRoom.DetailAvailableRoomDTO['0'].HotelRoom.DetailHotelRoomDTO.CancellationPolicy.CancellationPolicyDTO;
                        }else{
                            var htDtlCncl= hotelDetail.AvailableRoom.DetailAvailableRoomDTO.HotelRoom.DetailHotelRoomDTO.CancellationPolicy.CancellationPolicyDTO;
                        }
                        //Give more condition to not allow 'cancellation' section visible. 
                        //like booking_flag as 2 and penalty date is passed ie. today date is greater than cancellation date.
                        if(typeof htDtlCncl.StringDateTimeFrom !== 'undefined'){
                            var cancellationDate= htDtlCncl.StringDateTimeFrom;
                            $scope.cancellationDate= moment(cancellationDate).format('YYYYMMDD');
                            var cancelDt= new Date(moment(cancellationDate).format('MM-DD-YYYY'));
                            //calculate PenaltyPercent and PenaltyDay
                            //var penaltyPercent= htDtlCncl.PenaltyPercent;
                            //var penaltyDay= htDtlCncl.PenaltyDay;
                            var toDt= new Date(moment().format('MM-DD-YYYY'));
                            //console.log('typeof', typeof response.data.myBookingDetailsRes.booking_flag);
                            $scope.hideCancellation = (response.data.myBookingDetailsRes.booking_flag !== 2) 
                             && (cancelDt > toDt) ;
                        }else{
                            $scope.hideCancellation = false;
                        } 
                        //console.log('hideCancellation', $scope.hideCancellation);

                        $scope.viewBooking.hotelAddress = response.data.myBookingDetailsRes.address;
                        $scope.viewBooking.rating = response.data.myBookingDetailsRes.rating;
                        $scope.viewBooking.category = response.data.myBookingDetailsRes.category || "0";
                        //price in respective currency
                        $scope.viewBooking.payment_customer= response.data.myBookingDetailsRes.payment_customer;
                        $scope.viewBooking.currency_code= response.data.myBookingDetailsRes.currency_code; //the actula payment currency
                        
                        //mark up price
                        $scope.viewBooking.markupPrice= response.data.myBookingDetailsRes.markupPrice; 
                        //currency cancellatin message
                        $scope.viewBooking.otlaat_currency= response.data.myBookingDetailsRes.otlaat_currency; 
                        $scope.viewBooking.saudiRate = response.data.myBookingDetailsRes.saudiRate;
                        $scope.viewBooking.cancellation = generateCancellationPolicy(htDtlCncl, $scope.viewBooking.currency_code, $scope.viewBooking.saudiRate);

                         if (!_.isArray(hotelDetail.AvailableRoom.DetailAvailableRoomDTO)) {
                            hotelDetail.AvailableRoom.DetailAvailableRoomDTO = [hotelDetail.AvailableRoom.DetailAvailableRoomDTO];
                         }

                        $scope.viewBooking.rooms = hotelDetail.AvailableRoom.DetailAvailableRoomDTO.map(function (room) {
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
                }, function (error) {
                    $scope.isFetching = false;
                    $scope.errors = {
                        serverError: 'Please, try again later.'
                    };
                    globalSpinner.stop();
                });
        }

        /*function requestBookingPriceFromDb(){
            var url= constants.requestUrls.$rootScope.basePath + 
                '?email=' + userProfileService.getEmail() +
                '&api_token=' + authService.getToken() +
                '&fileNumber=' + fileNumber;
            $http.get(url).then(function(response){
                console.log('view booking price', response.data);
            }, function(error){
                console.log('view booking price error');
            }); 
        }*/
        

        function cancelBooking() { 
            cancelBookingModalService.open(null, null, null, $scope.viewBooking.fileNumber, $scope.cancellationDate);

        }

        function setFileNumber(){
            cancelBookingModalService.setFileNumber(fileNumber);
        }

        function downloadVoucherInvoice(booking_id, type) {
            //here actually booking_id is reference id
            var downloadType = type.toUpperCase();
            var errors;
            type = type + '=true';
            //make the booking_id as md5
            //var booking_id= calcMD5(booking_id);
            $scope.fetchingDownload = true;
            var url = constants.requestUrls.downloadVoucherInvoice +
                '?email=' + userProfileService.getEmail() +
                '&api_token=' + authService.getToken() +
                //'&booking_id=' + booking_id +
                '&referenceNumber=' + booking_id +
                '&' + type;
            $http
                .get(url)
                .then(function (response) {
                    $scope.fetchingDownload = false;
                    if (response.data && response.data.success === false) {
                        if (response.data.err_msg) {
                            errors = {
                                serverError: response.data.err_msg
                            };

                        } else {
                            errors = response.data.error;
                        }
                        notificationModalService.open(downloadType, errors)
                    } else {
                        var iframe = document.createElement("iframe");
                        iframe.setAttribute("src", url);
                        iframe.setAttribute("style", "display: none;");
                        document.body.appendChild(iframe);
                    }
                }, function (error) {
                    $scope.fetchingDownload = false;
                    var errors = {
                        serverError: 'Please, try again later.'
                    };
                    notificationModalService.open(downloadType, errors);
                });
        }


        function generateCancellationPolicy(cancellation, payment_currency_code, saudiRate) { 
            return getText(cancellation.StringDateTimeFrom, cancellation.Amount); 
            function getText(dateFrom, amount) {
                if (!amount || amount === '0') {
                    return 'Cancellation is Free for this room.'
                }

                if(payment_currency_code === 'SAR'){ 
                    return $translate.instant("payment.cancellationMessage", {
                        price: $filter('currencyConverterFilter')(parseFloat(amount.replace(',', '.')), saudiRate, $filter('lowercase')(payment_currency_code), false, $scope.viewBooking.markupPrice) ,
                        date: moment(dateFrom).format('DD/MM/YYYY')
                    });
                }else{
                    /*return $translate.instant("payment.cancellationMessage", {
                        price: $filter('currencyConverterFilter')(parseFloat(amount.replace(',', '.')), $scope.viewBooking.otlaat_currency.currencyPrice, $scope.viewBooking.otlaat_currency.currency ) ,
                        date: moment(dateFrom).format('DD/MM/YYYY')
                    });*/
                    return $translate.instant("payment.cancellationMessage", {
                        price: $filter('currencyConverterFilter')(parseFloat(amount.replace(',', '.')), 1, $filter('lowercase')(payment_currency_code), false, $scope.viewBooking.markupPrice) ,
                        date: moment(dateFrom).format('DD/MM/YYYY')
                    });
                }
            }
        }

        function getPassengers(passengers) {  
            if (Array.isArray(passengers)) {
                if (!$scope.viewBooking.leader.firstName) {
                    $scope.viewBooking.leader.firstName = passengers
                        .filter(function (passenger) {
                            return passenger.IsLeader == 'true';
                        })[0].Name;
                    $scope.viewBooking.leader.lastName = passengers
                        .filter(function (passenger) {
                            return passenger.IsLeader == 'true';
                        })[0].LastName;
                }
                return passengers;
            } else {
                if (!$scope.viewBooking.leader.firstName) {
                    $scope.viewBooking.leader.firstName = passengers.Name;
                    $scope.viewBooking.leader.lastName = passengers.LastName;
                }
                return [passengers];
            }
        }

        function getAdultsArray(adultsCount) {
            return Array.apply(null, {length: adultsCount}).map(Number.call, Number);
        }

    }

})();