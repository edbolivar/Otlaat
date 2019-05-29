'use strict';

(function () {
    angular
        .module('hotelApp')
        .service('seoService', seoService);

    authService.$inject = ['$rootScope'];

    function seoService($rootScope) {

        return {
            robotFlag= true;
            if($rootScope.lang === 'en'){
                page_title = 'Otlaat Hotels';
                page_description='Book the best hotels with holidays. Make sure you book cheap, family-friendly hotels. Enjoy secure booking, and the best bokking hotel deals with holidays';
            }else{
                page_title = 'فنادق عطلات';
                page_description='حجز الفنادق بأفضل الاسعار مع عطلات. إضمن حجز فنادق رخيصة صديقة للأسرة. إستمتع بحجز أمن، وأفضل عروض البوكنج للفنادق مع عطلات';
            }
            /*$rootScope.change_title = function(){
                $rootScope.robotFlag= true;
                $rootScope.page_title= $rootScope.meta_title;
                $rootScope.page_description= $rootScope.meta_description;
            }*/
        };

    }
})();

