(function () {
    'use strict';
    angular
        .module('hotelApp')
        .service('constants', constants);

    constants.$inject = ['$rootScope'];

    function constants($rootScope) {
        //frontend path url
        $rootScope.basePath= "/otlaat/";
        $rootScope.baseDirectory= "/otlaat/";
        $rootScope.cancelUrl= "http://localhost:80/otlaat/cancelPaypal?cancelUrlToken=";
        /*$rootScope.basePath= "/hotels/";
        $rootScope.baseDirectory= "/hotels/otlaat_frontend_oct/";
        $rootScope.cancelUrl= "https://otlaat.com/hotels/cancelPaypal?cancelUrlToken=";*/

        var requestUrls = {
            userProfileGet: $rootScope.basePath + 'profile',
            userProfileUpdate: $rootScope.basePath + 'profileUpdate',
            profilePasswordUpdate: $rootScope.basePath + 'changePassword',
            logout: $rootScope.basePath + 'userlogout',
            passwordRecovery: $rootScope.basePath + 'forgotPassword',
            login: $rootScope.basePath + 'userlogin',
            register: $rootScope.basePath + 'userregister',
            forgotPassword: $rootScope.basePath + 'resetPassword',
            bookings: $rootScope.basePath + 'myBooking',
            downloadVoucherInvoice: $rootScope.basePath + 'downloadBookingPdf',
            getOrderDetails: $rootScope.basePath + 'basketHotels',
            paymentCheck: $rootScope.basePath + 'paymentCheck',
            addToPayment: $rootScope.basePath + 'addToPayment',
            verifyConfirmationToken: $rootScope.basePath + 'verifyConfirmationToken',
            confirmationAftPaypal: $rootScope.basePath + 'confirmationAftPaypal',
            addBooking : $rootScope.basePath + 'addBooking',
            downloadConfirmationPdf: $rootScope.basePath + 'downloadConfirmationPdf',
            updateProductPayload: $rootScope.basePath + 'updateProductPayload',
            bookingDetails: $rootScope.basePath + 'bookingDetails',
            verifyTokenPaypal: $rootScope.basePath + 'verifyTokenPaypal',
            cancelBooking: $rootScope.basePath + 'cancellationBooking',
            myReservationBookingDetails: $rootScope.basePath + 'myReservationBookingDetails',
            reservationCancelBooking : $rootScope.basePath + 'reservationCancelBooking',
            reservationDownloadPdf : $rootScope.basePath + 'reservationDownloadPdf',
            validateEmailCancellation: $rootScope.basePath + 'validateEmailCancellation',
            //homePageBottom: $rootScope.basePath + 'homePageBottom',
            //homePageCenter: $rootScope.basePath + 'homePageCenter',
            homePageTop: $rootScope.basePath + 'homePageTop',
            currencyConversionRate: $rootScope.basePath + 'currencyConversionRate',
            //for checkoutpay
            checkoutPay: $rootScope.basePath + 'checkoutPay',
            fetchBrokenImage: $rootScope.basePath + 'fetchBrokenImage',
            /*requestBookingPriceFromDb: $rootScope.basePath + 'requestBookingPriceFromDb' */
        };

        var partials = {
            forgetPasswordForm: $rootScope.baseDirectory + 'templates/partials/forgot-password-form.html',
            loginTemplate: $rootScope.baseDirectory + 'templates/partials/loginTemplate.html',
            registerTemplate: $rootScope.baseDirectory + 'templates/partials/registerTemplate.html',
            rooms: $rootScope.baseDirectory + 'templates/partials/rooms.html',
            roomsPortlet: $rootScope.baseDirectory + 'templates/partials/roomsPortlet.html'        
        };


        var countries_ar = [
            {
                "code": "SA",
                "name": "المملكة العربية السعودية"
            },
            {
                "code": "AE",
                "name": "الامارات العربية المتحدة"
            },
            {
                "code": "DZ",
                "name": "الجزائر"
            },
            {
                "code": "BH",
                "name": "البحرين"
            },
            {
                "code": "KM",
                "name": "جزر القمر"
            },
            {
                "code": "DJ",
                "name": "جيبوتي"
            },
            {
                "code": "EG",
                "name": "مصر"
            },
            {
                "code": "IQ",
                "name": "العراق"
            },
            {
                "code": "IR",
                "name": "ايران"
            },
            {
                "code": "JO",
                "name": "الأردن"
            },
            {
                "code": "KW",
                "name": "الكويت"
            },
            {
                "code": "LB",
                "name": "لبنان"
            },
            {
                "code": "LY",
                "name": "ليبيا"
            },
            {
                "code": "MA",
                "name": "المغرب"
            },
            {
                "code": "OM",
                "name": "عمان"
            },
            {
                "code": "QA",
                "name": "قطر"
            },
            {
                "code": "SD",
                "name": "السودان"
            },
            {
                "code": "SY",
                "name": "سوريا"
            },
            {
                "code": "TN",
                "name": "تونس"
            },
            {
                "code": "YE",
                "name": "اليمن"
            },
            {
                "code": "AW",
                "name": "آروبا"
            },
            {
                "code": "ES",
                "name": "أسبانيا"
            },
            {
                "code": "AU",
                "name": "أستراليا"
            },
            {
                "code": "AM",
                "name": "أرمينيا"
            },
            {
                "code": "AZ",
                "name": "أذربيجان"
            },
            {
                "code": "AF",
                "name": "أفغانستان"
            },
            {
                "code": "AL",
                "name": "ألبانيا"
            },
            {
                "code": "DE",
                "name": "ألمانيا"
            },
            {
                "code": "AG",
                "name": "أنتيجوا وبربودا"
            },
            {
                "code": "AO",
                "name": "أنجولا"
            },
            {
                "code": "AI",
                "name": "أنجويلا"
            },
            {
                "code": "AD",
                "name": "أندورا"
            },
            {
                "code": "UY",
                "name": "أورجواي"
            },
            {
                "code": "UZ",
                "name": "أوزبكستان"
            },
            {
                "code": "UG",
                "name": "أوغندا"
            },
            {
                "code": "UA",
                "name": "أوكرانيا"
            },
            {
                "code": "IE",
                "name": "أيرلندا"
            },
            {
                "code": "IS",
                "name": "أيسلندا"
            },
            {
                "code": "ET",
                "name": "اثيوبيا"
            },
            {
                "code": "ER",
                "name": "اريتريا"
            },
            {
                "code": "EE",
                "name": "استونيا"
            },
            {
                "code": "IL",
                "name": "اسرائيل"
            },
            {
                "code": "AR",
                "name": "الأرجنتين"
            },
            {
                "code": "EC",
                "name": "الاكوادور"
            },
            {
                "code": "BS",
                "name": "الباهاما"
            },
            {
                "code": "BR",
                "name": "البرازيل"
            },
            {
                "code": "PT",
                "name": "البرتغال"
            },
            {
                "code": "BA",
                "name": "البوسنة والهرسك"
            },
            {
                "code": "GA",
                "name": "الجابون"
            },
            {
                "code": "ME",
                "name": "الجبل الأسود"
            },
            {
                "code": "DK",
                "name": "الدانمرك"
            },
            {
                "code": "CV",
                "name": "الرأس الأخضر"
            },
            {
                "code": "SV",
                "name": "السلفادور"
            },
            {
                "code": "SN",
                "name": "السنغال"
            },
            {
                "code": "SE",
                "name": "السويد"
            },
            {
                "code": "EH",
                "name": "الصحراء الغربية"
            },
            {
                "code": "SO",
                "name": "الصومال"
            },
            {
                "code": "CN",
                "name": "الصين"
            },
            {
                "code": "VA",
                "name": "الفاتيكان"
            },
            {
                "code": "PH",
                "name": "الفيلبين"
            },
            {
                "code": "AQ",
                "name": "القطب الجنوبي"
            },
            {
                "code": "CM",
                "name": "الكاميرون"
            },
            {
                "code": "CG",
                "name": "الكونغو - برازافيل"
            },
            {
                "code": "HU",
                "name": "المجر"
            },
            {
                "code": "IO",
                "name": "المحيط الهندي البريطاني"
            },
            {
                "code": "TF",
                "name": "المقاطعات الجنوبية الفرنسية"
            },
            {
                "code": "MX",
                "name": "المكسيك"
            },
            {
                "code": "GB",
                "name": "المملكة المتحدة"
            },
            {
                "code": "NO",
                "name": "النرويج"
            },
            {
                "code": "AT",
                "name": "النمسا"
            },
            {
                "code": "NE",
                "name": "النيجر"
            },
            {
                "code": "IN",
                "name": "الهند"
            },
            {
                "code": "US",
                "name": "الولايات المتحدة الأمريكية"
            },
            {
                "code": "JP",
                "name": "اليابان"
            },
            {
                "code": "GR",
                "name": "اليونان"
            },
            {
                "code": "ID",
                "name": "اندونيسيا"
            },
            {
                "code": "IT",
                "name": "ايطاليا"
            },
            {
                "code": "PG",
                "name": "بابوا غينيا الجديدة"
            },
            {
                "code": "PY",
                "name": "باراجواي"
            },
            {
                "code": "PK",
                "name": "باكستان"
            },
            {
                "code": "PW",
                "name": "بالاو"
            },
            {
                "code": "BW",
                "name": "بتسوانا"
            },
            {
                "code": "PN",
                "name": "بتكايرن"
            },
            {
                "code": "BB",
                "name": "بربادوس"
            },
            {
                "code": "BM",
                "name": "برمودا"
            },
            {
                "code": "BN",
                "name": "بروناي"
            },
            {
                "code": "BE",
                "name": "بلجيكا"
            },
            {
                "code": "BG",
                "name": "بلغاريا"
            },
            {
                "code": "BZ",
                "name": "بليز"
            },
            {
                "code": "BD",
                "name": "بنجلاديش"
            },
            {
                "code": "PA",
                "name": "بنما"
            },
            {
                "code": "BJ",
                "name": "بنين"
            },
            {
                "code": "BT",
                "name": "بوتان"
            },
            {
                "code": "PR",
                "name": "بورتوريكو"
            },
            {
                "code": "BF",
                "name": "بوركينا فاسو"
            },
            {
                "code": "BI",
                "name": "بوروندي"
            },
            {
                "code": "PL",
                "name": "بولندا"
            },
            {
                "code": "BO",
                "name": "بوليفيا"
            },
            {
                "code": "PF",
                "name": "بولينيزيا الفرنسية"
            },
            {
                "code": "PE",
                "name": "بيرو"
            },
            {
                "code": "TZ",
                "name": "تانزانيا"
            },
            {
                "code": "TH",
                "name": "تايلند"
            },
            {
                "code": "TW",
                "name": "تايوان"
            },
            {
                "code": "TM",
                "name": "تركمانستان"
            },
            {
                "code": "TR",
                "name": "تركيا"
            },
            {
                "code": "TT",
                "name": "ترينيداد وتوباغو"
            },
            {
                "code": "TD",
                "name": "تشاد"
            },
            {
                "code": "TG",
                "name": "توجو"
            },
            {
                "code": "TV",
                "name": "توفالو"
            },
            {
                "code": "TK",
                "name": "توكيلو"
            },
            {
                "code": "TO",
                "name": "تونجا"
            },
            {
                "code": "TL",
                "name": "تيمور الشرقية"
            },
            {
                "code": "JM",
                "name": "جامايكا"
            },
            {
                "code": "GI",
                "name": "جبل طارق"
            },
            {
                "code": "GD",
                "name": "جرينادا"
            },
            {
                "code": "GL",
                "name": "جرينلاند"
            },
            {
                "code": "AX",
                "name": "جزر أولان"
            },
            {
                "code": "AN",
                "name": "جزر الأنتيل الهولندية"
            },
            {
                "code": "TC",
                "name": "جزر الترك وجايكوس"
            },
            {
                "code": "KY",
                "name": "جزر الكايمن"
            },
            {
                "code": "MH",
                "name": "جزر المارشال"
            },
            {
                "code": "MV",
                "name": "جزر الملديف"
            },
            {
                "code": "UM",
                "name": "جزر الولايات المتحدة البعيدة الصغيرة"
            },
            {
                "code": "SB",
                "name": "جزر سليمان"
            },
            {
                "code": "FO",
                "name": "جزر فارو"
            },
            {
                "code": "VI",
                "name": "جزر فرجين الأمريكية"
            },
            {
                "code": "VG",
                "name": "جزر فرجين البريطانية"
            },
            {
                "code": "FK",
                "name": "جزر فوكلاند"
            },
            {
                "code": "CK",
                "name": "جزر كوك"
            },
            {
                "code": "CC",
                "name": "جزر كوكوس"
            },
            {
                "code": "MP",
                "name": "جزر ماريانا الشمالية"
            },
            {
                "code": "WF",
                "name": "جزر والس وفوتونا"
            },
            {
                "code": "CX",
                "name": "جزيرة الكريسماس"
            },
            {
                "code": "BV",
                "name": "جزيرة بوفيه"
            },
            {
                "code": "IM",
                "name": "جزيرة مان"
            },
            {
                "code": "NF",
                "name": "جزيرة نورفوك"
            },
            {
                "code": "HM",
                "name": "جزيرة هيرد وماكدونالد"
            },
            {
                "code": "CF",
                "name": "جمهورية افريقيا الوسطى"
            },
            {
                "code": "CZ",
                "name": "جمهورية التشيك"
            },
            {
                "code": "DO",
                "name": "جمهورية الدومينيك"
            },
            {
                "code": "CD",
                "name": "جمهورية الكونغو الديمقراطية"
            },
            {
                "code": "ZA",
                "name": "جمهورية جنوب افريقيا"
            },
            {
                "code": "GT",
                "name": "جواتيمالا"
            },
            {
                "code": "GP",
                "name": "جوادلوب"
            },
            {
                "code": "GU",
                "name": "جوام"
            },
            {
                "code": "GE",
                "name": "جورجيا"
            },
            {
                "code": "GS",
                "name": "جورجيا الجنوبية وجزر ساندويتش الجنوبية"
            },
            {
                "code": "JE",
                "name": "جيرسي"
            },
            {
                "code": "DM",
                "name": "دومينيكا"
            },
            {
                "code": "RW",
                "name": "رواندا"
            },
            {
                "code": "RU",
                "name": "روسيا"
            },
            {
                "code": "BY",
                "name": "روسيا البيضاء"
            },
            {
                "code": "RO",
                "name": "رومانيا"
            },
            {
                "code": "RE",
                "name": "روينيون"
            },
            {
                "code": "ZM",
                "name": "زامبيا"
            },
            {
                "code": "ZW",
                "name": "زيمبابوي"
            },
            {
                "code": "CI",
                "name": "ساحل العاج"
            },
            {
                "code": "WS",
                "name": "ساموا"
            },
            {
                "code": "AS",
                "name": "ساموا الأمريكية"
            },
            {
                "code": "SM",
                "name": "سان مارينو"
            },
            {
                "code": "PM",
                "name": "سانت بيير وميكولون"
            },
            {
                "code": "VC",
                "name": "سانت فنسنت وغرنادين"
            },
            {
                "code": "KN",
                "name": "سانت كيتس ونيفيس"
            },
            {
                "code": "LC",
                "name": "سانت لوسيا"
            },
            {
                "code": "MF",
                "name": "سانت مارتين"
            },
            {
                "code": "SH",
                "name": "سانت هيلنا"
            },
            {
                "code": "ST",
                "name": "ساو تومي وبرينسيبي"
            },
            {
                "code": "LK",
                "name": "سريلانكا"
            },
            {
                "code": "SJ",
                "name": "سفالبارد وجان مايان"
            },
            {
                "code": "SK",
                "name": "سلوفاكيا"
            },
            {
                "code": "SI",
                "name": "سلوفينيا"
            },
            {
                "code": "SG",
                "name": "سنغافورة"
            },
            {
                "code": "SZ",
                "name": "سوازيلاند"
            },
            {
                "code": "SR",
                "name": "سورينام"
            },
            {
                "code": "CH",
                "name": "سويسرا"
            },
            {
                "code": "SL",
                "name": "سيراليون"
            },
            {
                "code": "SC",
                "name": "سيشل"
            },
            {
                "code": "CL",
                "name": "شيلي"
            },
            {
                "code": "RS",
                "name": "صربيا"
            },
            {
                "code": "CS",
                "name": "صربيا والجبل الأسود"
            },
            {
                "code": "TJ",
                "name": "طاجكستان"
            },
            {
                "code": "GM",
                "name": "غامبيا"
            },
            {
                "code": "GH",
                "name": "غانا"
            },
            {
                "code": "GF",
                "name": "غويانا"
            },
            {
                "code": "GY",
                "name": "غيانا"
            },
            {
                "code": "GN",
                "name": "غينيا"
            },
            {
                "code": "GQ",
                "name": "غينيا الاستوائية"
            },
            {
                "code": "GW",
                "name": "غينيا بيساو"
            },
            {
                "code": "VU",
                "name": "فانواتو"
            },
            {
                "code": "FR",
                "name": "فرنسا"
            },
            {
                "code": "PS",
                "name": "فلسطين"
            },
            {
                "code": "VE",
                "name": "فنزويلا"
            },
            {
                "code": "FI",
                "name": "فنلندا"
            },
            {
                "code": "VN",
                "name": "فيتنام"
            },
            {
                "code": "FJ",
                "name": "فيجي"
            },
            {
                "code": "CY",
                "name": "قبرص"
            },
            {
                "code": "KG",
                "name": "قرغيزستان"
            },
            {
                "code": "KZ",
                "name": "كازاخستان"
            },
            {
                "code": "NC",
                "name": "كاليدونيا الجديدة"
            },
            {
                "code": "HR",
                "name": "كرواتيا"
            },
            {
                "code": "KH",
                "name": "كمبوديا"
            },
            {
                "code": "CA",
                "name": "كندا"
            },
            {
                "code": "CU",
                "name": "كوبا"
            },
            {
                "code": "KR",
                "name": "كوريا الجنوبية"
            },
            {
                "code": "KP",
                "name": "كوريا الشمالية"
            },
            {
                "code": "CR",
                "name": "كوستاريكا"
            },
            {
                "code": "CO",
                "name": "كولومبيا"
            },
            {
                "code": "KI",
                "name": "كيريباتي"
            },
            {
                "code": "KE",
                "name": "كينيا"
            },
            {
                "code": "LV",
                "name": "لاتفيا"
            },
            {
                "code": "LA",
                "name": "لاوس"
            },
            {
                "code": "LU",
                "name": "لوكسمبورج"
            },
            {
                "code": "LR",
                "name": "ليبيريا"
            },
            {
                "code": "LT",
                "name": "ليتوانيا"
            },
            {
                "code": "LI",
                "name": "ليختنشتاين"
            },
            {
                "code": "LS",
                "name": "ليسوتو"
            },
            {
                "code": "MQ",
                "name": "مارتينيك"
            },
            {
                "code": "MO",
                "name": "ماكاو الصينية"
            },
            {
                "code": "MT",
                "name": "مالطا"
            },
            {
                "code": "ML",
                "name": "مالي"
            },
            {
                "code": "MY",
                "name": "ماليزيا"
            },
            {
                "code": "YT",
                "name": "مايوت"
            },
            {
                "code": "MG",
                "name": "مدغشقر"
            },
            {
                "code": "MK",
                "name": "مقدونيا"
            },
            {
                "code": "MW",
                "name": "ملاوي"
            },
            {
                "code": "ZZ",
                "name": "منطقة غير معرفة"
            },
            {
                "code": "MN",
                "name": "منغوليا"
            },
            {
                "code": "MR",
                "name": "موريتانيا"
            },
            {
                "code": "MU",
                "name": "موريشيوس"
            },
            {
                "code": "MZ",
                "name": "موزمبيق"
            },
            {
                "code": "MD",
                "name": "مولدافيا"
            },
            {
                "code": "MC",
                "name": "موناكو"
            },
            {
                "code": "MS",
                "name": "مونتسرات"
            },
            {
                "code": "MM",
                "name": "ميانمار"
            },
            {
                "code": "FM",
                "name": "ميكرونيزيا"
            },
            {
                "code": "NA",
                "name": "ناميبيا"
            },
            {
                "code": "NR",
                "name": "نورو"
            },
            {
                "code": "NP",
                "name": "نيبال"
            },
            {
                "code": "NG",
                "name": "نيجيريا"
            },
            {
                "code": "NI",
                "name": "نيكاراجوا"
            },
            {
                "code": "NZ",
                "name": "نيوزيلاندا"
            },
            {
                "code": "NU",
                "name": "نيوي"
            },
            {
                "code": "HT",
                "name": "هايتي"
            },
            {
                "code": "HN",
                "name": "هندوراس"
            },
            {
                "code": "NL",
                "name": "هولندا"
            },
            {
                "code": "HK",
                "name": "هونج كونج الصينية  "
            }
        ];

        var countries_en = [
            {"name": "Saudi Arabia", "code": "SA"},
            {"name": "United Arab Emirates", "code": "AE"},
            {"name": "Algeria", "code": "DZ"},
            {"name": "Bahrain", "code": "BH"},
            {"name": "Comoros", "code": "KM"},
            {"name": "Djibouti", "code": "DJ"},
            {"name": "Egypt", "code": "EG"},
            {"name": "Iraq", "code": "IQ"},
            {"name": "Iran, Islamic Republic Of", "code": "IR"},
            {"name": "Jordan", "code": "JO"},
            {"name": "Kuwait", "code": "KW"},
            {"name": "Lebanon", "code": "LB"},
            {"name": "Libyan Arab Jamahiriya", "code": "LY"},
            {"name": "Mauritania", "code": "MR"},
            {"name": "Morocco", "code": "MA"},
            {"name": "Oman", "code": "OM"},
            {"name": "Qatar", "code": "QA"},
            {"name": "Sudan", "code": "SD"},
            {"name": "Syrian Arab Republic", "code": "SY"},
            {"name": "Tunisia", "code": "TN"},
            {"name": "Yemen", "code": "YE"},
            {"name": "Afghanistan", "code": "AF"},
            {"name": "Åland Islands", "code": "AX"},
            {"name": "Albania", "code": "AL"},
            {"name": "American Samoa", "code": "AS"},
            {"name": "AndorrA", "code": "AD"},
            {"name": "Angola", "code": "AO"},
            {"name": "Anguilla", "code": "AI"},
            {"name": "Antarctica", "code": "AQ"},
            {"name": "Antigua and Barbuda", "code": "AG"},
            {"name": "Argentina", "code": "AR"},
            {"name": "Armenia", "code": "AM"},
            {"name": "Aruba", "code": "AW"},
            {"name": "Australia", "code": "AU"},
            {"name": "Austria", "code": "AT"},
            {"name": "Azerbaijan", "code": "AZ"},
            {"name": "Bahamas", "code": "BS"},
            {"name": "Bangladesh", "code": "BD"},
            {"name": "Barbados", "code": "BB"},
            {"name": "Belarus", "code": "BY"},
            {"name": "Belgium", "code": "BE"},
            {"name": "Belize", "code": "BZ"},
            {"name": "Benin", "code": "BJ"},
            {"name": "Bermuda", "code": "BM"},
            {"name": "Bhutan", "code": "BT"},
            {"name": "Bolivia", "code": "BO"},
            {"name": "Bosnia and Herzegovina", "code": "BA"},
            {"name": "Botswana", "code": "BW"},
            {"name": "Bouvet Island", "code": "BV"},
            {"name": "Brazil", "code": "BR"},
            {"name": "British Indian Ocean Territory", "code": "IO"},
            {"name": "Brunei Darussalam", "code": "BN"},
            {"name": "Bulgaria", "code": "BG"},
            {"name": "Burkina Faso", "code": "BF"},
            {"name": "Burundi", "code": "BI"},
            {"name": "Cambodia", "code": "KH"},
            {"name": "Cameroon", "code": "CM"},
            {"name": "Canada", "code": "CA"},
            {"name": "Cape Verde", "code": "CV"},
            {"name": "Cayman Islands", "code": "KY"},
            {"name": "Central African Republic", "code": "CF"},
            {"name": "Chad", "code": "TD"},
            {"name": "Chile", "code": "CL"},
            {"name": "China", "code": "CN"},
            {"name": "Christmas Island", "code": "CX"},
            {"name": "Cocos (Keeling) Islands", "code": "CC"},
            {"name": "Colombia", "code": "CO"},
            {"name": "Congo", "code": "CG"},
            {"name": "Congo, The Democratic Republic of the", "code": "CD"},
            {"name": "Cook Islands", "code": "CK"},
            {"name": "Costa Rica", "code": "CR"},
            {"name": "Cote D'Ivoire", "code": "CI"},
            {"name": "Croatia", "code": "HR"},
            {"name": "Cuba", "code": "CU"},
            {"name": "Cyprus", "code": "CY"},
            {"name": "Czech Republic", "code": "CZ"},
            {"name": "Denmark", "code": "DK"},
            {"name": "Dominica", "code": "DM"},
            {"name": "Dominican Republic", "code": "DO"},
            {"name": "Ecuador", "code": "EC"},
            {"name": "El Salvador", "code": "SV"},
            {"name": "Equatorial Guinea", "code": "GQ"},
            {"name": "Eritrea", "code": "ER"},
            {"name": "Estonia", "code": "EE"},
            {"name": "Ethiopia", "code": "ET"},
            {"name": "Falkland Islands (Malvinas)", "code": "FK"},
            {"name": "Faroe Islands", "code": "FO"},
            {"name": "Fiji", "code": "FJ"},
            {"name": "Finland", "code": "FI"},
            {"name": "France", "code": "FR"},
            {"name": "French Guiana", "code": "GF"},
            {"name": "French Polynesia", "code": "PF"},
            {"name": "French Southern Territories", "code": "TF"},
            {"name": "Gabon", "code": "GA"},
            {"name": "Gambia", "code": "GM"},
            {"name": "Georgia", "code": "GE"},
            {"name": "Germany", "code": "DE"},
            {"name": "Ghana", "code": "GH"},
            {"name": "Gibraltar", "code": "GI"},
            {"name": "Greece", "code": "GR"},
            {"name": "Greenland", "code": "GL"},
            {"name": "Grenada", "code": "GD"},
            {"name": "Guadeloupe", "code": "GP"},
            {"name": "Guam", "code": "GU"},
            {"name": "Guatemala", "code": "GT"},
            {"name": "Guernsey", "code": "GG"},
            {"name": "Guinea", "code": "GN"},
            {"name": "Guinea-Bissau", "code": "GW"},
            {"name": "Guyana", "code": "GY"},
            {"name": "Haiti", "code": "HT"},
            {"name": "Heard Island and Mcdonald Islands", "code": "HM"},
            {"name": "Holy See (Vatican City State)", "code": "VA"},
            {"name": "Honduras", "code": "HN"},
            {"name": "Hong Kong", "code": "HK"},
            {"name": "Hungary", "code": "HU"},
            {"name": "Iceland", "code": "IS"},
            {"name": "India", "code": "IN"},
            {"name": "Indonesia", "code": "ID"},
            {"name": "Ireland", "code": "IE"},
            {"name": "Isle of Man", "code": "IM"},
            {"name": "Israel", "code": "IL"},
            {"name": "Italy", "code": "IT"},
            {"name": "Jamaica", "code": "JM"},
            {"name": "Japan", "code": "JP"},
            {"name": "Jersey", "code": "JE"},
            {"name": "Kazakhstan", "code": "KZ"},
            {"name": "Kenya", "code": "KE"},
            {"name": "Kiribati", "code": "KI"},
            {"name": "Korea, Democratic People'S Republic of", "code": "KP"},
            {"name": "Korea, Republic of", "code": "KR"},
            {"name": "Kyrgyzstan", "code": "KG"},
            {"name": "Lao People'S Democratic Republic", "code": "LA"},
            {"name": "Latvia", "code": "LV"},
            {"name": "Lesotho", "code": "LS"},
            {"name": "Liberia", "code": "LR"},
            {"name": "Liechtenstein", "code": "LI"},
            {"name": "Lithuania", "code": "LT"},
            {"name": "Luxembourg", "code": "LU"},
            {"name": "Macao", "code": "MO"},
            {"name": "Macedonia, The Former Yugoslav Republic of", "code": "MK"},
            {"name": "Madagascar", "code": "MG"},
            {"name": "Malawi", "code": "MW"},
            {"name": "Malaysia", "code": "MY"},
            {"name": "Maldives", "code": "MV"},
            {"name": "Mali", "code": "ML"},
            {"name": "Malta", "code": "MT"},
            {"name": "Marshall Islands", "code": "MH"},
            {"name": "Martinique", "code": "MQ"},
            {"name": "Mauritius", "code": "MU"},
            {"name": "Mayotte", "code": "YT"},
            {"name": "Mexico", "code": "MX"},
            {"name": "Micronesia, Federated States of", "code": "FM"},
            {"name": "Moldova, Republic of", "code": "MD"},
            {"name": "Monaco", "code": "MC"},
            {"name": "Mongolia", "code": "MN"},
            {"name": "Montserrat", "code": "MS"},
            {"name": "Mozambique", "code": "MZ"},
            {"name": "Myanmar", "code": "MM"},
            {"name": "Namibia", "code": "NA"},
            {"name": "Nauru", "code": "NR"},
            {"name": "Nepal", "code": "NP"},
            {"name": "Netherlands", "code": "NL"},
            {"name": "Netherlands Antilles", "code": "AN"},
            {"name": "New Caledonia", "code": "NC"},
            {"name": "New Zealand", "code": "NZ"},
            {"name": "Nicaragua", "code": "NI"},
            {"name": "Niger", "code": "NE"},
            {"name": "Nigeria", "code": "NG"},
            {"name": "Niue", "code": "NU"},
            {"name": "Norfolk Island", "code": "NF"},
            {"name": "Northern Mariana Islands", "code": "MP"},
            {"name": "Norway", "code": "NO"},
            {"name": "Pakistan", "code": "PK"},
            {"name": "Palau", "code": "PW"},
            {"name": "Palestinian Territory, Occupied", "code": "PS"},
            {"name": "Panama", "code": "PA"},
            {"name": "Papua New Guinea", "code": "PG"},
            {"name": "Paraguay", "code": "PY"},
            {"name": "Peru", "code": "PE"},
            {"name": "Philippines", "code": "PH"},
            {"name": "Pitcairn", "code": "PN"},
            {"name": "Poland", "code": "PL"},
            {"name": "Portugal", "code": "PT"},
            {"name": "Puerto Rico", "code": "PR"},
            {"name": "Reunion", "code": "RE"},
            {"name": "Romania", "code": "RO"},
            {"name": "Russian Federation", "code": "RU"},
            {"name": "RWANDA", "code": "RW"},
            {"name": "Saint Helena", "code": "SH"},
            {"name": "Saint Kitts and Nevis", "code": "KN"},
            {"name": "Saint Lucia", "code": "LC"},
            {"name": "Saint Pierre and Miquelon", "code": "PM"},
            {"name": "Saint Vincent and the Grenadines", "code": "VC"},
            {"name": "Samoa", "code": "WS"},
            {"name": "San Marino", "code": "SM"},
            {"name": "Sao Tome and Principe", "code": "ST"},
            {"name": "Senegal", "code": "SN"},
            {"name": "Serbia and Montenegro", "code": "CS"},
            {"name": "Seychelles", "code": "SC"},
            {"name": "Sierra Leone", "code": "SL"},
            {"name": "Singapore", "code": "SG"},
            {"name": "Slovakia", "code": "SK"},
            {"name": "Slovenia", "code": "SI"},
            {"name": "Solomon Islands", "code": "SB"},
            {"name": "Somalia", "code": "SO"},
            {"name": "South Africa", "code": "ZA"},
            {"name": "South Georgia and the South Sandwich Islands", "code": "GS"},
            {"name": "Spain", "code": "ES"},
            {"name": "Sri Lanka", "code": "LK"},
            {"name": "Suriname", "code": "SR"},
            {"name": "Svalbard and Jan Mayen", "code": "SJ"},
            {"name": "Swaziland", "code": "SZ"},
            {"name": "Sweden", "code": "SE"},
            {"name": "Switzerland", "code": "CH"},
            {"name": "Taiwan, Province of China", "code": "TW"},
            {"name": "Tajikistan", "code": "TJ"},
            {"name": "Tanzania, United Republic of", "code": "TZ"},
            {"name": "Thailand", "code": "TH"},
            {"name": "Timor-Leste", "code": "TL"},
            {"name": "Togo", "code": "TG"},
            {"name": "Tokelau", "code": "TK"},
            {"name": "Tonga", "code": "TO"},
            {"name": "Trinidad and Tobago", "code": "TT"},
            {"name": "Turkey", "code": "TR"},
            {"name": "Turkmenistan", "code": "TM"},
            {"name": "Turks and Caicos Islands", "code": "TC"},
            {"name": "Tuvalu", "code": "TV"},
            {"name": "Uganda", "code": "UG"},
            {"name": "Ukraine", "code": "UA"},
            {"name": "United Kingdom", "code": "GB"},
            {"name": "United States", "code": "US"},
            {"name": "United States Minor Outlying Islands", "code": "UM"},
            {"name": "Uruguay", "code": "UY"},
            {"name": "Uzbekistan", "code": "UZ"},
            {"name": "Vanuatu", "code": "VU"},
            {"name": "Venezuela", "code": "VE"},
            {"name": "Viet Nam", "code": "VN"},
            {"name": "Virgin Islands, British", "code": "VG"},
            {"name": "Virgin Islands, U.S.", "code": "VI"},
            {"name": "Wallis and Futuna", "code": "WF"},
            {"name": "Western Sahara", "code": "EH"},
            {"name": "Zambia", "code": "ZM"},
            {"name": "Zimbabwe", "code": "ZW"}
        ];

        return {
            requestUrls: requestUrls,
            countries: function (language) {
                if (language === 'en') return countries_en;
                return countries_ar;
            },
            partials: partials
        };


    }
})();

