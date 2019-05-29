(function () {
    'use strict';
    angular
        .module('hotelApp')
        .directive('imageNotFound', imageNotFound);

    imageNotFound.$inject = ['HotelSearchService'];
    var brokenArr= {};
    var brokenLinks = {};
    var imagesResultReceivedCount = 0;

    function imageNotFound(HotelSearchService) {

        return {
            link: function (scope, element, attrs) {
                element.bind('error', function () {
                    if (attrs.src != attrs.imageNotFound) {
                        brokenLinks[attrs.hCode] = attrs.src;
                        brokenArr.brokenimg= brokenLinks;
                        attrs.$set('src', attrs.imageNotFound);
                    }
                    checkImageResult();
                    
                });
                
                /*scope.$watch('attrs.hPage', function(newValue, oldValue){
                    console.log('newValue', newValue);
                    console.log('oldValue', oldValue);
                });*/

                element.bind('load', function () {
                    checkImageResult();
                });

                function checkImageResult() {  
                scope.hpage= attrs.hPage;
                //console.log('hpage', scope.hpage);
                scope.$watch('hPage', function(){
                    //console.log('hey, myVar has changed!');
                    brokenLinks = {};
                    imagesResultReceivedCount = 0;
                }); 

                    /*if(attrs.hPage == 2 && imagesResultReceivedCount != 0){
                        brokenLinks = {};
                        imagesResultReceivedCount = 0;
                        console.log('page2');
                    }
                    if(attrs.hPage == 3  && imagesResultReceivedCount != 0){
                        brokenLinks = {};
                        imagesResultReceivedCount = 0;
                        console.log('page3');
                    }*/

                    //console.log('pagination', attrs.hPage);
                    imagesResultReceivedCount++;
                    var isThereAnyBrokenLink = !!Object.keys(brokenLinks).length;

                    if (imagesResultReceivedCount === 10 && isThereAnyBrokenLink) {
                        HotelSearchService.fetchBrokenImage(brokenArr);
                    }
                }
            }
        }
    }
})();


