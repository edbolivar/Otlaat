 app.controller('bookingsController', ['$scope', 'userProfileService', 'constants', '$http', 'authService', '$filter',
    'notificationModalService', '$state', 'DateService', '$location', 'globalSpinner', 'paypalService', '$timeout',
    function ($scope, userProfileService, constants, $http, authService, $filter, notificationModalService,
              $state, DateService, $location, globalSpinner, paypalService, $timeout) {
        $scope.myBookings = {
            // Default filter for bookings sub-view
            filter: ''
        };

        $scope.pagination = {
            limit: 5,
            currentPage: 1
        };
        $scope.pageSettings.tab = 'bookings';
        $state.go('profile.bookings');

        $scope.changeFilter = changeFilter;
        $scope.downloadVoucherInvoice = downloadVoucherInvoice;
        $scope.processDate = processDate;
        $scope.bookingDetails = bookingDetails;
        $scope.statusIs = statusIs;
        $scope.goToHotelDetails = goToHotelDetails;

        formData();

        function formData() {
            getBookings();
        }

        function getBookings() {
            $scope.isFetching = true;
            $http.get(constants.requestUrls.bookings +
                '?email=' + userProfileService.getEmail() +
                '&api_token=' + authService.getToken())
                .then(function bookingsReceived(bookingsList) {
                    $scope.isFetching = false;
                    if (bookingsList.data.success === true) {
                        $scope.bookings = bookingsList.data.myBookingRes;
                    } else {
                        if (bookingsList.data.err_msg) {
                            $scope.errors = {
                                serverError: bookingsList.data.err_msg
                            };
                        } else {
                            $scope.errors = bookingsList.data.error;
                        }
                    }
                }, function errorReceivingBookings(error) {
                    $scope.isFetching = false;
                    $scope.errors = {
                        serverError: $filter('translate')('errors.Please, try again later.')
                    }
                })
        }

        function changeFilter(filter) {
            $scope.myBookings.filter = filter;
            $scope.pagination.currentPage = 1;
        }

        function bookingDetails(fileNumber) {
            //globalSpinner.run(); 
            $state.go('viewBooking', {fileNumber: fileNumber});
        }

        function downloadVoucherInvoice(booking_id, type) {
            var downloadType = type.toUpperCase();
            var errors;
            type = type + '=true';
            var url = constants.requestUrls.downloadVoucherInvoice +
                '?email=' + userProfileService.getEmail() +
                '&api_token=' + authService.getToken() +
                '&booking_id=' + booking_id +
                '&' + type;
            $http
                .get(url)
                .then(function (response) { //console.log(response );
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
                    $scope.isFetching = false;
                    var errors = {
                        serverError: 'Please, try again later.'
                    };
                    notificationModalService.open(downloadType, errors);
                });
        }

        function processDate(date) {
            date = date.toString();
            return new Date(date.substring(0, 4), date.substring(4, 6) - 1, date.substring(6, 8));
        }

        function statusIs(statusForCheck, booking) {
            var status;
            var today = new Date().getTime();
            var toDate = formatDate(booking.toDate).getTime();

            if (booking.booking_flag == '2') {
                status = 'upcoming';
                return status === statusForCheck;
            }

            if (toDate > today) {
                status = 'completed';
            } else {
                status = 'upcoming';
            }

            return status === statusForCheck;

            function formatDate(date) {
                date = date.toString();
                return new Date(date.substring(0, 4), date.substring(4, 6) - 1, date.substring(6, 8));
            }
        }

        function goToHotelDetails(hotelCode, cityCode, countrySymbol) {
            var date = new Date();
            //var today = moment(date).format('YYYYMMDD');
            //var tomorrow = moment(date).add(1, 'days').format('YYYYMMDD');
            var today = moment(date).add(4, 'days').format('YYYYMMDD');
            var tomorrow = moment(date).add(5, 'days').format('YYYYMMDD');
            var searchDetails = {
                hotelId: hotelCode,
                cityId: cityCode ,
                countryId: cityCode,
                countryCode: countrySymbol,
                checkInDate: today,
                checkOutDate: tomorrow,
                "roomCriteria[0][adultCount]": "1",
                "roomCriteria[0][roomCount]": "1",
                "roomCriteria[0][childCount]": "0"
            };
            $location.path('/hoteldetails').search(searchDetails);
        }

    }]);
