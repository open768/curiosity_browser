/****************************************************************************
Copyright (C) Chicken Katsu 2016 www.chickenkatsu.co.uk

This code is protected by copyright under the terms of the 
Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License
http://creativecommons.org/licenses/by-nc-nd/4.0/legalcode

For licenses that allow for commercial use please contact cluck@chickenkatsu.co.uk

// USE AT YOUR OWN RISK - NO GUARANTEES OR ANY FORM ARE EITHER EXPRESSED OR IMPLIED
**************************************************************************/


var DEBUG_ON = true;
var loading = true;
var MAX_ID="max";
var MAX_ID2="max2";
var CURRENT_ID = "current";
var CURRENT_ID2 = "current2";
var IMAGE_CONTAINER_ID="images";
var SOL_ID = "this_sol";
var SOL_QUERYSTRING = "s";
var INSTR_QUERYSTRING = "i";
var THUMB_QUERYSTRING = "t";
var MAXIMAGES_QUERYSTRING = "m";
var BEGIN_QUERYSTRING = "b";
var SOL_DIVISIONS=50;

var RADIO_BACK_COLOUR = "gold";
var BODY_COLOUR = "LemonChiffon";

var gi_current_img_idx = 0;
var gi_current_sol = null;
var gs_current_instrument = null;
var sAllInstruments = "All";
var sCheckThumbs = "chkThumbs";

//###############################################################
//* JQUERY
//###############################################################
bean.on(cJQueryObj, "OnJqueryLoad", onLoadJQuery_INDEX);
function onLoadJQuery_INDEX(){	

	//show the intro blurb if nothing on the querystring
	if (document.location.search.length == 0)
		$("#intro").show();
	
	//load the tabs and show the first one
	instrumentTabs();
	$("#sol-tab").show();

	//render the sol instrument chooser widget
	$("#sichooser").solinstrumentChooser({
		onStatus:onStatusEvent,
		onSelect:onSelectSolInstrEvent,
		mission:cMission
	});
	
	//render the solbuttons
	$("#solButtons").solButtons({
		onStatus:onStatusEvent,
		mission:cMission,
		onClick:stop_queue,
		onAllSolThumbs:onClickAllSolThumbs
	});
	
	//set up the onchange handler for sols
	if (cBrowser.data[THUMB_QUERYSTRING] != null)
		$("#"+sCheckThumbs).prop('checked', true);
	$("#"+sCheckThumbs).change(onChangeThumbs);
	
	//hide things
	$("#search_text").keypress(onSearchKeypress);
	
	//go and load stuff
	set_status("loading static data...");
	if (cBrowser.data[BEGIN_QUERYSTRING] ){
		gi_current_img_idx = parseInt(cBrowser.data[BEGIN_QUERYSTRING]);
	}
		
	cTagging.getTagNames(tagnames_callback);
}

//###############################################################
//# Event Handlers
//###############################################################
function onClickAllSolThumbs(){
	stop_queue();
	gs_current_instrument = null;
	gi_current_img_idx = -1;
	$("#chkThumbs").prop("checked", true);
	$("#chkThumbs").attr('disabled', "disabled");
	reload_data();
}

function onSearchKeypress(e){
	stop_queue();
    if(e.which == 13) onClickSearch();
}

//***************************************************************
function onClickSearch(){
	stop_queue();
	var sText = $("#search_text").val();
	if (sText == "") return;
	gs_current_instrument = null;
	
	if (!isNaN(sText)){
		select_sol(sText);		//numeric search is a sol
	}else{
		var sUrl=cBrowser.buildUrl("php/rest/search.php", {s:sText});
		cHttp.fetch_json(sUrl, search_callback);
	}
}

//***************************************************************
function onChangeThumbs(poEvent){
	stop_queue();
	reload_data();
}



//***************************************************************
function onImageClick(poEvent, poOptions){
	stop_queue();
	var sURL = cBrowser.buildUrl("detail.php",{s:poOptions.sol,i:poOptions.instrument,p:poOptions.product});
	cBrowser.openWindow(sURL, "detail");
}


//###############################################################
//# Utility functions 
//###############################################################
function update_url(){
	var sUrl = cBrowser.pageUrl() + 
			"?s=" +  gi_current_sol + 
			(gs_current_instrument?"&i=" + gs_current_instrument:"") +
			(is_thumbs_checked()? "&" +THUMB_QUERYSTRING + "=1":"") +
			(gi_current_img_idx>1? "&" + BEGIN_QUERYSTRING +"=" + gi_current_img_idx:"");
	cBrowser.pushState("Index", sUrl);
}

function stop_queue(){
	var oDiv;
	try{
		oDiv = $("#"+ IMAGE_CONTAINER_ID);
		oDiv.thumbnailview("stop_queue");
	}
	catch (e){}
	window.stop();
}

function onSelectSolInstrEvent( poEvent, poData){
	cDebug.write("selecting sol:"+poData.sol + " instr:" + poData.instrument);
	stop_queue();
	
	gi_current_sol = poData.sol;
	gs_current_instrument = poData.instrument;
	reload_data();
}

function is_thumbs_checked(){
	return $("#"+sCheckThumbs).is(':checked');
}

//***************************************************************
function reload_data(){
	update_url();
	
	$("#solButtons").solButtons("set_sol", gi_current_sol);
	
	if (gs_current_instrument){
		if (is_thumbs_checked())
			show_thumbs(gi_current_sol, gs_current_instrument);
		else
			show_images(gi_current_sol, gs_current_instrument,1);
	}else
		show_thumbs(gi_current_sol, sAllInstruments);
}

//###############################################################
//* EVENTS
//###############################################################
function onStatusEvent(poEvent, paHash){
	set_status(paHash.text);
}

function onThumbClick(poEvent, poData){
	stop_queue();
	var sURL = "detail.php?s=" + poData.sol + "&i=" + poData.instr +"&p=" + poData.product;
	cBrowser.openWindow(sURL, "detail");
}

function onImagesLoadedEvent(poEvent, piStartImage){
	//enable thumbnails
	$("#solthumbs").removeAttr('disabled');	
	gi_current_img_idx = piStartImage;
	update_url();
}

//###############################################################
//* GETTERS
//###############################################################
function show_thumbs(psSol, psInstrument){
	var oWidget, oDiv;
	
	
	var oDiv = $("#"+ IMAGE_CONTAINER_ID);
	oWidget = oDiv.data("chickenkatsuThumbnailview");
	if ( oWidget){ oWidget.destroy();}
	
	oWidget = oDiv.thumbnailview({		 // apply widget
		sol:psSol, 
		instrument:psInstrument,
		onStatus:onStatusEvent,
		onClick: onThumbClick,
		mission:cMission
	});
}

//***************************************************************
function show_images( piSol, psInstr, piStartImage){
	var sUrl;
	
	var oWidget, oDiv;
	
	var oDiv = $("#"+ IMAGE_CONTAINER_ID);
	oWidget = oDiv.data("chickenkatsuImageview");
	if ( oWidget){ oWidget.destroy();}
	
	oWidget = oDiv.imageview({		 // apply widget
		sol:piSol, 
		instrument:psInstr,
		start: piStartImage,
		onStatus:onStatusEvent,
		onLoaded:onImagesLoadedEvent,
		onClick: onImageClick,
		mission:cMission
	});
}


//###############################################################
//* call backs 
//###############################################################
function search_callback(poJS){
	var sUrl;
	
	if (!poJS)
		set_status("not a valid search");
	else{
		set_status("got search callback");
		sUrl = "detail.php?s=" + poJS.s + "&i=" + poJS.d.instrument + "&p=" + poJS.d.itemName;
		document.location.href = sUrl;
	}
}

//***************************************************************
function tagnames_callback(poJs){
	set_status("got tag names");
	cTagging.showTagCloud("tags",poJs);
}


