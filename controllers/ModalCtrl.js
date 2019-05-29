app.controller('ModalCtrl', function ($uibModal, $log, $document, $scope, registerModalService, loginModalService, $rootScope, $state) {
    var $ctrl = this;
    $ctrl.items = [];
    $ctrl.animationsEnabled = true;

    $ctrl.openRegisterModal = openRegisterModal;
    $ctrl.openLoginModal = openLoginModal;
    $ctrl.goToUserProfile = goToUserProfile;
    $ctrl.closeMobileSidebar = closeMobileSidebar;

    $rootScope.openLoginModal = openLoginModal;

    function openRegisterModal(size, parentSelector) {
        registerModalService
            .open(size, parentSelector, $ctrl.animationsEnabled, $ctrl.items)
            .then(function (selectedItem) {
                $ctrl.selected = selectedItem;
            });
    }

    function openLoginModal(size, parentSelector) {
        loginModalService
            .open(size, parentSelector, $ctrl.animationsEnabled, $ctrl.items)
            .then(function (selectedItem) {
                $ctrl.selected = selectedItem;
            });
    }

    function goToUserProfile() {
        $state.go('profile.user-profile');
        closeMobileSidebar();
    }

    function closeMobileSidebar() {
        $("#mask").fadeOut();
        document.getElementById("sidenavWrapper").style.left = "-80%";
    }


});

// Please note that $uibModalInstance represents a modal window (instance) dependency.
// It is not the same as the $uibModal service used above.
app.controller('ModalInstanceCtrl', function ($uibModalInstance, items) {
    var $ctrl = this;
    $ctrl.items = items;
    $ctrl.selected = {
        item: $ctrl.items[0]
    };

    $ctrl.ok = function () {
        $uibModalInstance.close($ctrl.selected.item);
    };

    $ctrl.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});

// Please note that the close and dismiss bindings are from $uibModalInstance.

app.component('modalComponent', {
    templateUrl: 'myModalContent.html',
    bindings: {
        resolve: '<',
        close: '&',
        dismiss: '&'
    },
    controller: function () {
        var $ctrl = this;

        $ctrl.$onInit = function () {
            $ctrl.items = $ctrl.resolve.items;
            $ctrl.selected = {
                item: $ctrl.items[0]
            };
        };

        $ctrl.ok = function () {
            $ctrl.close({$value: $ctrl.selected.item});
        };

        $ctrl.cancel = function () {
            $ctrl.dismiss({$value: 'cancel'});
        };
    }
});


app.controller("translateController", ["$scope", "$translate", '$rootScope', 'languageService',
    function ($scope, $translate, $rootScope, languageService) {
        $scope.changeLanguage = languageService.setLanguage;
    }]);

app.controller("SideBarLoginCtrl", ["$scope", "$translate", function ($scope, $translate) {
    $scope.language = function (lang) {
        $translate.use(lang);

        var el = document.getElementById("style1");

        if (lang == "ar") {
            el.href = "css/bootstrap-rtl.css";
        }
        else {
            el.href = "css/bootstrap.css";
        }
    }

}]);


