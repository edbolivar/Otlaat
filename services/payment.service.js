'use strict';
(function () {
    app.service('PaymentService', PaymentService);

    PaymentService.$inject = ['$http', 'constants', 'authService'];

    function PaymentService($http, constants, authService) {
        var userData="";
        var otherDtls="";
        return {
            getOrderDetails: getOrderDetails,
            paymentCheck: paymentCheck,
            addToPayment: addToPayment,
            generatePayload: generatePayload,
            userDetails: userDetails,
            getUserDetails: getUserDetails,
            otherDetails: otherDetails,
            getOtherDetails: getOtherDetails,
            addBooking: addBooking,
            addPropertyToPayload: addPropertyToPayload,
            updateProductPayload: updateProductPayload
        };

        function getOrderDetails(options, token, cityId) { 

            var roomsString = '?';
            var payload = {
                person: options
            };
            //payload.token = authService.getToken();
            payload.token = token;
            payload.cityId = cityId;
            roomsString += 'token=' + payload.token + '&cityId=' + payload.cityId;
            angular.forEach(options, function (room, index) {
                var criteria = '&hotelRoomCriteria[' + index + ']';
                roomsString += criteria + '[servicesUniqueNumber]=' + room.servicesUniqueNumber + criteria + '[adonisUniqueNumber]=' + room.adonisUniqueNumber
                    + criteria + '[servicesType]=' + room.servicesType;
            });
            //console.log('payloaad', payload);
            //roomsString = roomsString + '&token=' + payload.token;
            return $http.post(constants.requestUrls.getOrderDetails + roomsString);
        }

        function paymentCheck(options) {
            //var paypalData = '?item_number=' + options['0']['item_number'] ;
            return $http.post(constants.requestUrls.paymentCheck, options);
        }

        function addToPayment(options){
            //var paypalData = '?item_number=' + options.item_number + '&payment_method=' ;
            return $http.post(constants.requestUrls.addToPayment, options);
        }

        function addBooking(options){ 
            //return $http.post(constants.requestUrls.addBooking + '?payment_id=' + bookingRecordPayload.payment_id + '?client_id=' + bookingRecordPayload.client_id);
            return $http.post(constants.requestUrls.addBooking , options);
        }

        // for setting condition for isLeader 'true' only once.
        
        function generatePayload(mainUser, guests, guestsChildren, details) {

            var isLeaderFlag= 1;
            Room.count = 0;
            Human.count = 0;

            function Room(options, adults, children) {
                Human.count = 0;
                Room.count++;
                this.purchaseToken = options.purchaseToken;
                this.servicesUniqueNumber = options.servicesUniqueNumber;
                this.adonisUniqueNumber = options.adonisUniqueNumber;
                this.servicesType = options.servicesType;
                this.adultCount = options.adultCount;
                this.childCount = options.childCount;

                if (adults.length) {
                    var newRoom = true;
                    this.adults = _.map(adults, function (adult, index) {
                        if (index !== 0) newRoom = false;
                        if(isLeaderFlag === 0) newRoom = false;
                        if (!adult.firstName && !adult.lastName) adult = mainUser;
                        return new Adult(adult, newRoom);
                    });
                }
                if (children && children.length) {
                    this.children = _.map(children, function (child) {
                        return new Child(child);
                    })
                }
            }


            function Human(options) {
                Human.count++;
                this.id = Human.count;
                this.name = options.firstName;
                this.lastName = options.lastName;
                this.ageSpecified = true;
                this.salutationId = '66f1c75c-dff4-4305-99b7-19cdbdc9135a';
            }


            function Adult(options, newRoom) {
                Human.apply(this, arguments);
                //this.isLeader = (this.id === 1 && Room.count === 0) ? true : newRoom;
                //this.isLeader =  newRoom;
                this.isLeader = (this.id === 1 && Room.count === 0 && isLeaderFlag===1) ? true : newRoom;
                this.name = options.firstName;
                this.lastName = options.lastName;
                this.passengerType = 'Adult';
                this.age = 30;
                isLeaderFlag= 0;
            }

            function Child(options) {
                Human.apply(this, arguments);
                this.isLeader = false;
                this.name = options.firstName || 'Ajwan';
                this.lastName = options.lastName || 'Firdous';
                this.passengerType = 'Child';
                this.age = options.childAge || '3';
            }

            var purchaseToken = details.PurchaseToken;
            var adults = Array.prototype.concat.apply([mainUser], guests);
            var payload = '?token=' + details.Token;

            var detailsFromLocalStorage = JSON.parse(localStorage.getItem('otlaat.details'));
            var roomCriteria = {};

            Object.keys(detailsFromLocalStorage)
                .forEach(function (key) {
                    var roomCriteriaWithChildAgeKey = key.match(/roomCriteria\[\d]\[childAge]\[\d]/);
                    if (roomCriteriaWithChildAgeKey) {
                        const indexesArray = key.match(/\d/gi);
                        if (!roomCriteria[indexesArray[0]]) {
                            roomCriteria[indexesArray[0]] = [];
                        }

                        roomCriteria[indexesArray[0]].push({childAge: detailsFromLocalStorage[key]});
                    }
                });

            var childrenIndex = 0;
            Object.keys(roomCriteria).forEach(function (roomIndex) {
                roomCriteria[roomIndex] = roomCriteria[roomIndex].map(function (value) {
                    const element = Object.assign(value, guestsChildren[childrenIndex]);
                    childrenIndex++;
                    return element;
                })
            });

            var rooms = _.map(details.HotelDetails.filterinfo, function (room, index) {
                return new Room({
                    purchaseToken: purchaseToken,
                    servicesUniqueNumber: room.HotelRoom.HotelRoomDTO.HotelRoomUniqueNumber.XmlServicesUniqueNumber,
                    adonisUniqueNumber: room.HotelRoom.HotelRoomDTO.HotelRoomUniqueNumber.AdonisUniqueNumber,
                    servicesType: room.HotelRoom.HotelRoomDTO.HotelRoomUniqueNumber.XmlServicesType,
                    adultCount: room.HotelOccupancy.Occupancy.AdultCount,
                    childCount: room.HotelOccupancy.Occupancy.ChildCount,
                }, function () {
                    return adults.splice(0, room.HotelOccupancy.Occupancy.AdultCount);
                }(), function () {
                    return roomCriteria[index];
                }());
            });


            var formPayload = function (rooms) {
                _.each(rooms, function (room, roomIndex) {
                    //payload = payload + '&confirmPassenger[' + roomIndex + ']';
                    payload = payload + '&';
                    _.each(room, function (value, key) {
                        if (key === 'adults') {
                            return _.each(room.adults, function (adults) {
                                _.each(adults, function (adult, key) {
                                    payload = payload + '&confirmPassenger[' + roomIndex + '][occupancy][' + adults.id + '][' + key + ']=' + adult;
                                })
                            });
                        }

                        if (key === 'children') {
                            return _.each(room.children, function (children) {
                                _.each(children, function (child, key) {
                                    payload = payload + '&confirmPassenger[' + roomIndex + '][occupancy][' + children.id + '][' + key + ']=' + child;
                                })
                            });
                        }

                        payload = payload + 'confirmPassenger[' + roomIndex + '][' + key + ']=' + value + '&';
                    });
                });
                return payload.replace(/&&/g, '&');
            };
            var payload = formPayload(rooms);

            return payload;
        }
        //

        function userDetails(data){
            userData= data;
        }

        function getUserDetails(){
            return userData;
        }

        function otherDetails(data){
            otherDtls= data;
        }

        function getOtherDetails(){
            return otherDtls;
        }

        function addPropertyToPayload(propertyName, value) {//now this function not in use
            //localStorage.setItem('otlaat.payment', localStorage.getItem('otlaat.payment') + '&' + propertyName + '=' + value);
        }

        function updateProductPayload(payload){
             //var payload= '&token=' + payload;    roomsString = roomsString + '&token=' + payload.token;
             //return $http.post(constants.requestUrls.updateProductPayload + payload);
             return $http.post(constants.requestUrls.updateProductPayload+ payload);
        }
    }

})();