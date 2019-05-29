(function () {

    function searchPanelCtrl($translate, $rootScope, DateService, $location, objToQuery, $timeout) {
        var ctrl = this;

        formData();

        function formData() {
            showSearchPanel();
        }

        function showSearchPanel() {
            $timeout(function () {
                ctrl.panelShown = true;
            }, 1000)

        }

        initOptions(true);
        ctrl.hotelSearch = {};
        ctrl.hotelSearch.passengerInfo = [];
        ctrl.isMobile = $rootScope.isMobile.any();

        ctrl.showLocationSpinner = true;

        ctrl.hotelSearch.passengerInfo.push({
            adults: 2,
            childrenAge: []
        });
        ctrl.changeOption = function(option) {
            ctrl.chosenOption = option;
            if (option.value === 3) {
                $rootScope.addGuestPicker = 'room';
                ctrl.showGuestPicker = true;
            } else {
                ctrl.showGuestPicker = false;
                $rootScope.addGuestPicker = '';
            }
        };

        ctrl.addRoom = function () {
            ctrl.hotelSearch.passengerInfo.push({
                adults: 2,
                childrenAge: []
            });
            if (ctrl.hotelSearch.passengerInfo.length > 2) {
                $rootScope.addGuestPicker = 'full';
            }

        };

        ctrl.removeRoom = function () {
            ctrl.hotelSearch.passengerInfo = _.dropRight(ctrl.hotelSearch.passengerInfo, 1);
            if (ctrl.hotelSearch.passengerInfo.length < 3) {
                $rootScope.addGuestPicker = 'room';
            }
        };

        ctrl.searchHotels = function (form) {
            if (form.$invalid || !_.isObject(ctrl.hotelSearch.chosenDestination)) { 
                $rootScope.showErrorDestinationMsg = true;
                return;
            }
            var params= {};
            if (ctrl.hotelSearch.chosenDestination.cityId) { 
                params.cityId = ctrl.hotelSearch.chosenDestination.cityId;
            } 
            if (ctrl.hotelSearch.chosenDestination.hotelId) {
                params.hotelId = ctrl.hotelSearch.chosenDestination.hotelId;
            }
            params.name = ctrl.hotelSearch.chosenDestination.name; //location name added 
            params.countryId = ctrl.hotelSearch.chosenDestination.countryId;
            params.countryCode = ctrl.hotelSearch.chosenDestination.countryCode;
            params.checkInDate = DateService.formatDateForApi(ctrl.hotelSearch.startDate);
            params.checkOutDate = DateService.formatDateForApi(ctrl.hotelSearch.endDate);
        
            roomCriteria = [],
            roomsString = '';

            /*
            //dummy data to be removed later
            params.cityId = "12502";
            //params.cityId = "28674";
            params.countryId = "162";
            params.countryCode = "TR"; */
            

            if (ctrl.chosenOption.value === 1) {
                roomsString = '&roomCriteria[0][adultCount]=1&roomCriteria[0][roomCount]=1&roomCriteria[0][childCount]=0';
            } else if (ctrl.chosenOption.value === 2) {
                roomsString = '&roomCriteria[0][adultCount]=2&roomCriteria[0][roomCount]=1&roomCriteria[0][childCount]=0';
            } else {
                angular.forEach(ctrl.hotelSearch.passengerInfo, function(room, index) {
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

            $location.path('/hotellist').search(hotelParams);
        }; 

        $rootScope.$watch('lang', function(newVal, oldVal) {
            if (!newVal || newVal === oldVal) {
                return;
            }

            initOptions();
        });

        function initOptions(isInitChosen) {
            ctrl.datePickerOptions = [];
            var optionNum = 0;
            for (var i = 1; i <= 3; i++) {
                var option = {
                    text: $translate.instant('DatePickerOption' + i),
                    value: i
                };
                ctrl.datePickerOptions.push(option);
                if (!isInitChosen && i === ctrl.chosenOption.value) {
                    optionNum = i;
                }
            }
            ctrl.chosenOption = isInitChosen ? ctrl.datePickerOptions[optionNum] : ctrl.datePickerOptions[optionNum];
        }
    }
    angular
        .module('hotelApp')
        .component('searchPanel', {
            templateUrl: 'components/search-panel/search-panel.component.html',
            controller: ['$translate', '$rootScope', 'DateService', '$location', 'objToQuery', '$timeout', searchPanelCtrl],
            controllerAs: 'ctrl',
            bindings: {}
        });
})();
