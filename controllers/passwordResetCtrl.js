app.controller('passwordResetController', passwordResetController);

passwordResetController.$inject = ['$scope', '$stateParams', '$http', '$timeout', '$state', 'constants', 'errorsService'];

function passwordResetController($scope, $stateParams, $http, $timeout, $state, constants, errorsService) {
    $scope.resetPassword = {};
    $scope.errors = false;
    $scope.requestResetPassword = requestResetPassword;

    formData();

    function formData() {
        $scope.resetPassword.token = $stateParams.token;
        $scope.resetPassword.email = $stateParams.email;
    }

    function requestResetPassword() {
        //making passwords md5
        var resetPasswordDt = {
            email: $scope.resetPassword.email,
            token: $scope.resetPassword.token,
            password: calcMD5($scope.resetPassword.password),
            password_confirmation: calcMD5($scope.resetPassword.password_confirmation)
        };

        $scope.isFetching = true;
        $scope.errors = false;
        $http.post(constants.requestUrls.forgotPassword, resetPasswordDt)
            .then(function successfulResponse(response) {
                $scope.isFetching = false;

                if (response.data.success == true) {
                    $scope.successfulMessage = true;
                    //redirect after 10s
                     $timeout(function() {
                        $state.go('home');
                     }, 10000);

                } else {
                    $scope.errors = errorsService.handleErrors(response, 'success')
                }
            }, function errorResponse(error) {
                $scope.isFetching = false;
                $scope.errors = errorsService.handleErrors(error, 'error')
            });
    }

}