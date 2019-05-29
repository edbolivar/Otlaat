app.controller("registerCtrl", function ($scope, $log, $http, constants) {
    //variables
    $scope.register = {
        register_firstname: undefined,
        register_lastname: undefined,
        register_email: undefined,
        register_phonenumber: undefined,
        register_password: undefined,
        register_confpassword: undefined,
        register_promotionoffer: true
    };
    $scope.isFetching = false;
    $scope.success = false;

    $scope.dismissPopup = dismissPopup;
    $scope.closePopup = closePopup;
    $scope.register_submit = register_submit;
    $scope.numberfun = numberfun;

    function register_submit() {
        $scope.errors = null;
        $scope.isFetching = true;

        var regdata = {
            register_firstname: $scope.register.register_firstname,
            register_lastname: $scope.register.register_lastname,
            register_email: $scope.register.register_email,
            register_phonenumber: $scope.register.register_phonenumber,
            register_password: $scope.register.register_password,
            register_confpassword: $scope.register.register_confpassword,
            register_promotionoffer: $scope.register.register_promotionoffer
        };

        $http({
            url: constants.requestUrls.register,
            method: "POST",
            data: {
                firstname: regdata.register_firstname, 
                lastname: regdata.register_lastname,
                email: regdata.register_email,
                phonenumber: regdata.register_phonenumber,
                password: calcMD5(regdata.register_password),
                password_hidden: regdata.register_password.length,
                password_confirmation: calcMD5(regdata.register_confpassword),
                promotionoffer: regdata.register_promotionoffer,
                otlaat_lang: localStorage.getItem("otlaat.lang")
            }

        }).then(function (response) {
            $scope.isFetching = false;

            if (response.data.success == true) {
                $scope.success = true;
            } else {
                if(response.data.err_msg){
                    $scope.errors =  {
                        serverError: response.data.err_msg
                    };
                }else{
                    $scope.errors=response.data.error;
                }
            }
        }, function (error) {
            $scope.isFetching = false;
            $scope.errors =  {
                serverError: 'Please, try again later.'
            };
        });
    }

    function numberfun(e){
        var charcode= (e.which) ? e.which : e.keyCode;
        if(!(charcode >= 48 && charcode <= 57)){
            e.preventDefault();
        }
    }

    function dismissPopup() {
        $scope.$ctrl.cancel();
    }

    function closePopup() {
        //$scope.$ctrl.ok();
        $scope.$ctrl && $scope.$ctrl.ok();
        if (!$scope.template) return;
        $scope.template.key = 'loginTemplate';
        $scope.success = undefined;
    }

});

