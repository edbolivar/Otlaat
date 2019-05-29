app.controller('userproController', ['$scope', 'userProfileService', 'constants', '$state', '$filter', '$window',
    function ($scope, userProfileService, constants, $state, $filter, $window) {

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
        $scope.password = {};
        $scope.pageSettings = {};
        $scope.countries = constants.countries(localStorage.getItem("otlaat.lang") || 'en');


        $scope.openCalendar = openCalendar;
        $scope.updateUserProfile = updateUserProfile;
        $scope.updateUserPassword = updateUserPassword;
        $scope.changeState = changeState;
        $scope.clearEnteredData = clearEnteredData;

        formData();

        function formData() {

            getUserProfile();
            activateUserProfileTabs(); 

            if ($state.current.name === 'profile') {
                $scope.pageSettings.tab = 'user-profile';
                $state.go('profile.user-profile');
            } else {
                $scope.pageSettings.tab = $state.current.name.replace('profile.', '');
            }
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

                        //console.log('profile', $scope.user.dob);
                        if (!userProfile.phone_number) {
                            $scope.user.phone_number = 9665;
                        }
                        
                        if (!$scope.user.salutation) {
                            $scope.user.salutation = 'mr';
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

        function updateUserPassword(event) {
            event.preventDefault(); // needed to avoid bootstrap default action request

            $scope.errorsPassword = null;
            $scope.successMessagePassword = false;

            var payload = angular.copy($scope.password);

            $scope.password.current_password = calcMD5(payload.current_password);
            $scope.password.password = calcMD5(payload.password);
            $scope.password.password_confirmation = calcMD5(payload.password_confirmation);

            userProfileService.updateUserPassword($scope.password)
                .then(function userProfileUpdated(response) {
                    if (response.data.success === true) {
                        $scope.successMessagePassword = true;
                    } else {
                        if (response.data.err_msg) {
                            $scope.errorsPassword = {
                                serverError: response.data.err_msg
                            };
                        } else {
                            $scope.errorsPassword = response.data.error;
                        }
                    }
                }, function () {
                    $scope.isFetching = false;
                    $scope.errorsPassword = {
                        serverError: $filter('translate')('errors.Please, try again later.')
                    }
                })
        }


        function activateUserProfileTabs() {
            $(document).ready(function () {
                $("div.bhoechie-tab-menu>div.list-group>a").click(function (e) {
                    e.preventDefault();
                    $(this).siblings('a.active').removeClass("active");
                    $(this).addClass("active");
                    var index = $(this).index();
                    $("div.bhoechie-tab>div.bhoechie-tab-content").removeClass("active");
                    $("div.bhoechie-tab>div.bhoechie-tab-content").eq(index).addClass("active");
                });
            });
        }

        function maxStartDate() {
            return new Date().setFullYear(new Date().getFullYear() - 15);
        }

        function changeState(state) {
            $scope.pageSettings.tab = state;
            $state.go('profile.' + state);
        }

        function maxInitialDate() {
            return new Date().setFullYear(new Date().getFullYear() - 25);
        }

        function scrollTop() {
            document.body.scrollTop = document.documentElement.scrollTop = 0;
        }

        function clearEnteredData(field, form) {
            if ($scope.errorsPassword) {
                if (field === 'current_password') {
                    $scope.password = {};
                    form.$setUntouched();
                    return;
                }
                $scope.password[field] = '';
            }
        }
    }]);
