app.controller('hotelConfirmationController', ['$scope', '$stateParams', 'hotelConfirmationService', 'DateService',
    '$http', 'globalSpinner', '$filter', 'constants', 'userProfileService', 'authService', '$timeout', '$translate', '$rootScope',
    function ($scope, $stateParams, hotelConfirmationService, DateService, $http, globalSpinner, $filter, constants,
              userProfileService, authService, $timeout, $translate, $rootScope) {

        var confirmationId = $stateParams.checkoutToken; //checkoutToken is same as confirmationId
        var paypalToken = $stateParams.paypalToken;
        $scope.confirmation = {
            referenceNumber: '',
            confirmationNumber: '',
            hotel: {
                name: '',
                address: '',
                rating: 0,
                checkIn: "",
                checkOut: "",
                nights: ""
            },
            leader: {
                firstName: '',
                lastName: ''
            },
            price: 0,
            currency: '',
            rooms: []
        };

        $scope.downloadVoucherInvoice = downloadVoucherInvoice;

        formData();

        function formData() {
            if ($stateParams.mainError) {
                return $scope.mainError = true;
            }
            if (!$stateParams.hotelConfirmationDetails) {
                if (confirmationId) {
                    requestConfirmationData();
                } else if (paypalToken) {
                    //confirmationAftPaypal();
                    verifyTokenPaypal();
                } else {
                    return $scope.mainError = true;
                }
            } else {
                formConfirmationData($stateParams.hotelConfirmationDetails);
            }
        }

        function formConfirmationData(data) {
            //Meta Data
            var metaData={
                meta_title: data.data.confirmHotelRes.meta_title,
                meta_description: data.data.confirmHotelRes.meta_description
            }
            $rootScope.meta_title= metaData.meta_title;
            $rootScope.meta_description= metaData.meta_description;
            $rootScope.change_title();
            //

            $scope.confirmation.confirmationNumber = data.data.confirmHotelRes.FileNumber;
            $scope.confirmation.referenceNumber = data.data.confirmHotelRes.ReferenceNumber;
            var confirmationDto = data.data.confirmHotelRes.ConfirmationItem.HotelConfirmDTO.ConfirmationItem.ConfirmationItemDTO;
            $scope.confirmation.hotel.checkIn = moment(DateService.parseDate(confirmationDto.FromDate)).format('DD MMM YYYY');
            $scope.confirmation.hotel.checkOut = moment(DateService.parseDate(confirmationDto.ToDate)).format('DD MMM YYYY');
            var hotelDto = confirmationDto.Hotels.HotelDTO;
            $scope.confirmation.hotel.name = hotelDto.hotelName;
            $scope.confirmation.hotel.nights = moment(DateService.parseDate(confirmationDto.ToDate)).diff(moment(DateService.parseDate(confirmationDto.FromDate)), 'days');
            $scope.confirmation.hotel.rating = hotelDto.rating;
            $scope.confirmation.hotel.address = hotelDto.address;
            if (hotelDto.coordinate1) {
                $scope.coordinatesAvailable = true;
                $timeout(function () {
                    initMap(parseFloat(hotelDto.coordinate1), parseFloat(hotelDto.coordinate2));
                }, 1000);
            }
            //for currency
            $scope.confirmation.otlaat_currency = data.data.confirmHotelRes.otlaat_currency;
            $scope.markupPrice= data.data.confirmHotelRes.markupPrice;

            //make array incase of single search before map, by Mir
            if(!_.isArray(hotelDto.AvailableRoom.AvailableRoomDTO)){
                hotelDto.AvailableRoom.AvailableRoomDTO= [hotelDto.AvailableRoom.AvailableRoomDTO];
            }
            $scope.confirmation.rooms = hotelDto.AvailableRoom.AvailableRoomDTO.map(function (room) {
                var roomDetails = room.HotelRoom.HotelRoomDTO;
                $scope.confirmation.price = $scope.confirmation.price + parseFloat(roomDetails.Price.Amount.replace(',', '.'));
                $scope.confirmation.currency = roomDetails.Price.Currency;

                return {
                    board: roomDetails.Board.Name,
                    characteristics: roomDetails.RoomType.Characteristic,
                    adults: getAdultsArray(room.HotelOccupancy.Occupancy.AdultCount),
                    passengers: getPassengers(room.HotelOccupancy.Occupancy.Passengers.PassengerDTO),
                    policy: generateCancellationPolicy(room),
                    children: getChildrenArray(room.HotelOccupancy.Occupancy.ChildCount)
                }
            });

            function generateCancellationPolicy(room) {
                var cancellation = room.HotelRoom.HotelRoomDTO.CancellationPolicy.CancellationPolicyDTO;
                return {
                    roomName: room.HotelRoom.HotelRoomDTO.Board.Name,
                    policy: getText(cancellation.DateTimeFrom, cancellation.DateTimeTo, cancellation.Amount)
                };

                function getText(dateFrom, dateTo, amount) {
                    if (!amount || amount === '0') {
                        return 'Cancellation is Free for this room.'
                    }
                    return 'Before the ' 
                    + moment(DateService.parseDate(dateFrom)).format('DD MMM YYYY') 
                    + ' you will be charged of ' 
                    + $filter('currencyConverterFilter')(parseFloat(amount.replace(',', '.')), $scope.confirmation.otlaat_currency.currencyPrice, $scope.confirmation.otlaat_currency.currency, false, $scope.markupPrice)  
                    + '. After this date, you will be charged with a full price.'
                }
            }

            function getPassengers(passengers) {
                if (Array.isArray(passengers)) {
                    if (!$scope.confirmation.leader.firstName) {
                        $scope.confirmation.leader.firstName = passengers
                            .filter(function (passenger) {
                                return passenger.IsLeader == 'true';
                            })[0].Name;
                        $scope.confirmation.leader.lastName = passengers
                            .filter(function (passenger) {
                                return passenger.IsLeader == 'true';
                            })[0].LastName;
                    }
                    return passengers;
                } else {
                    if (!$scope.confirmation.leader.firstName) {
                        $scope.confirmation.leader.firstName = passengers.Name;
                        $scope.confirmation.leader.lastName = passengers.LastName;
                    }
                    return [passengers];
                }
            }

            function getAdultsArray(adultsCount) {
                return Array.apply(null, {length: adultsCount}).map(Number.call, Number);
            }

            function getChildrenArray(childrenCount){
                return Array.apply(null, {length: childrenCount}).map(Number.call, Number);
            }
        }

        function requestConfirmationData() {  
            globalSpinner.run($filter('translate')('confirm.pleaseWait'), true);
            var finalPayload = confirmationId ? '?tokenid=' + confirmationId : '';
            hotelConfirmationService.verifyConfirmationToken(finalPayload)
                .then(function (response) {
                    if (response.data.success == true) { 
                        formConfirmationData(response);
                        cleanUpLocalStorage();
                    } else {
                        if (response.data.err_msg === 'Already booked') {
                            $scope.alreadyBooked = true;
                        } else {
                            $scope.mainError = true;
                        }
                    }
                    globalSpinner.stop();
                }, function (error) {
                    $scope.mainError = true;
                    globalSpinner.stop();
                });
        }  


        //function confirmationAftPaypal() {
        function verifyTokenPaypal(){//for checking a paypal booking is already done or not on page refresh
            globalSpinner.run($filter('translate')('confirm.pleaseWait'), true);
            var finalPayload = paypalToken ? '?paypalToken=' + paypalToken : '';
            //hotelConfirmationService.confirmationAftPaypal(finalPayload)
            hotelConfirmationService.verifyTokenPaypal(finalPayload)
                .then(function (response) { 
                    if (response.data.success == true) {
                        formConfirmationData(response);
                        cleanUpLocalStorage();
                    } else {
                        if (response.data.err_msg === 'Already booked') {
                            $scope.alreadyBooked = true;
                        } else {
                            $scope.mainError = true;
                        }
                    }
                    globalSpinner.stop();
                }, function (error) {
                    $scope.mainError = true;
                    globalSpinner.stop();
                });
        }

        function downloadVoucherInvoice(booking_id, type) {
            var downloadType = type.toUpperCase();
            var errors; 
            var fileNumber= $scope.confirmation.confirmationNumber;
            type = type + '=true';
            $scope.fetchingDownload = true;
            var url = constants.requestUrls.downloadConfirmationPdf +
                '?email=' + userProfileService.getEmail() +
                '&api_token=' + authService.getToken() +
                '&booking_id=' + booking_id +
                '&fileNumber=' + fileNumber +
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

        function initMap(latitude, longitude) {
          /*  var latlng = new google.maps.LatLng(latitude, longitude);
            var map = new google.maps.Map(document.getElementById('map'), {
                zoom: 16,
                center: latlng
            });
            new google.maps.Marker({
                position: latlng,
                map: map
            });*/
        }

        function cleanUpLocalStorage() {
            localStorage.removeItem('otlaat.payment');
            localStorage.removeItem('otlaat.lastPaymentDetails');
            localStorage.removeItem('otlaat.search');
        }
    }]);