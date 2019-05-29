(function () {
    'use strict';
    angular
        .module('hotelApp')
        .service('languageService', languageService);

    languageService.$inject = ['$rootScope', '$http', 'constants', 'authService', '$state', '$translate', 'tmhDynamicLocale'];

    function languageService($rootScope, $http, constants, authService, $state, $translate, tmhDynamicLocale) {

        return {
            setLanguage: setLanguage,
            setLanguageParamToUrl: setLanguageParamToUrl
        };

        function setLanguage(lang, isClick) {
            $rootScope.lang = lang || localStorage.getItem("otlaat.lang") || 'en';
            localStorage.setItem("otlaat.lang", $rootScope.lang);
            $translate.use($rootScope.lang);

            var el = document.getElementById("style1");
            var styleAr = document.getElementById("styleAr");

            if (isClick) {
                location.reload();
                setLanguageParamToUrl();
            }

            if ($rootScope.lang === 'ar') {
                $rootScope.languageavailable = true;
                el.href = "css/bootstrap-rtl.css";
                styleAr.href = "css/style-ar.css";
                tmhDynamicLocale.set("ar");
            }
            else {
                $rootScope.languageavailable = false;
                el.href = "css/bootstrap.css";
                styleAr.href = "";
            }
        }

        function setLanguageParamToUrl() {
            var isLangParamSet = window.location.href.indexOf("lang=") !== -1 || window.location.href.indexOf("lang=") !== -1;
            isLangParamSet
                ? replaceParam()
                : addParam();

            function replaceParam() {
                const newUrl = window.location.href.replace(/lang=[a-z]{2}/, "lang=" + $rootScope.lang);
                window.history.pushState({path: newUrl}, '', newUrl);
            }

            function addParam() {
                var newurl = window.location.href + '?lang=' + $rootScope.lang;
                var isAnyParamSet = window.location.href.toString().search(/\?[a-z]{1}/);
                if (isAnyParamSet !== -1) {
                    var href = window.location.href.toString();
                    //console.log(window.location.href);
                    var cutHref = href.slice(0, isAnyParamSet) + href.slice(isAnyParamSet + 1);
                    var url = splice(cutHref, isAnyParamSet, 0, "?lang=" + $rootScope.lang + "&");
                    window.history.pushState({path: url}, '', url);

                } else {
                    window.history.pushState({path: newurl}, '', newurl);
                }

            }

            function splice(toSplice, idx, rem, str) {
                return toSplice.slice(0, idx) + str + toSplice.slice(idx + Math.abs(rem));
            }
        }

    }
})();

