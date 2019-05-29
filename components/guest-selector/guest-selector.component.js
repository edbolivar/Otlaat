(function () {

    function guestSelectorCtrl($translate, $rootScope) {
        var ctrl = this;

        ctrl.$onInit = onInit;

        function onInit() { 
            var maxChildAge = 12,
                maxPeopleCount = 6, 
                availableCount = maxPeopleCount;

            ctrl.passengerInfo = ctrl.passengerInfo || {};
            ctrl.passengerInfo.childrenAge = ctrl.passengerInfo.childrenAge || [];
            ctrl.passengerInfo.adults = ctrl.passengerInfo.adults || 2;
            ctrl.childrenAgeLength = ctrl.passengerInfo.childrenAge.length || 0;
            ctrl.childAge = [];
            ctrl.peopleCountArray = [];
            ctrl.childrenCountArray = [];
            ctrl.childYearArray = [];
            //console.log('passengerInfo', ctrl.passengerInfo);

            ctrl.isOpenAdultDropdown = [false, false, false, false];
            ctrl.isOpenChildDropdown = [false, false, false, false];
            ctrl.ageDropdowns = {0: false, 1: false, 2: false};
            ctrl.isOpenAgeDropdown = [ctrl.ageDropdowns, ctrl.ageDropdowns, ctrl.ageDropdowns, ctrl.ageDropdowns];
            ctrl.isMobile = $rootScope.isMobile.any();

            initRoomsTitle();
            initAdultAgesTitle(true);
            initChildrenAgesTitle(true);

            if (ctrl.childrenAgeLength > 0) {
                for (var childAgeCount = 1; childAgeCount < ctrl.childrenAgeLength; childAgeCount++) {
                    setChildYearArray(ctrl.passengerInfo.childrenAge[childAgeCount]);
                }
            }

            ctrl.changeAdultCount = function (adultNumber, isInit) {
                availableCount = maxPeopleCount - ctrl.passengerInfo.childrenAge.length;
                var availableAdult = availableCount,
                    availableChildren;

                ctrl.passengerInfo.adults = adultNumber;
                availableAdult = isInit ? maxPeopleCount : availableAdult;
                availableChildren = maxPeopleCount - adultNumber;
                ctrl.peopleCountArray = setNewPeopleArray(maxPeopleCount, true);
                ctrl.childrenCountArray = setNewPeopleArray(maxPeopleCount - 1);
                ctrl.chosenAdaults = ctrl.adultAgesTitle[adultNumber - 1];
            };

            ctrl.changeAdultCount(ctrl.passengerInfo.adults, true);

            for (var maxChildAgeCount = 0; maxChildAgeCount < maxChildAge; maxChildAgeCount++) {
                ctrl.childAge.push({id: maxChildAgeCount + 1, name: maxChildAgeCount + 1})
            }

            ctrl.changeChildrenCount = function (childrenNumber, isInit) {
                childrenNumber = childrenNumber || 0;
                var childrenAgeLength = ctrl.passengerInfo.childrenAge.length,
                    difference = childrenAgeLength - childrenNumber,
                    availableChildren,
                    availableAdult;

                if (!isInit && difference === 0) {
                    return;
                }

                availableCount = maxPeopleCount - ctrl.passengerInfo.adults;
                availableChildren = availableCount;
                availableAdult = maxPeopleCount - childrenNumber;

                ctrl.childrenCountArray = setNewPeopleArray(maxPeopleCount - 1);
                ctrl.peopleCountArray = setNewPeopleArray(maxPeopleCount, true);
                if (difference > 0) {
                    ctrl.passengerInfo.childrenAge = _.dropRight(ctrl.passengerInfo.childrenAge, difference);
                    var childYearDiff = !_.isEmpty(ctrl.childYearArray)
                        ? ctrl.childYearArray.length - ctrl.passengerInfo.childrenAge.length : false;
                    ctrl.childYearArray = childYearDiff === false ?
                        ctrl.childYearArray : _.dropRight(ctrl.childYearArray, childYearDiff);
                    ctrl.isShowChildTitle = true;
                } else if (difference < 0) {
                    // ctrl.childrenAgeLength = ctrl.passengerInfo.childrenAge.length;
                    difference = difference * (-1);
                    for (var i = childrenAgeLength; i < childrenAgeLength + difference; i++) {
                        ctrl.passengerInfo.childrenAge[i] = ctrl.childAge[0].name;
                        setChildYearArrayNew(ctrl.passengerInfo.childrenAge[i], i)
                    }
                    ctrl.isShowChildTitle = true;
                }

                ctrl.childrenAgeLength = ctrl.passengerInfo.childrenAge.length;
                ctrl.chosenChildren = ctrl.childrenAgesTitle[childrenNumber];
            };

            ctrl.changeChildAge = function (ageValue, index) {
                if (ageValue === '<1') {
                    ageValue = 0;
                }
                ctrl.passengerInfo.childrenAge[index] = ageValue;
                setChildYearArrayNew(ageValue, index);

            };

            function setNewPeopleArray(number, isAdult) {
                var peopleArray = [];
                for (var i = 0; i <= number; i++) {
                    if (i === 0) {
                        i = isAdult ? i + 1 : i;
                    }
                    peopleArray.push(i);
                }
                return peopleArray;
            }

            function setChildYearArray(year) {
                if (!Number(year)) {
                    ctrl.childYearArray.push({id: year, name: '<1'});
                } else {
                    ctrl.childYearArray.push({id: year, name: year.toString()});
                }
            }

            function setChildYearArrayNew(year, index) {
                if (!Number(year)) {
                    ctrl.childYearArray[index] = ({id: year, name: '<1'});
                } else {
                    ctrl.childYearArray[index] = ({id: year, name: year.toString()});
                }
            }

            function initRoomsTitle() {
                ctrl.roomsTitle = [];
                for (var i = 1; i <= 4; i++) {
                    var title = {
                        text: $translate.instant('RoomsTitle' + i),
                        value: i - 1
                    };
                    ctrl.roomsTitle.push(title);
                }
            }

            function initAdultAgesTitle(isInitChosen) {
                ctrl.adultAgesTitle = [];
                var adultsNum = 2;
                for (var i = 1; i <= maxPeopleCount; i++) {
                    var adults = {
                        text: $translate.instant('AdultsTitle' + i),
                        value: i
                    };
                    ctrl.adultAgesTitle.push(adults);
                    if (!isInitChosen && i === ctrl.chosenAdaults.value) {
                        adultsNum = i;
                    }
                }
                ctrl.chosenAdaults = isInitChosen ? ctrl.adultAgesTitle[adultsNum] : _.find(ctrl.adultAgesTitle, {value: ctrl.chosenAdaults.value});
            }

            function initChildrenAgesTitle(isInitChosen) {
                ctrl.childrenAgesTitle = [];
                var childrenNum = 0;
                for (var i = 0; i <= maxPeopleCount - 1; i++) {
                    var adults = {
                        text: $translate.instant('ChildrenTitle' + i),
                        value: i
                    };
                    ctrl.childrenAgesTitle.push(adults);
                    if (!isInitChosen && i === ctrl.chosenAdaults.value) {
                        childrenNum = i;
                    }
                }

                if (isInitChosen) {
                    childrenNum = ctrl.passengerInfo.childrenAge.length;
                }
                ctrl.chosenChildren = isInitChosen ? ctrl.childrenAgesTitle[childrenNum] : ctrl.childrenAgesTitle[childrenNum];
            }

            $rootScope.$watch('lang', function (newVal, oldVal) {
                if (!newVal || newVal === oldVal) {
                    return;
                }

                initRoomsTitle(true);
                initAdultAgesTitle();
                initChildrenAgesTitle(true);
            });
        }
    }

    angular
        .module('hotelApp')
        .component('guestSelector', {
            templateUrl: 'components/guest-selector/guest-selector.component.html',
            controller: ['$translate', '$rootScope', guestSelectorCtrl],
            controllerAs: 'ctrl',
            bindings: {
                passengerInfo: '=',
                roomNumber: '<',
                isLast: '<',
                removeRoom: '&',
                isShowChildTitle: '='
            }
        });
})();
