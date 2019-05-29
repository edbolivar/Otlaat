app.controller("contactCtrl", function ($scope, $http, constants) {
    //variables
    $scope.contactus = {
        contact_name: undefined,
        contact_email: undefined,
        contact_mobile: undefined,
        contact_message: undefined
    };
    $scope.isFetching = false;
    $scope.success = false;
    $scope.contact_submit = contact_submit;

    function contact_submit() {
        $scope.errors = null;
        $scope.success = null;
        $scope.isFetching = true;
        var contactdata = {
            contact_name: $scope.contactus.contact_name,
            contact_email: $scope.contactus.contact_email,
            contact_mobile: $scope.contactus.contact_mobile,
            contact_message: $scope.contactus.contact_message,
        };

        $http({
            url: constants.requestUrls.contactus,
            method: "POST",
            data: {
                name: contactdata.contact_name,
                email: contactdata.contact_email,
                mobile: contactdata.contact_mobile,
                message: contactdata.contact_message,
                otlaat_lang: localStorage.getItem("otlaat.lang")
            }

        }).then(function (response) {
            $scope.isFetching = false;

            if (response.data.success == true) {
                $scope.success = true;
                //empty the form fields
                $scope.contactus={};
                $scope.contactForm.$setPristine();
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

});