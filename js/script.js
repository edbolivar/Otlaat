function gotop(){
    $('html, body').animate({scrollTop : 0},800);
    return false;
  };




document.addEventListener("click", login);

function login() {
	
	//$(this).toggleClass("loginBox");
}


// Hidden By Igor
/*
setTimeout(function(){
	$("div:nth-child(1) > div.HoteListWrapper").addClass("hotelListHighlighBorder");
	$("div:nth-child(1) > div.HoteListWrapper > div.col-md-8.offset-0 > div > div.labelleft2 > span.hotelListHotDeal").html("Hot Deal");
	$("div:nth-child(1) > div.HoteListWrapper > div.col-md-8.offset-0 > div > div.labelleft2 > span.hotelListHotDeal").css('display','inline-block');
}, 300);

*/
