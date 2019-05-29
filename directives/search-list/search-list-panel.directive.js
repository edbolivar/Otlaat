(function () {
    'use strict';

    angular.module('hotelApp')
        .directive('searchList', function(DateService, $timeout) {

            return {
                restrict: 'E',
                scope: {
                    hotelSearch: '=',
                    hotelDestination: '=',
                    dates: '='
                },
                templateUrl: 'directives/search-list/search-list-panel.directive.html',
                controller: ['$translate', '$rootScope', 'DateService', '$location', 'objToQuery', '$timeout', '$scope', searchPanelCtrl ]
            };

            //SeachPanelCtrl function body
            function searchPanelCtrl($translate, $rootScope, DateService, $location, objToQuery, $timeout, $scope) {
                $scope.hotelsSearchParams = $location.search();
                //angular.copy($scope.hotel, $scope.hotelsSearchParams);
                formData();

                function formData() { 
                    showSearchPanel();
                }

                function showSearchPanel() {
                    $timeout(function () {
                        $scope.panelShown = true;
                    }, 1000)
                }

                
                $scope.hotelSearch = {};
                $scope.hotelSearch.passengerInfo = [];
                $scope.hotelSearch.chosenDestination= {};//
                $scope.isMobile = $rootScope.isMobile.any();


                $scope.showLocationSpinner = true;

                $scope.hotelSearch.passengerInfo.push({
                    adults: 2,
                    childrenAge: []
                });

                initOptions(true);

                $scope.hotelSearch.chosenDestination= $scope.hotelDestination;
                $scope.changeOption = function(option) {
                    $scope.chosenOption = option;
                    if (option.value === 3) {
                        $rootScope.addGuestPicker = 'room';
                        $scope.showGuestPicker = true;
                    } else {
                        $scope.showGuestPicker = false;
                        $rootScope.addGuestPicker = '';
                    }
                };

                $scope.addRoom = function () { 
                    $scope.hotelSearch.passengerInfo.push({
                        adults: 2,
                        childrenAge: []
                    });
                    
                    if ($scope.hotelSearch.passengerInfo.length > 2) {
                        $rootScope.addGuestPicker = 'full';
                    }

                };

                $scope.removeRoom = function () {
                    $scope.hotelSearch.passengerInfo = _.dropRight($scope.hotelSearch.passengerInfo, 1);
                    if ($scope.hotelSearch.passengerInfo.length < 3) {
                        $rootScope.addGuestPicker = 'room';
                    }
                };

                $scope.searchHotels = function (form) { 
                    //console.log('city search params', $scope.hotelDestination);
                    //console.log('chosen params', $scope.hotelSearch.chosenDestination);

                    $scope.hotelSearch.chosenDestination.cityId= $scope.hotelSearch.chosenDestination.cityId;
                    $scope.hotelSearch.chosenDestination.hotelId= $scope.hotelSearch.chosenDestination.hotelId;
                    //$scope.hotelSearch.chosenDestination.name= $scope.hotelDestination.name;
                    $scope.hotelSearch.chosenDestination.countryId= $scope.hotelSearch.chosenDestination.countryId;
                    $scope.hotelSearch.chosenDestination.countryCode= $scope.hotelSearch.chosenDestination.countryCode;

                    if (form.$invalid || !_.isObject($scope.hotelSearch.chosenDestination)) { 
                        $rootScope.showErrorDestinationMsg = true;
                        return;
                    }
                    var params= {};
                    if ($scope.hotelSearch.chosenDestination.cityId) { 
                        params.cityId = $scope.hotelSearch.chosenDestination.cityId ;
                    } 
                    if ($scope.hotelSearch.chosenDestination.hotelId) {
                        params.hotelId = $scope.hotelSearch.chosenDestination.hotelId;
                    }
                    params.name = $scope.hotelSearch.chosenDestination.name;
                    params.countryId = $scope.hotelSearch.chosenDestination.countryId;
                    params.countryCode = $scope.hotelSearch.chosenDestination.countryCode;
                    params.checkInDate = DateService.formatDateForApi($scope.dates.startDate);
                    params.checkOutDate = DateService.formatDateForApi($scope.dates.endDate);

                   // console.log($scope.hotelSearch.chosenDestination.countryId +'--'+ $scope.hotelSearch.chosenDestination.countryCode);
                    

                    var roomCriteria = [];
                    var roomsString = '';

                    //dummy data to be removed later
                   /* params.cityId = "12502";
                    //params.cityId = "28674";
                    params.countryId = "162";
                    params.countryCode = "TR";*/
                    //
                    //console.log('$scope.chosenOption.value', $scope.chosenOption.value);
                    if ($scope.chosenOption.value === 1) {
                        roomsString = '&roomCriteria[0][adultCount]=1&roomCriteria[0][roomCount]=1&roomCriteria[0][childCount]=0';
                    } else if ($scope.chosenOption.value === 2) {
                        roomsString = '&roomCriteria[0][adultCount]=2&roomCriteria[0][roomCount]=1&roomCriteria[0][childCount]=0';
                    } else {
                        angular.forEach($scope.hotelSearch.passengerInfo, function(room, index) {
                            var criteria = '&roomCriteria[' + index + ']',
                                roomCriteria = criteria + '[roomCount]=1' + criteria + '[adultCount]=' + room.adults + criteria + '[childCount]=' + room.childrenAge.length;

                            if (room.childrenAge.length > 0) {
                                angular.forEach(room.childrenAge, function(childAge, childIndex) {
                                    var chAge = !!childAge ? childAge : 0;
                                    roomCriteria += criteria + '[childAge][' + childIndex + ']=' + chAge;
                                });
                            }
                            roomsString += roomCriteria;
                        });
                    }

                    var hotelParams = (objToQuery.convert(params) + roomsString).substr(1);
                    //console.log('params', hotelParams);
                    $location.path('/hotellist').search(hotelParams);
                    //getHotels(objToQuery.convert(hotelParams), true);
                    //$scope.startFilterParamsWatcher();
                    $rootScope.fetchApiData(); 
                };


                $rootScope.$watch('lang', function(newVal, oldVal) {
                    if (!newVal || newVal === oldVal) {
                        return;
                    }

                    initOptions();
                });

                /*function initOptions(isInitChosen) { 
                    //console.log('$scope.hotelsSearchParams', $scope.hotelsSearchParams);
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
                    
                    $scope.chosenOption = isInitChosen ? $scope.datePickerOptions[optionNum] : $scope.datePickerOptions[optionNum];
                    
                }*/

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
                    //$scope.hotelSearch = {};
                    $scope.hotelSearch.passengerInfo = [];
                    $scope.isMobile = $rootScope.isMobile.any();
                    $scope.showLocationSpinner = true;

                    var rooms = _.pickBy($scope.hotelsSearchParams, function (value, key) {
                        return _.startsWith(key, 'roomCriteria');
                    });
                    //console.log('asas', rooms);
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
            }

        });

})();
