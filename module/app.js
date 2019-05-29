var app = angular.module('hotelApp',
    [
        'ui.router',
        'ngAnimate',
        'ui.bootstrap',
        'ui-rangeSlider',
        'pascalprecht.translate',
        'angularUtils.directives.dirPagination',
        'rzModule',
        'angular-flexslider',
        'ui.select',
        'ngSanitize',
        'tmh.dynamicLocale'
    ]);

// configure our routes
app.config(["$stateProvider", "$translateProvider", "$urlRouterProvider",
    function ($stateProvider, $translateProvider, $urlRouterProvider) {

    var baseDir = '/otlaat';
    //var baseDir = '/hotels/otlaat_frontend_oct';

    //$translateProvider.useSanitizeValueStrategy('sanitize');
    $translateProvider.useStaticFilesLoader({
        files: [{
            prefix: baseDir + '/i18n/locale-',
            suffix: '.json'
        }]
    });

    $translateProvider.preferredLanguage('en');

    $stateProvider
    // route for the home page

        .state('home', {
            url: '/',
            templateUrl: 'templates/home.html', 
            controller: 'homeController'
        })
        .state('hotellist', { 
            url: '/hotellist',
            views: {
                '':
                    {templateUrl: 'templates/hotellist.html', controller: 'hotelListController'},
                'list@hotellist':
                    {templateUrl: 'templates/list.html', controller: 'listController'}
            }
        })
        .state('hoteldetails', {
            url: '/hoteldetails?hotelId&checkOutDate&checkInDate',
            templateUrl: 'templates/hoteldetails.html',
            controller: 'hotelDetailsController'
        })

        .state('hotelconfirmation', {
            url: '/hotelconfirmation?checkoutToken&paypalToken',
            templateUrl: 'templates/confirm.html',
            params: {
                //checkoutToken : null,
                hotelConfirmationDetails: null
            },
            controller: 'hotelConfirmationController'
        })

        .state('hotelconfirmationCheckout', {
            url: '/hotelconfirmationCheckout',
            templateUrl: 'templates/confirm.html',
            /*params: {
                checkoutToken : null
            },*/
            controller: 'hotelConfirmationController'
        })

        .state('profile', {
            url: '/profile',
            views: {
                '': {
                    templateUrl: 'templates/userprofile.html',
                    controller: 'userproController'
                }
            },
            data: {
                loginRequired: true
            },
            resolve: {
                auth: ['$state', '$timeout', '$q', 'userProfileService', function ($state, $timeout, $q, userProfileService) {
                    var deferred = $q.defer();

                    if (!localStorage.getItem("otlaat.api_token")) {
                        $timeout(function () {
                            $state.go('home');
                        });
                        return deferred.reject("User is not logged in");
                    } else {
                        userProfileService.queryUserProfile()
                            .then(function (response) {
                                if (response.data.success === true) {
                                    deferred.resolve();
                                } else {
                                    deferred.reject();
                                }
                            })
                    }
                    return deferred.promise;
                }]
            }
        })
        .state('profile.user-profile', {
            url: '/profile/user-profile',
            views: {
                'user-profile@profile': {
                    templateUrl: 'templates/partials/profile.html',
                    controller: 'profileController'
                }
            }
        })
        .state('profile.bookings', {
            url: '/profile/bookings',
            views: {
                'bookings@profile': {
                    templateUrl: 'templates/partials/bookings.html',
                    controller: 'bookingsController'
                }
            }
        })
        .state('profile.password', {
            url: '/profile/password',
            views: {
                'password@profile': {
                    templateUrl: 'templates/partials/password.html'
                }
            }
        })
        .state('contact', {
            url: '/contact',
            templateUrl: 'templates/contact.html',
            controller: 'contactCtrl'
        })
        .state('about', {
            url: '/about',
            templateUrl: 'templates/about.html',
            controller: 'aboutController'
        })
        .state('faq', {
            url: '/faq',
            templateUrl: 'templates/faq.html',
            controller: 'faqController'
        })
        .state('payment', {
            url: '/payment?error&errorcatch',
            params: {
                details: '',
                errors: ''
            },
            templateUrl: 'templates/payment.html',
            controller: 'paymentController',
            resolve: {
                checkParams: function ($q, $stateParams, $timeout, $location) {
                    var deferred = $q.defer();
                    $timeout(function () {
                        if ($stateParams.details || $stateParams.error || $stateParams.errorcatch) {
                            deferred.resolve();
                        } else {
                            var searchDetails = localStorage.getItem('otlaat.details');
                            $location.path('/hoteldetails').search(JSON.parse(searchDetails));
                        }
                    });

                    return deferred.promise;
                }
            }
        })
        /*.state('confirm', {
            url: '/confirm',
            templateUrl: 'templates/confirm.html'
            //controller  : 'confirmController'
        })*/
        .state('passwordReset', {
            url: '/resetPassword/:token?email',
            templateUrl: 'templates/passwordReset.html',
            controller: 'passwordResetController'
        })
        .state('viewBooking', {
            url: '/viewBooking/:fileNumber',
            templateUrl: 'templates/viewBooking.html',
            controller: 'viewBookingController'
        })
        .state('bookingCancelled', { 
            url: '/bookingCancelled',
            templateUrl: 'templates/bookingCancelled.html',
            controller: 'bookingCancelledController',
            params: {
                canceldetails: null
            }
        })
        //For invalid access
        .state('invalidAccess', {
            url: '/invalidAccess',
            templateUrl: 'templates/invalidaccess.html'
        })

        .state('myReservation', { 
            url: '/myReservation?cid&bid&ctoken',
            //url: '/myReservation/:cid/:bid/:ctoken',
            templateUrl: 'templates/myReservation.html',
            controller: 'myReservationCtrl',
            resolve:{
                auth: ['$state','$stateParams', '$timeout', '$q', 'reservationCancelBookingModalService', function($state, $stateParams, $timeout, $q, reservationCancelBookingModalService){
                    var deferred= $q.defer();
                    if(!$stateParams.cid || !$stateParams.bid || !$stateParams.ctoken ){
                        $timeout(function(){ 
                            $state.go('home');
                            //console.log('rejected');
                            return deferred.reject("Invalid access");
                        });
                    }else{ 
                        reservationCancelBookingModalService.validateEmailCancellation($stateParams.cid, $stateParams.bid, $stateParams.ctoken)
                            .then(function(response){ 
                                if(response.data.success === true){
                                    deferred.resolve();
                                }else{
                                    //deferred.reject("Invalid access");
                                    //templateUrl: 'templates/invalidaccess.html',
                                    //$state.go('home');
                                    $state.go('invalidAccess');
                                }
                            });
                    }
                    return deferred.promise;
                }]
            }
        })

    $urlRouterProvider.otherwise("/");

}]);


// its main controller
app.run(function ($rootScope, userProfileService, languageService, $timeout, $interval, globalSpinner, currencyConverterService) {
    $rootScope.userProfile = userProfileService.getUserProfile();
    $rootScope.loginData = userProfileService.getLoginData();
    $rootScope.logout = userProfileService.removeUserProfile;
    $rootScope.closeMobileSidebar = function () {
        $("#mask").fadeOut();
        document.getElementById("sidenavWrapper").style.left = "-80%";
    };

    languageService.setLanguage();
    languageService.setLanguageParamToUrl();


    //Set meta data according to the lang
    if($rootScope.lang === 'en'){
        $rootScope.page_title = 'Holiday Hotels';
        $rootScope.page_description='Book the best hotels with holidays. Make sure you book cheap, family-friendly hotels. Enjoy secure booking, and the best bokking hotel deals with holidays';
    }else{
        $rootScope.page_title = 'فنادق عطلات';
        $rootScope.page_description='حجز الفنادق بأفضل الاسعار مع عطلات. إضمن حجز فنادق رخيصة صديقة للأسرة. إستمتع بحجز أمن، وأفضل عروض البوكنج للفنادق مع عطلات';
    }
    $rootScope.change_title = function(){
        $rootScope.page_title= $rootScope.meta_title;
        $rootScope.page_description= $rootScope.meta_description;
    }
    //

    //Currency by default appending on url
    currencyConverterService.currencyConverter();
    //currencyConverterService.setCurrencyParamToUrl();

    $rootScope.isMobile = {
        Android: function () {
            return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function () {
            return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function () {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: function () {
            return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function () {
            return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i);
        },
        any: function () {
            return ($rootScope.isMobile.Android() ||
                $rootScope.isMobile.BlackBerry() ||
                $rootScope.isMobile.iOS() ||
                $rootScope.isMobile.Opera() ||
                $rootScope.isMobile.Windows());
        }
    };

    $rootScope.$on("$locationChangeStart", function () {
        document.body.scrollTop = 0; // For Chrome, Safari and Opera
        document.documentElement.scrollTop = 0; // For IE and Firefox
        $timeout.cancel($rootScope.paymentTimeout);
        $interval.cancel($rootScope.hotelDetailsRequestInterval);
        $interval.cancel($rootScope.checkoutInterval);
        //globalSpinner.stop();//removed to prevent not displaying of loader at Checkout Confimration page
    });


});

