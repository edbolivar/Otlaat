(function () {
    'use strict';
        app.directive('englishOnly', englishOnly);

        englishOnly.$inject = ['$timeout'];

    function englishOnly($timeout) {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, element, attr, ngModelCtrl) {
                function fromUser(text) {
                    if (text) {
                        var transformedInput;
                        if (attr.englishOnly) {
                            transformedInput = text.replace(/[^a-zA-Z]/g, '');
                        } else {
                            transformedInput = text[0].replace(/[^a-zA-Z]/g, '') + text.substring(1).replace(/[^a-zA-Z]/g, '');
                        }
                        if (transformedInput !== text) {
                            scope.englishOnly = true;

                            $timeout(function () {
                                scope.englishOnly = false;
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