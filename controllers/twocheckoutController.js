app.controller('twocheckoutController', ['$scope', '$rootScope', '$stateParams', '$state', 'DateService', '$timeout',
    'refreshModalService', '$location', 'userProfileService', 'twoCheckoutModalService', '$interval', 'globalSpinner',
    'confirmErrorModalService', 'twoCheckoutModalService', 'modalsStackService', 'PaymentService',
    function ($scope, $rootScope, $stateParams, $state, DateService, $timeout, refreshModalService, $location,
              userProfileService, twoCheckoutModalService, $interval, globalSpinner, confirmErrorModalService, twoCheckoutModalService, modalsStackService, PaymentService) {

    // Called when token created successfully.
    var successCallback = function(data) {
        var myForm = document.getElementById('myCCForm');

        // Set the token as the value for the token input
        myForm.token.value = data.response.token.token;
        //call to service to get data
        var otherDtls= PaymentService.getOtherDetails();
        myForm.price.value = 1 ;
        myForm.currency.value = otherDtls.currency_code;
        myForm.itemNumber.value = otherDtls.item_number;


        var item_number= otherDtls.item_number;
        var paymentMethod= 'checkout';

        var payload= {
            item_number: item_number,
            payment_method: paymentMethod
        };
        //Before submitting form do the User & Payments insertion 
        if($rootScope.loginData) {
            payload.temp_api_token =  $rootScope.loginData.api_token,
            payload.hashed_email =  $rootScope.loginData.email
            //if logged in fetch userinfo 
            var usrInfo= PaymentService.getUserDetails();
            myForm["billingAddr[name]"].value = usrInfo.firstName;
            myForm["billingAddr[email]"].value = usrInfo.email;
            myForm["billingAddr[phoneNumber]"].value = usrInfo.phone_number

        }else{
            payload.user= PaymentService.getUserDetails();
            myForm["billingAddr[name]"].value = payload.user.firstName;
            myForm["billingAddr[email]"].value = payload.user.email;
            myForm["billingAddr[phoneNumber]"].value = payload.user.phone_number
;
        }
        //Generate user id or insert guest.
        //twoCheckoutModalService.guestOrUser(payload)
        twoCheckoutModalService.addToPayment(payload)
            .then(function addpayment(response){
            if(response.data.success == true){
                // IMPORTANT: Here we call `submit()` on the form element directly instead of using jQuery to prevent and infinite token request loop.
                myForm.submit();

            }else{
                $scope.isPayment = false;
                var errors = {
                    serverError: 'Please, try again later.'
                };
            }
        }, function erroraddpayment() {
            $scope.isPayment = false;
            var errors = {
                serverError: 'Please, try again later.'
            };
        });

    };

    // Called when token creation fails.
    var errorCallback = function(data) {
        if (data.errorCode === 200) {
            tokenRequest();
        } else {
            alert(data.errorMsg);
        }
    };

    var tokenRequest = function() {
        // Setup token request arguments
        var args = {
            sellerId: "901365261",
            publishableKey: "ECDF10BE-02A8-410B-95E2-722AAA5D46FA",
            //sellerId: "203697185",
            //publishableKey: "0EBAFF29-947A-46B2-9495-8D16B61DBFF5",
            ccNo: $("#ccNo").val(),
            cvv: $("#cvv").val(),
            item_number: $("#item_number").val(),
            expMonth: $("#expMonth").val(),
            expYear: $("#expYear").val()
        };  
        // Make the token request
        TCO.requestToken(successCallback, errorCallback, args);
    };

    $(function() {
        // Pull in the public encryption key for our environment
        TCO.loadPubKey('sandbox');

        $("#myCCForm").submit(function(e) { 
            // Call our token request function
            tokenRequest();

            // Prevent form from submitting
            return false;
        });
    });

}]);
