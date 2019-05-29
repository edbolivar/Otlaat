(function () {
    'use strict';
    angular
        .module('hotelApp')
        .service('userProfileService', userProfileService);

    userProfileService.$inject = ['$rootScope', '$http', 'constants', 'authService', '$state'];

    function userProfileService($rootScope, $http, constants, authService, $state) {
        var userProfile = null;
        var loginData = null;



        return {
            getUserProfile: getUserProfile,
            setUserProfile: setUserProfile,
            setLoginData: setLoginData,
            getLoginData: getLoginData,
            removeUserProfile: removeUserProfile,
            queryUserProfile: queryUserProfile,
            updateUserProfile: updateUserProfile,
            updateUserPassword: updateUserPassword,
            getEmail: getEmail,
            //getMeta: getMeta,
           // setMeta: setMeta,
        };

       /* function setMeta(mttitle){
           //var title = 'Web App';

          $rootScope.title= mttitle;


           /*var metaDescription = '';
           var metaKeywords = '';
           return {
              set: function(newTitle, newMetaDescription, newKeywords) {
                  metaKeywords = newKeywords;
                  metaDescription = newMetaDescription;
                  title = newTitle; 
              },
              metaTitle: function(){ return title; },
              metaDescription: function() { return metaDescription; },
              metaKeywords: function() { return metaKeywords; }
           } */
        /*}

        function getMeta(){
            return title;
        }*/

        function getUserProfile() {
            return userProfile;
        }

        function setUserProfile(data) {
            userProfile = data;
            $rootScope.userProfile = userProfile;
        }

        function setLoginData(data) {
            loginData = data;
            $rootScope.loginData = loginData;
        }

        function getLoginData() {
            loginData = {
                api_token: localStorage.getItem("otlaat.api_token"),
                email: localStorage.getItem("otlaat.email"),
                name: localStorage.getItem("otlaat.name")
            };

            var isAnyTrueValue = false;

            _.each(loginData, function (value, key) {
                if (value) {
                    isAnyTrueValue = true;
                }
            });

            if (!isAnyTrueValue) {
                loginData = null;
            }

            return loginData;
        }

        function removeUserProfile() { 
            logUserOut();
             localStorage.removeItem("otlaat.api_token");
             localStorage.removeItem("otlaat.email");
             localStorage.removeItem("otlaat.name");
            userProfile = null;
            $rootScope.loginData = null;
            $state.go('home');
        }

        function queryUserProfile() { 
            return $http({ 
                url: constants.requestUrls.userProfileGet+'?email='+loginData.email+'&api_token='+authService.getToken(),
                method: "GET",
                data: {}
            })
        }

        function updateUserProfile(user) {
            var configs = {
                url: constants.requestUrls.userProfileUpdate,
                method: "POST"
            };

            configs.data = angular.copy(user);
            configs.data.email = loginData.email;
            configs.data.api_token = authService.getToken();

            return $http(configs)
        }

        function updateUserPassword(password) {
            var configs = {
                url: constants.requestUrls.profilePasswordUpdate,
                method: "POST"
            };

            configs.data = angular.copy(password);
            configs.data.email = loginData.email;
            configs.data.api_token = authService.getToken();

            return $http(configs)
        }

        function logUserOut() { 
            if (!authService.getToken()) return;
            var configs = {
                url: constants.requestUrls.logout+'?email='+loginData.email+'&api_token='+authService.getToken(),
                method: "GET",
                data: {}
            };


            return $http(configs)
        }

        function getEmail() {
            return localStorage.getItem("otlaat.email")
        }
    }
})();

