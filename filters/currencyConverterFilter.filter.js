app.filter('currencyConverterFilter', function(){ 
	return function(item, conversionRate, currency, addSpan, markupPrice){
		//var conversionRate= localStorage.getItem("otlaat.currency_rate");
		//markingup price
		var markedupPrice= parseFloat(item) + parseFloat(item * (markupPrice/100));
		var convertedCurrency= (markedupPrice * conversionRate).toFixed(2);
		//console.log('markedupPrice', markedupPrice);
		//var convertedCurrency= (item * conversionRate).toFixed(2);
		if(currency === 'usd'){
			return '$ ' + convertedCurrency;
		}else{
		    if (addSpan) {
                return '<span class="sar-currency">SAR</span> ' + convertedCurrency;
            } else {
                return 'SAR ' + convertedCurrency;
            }
		}
		
	};
});