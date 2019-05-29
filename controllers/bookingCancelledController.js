'use strict';

(function () {
    angular.module('hotelApp').controller('bookingCancelledController', bookingCancelledController);

    bookingCancelledController.$inject = ['$scope', '$http', '$stateParams'];

    function bookingCancelledController($scope, $http, $stateParams) {

        $scope.cancellation = {
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

        formData();

        function formData() {
            formBookingCancelledData();
        }

        function formBookingCancelledData() {
            if ($stateParams.canceldetails) {
                formConfirmationData($stateParams.canceldetails);
            } else {
               $scope.mainError = true; 
            }
        }

        function formConfirmationData(data) {
            $scope.cancellation.confirmationNumber = data.cancelBookingRes.FileNumber;
            $scope.cancellation.referenceNumber = data.cancelBookingRes.ReferenceNumber;
            var cancellationDto = data.cancelBookingRes.HotelCalcelItem.HotelCancelDTO.HotelCancelItem.HotelCalcelItemDTO;
            $scope.cancellation.hotel.checkIn = moment(data.cancelBookingRes.FromDate, 'D.M.YYYY hh:mm:ss').format('DD MMM YYYY');
            $scope.cancellation.hotel.checkOut = moment(data.cancelBookingRes.ToDate, 'D.M.YYYY hh:mm:ss').format('DD MMM YYYY');
            var hotelDto = cancellationDto.Hotels.DetailHotelDTO;
            $scope.cancellation.hotel.name = hotelDto.HotelName;
            $scope.cancellation.hotel.nights = moment(data.cancelBookingRes.ToDate, 'D.M.YYYY hh:mm:ss').diff(moment(data.cancelBookingRes.FromDate, 'D.M.YYYY hh:mm:ss'), 'days');

            if(!_.isArray(hotelDto.AvailableRoom.DetailAvailableRoomDTO)){
                hotelDto.AvailableRoom.DetailAvailableRoomDTO= [hotelDto.AvailableRoom.DetailAvailableRoomDTO];
            }
            $scope.cancellation.rooms = hotelDto.AvailableRoom.DetailAvailableRoomDTO.map(function (room) {
                var roomDetails = room.HotelRoom.DetailHotelRoomDTO;
                $scope.cancellation.price = $scope.cancellation.price + parseFloat(roomDetails.CancellationPolicy.CancellationPolicyDTO.Amount.replace(',', '.'));
                $scope.cancellation.currency = data.cancelBookingRes.Currency;

                return {
                    board: roomDetails.Board.Name,
                    characteristics: roomDetails.RoomType.Characteristic,
                    adults: getAdultsArray(room.HotelOccupancy.Occupancy.AdultCount),
                    passengers: getPassengers(room.HotelOccupancy.Occupancy.Passengers.PassengerDTO),
                    policy: generateCancellationPolicy(room)
                }
            });

            function generateCancellationPolicy(room) { 
                var cancellation = room.HotelRoom.DetailHotelRoomDTO.CancellationPolicy.CancellationPolicyDTO;
                return {
                    roomName: room.HotelRoom.DetailHotelRoomDTO.Board.Name,
                    policy: getText(cancellation.DateTimeFrom, cancellation.DateTimeTo, cancellation.Amount)
                };

                function getText(dateFrom, dateTo, amount) {
                    if (!amount || amount === '0') {
                        return 'Cancellation is Free for this room.'
                    }
                    return 'Before the ' + moment(dateFrom).format('DD MMM YYYY') + ' you will be charged of ' + amount.replace(',', '.') + '. After this date, you will be charged with a full price.'
                }
            }

            function getPassengers(passengers) {
                if (Array.isArray(passengers)) {
                    if (!$scope.cancellation.leader.firstName) {
                        $scope.cancellation.leader.firstName = passengers
                            .filter(function (passenger) {
                                return passenger.IsLeader == 'true';
                            })[0].Name;
                        $scope.cancellation.leader.lastName = passengers
                            .filter(function (passenger) {
                                return passenger.IsLeader == 'true';
                            })[0].LastName;
                    }
                    return passengers;
                } else {
                    if (!$scope.cancellation.leader.firstName) {
                        $scope.cancellation.leader.firstName = passengers.Name;
                        $scope.cancellation.leader.lastName = passengers.LastName;
                    }
                    return [passengers];
                }
            }

            function getAdultsArray(adultsCount) {
                return Array.apply(null, {length: adultsCount}).map(Number.call, Number);
            }
        }

    }
})();