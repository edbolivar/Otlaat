app.controller('hotelListController', ['$scope', '$http', '$location', '$timeout', '$rootScope', '$translate',
    'HotelSearchService', 'objToQuery', 'DateService', 'userProfileService',
    function ($scope, $http, $location, $timeout, $rootScope, $translate, HotelSearchService, objToQuery, DateService, userProfileService) {

        $scope.status = {
            isStarOpen: true,
            isPriceOpen: true,
            isAcomadationOpen: true,
            isHotelPrefOpen: true
        };
        $scope.isMobile = $rootScope.isMobile.any();
        $scope.dirSize = $scope.isMobile ? 5 : 10;
        $scope.pageSetup = {
            breadcrumb: "",
            language: $rootScope.lang || 'en',
            otlaat_session: ""
        };
        $scope.filteredHotels = {
            parent: false
        };
        $scope.pagination = {
            currentPage: 1
        };

        $scope.categories = [];
        $scope.p_list = {};
        $scope.a_list = {};

        $scope.hotellists = [];
        $scope.isFetching = true; // Start loading spinner *Added by Igor
        $scope.pageSize = 7;
        $scope.sort = {name: "#", price: '#', guest_rating: "#", mobile: "#"};
        $scope.hotel = {};
        $scope.hotelsSearchParams = {};

        $scope.search= {};

        $scope.hotelDestination={};

        $scope.filterParams = {};
        $scope.hotel = $location.search();
        angular.copy($scope.hotel, $scope.hotelsSearchParams);
        var firstWatcherRun = true;
        var sliderStartedChanging = false;
        var isSearchList = false; //search list flag

        $scope.pageSetup.dateFrom = moment(DateService.parseDate($scope.hotelsSearchParams.checkInDate)).format("DD-MM-YYYY");
        $scope.pageSetup.dateTo = moment(DateService.parseDate($scope.hotelsSearchParams.checkOutDate)).format("DD-MM-YYYY");

        $scope.nameSort = nameSort;
        $scope.priceSort = priceSort;
        $scope.guestRatingSort = guestRatingSort;
        $scope.mobileSort = mobileSort;
        $scope.togglePopular = togglePopular;
        $scope.toggleFilters = toggleFilters;
        $scope.calcDailyPrice = calcDailyPrice;
        $scope.hackForLang = hackForLang;
        $scope.calcStartingFrom = calcStartingFrom;
        $scope.getLabel = getLabel;
        $scope.renderRzSlider = renderRzSlider;
        $scope.redirectToTheFirstPage = redirectToTheFirstPage;

        //added by Mir
        $scope.requestHotelDetails = requestHotelDetails;
        $scope.changeOption = changeOption;
        $scope.addRoom = addRoom;
        $scope.removeRoom = removeRoom;


        formData();

        function formData() {
            localStorage.setItem('otlaat.search', JSON.stringify($scope.hotelsSearchParams));

            initializeSearch();

            getHotels(objToQuery.convert($scope.hotelsSearchParams), false);
            sortMobileText();
            startFilterParamsWatcher();
            renderRzSlider();
            $rootScope.$watch('lang', languageWatcher);
            $scope.$watch('filteredHotels.parent', filteredHotelsWatcher, true);
        }

        

        function languageWatcher(newValue, oldValue) {
            if (!newValue || newValue === oldValue || !$scope.priceRange) {
                return;
            }

            $scope.pageSetup.language = newValue;

            if (newValue === "ar") {
                $scope.priceRange.options.rightToLeft = true;
            } else {
                $scope.priceRange.options.rightToLeft = false;
            }
            $scope.$broadcast('rzSliderForceRender');

            $scope.ratinArr = [];
            $scope.ar = [];

            $scope.hotellists = !$scope.hotellists ? false
                : _.each($scope.hotellists, function (hotel) {
                    $scope.ar.push(getRatingText(hotel.stars));
                });

            $timeout(function () {
                $scope.ratinArr = $scope.ar;
                getDailyPriceText();
            }, 300);

            $scope.hackForLang();
        }


        function getHotels(params, isFilters) {
            $scope.serverErorr = false;

            if (isFilters) {
                $scope.isFetchingWithFilters = true;
            }
                //console.log('params',  params);
            HotelSearchService.hotelSearch(params, isFilters).then(function (result) {
                // Added by Igor
                if (dataHotelsReceivedAndSuccessful(result)) {
                    $scope.main = result.data;
                    
                    //Meta Data
                    if (!isFilters) {
                        var metaData={
                            meta_title: $scope.main.searchHotelRes.meta_title,
                            meta_description: $scope.main.searchHotelRes.meta_description
                        }
                        $rootScope.meta_title= metaData.meta_title;
                        $rootScope.meta_description= metaData.meta_description;
                        $rootScope.change_title();
                    }



                    //$rootScope.userProfileService = userProfileService;
                    //$rootScope.userProfileService.setMeta("Web App");
                    //console.log('main res title', $rootScope.meta_title);

                    // Added by Igor - to control not found or no filtered results
                    $scope.dataReceived = true;

                    //for hotel currency conversion
                    $scope.otlaat_currency= (typeof result.data.searchHotelRes !== 'undefined') ? result.data.searchHotelRes.otlaat_currency : result.data.searchHotelFilterRes.otlaat_currency;
                    //fetching markup price
                    $scope.markupPrice= (typeof result.data.searchHotelRes !== 'undefined') ? result.data.searchHotelRes.markupPrice : result.data.searchHotelFilterRes.markupPrice;
                    
                    if (!isFilters) {
                        //setup for otlaat_session
                        $scope.pageSetup.otlaat_session= result.data.searchHotelRes.otlaat_session;
                        //Keep The necessary data for filter use
                        $scope.pageSetup.breadcrumb = angular.copy(result.data.searchHotelRes.BreadCrumb);
                        $scope.pageSetup.FromDate = angular.copy(result.data.searchHotelRes.FromDate);
                        $scope.pageSetup.ToDate = angular.copy(result.data.searchHotelRes.ToDate);
                    }

                    try {
                        if (!isFilters) {
                            var fDate= $scope.main.searchHotelRes.FromDate.substring(0, 4)+' '+ $scope.main.searchHotelRes.FromDate.substring(4, 6)+' '+ $scope.main.searchHotelRes.FromDate.substring(6, 8);
                            var tDate= $scope.main.searchHotelRes.ToDate.substring(0, 4)+' '+ $scope.main.searchHotelRes.ToDate.substring(4, 6)+' '+ $scope.main.searchHotelRes.ToDate.substring(6, 8);
                            $scope.dates = {
                                min: new Date(fDate),
                                max: new Date(tDate)
                            };
                        } else {
                            var fDate= $scope.pageSetup.FromDate.substring(0, 4)+' '+ $scope.pageSetup.FromDate.substring(4, 6)+' '+ $scope.pageSetup.FromDate.substring(6, 8);
                            var tDate= $scope.pageSetup.ToDate.substring(0, 4)+' '+ $scope.pageSetup.ToDate.substring(4, 6)+' '+ $scope.pageSetup.ToDate.substring(6, 8);
                            $scope.dates = {
                                min: new Date(fDate),
                                max: new Date(tDate)
                            };
                        }
                        $scope.dates.range = Math.round(Math.abs(($scope.dates.min.getTime() - $scope.dates.max.getTime()) / (24 * 60 * 60 * 1000)))
                    } catch (exp) {
                        console.log("no date range given");
                    }

                    var processedResults = fixSchema(result.data.searchHotelRes ? result.data.searchHotelRes.HotelDetails : result.data.searchHotelFilterRes.HotelDetails, isFilters);
                    var sortedResults = processedResults.map(function (element) {
                        return element;
                    }).sort(function (a, b) {
                        return (a.price > b.price) ? 1 : ((b.price > a.price) ? -1 : 0);
                    });
                    var minPrice = sortedResults[0].price;
                    var maxPrice = sortedResults[sortedResults.length - 1].price;

                    $scope.hotellists = $location.search().hotelId ? processedResults : sortedResults;

                    $scope.hotel = $location.search();
                    $scope.hotel.range = {
                        min: minPrice,
                        max: maxPrice
                    };

                    if (!isFilters) {

                            //console.log('minPrice1', minPrice);
                            //console.log('maxPrice2', maxPrice);
                        //Keep The necessary data for filter use
                        $scope.priceRange = {
                            minValue: Math.floor(minPrice),
                            maxValue: Math.ceil(maxPrice),
                            options: {
                                floor: Math.floor(minPrice),
                                ceil: Math.ceil(maxPrice),
                                interval: 1000,
                                rightToLeft: $rootScope.lang === "ar",
                                onStart: function () {
                                    sliderStartedChanging = true;
                                },
                                onEnd: function () {
                                    sliderStartedChanging = false;
                                    $scope.filterParams.sliderStartedChanging = Math.random();
                                }
                            }
                        };

                        $scope.filterParams.priceRange = {
                            minValue: Math.floor(minPrice),
                            maxValue: Math.ceil(maxPrice)
                        };
                    }

                    $scope.sort = {name: "#", price: '#', guest_rating: "#", mobile: "#"};
                    $scope.rangeHackShow = true;
                    $scope.isFetching = false;
                    $scope.isFetchingWithFilters = false;
                    renderRzSlider();
                } else {
                    $scope.isFetching = false;
                    $scope.hotellists = false;
                    $scope.isFetchingWithFilters = false;
                    console.log('json success false');
                }
                getDailyPriceText();
            }, function (err) {
                $scope.isFetching = false;
                $scope.hotellists = false;
                $scope.isFetchingWithFilters = false;
                $scope.serverErorr = true;
            });
        }

        function hackForLang() {
            $scope.newH = [];
            angular.extend($scope.newH, $scope.hotellists);
            $scope.hotellists = $scope.hotellists.reverse();
            $timeout(function () {
                $scope.hotellists = $scope.newH;
            });
        }

        function calcDailyPrice(price) {
            if (!$scope.dates) {
                return 'no date range given'
            } else {
                return (parseFloat(price) * $scope.dates.range)
            }
        }

        function filteredHotelsWatcher(newValue, oldValue) { 
            //console.log('acivated2');
            isSearchList= false;
            // to show minimal price for these suggestions
            if (!newValue || newValue === oldValue) {
                return;
            }
            var minPrcieArr = [],
                minPrice = 0,
                maxPrice = 0;

            _.each(newValue, function (hotel) {
                minPrcieArr.push(hotel.price);
            });
            minPrcieArr = _.uniq(minPrcieArr);
            minPrice = _.min(minPrcieArr);

            $scope.pageSetup.starting_at =  Math.floor(minPrice);

            //isSearchList= false;
        }

        function renderRzSlider() {
            $timeout(function () { 
                $scope.$broadcast('reCalcViewDimensions');
            }, 100);
            $scope.$broadcast('rzSliderForceRender');
        }

        function calcStartingFrom(price) {
            if (!$scope.dates) {
                return 'no date range given'
            } else {
                return (parseFloat(price) * $scope.dates.range)
            }
        }

        function redirectToTheFirstPage() {
            $scope.pagination.currentPage = 1;
        }


        $rootScope.fetchApiData = function(){
            $scope.isFetching = true; //for showing loader
            $scope.hotel = $location.search();
            //console.log('hotel', $scope.hotel);
            angular.copy($scope.hotel, $scope.hotelsSearchParams);
            //console.log('xxxx', $scope.hotelsSearchParams);
            //make the filter blank. On main search from listingg page no filer is active.
            /*$scope.filterParams = {};
            $scope.filterParams.priceRange = {
                minValue: 0,
                maxValue: 0
            };*/

            //$scope.filterParams.star= {};
            $scope.filterParams = {
                star: [],
                board: [],
                amenity: [],
                //price: ""
                priceRange : {
                    minValue: 0,
                    maxValue: 0
                }
            };

            //make a flag for not allowing to call filter
            isSearchList = true;

            getHotels(objToQuery.convert($scope.hotelsSearchParams), false);
            $scope.searchByTopFilters = true;
        };

        function startFilterParamsWatcher() { 
            //$timeout(startWatcher);

            //console.log('hihi1111');
            startWatcher();
            //console.log('hihi');
            function startWatcher() {
                $scope.$watch('filterParams', watcherFunction, true);
            }

            function watcherFunction(new_, old) {//console.log('acivated1');

                //console.log('filterParams', $scope.filterParams);

                //console.log('new_', new_);
                //console.log('old_', old);
                //console.log('sliderStartedChanging', sliderStartedChanging);

                // Needed to avoid 2 or more requests in a row
                if (!old.priceRange || sliderStartedChanging) return;

                //console.log('isSearchList', isSearchList);
                if(isSearchList) return;

                //isSearchList= false;

                if (new_ && (JSON.stringify(new_) != JSON.stringify(old))) {
                    var params = {
                        star: [],
                        board: [],
                        amenity: [],
                        price: ""
                    };
                    try {
                        for (var i in $scope.filterParams.star) {
                            if ($scope.filterParams.star[i]) {
                                params.star.push(i);
                            }
                        }
                        params.star = params.star.join(",");
                    } catch (exp) {
                        console.warn("star not filtered");
                    }

                    var minPrice = ($scope.filterParams.priceRange.minValue < $scope.priceRange.minValue) ?
                        $scope.priceRange.minValue : $scope.filterParams.priceRange.minValue;
                    var maxPrice = ($scope.filterParams.priceRange.maxValue > $scope.priceRange.maxValue) ?
                        $scope.priceRange.maxValue : $scope.filterParams.priceRange.maxValue;
                    params.price = minPrice + "," + maxPrice;

                    if($scope.pageSetup.otlaat_session){
                        params.otlaat_session = $scope.pageSetup.otlaat_session;
                    }

                    try {
                        for (var i in $scope.filterParams.acomadation) {
                            if ($scope.filterParams.acomadation[i]) {
                                //params.board.push($scope.room_data[i]);
                                params.board.push(i);
                            }
                        }
                        params.board = params.board.join(",");
                    } catch (exp) {
                        console.warn("board not filtered");
                    }
                    try {
                        for (var i in $scope.filterParams.preferences) {
                            if ($scope.filterParams.preferences[i]) {
                                params.amenity.push(i);
                            }
                        }
                        params.amenity = params.amenity.join(",");
                    } catch (exp) {
                        console.warn("board not filtered");
                    }

                    var newObj = angular.extend($scope.hotelsSearchParams, params);

                    $scope.searchByTopFilters = false;

                    getHotels(objToQuery.convert(newObj), true);

                }
            }
        }

        // Calculates hotel preferences through all the hotels received from the server
        function calcAmenitiesList(list) {
            //$scope.p_list = {};
            for (var l in list) {
                if (list[l]) {
                    try {
                        if ($scope.p_list[l]) {
                            $scope.p_list[l] += 1;
                        } else {
                            $scope.p_list[l] = 1;
                        } //console.log('ameneties', $scope.p_list[l]);
                    } catch (exp) {
                    }
                }
            }
        }

        // Calculates accommodation types through all the hotels received from the server
        function calcAcomadation(list) {
            //$scope.a_list = {};
            for (var l in list) {
                if (list[l]) {
                    var newService = list[l];
                    var serviceName = alignBedAndBreakfast(newService.Name);
                    try {
                        if ($scope.a_list[newService.Name]) {
                            $scope.a_list[newService.Name].count += 1;
                        } else {
                            $scope.a_list[newService.Name] = {code: newService.Code, count: 1};
                        }
                    } catch (exp) {
                    }
                }
            }
        }

        function alignBedAndBreakfast(name) {
            return name === "Bed and Breakfast (Non-Refundable)"
                ? "Bed and Breakfast <br> <span class='accommodation-second-row'>(Non-Refundable)</span>"
                : name;
        }


        // Calculates categories through all the hotels received from the server
        function calcCategories(category) { 
            //$scope.categories = [];
            if ($scope.categories.indexOf(category) === -1 && category!== '-') {
                $scope.categories.push(category);
                //console.log('$scope.categories', $scope.categories);
            }
        }

        function sortMobileText() {
            setTimeout(function () {
                $("#mobile-sort-text").html($('#mobile-sort option:selected').html());
            }, 0);
        }

        function fixSchema(list, isFilters) {

            var hotels = [];
            $scope.ratinArr = [];

            if (!isFilters) {
                $scope.a_list = {};
                $scope.categories = [];
                $scope.p_list = {};
            }

            if (typeof list[0] == 'undefined') {
                list.filterinfo = _.isArray(list.filterinfo) && list.filterinfo
                    ? list.filterinfo : [list.filterinfo];

                if (!isFilters) {
                    calcAmenitiesList(list.hotelinfo.Amenities);
                    calcAcomadation(getRoomTypes(list.filterinfo));
                    calcCategories(list.hotelinfo.HotelCategory)
                }

                $scope.room_data = getRoomData(list.filterinfo);
                var price_options = getLowestPrice(list.filterinfo),
                    preferences = [];

                _.each(list.hotelinfo.Amenities, function (val, amenity) {
                    if (val) {
                        preferences.push(amenity);
                    }
                });

                var guestRating = list.hotelinfo['rating '] || list.hotelinfo['rating'];
                $scope.ratinArr.push(getRatingText(guestRating));
                hotels.push({
                    "img": list.hotelinfo.Photo,
                    "name": list.hotelinfo.HotelName,
                    "hotelName": decodeURIComponent(list.hotelinfo.HotelName),
                    "address": list.hotelinfo.Address,
                    "category": list.hotelinfo.HotelCategory,
                    "desc": list.hotelinfo.Description,
                    "rating": guestRating,
                    "preferences": preferences,
                    "reviews": 18,
                    //"price": (parseFloat(price_options.Price.Amount)) * $scope.dates.range,
                    "price": (parseFloat(price_options.Price.Amount)),
                    "room_type": price_options.Board.Name,
                    "facilities": list.hotelinfo.Amenities,
                    "room_types": getRoomTypes(list.filterinfo),
                    "link": null,
                    "top": (list.hotelinfo.fac_Top == "1"),
                    'ratingText': getRatingText(guestRating),
                    'hotelCode': list.hotelinfo.HotelCode,
                });

            } else {
                for (var l in list) {
                    list[l].filterinfo = _.isArray(list[l].filterinfo) && list[l].filterinfo
                        ? list[l].filterinfo : [list[l].filterinfo];


                    if (!isFilters) {
                        calcAmenitiesList(list[l].hotelinfo.Amenities);
                        calcAcomadation(getRoomTypes(list[l].filterinfo));
                        calcCategories(list[l].hotelinfo.HotelCategory);
                    }

                    $scope.room_data = getRoomData(list[l].filterinfo);
                    var price_options = getLowestPrice(list[l].filterinfo),
                        preferences = [];

                    _.each(list[l].hotelinfo.Amenities, function (val, amenity) {
                        if (val) {
                            preferences.push(amenity);
                        }
                    });

                    var guestRating = list[l].hotelinfo['rating '] || list[l].hotelinfo['rating'];
                    $scope.ratinArr.push(getRatingText(guestRating));
                    hotels.push({
                        "img": list[l].hotelinfo.Photo,
                        "name": list[l].hotelinfo.HotelName,
                        "hotelName": decodeURIComponent(list[l].hotelinfo.HotelName),
                        "address": list[l].hotelinfo.Address,
                        "category": list[l].hotelinfo.HotelCategory,
                        "desc": list[l].hotelinfo.Description,
                        "rating": guestRating,
                        "preferences": preferences,
                        "reviews": 18,
                        //"price1": (parseFloat(price_options.Price.Amount)) * $scope.dates.range,
                        "price": (parseFloat(price_options.Price.Amount)),
                        "room_type": price_options.Board.Name,
                        "facilities": list[l].hotelinfo.Amenities,
                        "room_types": getRoomTypes(list[l].filterinfo),
                        "link": null,
                        "top": (list[l].hotelinfo.fac_Top == "1"),
                        'ratingText': getRatingText(guestRating),
                        'hotelCode': list[l].hotelinfo.HotelCode
                    });
                }
            }

            return hotels;


            function getLowestPrice(price_list) {
                return price_list.sort(function (a, b) {
                    return (parseFloat(a.Price.Amount) > parseFloat(b.Price.Amount)) ? 1 : ((parseFloat(b.Price.Amount) > parseFloat(a.Price.Amount) ) ? -1 : 0);
                })[0];
            }

            function getRoomTypes(info) {
                var types = [];
                for (var i in info) {
                    types.push(info[i].Board)
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
        }

        function toggleFilters(e) {
            e.preventDefault();
            $scope.filtersActive = !$scope.filtersActive;
        }

        function nameSort() {
            if ($scope.sort.name == $translate.instant('zToA')) {
                $scope.hotellists = $scope.hotellists.sort(function (a, b) {
                    return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0);
                }).reverse();
            } else {
                $scope.hotellists = $scope.hotellists.sort(function (a, b) {
                    return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0);
                })
            }
        }

        function priceSort() {
            if ($scope.sort.price === $translate.instant('sortingDescending')) {
                $scope.hotellists = $scope.hotellists.sort(function (a, b) {
                    return (a.price > b.price) ? 1 : ((b.price > a.price) ? -1 : 0);
                }).reverse();
            } else {
                $scope.hotellists = $scope.hotellists.sort(function (a, b) {
                    return (a.price > b.price) ? 1 : ((b.price > a.price) ? -1 : 0);
                })
            }
        }

        function guestRatingSort() {
            if ($scope.sort.guest_rating === $translate.instant('guestAscending')) {
                $scope.hotellists = _.orderBy($scope.hotellists, 'rating', 'asc');
            } else {
                $scope.hotellists = _.orderBy($scope.hotellists, 'rating', 'desc');
            }
        }

        function mobileSort() {
            $scope.orderByField = $scope.sort.mobile.replace('#', '');
            $scope.reverseSort = ($scope.sort.mobile.indexOf('#') > -1);
            $("#mobile-sort-text").html($('#mobile-sort option:selected').html());
            $scope.hotellists = $scope.hotellists.sort(function (a, b) {
                return (a[$scope.sort.mobile.replace("#", '')] > b[$scope.sort.mobile.replace("#", '')]) ? 1 : ((b[$scope.sort.mobile.replace("#", '')] > a[$scope.sort.mobile.replace("#", '')]) ? -1 : 0);
            });
            if ($scope.sort.mobile.indexOf('#') > -1) {
                $scope.hotellists = $scope.hotellists.reverse();
            }

        }

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

        function togglePopular(e) {
            e.preventDefault();
            $scope.popular = !$scope.popular;
            $rootScope.most_popular = !$rootScope.most_popular;
        }

        function getDailyPriceText() {
            $scope.dailyPriceText = !$scope.dates
                ? $translate.instant('noDateRange')
                : $translate.instant('avgFirst') + ' ' + ($scope.dates.range > 1
                ? ($scope.dates.range + $translate.instant('avgSecondNights'))
                : $translate.instant('avgSecondNight'));
        }

        // Added by Igor
        function dataHotelsReceivedAndSuccessful(result) {
            if (result.data.success && result.data.searchHotelRes && result.data.searchHotelRes.HotelDetails && result.data.searchHotelRes.HotelDetails.hotelinfo) {
                return result.data.searchHotelRes.HotelDetails = [result.data.searchHotelRes.HotelDetails];
            } else {
                return result.data.success &&
                    (result.data.searchHotelRes && result.data.searchHotelRes.HotelDetails.length ||
                        result.data.searchHotelFilterRes && result.data.searchHotelFilterRes.HotelDetails.length)
            }

        }

        // Added By Igor from hoteldetailsCtrl
        function getLabel(key) {
            var substr = key.substr(4), res = substr;
            for (var i = 1; i < substr.length; i++) {
                if (substr[i] == substr[i].toUpperCase() && substr[1] != substr[1].toUpperCase()) {
                    res = substr.replace(substr[i], " " + substr[i]);
                    break;
                }
            }
            result = res.replace(/_/g, " ");
            return result;
        }

        //By mir
        function requestHotelDetails(modifySearchClick) {
            $scope.fetchingRooms = true;
            //$scope.hotellists.hotelDetails.combinedAndGroupedRooms = [];
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
            //console.log('cc details', $scope.hotelsSearchParams);
            params.checkInDate = DateService.formatDateForApi($scope.search.startDate);
            params.checkOutDate = DateService.formatDateForApi($scope.search.endDate);
            params.cityId = $scope.hotelsSearchParams.cityId;
            params.countryCode = $scope.hotelsSearchParams.countryCode;
            params.countryId = $scope.hotelsSearchParams.countryId;
            //params.hotelId = $scope.hotelsSearchParams.hotelId;

            //console.log('modify search', params);
            //Added for sending currency param in request
            //params.currency = $scope.hotelsSearchParams.currency;
            if (modifySearchClick === true) {
                $scope.hotelsSearchParams = params;
            }

            getHotels(objToQuery.convert($scope.hotelsSearchParams), false);
        }

        function initializeSearch() {
            $scope.search.startDate = parseDate($scope.hotelsSearchParams.checkInDate);
            $scope.search.endDate = parseDate($scope.hotelsSearchParams.checkOutDate);
            //add the autocomplete informations
            $scope.hotelDestination.cityId = $scope.hotelsSearchParams.cityId;
            $scope.hotelDestination.countryId = $scope.hotelsSearchParams.countryId;
            $scope.hotelDestination.countryCode = $scope.hotelsSearchParams.countryCode;
            $scope.hotelDestination.hotelId = $scope.hotelsSearchParams.hotelId;
            $scope.hotelDestination.name = $scope.hotelsSearchParams.name;
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
                if (!isInitChosen && i === $scope.chosenOption.value) {
                    optionNum = i;
                }
            }

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
            }

            $scope.chosenOption = $scope.datePickerOptions[optionNum];
            $scope.hotelSearch = {};
            $scope.hotelSearch.passengerInfo = [];
            $scope.isMobile = $rootScope.isMobile.any();
            $scope.showLocationSpinner = true;

            var rooms = _.pickBy($scope.hotelsSearchParams, function (value, key) {
                return _.startsWith(key, 'roomCriteria');
            });

            //console.log('hello', $scope.hotelSearch.passengerInfo);

            (function () {
                var i = 0;
                parseRooms(rooms);

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

        /* ----------------------------------- */
        /* Function for finding out Broken images */
        /* ----------------------------------- */

        /*$(window).bind('load', function(){
            $('img').each(function(){
                if((typeof this.naturalWidth != 'undefined' && this.naturalWidth == 0) || this.readyState == 'uninitialized'){
                    console.log('images broken', $(this).attr('src'));
                }
            });
        });*/



    }]);


app.filter('pagination', function () {
    return function (data, start) {
        if (data) {
            return data.slice(start);
        }
    };
})
    .filter('mostPopular', function ($rootScope) {
        return function (arrayItems) {
            if (!arrayItems) {
                return false
            }
            if ($rootScope.most_popular) {
                var list = [];
                for (var item in arrayItems) {
                    if (arrayItems[item].top) {
                        list.push(arrayItems[item]);
                    }
                }
                return list
            } else {
                return arrayItems
            }
        }
    })
    .filter('getRatingText', function ($translate) {
        return function (rating) {
            if (rating) {
                rating = parseFloat(rating);
                if (rating < 6) {
                    return $translate.instant('ratingPoor');
                }
                if (rating >= 6 && rating < 8) {
                    return $translate.instant('ratingGood');
                }
                if (rating >= 8 && rating < 9) {
                    return $translate.instant('ratingVeryGood');
                }
                if (rating >= 8 && rating <= 10) {
                    return $translate.instant('ratingExcellent');
                }
            }
        }
    })
    .filter('calcPrice', function () {
        return function (price) {
            if (price) {
                price = parseFloat(price);
            }
        }
    })
    .filter('fixRating', function () {
        return function (data) {
            if (data) {
                return Math.round(parseFloat(data) / 2)
            }
        }
    });




    
















