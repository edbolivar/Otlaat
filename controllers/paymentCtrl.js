app.controller('paymentController', ['$scope', '$rootScope', '$stateParams', '$state', 'DateService', '$timeout',
    'refreshModalService', '$location', 'userProfileService', 'PaymentService', '$interval', 'globalSpinner',
    'confirmErrorModalService', 'twoCheckoutModalService', 'modalsStackService', 'authService', 'hotelConfirmationService',
    '$filter', 'constants', 'paypalService', 'CheckoutService', '$translate',
    function ($scope, $rootScope, $stateParams, $state, DateService, $timeout, refreshModalService, $location,
              userProfileService, PaymentService, $interval, globalSpinner, confirmErrorModalService, twoCheckoutModalService,
              modalsStackService, authService, hotelConfirmationService, $filter, constants, paypalService, CheckoutService, $translate) {
        $scope.payment = {
            paymentMethod: 'paypal',
            hotel: {
                name: 'Million stars hotel',
                address: 'Dummy Address',
                rating: 5,
                checkIn: "25 July 2016",
                checkOut: "25 August 2016",
                nights: "60 Nights"
            },
            rooms: [
                {
                    board: 'Non refundable',
                    characteristics: 'Standard Atrium Room',
                    adults: [1, 2, 3]
                },
                {board: 'Non refundable', characteristics: 'Standard Atrium Room', adults: [1, 2]},
                {
                    board: 'Non refundable',
                    characteristics: 'Standard Atrium Room',
                    adults: [1, 3, 5, 8]
                }
            ],
            price: 0,
            currency: 'USD',
            cancellationPolicy: '',
            user: {},
            mainUser: {}
        };
        var timeout = 10; // minutes
        var checkPaymentInfoInterval = 5; //seconds
        var paymentUnsuccessfulTimeout = 600; //seconds
        var details = $stateParams.details;
        $scope.roomsPortlet = constants.partials.roomsPortlet;
        //for currency
        $scope.currency = details.otlaat_currency;

        $scope.generatePayload = generatePayload;
        $scope.payNow = payNow;
        //To fetch related payment related info for 2checkout
        var otherDts = {
            item_number: details.item_number,
            currency_code: details.Currency,
            price: details.totalPrice
        };

        //Meta Data
        var metaData={
            meta_title: details.meta_title,
            meta_description: details.meta_description
        }
        $rootScope.meta_title= metaData.meta_title;
        $rootScope.meta_description= metaData.meta_description;
        $rootScope.change_title();
        //

        PaymentService.otherDetails(otherDts);
        //To fetch user info
        PaymentService.userDetails($scope.payment.user);
        //To bind the markup price
        $scope.markupPrice= details.markupPrice;

        formData();

        function formData() {
            if ($stateParams.errors) {
                $scope.errors = $stateParams.errors;
                return;
            }

            if (!$stateParams.error && !$stateParams.errorcatch) {
                localStorage.setItem('otlaat.lastPaymentDetails', JSON.stringify($stateParams.details));
            }

            if ($stateParams.error || $stateParams.errorcatch) {
                $stateParams.error ? confirmErrorModalService.open(goToDetailsPage) : '';
                $stateParams.errorcatch ? confirmErrorModalService.open(goToDetailsPage, true) : '';
                details = JSON.parse(localStorage.getItem('otlaat.lastPaymentDetails'));
                initializeData();
                fillUserInfo();
                getUserProfile();
                generateGuests();
            } else {
                runIdleTimer();
                initializeData();
                fillUserInfo();
                getUserProfile();
                generateGuests()
            }
        }

        function getUserProfile() {
            if (!$rootScope.loginData) {
                authService.subscribeOnUserSignIn(function () {
                    getUserProfile();
                });
                $scope.showPassword = false;
                $timeout(function () {
                    renderPhone();
                }, 200);
                return;
            }

            $scope.isFetching = true;

            userProfileService.queryUserProfile()
                .then(function userProfileReceived(userProfile) {
                    $scope.isFetching = false;
                    if (userProfile.data.success === true) {
                        renderPhone(deepGet(userProfile, ['data', 'profile', 'country']));
                        $scope.payment.user.firstName = userProfile.data.profile.name;
                        $scope.payment.user.lastName = userProfile.data.profile.last_name;
                        $scope.payment.user.phone_number = userProfile.data.profile.phone_number;
                        $scope.payment.user.email = userProfile.data.profile.email;
                        $scope.payment.contactDetailsHidden = true;
                        $scope.payment.mainUser.firstName = userProfile.data.profile.name;
                        $scope.payment.mainUser.lastName = userProfile.data.profile.last_name;
                    }
                }, function () {
                    $scope.isFetching = false;
                })
        }

        function fillUserInfo() {
            if ($rootScope.loginData) {
                $scope.payment.user.firstName = $rootScope.loginData.name;
            } else {
                $timeout(function () {
                    $scope.payment.user.phone_number = undefined;
                }, 100)
            }
        }

        function generateGuests() {
            var adultsCount = getAdultsCount();

            var childrenCount = getChildrenCount();

            if (adultsCount === 1) {
                $scope.guests = null;
            } else {
                $scope.guests = Array.apply(null, {length: adultsCount - 1}).map(Number.call, function () {
                    return {firstName: '', lastName: ''};
                });
            }

            if (childrenCount) {
                $scope.guestsChilds = Array.apply(null, {length: childrenCount}).map(Number.call, function () {
                    return {firstName: '', lastName: ''};
                });
            }

            function getAdultsCount() {
                var rooms = details.HotelDetails.filterinfo;
                return rooms.reduce(function (sum, currentRoom) {
                    return sum + Number(currentRoom.HotelOccupancy.Occupancy.AdultCount);
                }, 0);
            }

            function getChildrenCount() {
                var rooms = details.HotelDetails.filterinfo;
                return rooms.reduce(function (total, currentRoom) {
                    return total + Number(currentRoom.HotelOccupancy.Occupancy.ChildCount)
                }, 0);
            }
        }

        function initializeData() { 
            var format = $rootScope.lang === "ar" ? "YYYY DD MMM" : "DD MMM YYYY";

            $scope.payment.hotel = { 
                name: details.HotelDetails.hotelinfo.HotelName,
                address: details.HotelDetails.hotelinfo.Address,
                rating: details.HotelDetails.hotelinfo.HotelCategory,
                checkIn: moment(DateService.parseDate(details.FromDate)).format(format),
                checkOut: moment(DateService.parseDate(details.ToDate)).format(format),
                nights: moment(DateService.parseDate(details.ToDate)).diff(moment(DateService.parseDate(details.FromDate)), 'days'),
                remark: details.Remark
            };
            $scope.payment.rooms = getAllRooms(details);
            $scope.payment.price = $scope.payment.price.toFixed(2);
            $scope.payment.cancellationPolicy = generateCancellationPolicy(details);

            
            $scope.currency_code= details.otlaat_currency.currency;
            //if currency is SAR then convert price
            if($scope.currency_code === 'sar'){
                //currency converted price calculated here
                $scope.convertedPrice= ($scope.payment.price * details.otlaat_currency.currencyPrice).toFixed(2);
            }

            function getAllRooms(details) {
                return _.map(details.HotelDetails.filterinfo, function (room) {
                    var roomDetails = room.HotelRoom.HotelRoomDTO;
                    $scope.payment.price = $scope.payment.price + parseFloat(roomDetails.Price.Amount.replace(',', '.'));
                    $scope.payment.currency = roomDetails.Price.Currency;
                    return {
                        board: roomDetails.Board.Name,
                        characteristics: roomDetails.RoomType.Characteristic,
                        adults: getAdultsArray(room.HotelOccupancy.Occupancy.AdultCount),
                        children: getChildrenArray(room.HotelOccupancy.Occupancy.ChildCount)
                    }
                });

                function getAdultsArray(adultsCount) {
                    return Array.apply(null, {length: adultsCount}).map(Number.call, Number);
                }

                function getChildrenArray(childrenCount) {
                    return Array.apply(null, {length: childrenCount}).map(Number.call, Number);
                }
            }

            

            function generateCancellationPolicy(details) {
                return _.map(details.HotelDetails.filterinfo, function (room) {
                    var cancellation = room.HotelRoom.HotelRoomDTO.CancellationPolicy.CancellationPolicyDTO;
                    return {
                        roomName: room.HotelRoom.HotelRoomDTO.Board.Name,
                        cancellationMessage: getText(cancellation.DateTimeFrom, cancellation.DateTimeTo, cancellation.Amount)
                    }
                });

                function getText(dateFrom, dateTo, amount) {
                    if (!amount || amount === '0') {
                        return 'Cancellation is Free for this room.'
                    }

                    return $translate.instant("payment.cancellationMessage", {
                        price: "<span class='inline-ltr'>" + $filter('currencyConverterFilter')(parseFloat(amount.replace(',', '.')), details.otlaat_currency.currencyPrice, details.otlaat_currency.currency, false, details.markupPrice) + "</span>" ,
                        date: moment(dateFrom).format('DD/MM/YYYY')
                    });

                }
            }
        }

        function runIdleTimer() {
            $timeout(function () {
                $rootScope.paymentTimeout = $timeout(function () {
                    globalSpinner.stop();
                    modalsStackService.closeAll();
                    refreshModalService.open()
                        .then(function () {
                            goToDetailsPage();
                        })
                }, 1000 * 60 * timeout)
            });
        }


        function payNow() { 
            $scope.iterationCount = 0;
            globalSpinner.run($filter('translate')('payment.proceed'));
            var paymentMethod = $scope.payment.paymentMethod;
            generatePayload();
            var updatePayload = $scope.payload + '&item_number=' + details.item_number + '&purchaseToken=' + details.PurchaseToken;
            //console.log('log', updatePayload);

            //update payload to product table
            //if currency is chosen other than USD and include a extra price field i payments table
            PaymentService.updateProductPayload(updatePayload).then(function updatePayloadSuccess(response) {
                if (response.data.success == true) {
                    if (paymentMethod === 'paypal') {
                        var item_name = details.HotelDetails.hotelinfo.HotelName;
                        var item_number = details.item_number;
                        var price = details.totalPrice;//USD price
                        var cancelUrlToken = $rootScope.cancelUrl + item_number;

                        $('#paypalfrm #cancel_return').val(cancelUrlToken);
                        $('#paypalfrm #item_name').val(item_name);
                        $('#paypalfrm #item_number').val(item_number);

                        
                        paypalfrm.custom.value= details.totalPrice;//USD price
 
                        if($scope.currency_code === 'sar'){
                            paypalfrm.amount.value= $scope.convertedPrice; //SAR price
                            //Add SAR price with markup price
                            //paypalfrm.custom.value= (parseFloat($scope.convertedPrice) + parseFloat($scope.convertedPrice * ($scope.markupPrice / 100))).toFixed(2);
                         }else{
                            paypalfrm.amount.value=details.totalPrice; //usd price
                            //Add usd price with markup price
                            //paypalfrm.custom.value= (parseFloat(details.totalPrice) + parseFloat(details.totalPrice * ($scope.markupPrice / 100))).toFixed(2);
                         } 

                        var paydata = {
                            item_number: item_number,
                            payment_method: paymentMethod
                        };
                        if ($rootScope.loginData) {
                            paydata.temp_api_token = $rootScope.loginData.api_token
                            paydata.hashed_email = $rootScope.loginData.email
                        } else {
                            paydata.user = $scope.payment.user;
                        }
                        //Submit paypal button
                        //document.paypalfrm.submit();

                        //When user is logged in, pass tempApiToken and hashed email to verify user
                        //And get back it's id and insert into payments table on backend
                        //When user is not logged in, Make a record inserted at guest table
                        //Get the id from guest table and insert to payment table

                        //generate payload for confirmation call
                        paydata.payload = $scope.payload;
                        //Create a payment record at payment table
                        PaymentService.addToPayment(paydata).then(function addpayment(response) {
                            var fetchingAddBookingRequest = false;
                            if (response.data.success == true) {
                                //add the payment_id uniqueness and use aong with item_number
                                var paypalpayid= response.data.payment_id;
                                //append the currency conversion rate and markupPrice and paypal paymentid
                                //var paypalpayidAppended= paypalpayid + '_'+ details.otlaat_currency.currencyPrice + '_'+ $scope.markupPrice;
                                
                                $('#paypalfrm #invoice').val(paypalpayid);  //invoice field is for payment_id
                                //for opening second popup for paypal
                                paypalService.open()
                                    .then(function (close) { 
                                        document.paypalfrm.submit();
                                        //Make a overlay on page
                                        $scope.isPayment = true;
                                        //check if the payament status is paid
                                        $timeout(function () {
                                            $rootScope.checkoutInterval = $interval(function () {
                                                $scope.iterationCount++;
                                                if ($scope.iterationCount === paymentUnsuccessfulTimeout / checkPaymentInfoInterval) {
                                                    modalsStackService.closeAll();
                                                    $interval.cancel($rootScope.checkoutInterval);
                                                    confirmErrorModalService.open(goToDetailsPage);
                                                    globalSpinner.stop();
                                                }

                                                PaymentService.paymentCheck(paydata).then(function payment(response) { 
                                                    if (response.data.paymentCheckRes.payment_status === 'Paid') {
                                                        $interval.cancel($rootScope.checkoutInterval);
                                                        $scope.isPayment = false;
                                                        var payment_token = response.data.paymentCheckRes.payment_token;
                                                        var bookingRecordPayload = {
                                                            payment_id: response.data.paymentCheckRes.payment_id,
                                                            client_id: response.data.paymentCheckRes.client_id,
                                                        }; 

                                                        if (fetchingAddBookingRequest) return;
                                                        fetchingAddBookingRequest = true;
                                                        //payment is paid so insert a record to booking table
                                                        PaymentService.addBooking(bookingRecordPayload).then(function addBooking(response) {
                                                            if (response.data.success == true) {
                                                                var reference_number = response.data.reference_number;

                                                                globalSpinner.run($filter('translate')('confirm.pleaseWait'));

                                                                var finalPayload = {
                                                                    reference_number: reference_number,
                                                                    item_number: details.item_number,
                                                                    purchaseToken: details.PurchaseToken,
                                                                    payment_id: bookingRecordPayload.payment_id,
                                                                    client_id: bookingRecordPayload.client_id
                                                                };

                                                                //console.log('finalPayload', finalPayload);

                                                                hotelConfirmationService.confirmationAftPaypal(finalPayload)
                                                                    .then(function confirmationReceived(data) { //console.log('result', data.data);
                                                                        if (data.data.success == true) {
                                                                            globalSpinner.stop();
                                                                            $state.go('hotelconfirmation', {
                                                                                hotelConfirmationDetails: data,
                                                                                paypalToken: payment_token
                                                                            });
                                                                        } else {
                                                                            globalSpinner.stop();
                                                                            $state.go('hotelconfirmation', {mainError: true});
                                                                        }
                                                                    }, function errorReceivingConfirmation(error) {
                                                                        $state.go('hotelconfirmation', {mainError: true});
                                                                    });
                                                            } else {
                                                                $scope.errors = response.data.error;
                                                            }
                                                        }, function errorBooking(error) {
                                                            $scope.isPayment = false;
                                                            var errors = {
                                                                serverError: 'Please, try again later.'
                                                            };
                                                        });

                                                    } else {
                                                        $scope.errors = response.data.error;
                                                        //globalSpinner.stop();
                                                        //(Commented above spinner by Mir as in some of cases the spinner was automatically going down.)
                                                    }
                                                }, function errorPayment() {
                                                    $scope.isPayment = false;
                                                    var errors = {
                                                        serverError: 'Please, try again later.'
                                                    };
                                                    //$state.go('payment', {errors: errors, details: true});
                                                    globalSpinner.stop();
                                                });
                                            }, 5000);
                                        });
                                    }, function (dismiss) {
                                        globalSpinner.stop();
                                        //go back to detail page
                                        var searchDetails = localStorage.getItem('otlaat.details');
                                        $location.path('/hoteldetails').search(JSON.parse(searchDetails));
                                    });

                            } else {
                                $scope.isPayment = false;
                                globalSpinner.stop();
                                //$scope.errors = response.data.err_msg;
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

                    }
                    //no checkout functionalities here
                } else {
                    $scope.isPayment = false;
                    var errors = {
                        serverError: 'Please, try again later.'
                    };
                }
            }, function updatePayloadError() {
                $scope.isPayment = false;
                var errors = {
                    serverError: 'Please, try again later.'
                };
            });
        }

    

        /* This is for Checkout Payment */
        //var tokenRequestCheckout = function (price, currency_code) {
            /*Checkout.configure({
                debugMode: true,
                title: 'Otlaat Payment',
                publicKey: 'pk_fb9d429d-4213-4d72-9488-8a2e373af28a',
                //publicKey: 'pk_test_73796ca3-ed54-4e34-bc64-3ca407b20747',
                value: price,
                renderMode: 0,
                currency: currency_code,
                payButtonSelector: "#payBtnCheckoutBtn",
                cardFormMode: 'cardTokenisation',
                paymentMode: 'cards',
                //calling successfull checkout tokenisation
                cardTokenised: cardTokenisedCallback,
                //calling failed checkout tokenisation
                cardTokenisationFailed: function (event) {
                    console.log('Token verification fails');
                    if (data.errorCode === 200) {
                        tokenRequesty();
                    } else {
                        alert(data.errorMsg);
                    }
                }
            }); */

            window.CKOConfig = {
                  publicKey: 'pk_test_22d0d98f-0c71-4000-9142-b82002cef984',
                  customerEmail: 'user@email.com',
                  value: 100,
                  currency: 'USD',
                  paymentMode: 'cards',
                  cardFormMode: 'cardTokenisation',
                  payButtonSelector: "#payBtnCheckoutBtn",
                  /*cardTokenised: function(event) {
                    console.log(event.data.cardToken);
                    
                    cardToken.value = event.data.cardToken
                    paymentForm.submit();
                    
                  }*/
                  cardTokenised: cardTokenisedCallback,
                  //logoUrl:'https://s3-eu-west-1.amazonaws.com/sl-public-assets/checkout-logo.jpg',
                  themeColor:'FFF'
                };

       // };

        function cardTokenisedCallback(event) { 
            $scope.iterationCount = 0;
            globalSpinner.run($filter('translate')('payment.proceed'));
            generatePayload();
            var updatePayload = $scope.payload + '&item_number=' + details.item_number + '&purchaseToken=' + details.PurchaseToken;
            var fetchingAddBookingRequest = false;
            var payload = {};

            PaymentService.updateProductPayload(updatePayload)
                .then(function updatePayloadSuccess() {
                    var myForm = document.getElementById('myCCForm');

                    // Set the token as the value for the token input
                    myForm.token.value = event.data.cardToken;
                    //call to service to get data
                    var otherDtls = PaymentService.getOtherDetails();

                    myForm.payment_adonis.value= details.totalPrice;//USD price

                    if($scope.currency_code === 'sar'){ 
                        //myForm.payment_customer.value= $scope.convertedPrice; //SAR price
                        //Add SAR price with markup price
                        myForm.payment_customer.value= (parseFloat($scope.convertedPrice) + parseFloat($scope.convertedPrice * ($scope.markupPrice / 100))).toFixed(2);
                        //myForm.currency_code.value = $scope.currency_code; //currency code for Sar
                    }else{
                        //myForm.payment_customer.value=details.totalPrice; //usd price
                        //Add usd price with markup price
                        myForm.payment_customer.value= (parseFloat(details.totalPrice) + parseFloat(details.totalPrice * ($scope.markupPrice / 100))).toFixed(2);
                        //myForm.currency_code.value = otherDtls.currency_code; //currency code for USD
                    }
                    //add currency rate and markup price to form
                    //myForm.payment_currency_rate.value= details.otlaat_currency.currencyPrice;
                    //myForm.payment_markup_price.value= $scope.markupPrice;
                    myForm.itemNumber.value = otherDtls.item_number;

                    var item_number = otherDtls.item_number;
                    var paymentMethod = 'checkout';

                    payload = {
                        item_number: item_number,
                        payment_method: paymentMethod
                    };

                    //Before submitting form do the User & Payments insertion
                    if ($rootScope.loginData) {
                        payload.temp_api_token = $rootScope.loginData.api_token;
                        payload.hashed_email = $rootScope.loginData.email;
                        //if logged in fetch userinfo
                        var usrInfo = PaymentService.getUserDetails();
                        myForm["billingAddr[name]"].value = usrInfo.firstName;
                        myForm["billingAddr[email]"].value = usrInfo.email;
                        myForm["billingAddr[phoneNumber]"].value = usrInfo.phone_number;

                    } else {
                        payload.user = PaymentService.getUserDetails();
                        myForm["billingAddr[name]"].value = payload.user.firstName;
                        myForm["billingAddr[email]"].value = payload.user.email;
                        myForm["billingAddr[phoneNumber]"].value = payload.user.phone_number;
                    }

                    //Generate user id or insert guest.
                    return twoCheckoutModalService.addToPayment(payload);
                }, errorCallback)
                .then(function addPaymentSuccess(response) {
                    if (response.data.success == true) {
                        var token = $('#myCCForm #token').val();
                        var payment_adonis = $('#myCCForm #payment_adonis').val();
                        var payment_customer = $('#myCCForm #payment_customer').val(); // for converted Price i.e SAR
                        //add the payment_id uniqueness and use along with item_number
                        var pay_id= response.data.payment_id; 
                        $('#myCCForm #payment_id').val(pay_id);
                        var payment_id= $('#myCCForm #payment_id').val(); // for paymnet_id
                        var itemNumber = $('#myCCForm #itemNumber').val();
                        var currency_code = $('#myCCForm #currency_code').val();
                        var billingAddrEmail = $('#myCCForm #billingAddrEmail').val();
                        var payloadForCheckoutPay = {
                            token: token,
                            payment_adonis: payment_adonis,
                            payment_customer: payment_customer,
                            payment_id: payment_id,
                            itemNumber: itemNumber,
                            currency_code: currency_code,
                            billingAddrEmail: billingAddrEmail
                        };
                        return CheckoutService.checkoutPay(payloadForCheckoutPay);
                    } else {
                        errorCallback()
                    }
                }, errorCallback)
                .then(function chkPaySuccess(res) { 
                    if (res.data.success === true) {
                        CheckoutService.open()
                            .then(function(close){
                                var win = window.open();
                                var url= res.data.redirectUrl;
                                win.location = url;
                                //check if the payment status is paid
                                $rootScope.checkoutInterval = $interval(function () {
                                    $scope.iterationCount++;
                                    if ($scope.iterationCount === paymentUnsuccessfulTimeout / checkPaymentInfoInterval) {
                                        modalsStackService.closeAll();
                                        $interval.cancel($rootScope.checkoutInterval);
                                        confirmErrorModalService.open(goToDetailsPage);
                                        globalSpinner.stop();
                                    }

                                    CheckoutService.paymentCheck(payload)
                                        .then(function paymentCheckSuccessful(response) {
                                            if (response.data.success === true) {
                                                if (response.data.paymentCheckRes.payment_status === 'APPROVED') {
                                                    $interval.cancel($rootScope.checkoutInterval);
                                                    $scope.isPayment = false;
                                                    var payment_token = response.data.paymentCheckRes.payment_token;

                                                    if (fetchingAddBookingRequest) return;
                                                    fetchingAddBookingRequest = true;

                                                    //redirect to confirmation page with token
                                                    if (response.data.success === true) {
                                                        $state.go('hotelconfirmation', {checkoutToken: payment_token});// token for comparing
                                                    } else {
                                                        $state.go('hotelconfirmation', {mainError: true});
                                                    }
                                                }
                                            } else {
                                                errorCallback()
                                            }
                                        }, errorCallback);
                                }, 5000);
                            }, function(dismiss){
                                globalSpinner.stop();
                                //go back to detail page
                                var searchDetails = localStorage.getItem('otlaat.details');
                                $location.path('/hoteldetails').search(JSON.parse(searchDetails));
                            });
                        //
                    }else{
                        globalSpinner.stop();
                        //show a error message in the page
                        console.log('Checkout Payment failed.');
                    }
                });

            function errorCallback(response) {
                var keepSpinnerRun = options.keepSpinnerRun;
                $scope.isPayment = false;
                globalSpinner.stop();
                $scope.errors = response ? response.data.error : null;

                var errors = {
                    serverError: 'Please, try again later.'
                };
            }
        }

        //calling the popup for Checkout 
        $(function () {
            //setting the price
            var price, currency_code;
            var otherDtls = PaymentService.getOtherDetails();
            if($scope.currency_code === 'sar'){
                price= $scope.convertedPrice * 100; //SAR price
                currency_code = $scope.currency_code; //currency code for Sar
            }else{
                price= details.totalPrice * 100; //usd price
                currency_code = otherDtls.currency_code; //currency code for USD
            }
            tokenRequestCheckout(price, currency_code);
        });


        function getRoomPrice(details) {
            var price = 0;
            _.map(details.HotelDetails.filterinfo, function (room) {
                var roomDetails = room.HotelRoom.HotelRoomDTO;
                price = price + parseFloat(roomDetails.Price.Amount.replace(',', '.'));
            });
            return price;
        }

        function renderPhone(initialCountry) {
            var options = {
                utilsScript: "js/utils.js",
                preferredCountries: ['ae', 'sa']
            };
            if (initialCountry) {
                options.initialCountry = initialCountry.toLowerCase();
                options.preferredCountries.unshift(initialCountry);
            }
            $("#phone").intlTelInput(options);
        }

        function generatePayload() {
            //console.log('details', details);
            $scope.payload = PaymentService.generatePayload($scope.payment.mainUser, $scope.guests, $scope.guestsChilds, details);

            PaymentService.addPropertyToPayload('firstName', $scope.payment.user.firstName);
            $scope.payload = $scope.payload + '&firstName=' + $scope.payment.user.firstName;

            PaymentService.addPropertyToPayload('lastName', $scope.payment.user.lastName);
            $scope.payload = $scope.payload + '&lastName=' + $scope.payment.user.lastName;

            PaymentService.addPropertyToPayload('phone_number', $scope.payment.user.phone_number);
            $scope.payload = $scope.payload + '&phone_number=' + $scope.payment.user.phone_number;

            PaymentService.addPropertyToPayload('email', $scope.payment.user.email);
            $scope.payload = $scope.payload + '&email=' + $scope.payment.user.email;
            //add todate and fromdate(no need now added to products table before)
            //$scope.payload= $scope.payload + '&fromDate=' + details.FromDate;
            //$scope.payload= $scope.payload + '&toDate=' + details.ToDate;
        }

        function goToDetailsPage() {
            var searchDetails = localStorage.getItem('otlaat.details');
            $location.path('/hoteldetails').search(JSON.parse(searchDetails));
        }

    }]);






