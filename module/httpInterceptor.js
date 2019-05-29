app.config(function ($httpProvider) {
    $httpProvider.interceptors.push('httpInterceptor');
});

app.factory('httpInterceptor', ['$q', '$timeout', '$injector', function($q, $timeout, $injector) {

    var invalidTokenResponses = {
        'Token is invalid': true,
        'Invalid email or password.': true,
        'Invalid Token': true,
        'Token expired, login again': true
    };
      //  loading html -> httpInterceptor requesr -> server get Request -> server response -> httpInterceptor response -> html loaded
    return {
        response: function(response) {
            var deferred = $q.defer();
            $timeout(function () {
                /*if (response.data.success === false && invalidTokenResponses[response.data.err_msg]) {
                    $injector.get('$state').go('home');
                    $injector.get('loginModalService').open('sm', null, null, null, true);
                    deferred.resolve(response);
                } else {
                    deferred.resolve(response);
                }*/
                if (response.data.success === false && invalidTokenResponses[response.data.err_msg]) {
                    $injector.get('$state').go('home');
                    if (localStorage.getItem("otlaat.api_token")) {
                        $injector.get('loginModalService').open('sm', null, null, null, true);
                    }
                    $injector.get('$rootScope').logout();
                    deferred.resolve(response);
                } else {
                    deferred.resolve(response);
                }
            });

            return deferred.promise;
        },
        request : function(config) { 
            config = angular.copy(config);
            var url = config.url;

            var restrictedRequestTypes = ['.json', '.html', '.css'];

            if ((config.method === 'POST' || config.method === 'GET') && !isRequestTypeRestricted(restrictedRequestTypes, url)){
                var lang = localStorage.getItem("otlaat.lang");
                var serialize = config.paramSerializer({otlaat_lang: lang});

                var currency = localStorage.getItem("otlaat.currency");
                var serializeCur = config.paramSerializer({otlaat_currency: currency});

                if (config.data) {
                   config.data.otlaat_lang = lang;
                   config.data.currency = currency;
                } else if (url.indexOf('?') !== -1) {
                    config.url = url + '&' + serialize + '&' + serializeCur;
                    //config.url = url + '&' + serializeCur;
                } else {
                    config.url = url + '?' + serialize + '&' + serializeCur;
                    //config.url = url + '?' + serializeCur;
                }
            }

            return config || $q.when(config);
        }
    };

    /**
     * @param restrictedTypes<Array>
     * @param url<String>
     */
    function isRequestTypeRestricted(restrictedTypes, url) {
        var restricted = false;
        angular.forEach(restrictedTypes, function (type, index) {
            if (url.indexOf(type) !== -1) {
                restricted = true;
            }
        });
        return restricted;
    }
}]);