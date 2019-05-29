(function(){
	'use strict';
	angular
		.module("hotelApp")
		.service('currencyConverterService', currencyConverterService);

	currencyConverterService.$inject= ['$rootScope', '$http', 'constants', '$translate', 'tmhDynamicLocale'];

	function currencyConverterService($rootScope, $http, constants, $translate, tmhDynamicLocale){
		return {
			currencyConverter: currencyConverter,
			//setCurrencyParamToUrl: setCurrencyParamToUrl
		};


		function currencyConverter(currency, isClick){ 
			$rootScope.currency= currency || localStorage.getItem("otlaat.currency") || 'usd';
			
			localStorage.setItem("otlaat.currency", $rootScope.currency); 

			if(isClick){
				location.reload();
				setCurrencyParamToUrl();
			}
			if ($rootScope.currency === 'sar') {
                $rootScope.currecnyAvailable = true;
            }else{
            	$rootScope.currecnyAvailable= false;
            }
		}

		/*function setCurrencyParamToUrl(){
			var isCurrencyParamSet = window.location.href.indexOf("currency=") !== -1 || window.location.href.indexOf("currency=") !== -1;
            isCurrencyParamSet
                ? replaceParam()
                : addParam();

            function replaceParam() {
                const newUrl = window.location.href.replace(/currency=[a-z]{3}/, "currency=" + $rootScope.currency);
                window.history.pushState({path: newUrl}, '', newUrl);
            }

            function addParam() {
                var newurl = window.location.href + '?currency=' + $rootScope.currency;
                var isAnyParamSet = window.location.href.toString().search(/\?[a-z]{1}/);
                if (isAnyParamSet !== -1) {
                    var href = window.location.href.toString();
                    //console.log(window.location.href);
                    var cutHref = href.slice(0, isAnyParamSet) + href.slice(isAnyParamSet + 1);
                    var url = splice(cutHref, isAnyParamSet, 0, "?currency=" + $rootScope.currency + "&");
                    window.history.pushState({path: url}, '', url);

                } else {
                    window.history.pushState({path: newurl}, '', newurl);
                }

            }

            function splice(toSplice, idx, rem, str) {
                return toSplice.slice(0, idx) + str + toSplice.slice(idx + Math.abs(rem));
            }
		}*/
	}

})();