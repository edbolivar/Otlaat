app.controller('hotelDetailsController', ['$scope', '$http', '$location', '$timeout', '$rootScope', '$translate',
    'HotelSearchService', 'objToQuery', 'hotelDetailsService', 'constants', '$interval', 'DateService',
    'cancellationModalService', 'PaymentService', 'notificationModalService', '$state',
    function ($scope, $http, $location, $timeout, $rootScope, $translate, HotelSearchService, objToQuery,
              hotelDetailsService, constants, $interval, DateService, cancellationModalService, PaymentService,
              notificationModalService, $state) {
 
        var roomsUpdateInterval = 20; // minutes
        var serverToken;
        $scope.isFetching = true;
        $scope.hotel = {};
        $scope.hotellists = {};
        $scope.hotelsSearchParams = {};
        $scope.filterParams = {};
        $scope.search = {};
        $scope.hotel = $location.search();
        angular.copy($scope.hotel, $scope.hotelsSearchParams);
        $scope.templates = {
            rooms: constants.partials.rooms
        };
        $scope.preLoaded = {
            images: []
        };

        $scope.daysStay = hotelDetailsService.getDaysStayRequested($scope.hotelsSearchParams.checkOutDate, $scope.hotelsSearchParams.checkInDate);
        $scope.roomsCount = hotelDetailsService.getRoomsCount($scope.hotelsSearchParams);

        $scope.getLabel = getLabel;
        $scope.bookNow = bookNow;
        $scope.getAllRoomsPrice = getAllRoomsPrice;
        $scope.allRoomsSameBoard = allRoomsSameBoard;
        $scope.getPolicy = getPolicy;
        $scope.requestHotelDetails = requestHotelDetails;
        $scope.changeOption = changeOption;
        $scope.addRoom = addRoom;
        $scope.removeRoom = removeRoom;

        formData();

        function formData() { 
            localStorage.setItem('otlaat.details', JSON.stringify($scope.hotelsSearchParams));
            initializeSearch();
            getHotels(objToQuery.convert($scope.hotelsSearchParams));
            $timeout(function () {
                $rootScope.hotelDetailsRequestInterval = $interval(requestHotelDetails, roomsUpdateInterval * 3000 * 60);
            });
        }

        // Request hotels from server
        function getHotels(params, modifySearch) {
            //console.log('params', params);
            //console.log('modifySearch', modifySearch);
            $scope.errors = null;
            $scope.internalErrors = null;
            HotelSearchService.hotelDetailSearch(params)
                .then(function (result) {
                    $timeout(function () {
                        $scope.isFetching = false;
                    }, 1000);
                    if (result.data && result.data.success) {
                        var hotelDetails = [];
                        $scope.main = result.data;

                        //Meta Data
                        var metaData={
                            meta_title: $scope.main.singleHotelDetailsRes.meta_title,
                            meta_description: $scope.main.singleHotelDetailsRes.meta_description
                        }
                        $rootScope.meta_title= metaData.meta_title;
                        $rootScope.meta_description= metaData.meta_description;
                        $rootScope.change_title();
                        //

                        //for hotel currency conversion
                        $scope.otlaat_currency= result.data.singleHotelDetailsRes.otlaat_currency;
                        //fetching markup price
                        $scope.markupPrice= result.data.singleHotelDetailsRes.markupPrice;

                        if (!$scope.breadcrumb) {
                            $scope.hotellists.breadcrumb = result.data.singleHotelDetailsRes.BreadCrumb;
                        }
                        try {
                            var fDate= $scope.main.singleHotelDetailsRes.FromDate.substring(0, 4)+' '+ $scope.main.singleHotelDetailsRes.FromDate.substring(4, 6)+' '+ $scope.main.singleHotelDetailsRes.FromDate.substring(6, 8);
                            var tDate= $scope.main.singleHotelDetailsRes.ToDate.substring(0, 4)+' '+ $scope.main.singleHotelDetailsRes.ToDate.substring(4, 6)+' '+ $scope.main.singleHotelDetailsRes.ToDate.substring(6, 8);
                            $scope.dates = {
                                min: new Date(fDate),
                                max: new Date(tDate)
                            };  
                            $scope.dates.range = Math.round(Math.abs(($scope.dates.min.getTime() - $scope.dates.max.getTime()) / (24 * 60 * 60 * 1000)));


                        } catch (exp) {
                            console.log("no date range given");
                        }
                        $scope.hotellists.hotelDetails = fixSchema(result.data.singleHotelDetailsRes ? result.data.singleHotelDetailsRes.HotelDetails : result.data.searchHotelFilterRes).sort(function (a, b) {
                            return (a.price > b.price) ? 1 : ((b.price > a.price) ? -1 : 0);
                        })[0];

                        //console.log('facilities', $scope.hotellists.hotelDetails.facilities);
                        //console.log('adas', $scope.hotellists.hotelDetails.lowestPriceHotel.RoomType.Characteristic);

                        serverToken = result.data.singleHotelDetailsRes.Token;
                        $scope.roomsCount = hotelDetailsService.getRoomsCount($scope.hotelsSearchParams)
                        if ($scope.roomsCount > 1) {
                            $scope.lowestPriceRooms = getLowest(_.orderBy(getOneArray(_.values(deepGet($scope.hotellists, ['hotelDetails', 'combinedAndGroupedRooms'])), 'Price.Amount')));
                            //console.log($scope.lowestPriceRooms);

                            function getOneArray(arraysOfArrays) {
                                var result = [];
                                _.each(arraysOfArrays, function (arrays) {
                                    _.each(arrays, function (array) {
                                        result.push(array);
                                    })
                                });

                                return result;
                            }

                            function getLowest(allGroups) {
                                var lowest = {
                                    price: 0,
                                    group: ''
                                };
                                _.each(allGroups, function (group) {
                                    var groupPrice = 0;
                                    _.each(group, function (room) {
                                        groupPrice = parseInt(room.Price.Amount) + groupPrice;
                                    });
                                    if (!lowest.price) {
                                        lowest.price = groupPrice;
                                        lowest.group = group;
                                    } else {
                                        if (lowest.price > groupPrice) {
                                            lowest.price = groupPrice;
                                            lowest.group = group;
                                        }
                                    }
                                });
                                return lowest;
                            }
                        }
                        //for image
                        $scope.slides = [];
                        if ($scope.hotellists.hotelDetails.img) {
                            $scope.slides = $scope.hotellists.hotelDetails.img.split(",");
                        }
                        //for search params
                        $scope.hotellists.hotelsSearchParams = $scope.hotelsSearchParams;
                        //console.log('details', $scope.hotellists.hotelDetails.combinedAndGroupedRooms);
                        //For showiing the pax count on detail page
                        //$scope.hotellists.roomsCntPax = getAllRooms($scope.hotellists.hotelDetails);

                        //For checking Amenities if blank
                        angular.forEach($scope.hotellists.hotelDetails.facilities, function(value, key){
                            //console.log(value+'---'+key);
                            if(value === 1){
                                $scope.$amenitiesFlag= true;
                            }
                        });
                        

                        //For map coordinates
                        //$scope.hotellists.hotelDetails.coordinate1;

                        $timeout(function () {
                            initMap($scope.hotellists.hotelDetails.coordinate1, $scope.hotellists.hotelDetails.coordinate2);
                        }, 1000);

                    } else {
                        if (modifySearch) {
                            $scope.internalErrors = {noRooms: 'No available rooms found'};
                        } else {
                            $scope.hotellists = false;
                            $scope.fetchingRooms = false;
                            $scope.isAjaxRoomRates = false;
                            console.log('json success false');
                        }
                    }
                    getDailyPriceText();
                    $scope.fetchingRooms = false;
                }, function (err) {
                    console.log(err);
                    $scope.hotellists = false;
                    $scope.fetchingRooms = false;
                    $scope.isAjaxRoomRates = false;
                    $timeout(function () {
                        $scope.isFetching = false;
                    }, 500)
                });
        }

        //function for amenities list
        function calcAmenitiesList(list) {
            for (var l in list) {
                if (list[l]) {
                    try {//console.log('amenities', $scope.p_list[l]);
                        if ($scope.p_list[l]) {
                            $scope.p_list[l] += 1;
                        } else {
                            $scope.p_list[l] = 1;
                        } //console.log('ameneties', $scope.p_list);
                    } catch (exp) {
                    }
                }
            }
        }

        //function for occupancy list
        function calcAcomadation(list) {
            for (var l in list) {
                if (list[l]) {
                    var newService = list[l].toLowerCase();
                    try {
                        if ($scope.a_list[newService]) {
                            $scope.a_list[newService] += 1;
                        } else {
                            $scope.a_list[newService] = 1;
                        }
                    } catch (exp) {
                    }
                }
            }
        }

        //Process data received from server
        function fixSchema(list) {
            $scope.p_list = {};
            $scope.a_list = {};
            var hotels = [];

            function getLowestPrice(price_list) {
                return price_list.sort(function (a, b) {
                    return (parseFloat(a.Price.Amount) > parseFloat(b.Price.Amount)) ? 1 : ((parseFloat(b.Price.Amount) > parseFloat(a.Price.Amount)) ? -1 : 0);
                })[0];
            }

            function getAllRoomRates(price_list) {
                return price_list.sort(function (a, b) {
                    return (parseFloat(a.Price.Amount) > parseFloat(b.Price.Amount)) ? 1 : ((parseFloat(b.Price.Amount) > parseFloat(a.Price.Amount)) ? -1 : 0);
                });
            }

            function getRoomTypes(info) {
                var types = [];
                for (var i in info) {
                    types.push(info[i].Board.Name.toLowerCase())
                }
                return types
            }

            function getRoomData(info) {
                var types = [];
                for (var i in info) {
                    types[info[i].Board.Name] = info[i].Board.Code;
                }
                return types
            }


            // Is this function needed?
            function roomFilters(filterinfo) {
                var a = [4, 5, 6, 7, 4, 6, 9, 5], b = [];
                for (var i = 0; i < a.length - 1; i++) {
                    for (var j = 1; j < a.length; j++) {
                        if (a[i] == a[j]) {
                            //a.splice(a[j],0, );
                            b.push(a[i]);
                            b.push(a[j]);
                            a.splice(i, 1);
                            a.splice(j, 1);
                        } else {

                        }
                    }
                }


                return false;


                var roomrates = filterinfo;
                var arr = [];
                var a;
                var b;
                for (var i = 0; i < roomrates.length - 1; i++) {
                    for (var j = 1; j < roomrates.length; j++) {
                        if ((roomrates[i].Board.Name == roomrates[j].Board.Name) && (roomrates[i].RoomType.Code == roomrates[j].RoomType.Code)) {

                            a = roomrates.splice(i, 1);
                            b = roomrates.splice(j, 1);
                            arr.push(a);
                            arr.push(b);
                            break;
                        }
                    }
                }

            }


            function arrayFromObject(obj) {
                var arr = [];
                for (var i in obj) {
                    arr.push(obj[i]);
                }
                return arr;
            }

            function groupBy(list, fn) {
                var groups = {};
                for (var i = 0; i < list.length; i++) {
                    var group = JSON.stringify(fn(list[i]));
                    if (group in groups) {
                        groups[group].push(list[i]);
                    } else {
                        groups[group] = [list[i]];
                    }
                }
                return arrayFromObject(groups);
            }


            $scope.ratinArr = [];

            list.filterinfo = _.isArray(list.filterinfo) && list.filterinfo
                ? list.filterinfo : [list.filterinfo];
            calcAmenitiesList(list.hotelinfo.Amenities);
            calcAcomadation(getRoomTypes(list.filterinfo));
            $scope.room_data = getRoomData(list.filterinfo);
            var getAllRoomRates = getAllRoomRates(list.filterinfo);
            var combinedAndGroupedRooms = groupAndCombineRooms(list.filterinfo);


            var output = _.groupBy(list.filterinfo, function (entry) {
                return entry.Occupancy.AdultCount;
            });

            var price_options = getLowestPrice(list.filterinfo),
                preferences = [];

            _.each(list.hotelinfo.Amenities, function (val, amenity) {
                //preference means Amenities
                if (val) {
                    preferences.push(amenity);
                    $scope.$amenitiesFlag= true;
                }
            });

            var guestRating = list.hotelinfo['rating'];


            //Rearrange the whole list
            hotels.push({
                "img": list.hotelinfo.Photo,
                //"name": list.hotelinfo.HotelName,
                "hotelName": list.hotelinfo.HotelName,
                "address": list.hotelinfo.Address,
                "category": list.hotelinfo.HotelCategory,
                "desc": list.hotelinfo.Description,
                "rating": guestRating,
                "preferences": preferences,
                //"reviews": 18,
                "lowestPriceHotel": price_options,
                "price": parseFloat(price_options.Price.Amount),//no need of adding date range as it's the finla price from server according to the multiple room/ date request
                //"price": (parseFloat(price_options.Price.Amount)) * $scope.dates.range,
                //"room_type": price_options.Board.Name,
                "facilities": list.hotelinfo.Amenities,
                "getAllRoomRates": getAllRoomRates,
                combinedAndGroupedRooms: combinedAndGroupedRooms,
                //"roomFilters": roomFilters,
                //"room_types": getRoomTypes(list.filterinfo),
                //"link": null,
                "top": (list.hotelinfo.fac_Top == "1"),
                'ratingText': getRatingText(guestRating),
                'hotelCode': list.hotelinfo.HotelCode,
                'coordinate1': list.hotelinfo.coordinate1,
                'coordinate2': list.hotelinfo.coordinate2
            });

            return hotels;
        }

        //for showing amenities in proper format
        function getLabel(key) {
            var substr = key.substr(4), 
            res = substr;
            for (var i = 1; i < substr.length; i++) { //console.log(substr[i]);
                if (substr[i] == substr[i].toUpperCase() && substr[1] != substr[1].toUpperCase()) {
                    res = substr.replace(substr[i], " " + substr[i]);
                    break;
                }
            }
            result = res.replace(/_/g, " ");
            return result;
        }

        //For detail page
        function bookNow(room, fetching) {
            $scope.isFetchingImmediate = true;
            $scope.isFetching = true;
            document.body.scrollTop = 0; // For Chrome, Safari and Opera
            document.documentElement.scrollTop = 0; // For IE and Firefox
            if (fetching) {
                fetching.isFetching = true;
            }
            var payload = [];
            var rooms = angular.copy(room);
            delete rooms.$$hashKey;

            _.each(rooms, function (room) {
                payload.push({
                    servicesUniqueNumber: room.HotelRoomUniqueNumber.XmlServicesUniqueNumber,
                    adonisUniqueNumber: room.HotelRoomUniqueNumber.AdonisUniqueNumber,
                    servicesType: room.HotelRoomUniqueNumber.XmlServicesType
                });
            });

            var cityId= $scope.hotelsSearchParams.cityId;

            PaymentService.getOrderDetails(payload, serverToken, cityId)
                .then(function orderDetailsReceived(response) {
                    if (response.data && response.data.success === false) {
                        if (response.data.err_msg) {
                            $scope.errors = {
                                serverError: response.data.err_msg
                            };

                        } else {
                            $scope.errors = response.data.error;
                        }
                        $state.go('payment', {errors: $scope.errors, details: true});
                    } else {
                        $state.go('payment', {details: response.data.basketHotelRes});
                    }
                    if (fetching) {
                        fetching.isFetching = false;
                    }
                }, function errorReceivingOrderDetails() {
                    $scope.isFetchingImmediate = false;
                    if (fetching) {
                        fetching.isFetching = false;
                    }
                    var errors = {
                        serverError: 'Please, try again later.'
                    };
                    $state.go('payment', {errors: errors, details: true});
                    $scope.isFetchingImmediate = false;
                });
        }

        //Get rating in a text format
        function getRatingText(stars) {
            if (stars) {
                rating = parseFloat(stars);
                if (rating < 6) {
                    return $translate.instant('ratingPoor');
                }
                if (rating >= 6 && rating < 8) {
                    return $translate.instant('ratingGood');
                }
                if (rating >= 8 && rating < 9) {
                    return $translate.instant('ratingVeryGood');
                }
                if (rating >= 9 && rating < 11) {
                    return $translate.instant('ratingExcellent');
                }
            }
        }

        //For map
        function initMap(latitude, longitude) {
            var coordinates = {
                lat: Number(latitude),
                lng: Number(longitude)
            };
           /* var coordinates = {
                lat: Number('25.3276'),//test coordinates for Hilton Sharjah
                lng: Number('55.3781')
            };*/

            var map = new google.maps.Map(document.getElementById('map'), {
                //var map = new google.maps.Map($scope.map, {
                zoom: 16,
                center: coordinates
            });
            var marker = new google.maps.Marker({
                position: coordinates,
                map: map
            });
        }

        function getDailyPriceText() {
            $scope.dailyPriceText = !$scope.dates
                ? $translate.instant('noDateRange')
                : $translate.instant('avgFirst') + ' ' + ($scope.dates.range > 1
                ? ($scope.dates.range + $translate.instant('avgSecondNights'))
                : $translate.instant('avgSecondNight'));
        }

        //Processing of rooms collection if more than one room combination requested
        function groupAndCombineRooms(filteredRooms) { //hotels = filterinfo
            $scope.roomsCount = hotelDetailsService.getRoomsCount($scope.hotelsSearchParams);
            var grouped = null;
            if ($scope.roomsCount < 2) {
                grouped = _.groupBy(filteredRooms, function (room) {
                    return room.Board.Name;
                });

                if (!Array.isArray(!grouped[0])) {
                    grouped = Object.keys(grouped).map(function (key) {
                        return [grouped[key]];
                    })
                }

                return grouped;
            }



            var rooms = angular.copy(filteredRooms);
            var allPossibleCombinations;
            var areAllRoomsSameAdultsCount = hotelDetailsService.allRoomsSameAdultsCount($scope.hotelsSearchParams);
            var isMoreThanOneRoomsSameAdultCount = hotelDetailsService.moreThanOneRoomsSameAdultCount($scope.hotelsSearchParams);

            if (areAllRoomsSameAdultsCount) {
                var size = areAllRoomsSameAdultsCount;
                rooms = _
                    .chain(rooms)
                    .groupBy(function (room) {
                        return room.Board.Name;
                    })
                    .mapValues(function (rooms) {
                        return hotelDetailsService.spliceArrayByGroups(_.orderBy(rooms, 'RoomType.Characteristic'), size)
                    })
                    .value();
                return rooms;
            }


            var roomsCountByAdults = isMoreThanOneRoomsSameAdultCount;

            var groupedByAdults = _.groupBy(rooms, function (room) {
                return room.Occupancy.AdultCount;
            });

            _.each(roomsCountByAdults, function (quantity, adults) {
                if (quantity > 1) {
                    groupedByAdults[adults] = hotelDetailsService.spliceArrayByNGroups(groupedByAdults[adults], quantity);
                }
            });

            var mappedIntoArray = [];

            _.each(groupedByAdults, function (value, key) {
                if (_.isArray(value[0])) {
                    _.each(value, function (rooms) {
                        mappedIntoArray.push(rooms)
                    })
                } else {
                    mappedIntoArray.push(value);
                }
            });

            allPossibleCombinations = hotelDetailsService.findAllCombinations(mappedIntoArray);
            var filtered = hotelDetailsService.filterByBoardAndCharacteristics(allPossibleCombinations);
            if (filtered.notSameBoard) {
                $scope.notSameBoard = true;
            }

            var result = {};
            _.each(filtered.filtered, function (rooms, key) {
                result[key] = {};
                _.each(rooms, function (roomsChild) {
                    var details = '';
                    _.each(roomsChild, function (room) {
                        details = details + room.Board.Code + room.RoomType.Characteristic;
                    });
                    result[key][details] = roomsChild;
                })
            });

            _.each(result, function (rooms, key) {
                result[key] = _.map(rooms, function (room) {
                    return room;
                })
            });

            return result;

        }

        function getAllRoomsPrice(rooms) {
            var price = 0;
            _.each(rooms, function (room) {
                price = _.toNumber(room.Price.Amount.replace(',', '.')) + price
            });

            return Number(price.toFixed(2));
        }

        function allRoomsSameBoard(rooms) {
            var boardCode = rooms[0].Board.Code;
            var boardName = rooms[0].Board.Name;
            var sameAsFirst = _
                .chain(rooms)
                .map(function (room) {
                    return room.Board.Code === boardCode;
                })
                .value();
            var allSame = _.every(sameAsFirst, function (ke) {
                return !!ke;
            });

            if (allSame) return boardName;
        }

        function getPolicy(room, event) {
            cancellationModalService.open('lg', '#rooms', room.roomId)
                .then(function modalClosed(policy) {
                    room.policy = policy;
                });

            return;
            if (room.policy) return;
            HotelSearchService.getCancellation(room.roomId)
                .then(function () {
                    room.policy = 'Async call';
                    room.enabled = true;
                    $timeout(function () {
                        $(event.target).mouseenter();
                    })
                }, function () {
                    room.policy = 'Async call';
                    room.enabled = true;
                    $timeout(function () {
                        $(event.target).mouseenter();
                    })
                });
        }

        //MODIFY SEARCH CALLS HERE
        function requestHotelDetails(modifySearchClick) {
            $scope.fetchingRooms = true;
            $scope.hotellists.hotelDetails.combinedAndGroupedRooms = [];
            var params = {}; 
            if ($scope.chosenOption.value === 1) {
                params['roomCriteria[0][adultCount]'] = "1";
                params['roomCriteria[0][roomCount]'] = "1";
                params['roomCriteria[0][childCount]'] = "0";
            } else if ($scope.chosenOption.value === 2) {
                params['roomCriteria[0][adultCount]'] = "2";
                params['roomCriteria[0][roomCount]'] = "1";
                params['roomCriteria[0][childCount]'] = "0";
            } else {
                angular.forEach($scope.hotelSearch.passengerInfo, function (room, index) {
                    var criteria = 'roomCriteria[' + index + ']';
                    params[criteria + '[roomCount]'] = "1";
                    params[criteria + '[adultCount]'] = room.adults.toString();
                    params[criteria + '[childCount]'] = room.childrenAge.length.toString();
                    if (room.childrenAge.length > 0) {
                        angular.forEach(room.childrenAge, function (childAge, childIndex) {
                            var chAge = !!childAge ? childAge : 0;
                            params[criteria + '[childAge][' + childIndex + ']'] = chAge.toString();
                        });
                    }
                });
            }

            params.checkInDate = DateService.formatDateForApi($scope.search.startDate);
            params.checkOutDate = DateService.formatDateForApi($scope.search.endDate);
            params.cityId = $scope.hotelsSearchParams.cityId;
            params.countryCode = $scope.hotelsSearchParams.countryCode;
            params.countryId = $scope.hotelsSearchParams.countryId;
            params.hotelId = $scope.hotelsSearchParams.hotelId;
            //Added for sending currency param in request
            params.currency = $scope.hotelsSearchParams.currency;
            if (modifySearchClick === true) {
                $scope.hotelsSearchParams = params;
            }

            getHotels(objToQuery.convert($scope.hotelsSearchParams), true);
        }

        function initializeSearch() {
            $scope.search.startDate = parseDate($scope.hotelsSearchParams.checkInDate);
            $scope.search.endDate = parseDate($scope.hotelsSearchParams.checkOutDate);
            initOptions(true);
        }

        function parseDate(str) {
            var y = str.substr(0, 4),
                m = str.substr(4, 2) - 1,
                d = str.substr(6, 2);
            var D = new Date(y, m, d);
            return (D.getFullYear() == y && D.getMonth() == m && D.getDate() == d) ? D : 'invalid date';
        }

        function initOptions(isInitChosen) {
            $scope.datePickerOptions = [];
            var optionNum = 0;
            for (var i = 1; i <= 3; i++) {
                var option = {
                    text: $translate.instant('DatePickerOption' + i),
                    value: i
                };
                $scope.datePickerOptions.push(option);
                //console.log('DatePickerOptions', $scope.datePickerOptions);
                if (!isInitChosen && i === $scope.chosenOption.value) {
                    optionNum = i;
                }
                //console.log('optionNum', optionNum);
            }
            //console.log('$scope.hotelsSearchParams', $scope.hotelsSearchParams);
            if ($scope.hotelsSearchParams['roomCriteria[0][adultCount]'] == "1" &&
                $scope.hotelsSearchParams['roomCriteria[0][roomCount]'] == "1" &&
                $scope.hotelsSearchParams['roomCriteria[0][childCount]'] == "0" &&
                !$scope.hotelsSearchParams['roomCriteria[1][adultCount]']) {
                optionNum = 0;
            } else if ($scope.hotelsSearchParams['roomCriteria[0][adultCount]'] == "2" &&
                $scope.hotelsSearchParams['roomCriteria[0][roomCount]'] == "1" &&
                $scope.hotelsSearchParams['roomCriteria[0][childCount]'] == "0" &&
                !$scope.hotelsSearchParams['roomCriteria[1][adultCount]']) {
                optionNum = 1;
            } else {
                optionNum = 2;
                $rootScope.addGuestPicker = 'room';
                $scope.showGuestPicker = true;
                //console.log('Num logs', optionNum);
            }

            $scope.chosenOption = $scope.datePickerOptions[optionNum];
            $scope.hotelSearch = {};
            $scope.hotelSearch.passengerInfo = [];
            $scope.isMobile = $rootScope.isMobile.any();
            $scope.showLocationSpinner = true;

            var rooms = _.pickBy($scope.hotelsSearchParams, function (value, key) {
                return _.startsWith(key, 'roomCriteria');
            });

            (function () {
                var i = 0;
                parseRooms(rooms);
                //console.log('hotelSearch.passengerInfo', $scope.hotelSearch.passengerInfo);
                function parseRooms(rooms) {
                    var j = 0;
                    var room = rooms['roomCriteria[' + i + '][adultCount]'];
                    if (room) {
                        var count = {
                            adults: room,
                            childrenAge: []
                        };
                        parseChilds(i, count);
                        $scope.hotelSearch.passengerInfo.push(count);
                        ++i;
                        parseRooms(rooms);

                        function parseChilds(index, count) {
                            var child = rooms['roomCriteria[' + index + '][childAge][' + j + ']'];
                            if (child) {
                                count.childrenAge.push(child);
                                ++j;
                                parseChilds(index, count);
                            }
                        }
                    }
                }
            })();
        }

        function changeOption(option) {
            $scope.chosenOption = option;
            if (option.value === 3) {
                $rootScope.addGuestPicker = 'room';
                $scope.showGuestPicker = true;
            } else {
                $scope.showGuestPicker = false;
                $rootScope.addGuestPicker = '';
            }
        }

        function addRoom() {
            $scope.hotelSearch.passengerInfo.push({
                adults: 2,
                childrenAge: []
            });
            if ($scope.hotelSearch.passengerInfo.length > 2) {
                $rootScope.addGuestPicker = 'full';
            }

        }

        function removeRoom() {
            $scope.hotelSearch.passengerInfo = _.dropRight($scope.hotelSearch.passengerInfo, 1);
            if ($scope.hotelSearch.passengerInfo.length < 3) {
                $rootScope.addGuestPicker = 'room';
            }
        }


                            
    }]);


