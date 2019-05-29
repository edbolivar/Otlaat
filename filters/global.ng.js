app.filter('to_trusted', ['$sce', function ($sce) {
        return function (text) {
            return $sce.trustAsHtml(text);
        };
    }])
    .filter('trusted_url', ['$sce', ($sce) => {
        return (url) => {
            return $sce.trustAsResourceUrl(url);
        };
    }]);
