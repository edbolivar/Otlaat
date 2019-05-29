(function () {
    'use strict';
        app.directive('numbersOnly', numbersOnly);

        numbersOnly.$inject = ['$timeout'];

    function numbersOnly($timeout) {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, element, attr, ngModelCtrl) {
                function fromUser(text) {
                    if (text) {
                        var transformedInput;
                        if (attr.numbersOnly) {
                            transformedInput = text.replace(/[^0-9]/g, '');
                        } else {
                            transformedInput = text[0].replace(/[^1-9]/g, '') + text.substring(1).replace(/[^0-9]/g, '');
                        }
                        if (transformedInput !== text) {
                            scope.numberOnly = true;

                            $timeout(function () {
                                scope.numberOnly = false;
                            }, 3000);

                            ngModelCtrl.$setViewValue(transformedInput);
                            ngModelCtrl.$render();
                        }
                        return transformedInput;
                    }
                    return undefined;
                }
                ngModelCtrl.$parsers.push(fromUser);
            }
        };
    }
})();