'use strict';
(function () {
    app.controller('profileController', profileController);

    profileController.$inject = ['$scope', 'constants', 'userProfileService', '$state'];

    function profileController($scope, constants, userProfileService, $state) {
        $scope.user = {
            salutation: undefined,
            name: '',
            last_name: '',
            dob: '',
            address: '',
            phone_number: '',
            zip_code: '',
            city: '',
            country: ''
        };
        $scope.dateOptionsStart = {
            maxDate: maxStartDate(),
            showWeeks: false,
            startingDay: 1,
            initDate: new Date(maxInitialDate()) 
        };
        $scope.pageSettings.tab = 'user-profile';
        $state.go('profile.user-profile');
        $scope.countries = constants.countries(localStorage.getItem("otlaat.lang") || 'en');

        $scope.openCalendar = openCalendar;
        $scope.updateUserProfile = updateUserProfile;

        formData();

        function formData() {
            getUserProfile();
        }

        function getUserProfile() {
            $scope.isFetching = true;

            userProfileService.queryUserProfile()
                .then(function userProfileReceived(userProfile) {
                    $scope.isFetching = false;

                    if (userProfile.data.success === true) {
                        $scope.user = userProfile.data.profile;

                        // This check is to make initDate working for ui-angular-bootstrap datepicker
                        if ($scope.user.dob && $scope.user.dob != '0000-00-00') {
                            $scope.user.dob = new Date($scope.user.dob)
                        } else {
                            $scope.user.dob = undefined;
                        }

                        if (!$scope.user.phone_number) {
                            $scope.user.phone_number = 9665;
                        }

                        if (!$scope.user.salutation) {
                            //$scope.user.salutation = 'mr';
                        }

                        if ($scope.user.country && $scope.user.country != '0') {
                            var filteredCountries = _.filter($scope.countries, function (country) {
                                return country.code === $scope.user.country;
                            });
                            $scope.user.country = filteredCountries[0];
                        }

                        if ($scope.user.city == '0') {
                            $scope.user.city = '';
                        }

                        if ($scope.user.county == '0') {
                            $scope.user.county = '';
                        }

                    } else {
                        $scope.errorsProfile = {
                            serverError:  'Error requesting your profile. Please, try again later.'
                        };
                    }
                }, function () {
                    $scope.isFetching = false;
                    $scope.errorsProfile = {
                        serverError: 'Error requesting your profile. Please, try again later.'
                    };
                })
        }

        function openCalendar() {
            $scope.pageSettings.dobOpened = !$scope.pageSettings.dobOpened;
        }

        function updateUserProfile(event) {
            event.preventDefault(); // needed to avoid bootstrap default action request

            $scope.errorsProfile = null;
            $scope.successMessageProfile = false;

            var payload = angular.copy($scope.user);

            userProfileService.updateUserProfile(payload)
                .then(function userProfileUpdated(response) {
                    if (response.data.success === true) {
                        $scope.successMessageProfile = true;
                    } else {
                        if (response.data.err_msg) {
                            $scope.errorsProfile = {
                                serverError: response.data.err_msg
                            };
                        } else {
                            $scope.errorsProfile = response.data.error;
                        }
                    }
                    scrollTop();
                }, function () {
                    $scope.isFetching = false;
                    $scope.errorsProfile = {
                        serverError: 'Please, try again later.'
                    };
                    scrollTop();
                })
        }

        function maxStartDate() {
            return new Date().setFullYear(new Date().getFullYear() - 15);
        }

        function maxInitialDate() {
            return new Date().setFullYear(new Date().getFullYear() - 25);
        }

        function scrollTop() {
            document.body.scrollTop = document.documentElement.scrollTop = 0;
        }
    }
})();