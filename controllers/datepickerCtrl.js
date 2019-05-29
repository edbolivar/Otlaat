app.controller('DatepickerPopupCtrl', function ($scope, DateService) {

    $scope.today = function () {
        $scope.dt = new Date();
        $scope.dt2 = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
    };

    $scope.today();

    $scope.changeDate = function () {
        $scope.dt2 = new Date($scope.dt.getTime() + 24 * 60 * 60 * 1000);

        $scope.dateOptions = {
            minDate: $scope.dt,
            startingDay: 1,
            customClass: getDateClass,
        };

    };

    $scope.clear = function () {
        $scope.dt = null;
        $scope.dt2 = null;
    };

    $scope.inlineOptions = {
        customClass: getDateClass,
        minDate: new Date(),
        showWeeks: true
    };

    $scope.dateOptions = {
        //dateDisabled: disabled,
        formatYear: 'yy',
        maxDate: new Date(2017, 6, 20),
        minDate: new Date(),
        startingDay: 1,
        customClass: getDateClass,
    };


    $scope.toggleMin = function () {
        $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
        $scope.dateOptions.minDate = $scope.inlineOptions.minDate;
    };

    // $scope.toggleMin();

    $scope.open1 = function () {
        $scope.dateOptions = {
            minDate: new Date(),
            startingDay: 1,
            customClass: getDateClass,
        };
        $scope.popup1.opened = true;
    };

    $scope.open2 = function () {

        $scope.dateOptions = {
            minDate: $scope.dt,
            startingDay: 1,
            customClass: getDateClass,
        };

        minDate: $scope.dt
        $scope.popup2.opened = true;
    };

    $scope.setDate = function (year, month, day) {
        $scope.dt = new Date(year, month, day);
        $scope.dt2 = new Date(year, month, day);
    };

    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];
    $scope.altInputFormats = ['M!/d!/yyyy'];

    $scope.popup1 = {
        opened: false
    };

    $scope.popup2 = {
        opened: false
    };

    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    var afterTomorrow = new Date();
    afterTomorrow.setDate(tomorrow.getDate() + 1);
    $scope.events = [
        {
            date: tomorrow,
            status: 'full'
        },
        {
            date: afterTomorrow,
            status: 'partially'
        }
    ];

    $scope.getMoment = DateService.getMomentTimestampDate;
    $scope.formatDate = DateService.formatDate;

    function getDateClass(data) {
        var date = $scope.formatDate(data.date),
            startDate = $scope.formatDate($scope.dt),
            endDate = $scope.formatDate($scope.dt2);

        if ($scope.getMoment(date) > $scope.getMoment(startDate)
            && $scope.getMoment(date) < $scope.getMoment(endDate)) {
            return 'in-range';
        }

        if (date === startDate || date === endDate) {
            return 'in-date';
        }

        if (data === $scope.formatDate()) {
            return 'today';
        } else {
            return '';
        }
    }

});