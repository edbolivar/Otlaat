(function(){
    angular
        .module('hotelApp')
        .directive('setDropdownWidth', setDropdownWidth);

    function setDropdownWidth($timeout){
        return {
            restrict: 'A',
            link: link,
            scope: {
                dropdownId: '@',
                isOpens: '='
            }
        };

        function link($scope, elem, attrs){
            $scope.$watch('isOpens', function (newVal, oldVal) {
                if (newVal === oldVal && newVal) {
                    return;
                }
                if (newVal) {
                    var searchField = angular.element.find('#' + $scope.dropdownId),
                        width = searchField[0].offsetWidth;
                        $timeout(function() {
                            elem.css('width', (width + 'px'));
                            elem.css('min-width', (width + 'px'));
                        });

                }
            });

        }
    }
})();
