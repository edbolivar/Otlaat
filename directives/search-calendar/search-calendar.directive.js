(function () {
    'use strict';

    angular.module('hotelApp')
        .directive('searchCalendar', function(DateService, $timeout) {

            return {
                restrict: 'E',
                scope: {
                    startDate: '=',
                    endDate: '=',
                    isRequired: '=',
                    smallSizeFormat: '='
                },
                templateUrl: 'directives/search-calendar/search-calendar.directive.html',
                link: function($scope) {
                    $scope.getMoment = DateService.getMoment;
                    var today = DateService.getMomentTimestampDate(),
                        isNotStartDate = !$scope.startDate,
                        maxStartDate = null,
                        minStartDate = today;

                    $scope.startDate = DateService.getMomentTimestampDate($scope.startDate);
                    $scope.endDate = DateService.getMomentTimestampDate($scope.endDate);
                    if (isNotStartDate) {
                        $scope.startDate = DateService.addPeriodToDate(1, 'days', $scope.startDate);
                        $scope.endDate = DateService.addPeriodToDate(1, 'days', $scope.startDate);
                        minStartDate = $scope.startDate;
                    }

                    $scope.showPopup = {
                        openStartDate: false,
                        openEndDate: false
                    };

                    $scope.dateOptionsStart = {
                        formatYear: 'yy',
                        maxDate: maxStartDate,
                        minDate: minStartDate,
                        showWeeks: false,
                        startingDay: 1,
                        initDate: new Date($scope.startDate),
                        customClass: getDateClass
                    };

                    $scope.dateOptionsEnd = {
                        formatYear: 'yy',
                        maxDate: null,
                        minDate: DateService.addPeriodToDate(1, 'days', $scope.startDate),
                        showWeeks: false,
                        startingDay: 1,
                        initDate: DateService.addPeriodToDate(1, 'days', $scope.startDate),
                        customClass: getDateClass
                    };

                    $scope.$watch('startDate', function(newVal, oldVal) {
                        if (!newVal || newVal === oldVal) {
                            return;
                        }
                        var minDate = DateService.addPeriodToDate(1, 'days', newVal);
                        $scope.dateOptionsEnd.minDate = minDate;
                        $scope.dateOptionsEnd.initDate = minDate;
                    });

                    $scope.$watch('showPopup.openStartDate', function(newVal, oldVal) {
                       // debugger
                    });

                    $scope.openStartDate = function(event) {
                        if (event.originalEvent.target.className.indexOf('calendar-select') < 0) {
                            event.stopPropagation();
                            $timeout(function() {
                                //$scope.showPopup.openEndDate = true;
                            });
                            return;
                        }
                        $scope.showPopup.openStartDate = true;
                    };

                    $scope.openEndDate = function(event) {
                        if(!$scope.startDate || event.originalEvent.target.className.indexOf('calendar-select') < 0) {
                            event.stopPropagation();
                            return;
                        }
                        $scope.showPopup.openEndDate = true;
                    };

                    if($scope.smallSizeFormat){
                        //$scope.format = 'dd-MMM-yy';
                        $scope.format = 'dd-MMM-yyyy';
                    }else{
                        $scope.format = 'dd-MMMM-yyyy';
                    }
                    //$scope.format = 'dd-MMMM-yyyy';
                    //$scope.format = 'dd-MMM-yy';

                    $scope.changeStartDate = function() {
                        if (($scope.getMoment($scope.startDate) > $scope.getMoment($scope.endDate)
                            || !$scope.endDate) || (DateService.getMomentTimestampDate($scope.startDate)
                            === DateService.getMomentTimestampDate($scope.endDate))) {
                            $scope.endDate = DateService.addPeriodToDate(1, 'days', $scope.startDate);
                        }
                        $timeout(function() {
                           // $scope.showPopup.openStartDate = false;
                            //$scope.showPopup.openEndDate = true;
                        });

                    };

                    $scope.changeEndDate = function() {
                        $timeout(function() {
                            //$scope.showPopup.openEndDate = false;
                        });
                    };


                    function getDateClass(data) {
                        var date = DateService.formatDate(data.date),
                            startDate = DateService.formatDate($scope.startDate),
                            endDate = DateService.formatDate($scope.endDate);

                        if (DateService.getMomentTimestampDate(date) > DateService.getMomentTimestampDate(startDate)
                            && DateService.getMomentTimestampDate(date) < DateService.getMomentTimestampDate(endDate)) {
                            return 'in-range';
                        }

                        if (date === startDate || date === endDate) {
                            return 'in-date';
                        }
                    }
                }
            };
        });

})();
