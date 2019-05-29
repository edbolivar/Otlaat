app.controller("loginCtrl", ['$scope', '$log', '$http', '$timeout', 'registerModalService', '$rootScope',
    'userProfileService', 'constants', 'authService',
    function ($scope, $log, $http, $timeout, registerModalService, $rootScope, userProfileService, constants, authService) {
        //Predefined variables
        $scope.login = {
            login_email: undefined,
            login_password: undefined
        };
        $scope.isFetching = false; //If true - spinners and loaders will be activated
        $scope.isForgotPasswordRequesting = false;
        $scope.errors = null;
        $scope.forgetPasswordFormTemplate = constants.partials.forgetPasswordForm; 
        $scope.forgotPassword = {
            email: ''
        };
        $scope.template = {key: 'loginTemplate'};
        $scope.templates = {
            loginTemplate: constants.partials.loginTemplate,
            registerTemplate: constants.partials.registerTemplate
        };


        //Predefined methods
        $scope.openRegisterModal = openRegisterModal;
        $scope.dismissPopup = dismissPopup;
        $scope.closePopup = closePopup;
        $scope.login_submit = login_submit;
        $scope.triggerForgotPasswordForm = triggerForgotPasswordForm;
        $scope.requestPasswordRecovery = requestPasswordRecovery;


        function login_submit(event) {
            $scope.isFetching = true;

            var logdata = {
                login_email: $scope.login.login_email,
                login_password: $scope.login.login_password
            };

            $http({
                url: constants.requestUrls.login,
                method: "POST",
                data: {
                    email: logdata.login_email,
                    password: calcMD5(logdata.login_password),
                    otlaat_lang: localStorage.getItem("otlaat.lang")
                }
            }).then(function (response) {
                $scope.isFetching = false;
                //if success, blanck the form, show success message
                if (response.data.success == true) {
                    //set data in local storage
                    //we need to keep it for some duartion after that and on logout, heave to clear storage.
                    //some point of time need to think how to store data so that on visiting next time the site we shouldn't be automatically login.
                    localStorage.setItem("otlaat.api_token", response.data.loginData.api_token);
                    localStorage.setItem("otlaat.email", response.data.loginData.email);
                    localStorage.setItem("otlaat.name", response.data.loginData.name);

                    userProfileService.setLoginData(response.data.loginData);

                    closePopup();
                    authService.propagateUserSignedIn();
                    } else {
                        //if false, check if it's an error[] or err_msg, show error messages
                        if(response.data.err_msg){
                            $scope.errors =  {
                                serverError: response.data.err_msg
                            };
                        }else{
                            $scope.errors=response.data.error;
                        }
                    }
            }, function (error) {
                $scope.errors =  {
                    serverError: 'Please, try again later.'
                };
            });
        }

        function dismissPopup() {
            $scope.$ctrl.cancel();
        }

        function closePopup() {
            $scope.$ctrl ? $scope.$ctrl.ok() : triggerForgotPasswordForm();
        }

        function openRegisterModal(size, parentSelector) {
            if (!$scope.isSidebar) {
                dismissPopup();
                registerModalService.open(size, parentSelector)
            } else {
                $scope.template = {key: 'registerTemplate'};
                $scope.isFetching = false;
            }
        }

        function triggerForgotPasswordForm() {
            $scope.forgotPasswordFormVisible = !$scope.forgotPasswordFormVisible;
            $scope.forgotPasswordErrors= null;
            $scope.forgotPassword={};
            $scope.errors = null;
        }

        function requestPasswordRecovery(e) {
            e.preventDefault();

            $scope.isForgotPasswordRequesting = true;

             $http({
                url: constants.requestUrls.passwordRecovery,
                method: "POST",
                data: {
                    email: $scope.forgotPassword.email
                }
                
            }).then(function (response) {
                $scope.isForgotPasswordRequesting = false;

                if (response.data.success == true) {
                    //remove previous error message from popup
                    $scope.forgotPasswordErrors=false;
                    $scope.passwordRequested = true;
                } else {
                    if(response.data.err_msg){
                        $scope.forgotPasswordErrors =  {
                            serverError: response.data.err_msg
                        };
                    }else{
                        $scope.forgotPasswordErrors=response.data.error;
                    }
                }

            }, function (error) {
                $scope.isForgotPasswordRequesting = false;
                $scope.forgotPasswordErrors =  {
                    serverError: 'Please, try again later.'
                };
            });
        }

    }]);


app.controller('ModalInstanceCtrl', ['$uibModalInstance', 'items', 'isTokenInvalid', 'constants', function ($uibModalInstance, items,
                                                                                               isTokenInvalid, constants) {
    var $ctrl = this;
    $ctrl.items = items;
    $ctrl.selected = {
        item: $ctrl.items[0]
    };

    $ctrl.isTokenInvalid = isTokenInvalid;

    $ctrl.ok = function () {
        $uibModalInstance.close($ctrl.selected.item);
    };

    $ctrl.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $ctrl.template = {key: 'registerTemplate'};
    $ctrl.templates = {
        loginTemplate: constants.partials.loginTemplate,
        registerTemplate: constants.partials.registerTemplate
    };
}]);