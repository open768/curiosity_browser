//from http://jsfiddle.net/syahrasi/us8uc/

function onTabClick(poEvent){
	cDebug.write("clicked tab");
	event.preventDefault();
	$(this).parent().addClass("current");
    $(this).parent().siblings().removeClass("current");	
	var tab = $(this).attr("href");
    $(".tab-content").not(tab).css("display", "none");
    $(tab).fadeIn();
}

function instrumentTabs(){
	cDebug.write("instrumenting tabs");
    $(".tabs-menu a").click(onTabClick);
}