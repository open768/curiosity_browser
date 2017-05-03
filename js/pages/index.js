/****************************************************************************
Copyright (C) Chicken Katsu 2016 www.chickenkatsu.co.uk

This code is protected by copyright under the terms of the 
Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License
http://creativecommons.org/licenses/by-nc-nd/4.0/legalcode

For licenses that allow for commercial use please contact cluck@chickenkatsu.co.uk

// USE AT YOUR OWN RISK - NO GUARANTEES OR ANY FORM ARE EITHER EXPRESSED OR IMPLIED
**************************************************************************/


var DEBUG_ON = true;
var IMAGE_CONTAINER_ID="images";
var SOL_QUERYSTRING = "s";
var INSTR_QUERYSTRING = "i";
var THUMB_QUERYSTRING = "t";
var BEGIN_QUERYSTRING = "b";
var ALL_INSTRUMENTS="All";
var CHKTHUMBS_ID="chkThumbs";

var cOptions = {
	start_image:0,
	sol:null,
	instrument:null
};

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
	
	//disable thumbs checkbox until something happens
	$("#"+CHKTHUMBS_ID).attr('disabled', "disabled");
	
	//set up keypress monitor
	$("#search_text").keypress(onSearchKeypress);
	
	//go and load stuff
	if (cBrowser.data[BEGIN_QUERYSTRING] ){
		cOptions.start_image = parseInt(cBrowser.data[BEGIN_QUERYSTRING]);
	}
		
	cTagging.getTagNames(tagnames_callback);
}

//###############################################################
//# Event Handlers
//###############################################################
function onClickAllSolThumbs(){
	stop_queue();
	cOptions.instrument = null;
	cOptions.start_image = -1;
	$("#"+CHKTHUMBS_ID).prop("checked", true).attr('disabled', "disabled");
	$("#sichooser").solinstrumentChooser("deselectInstrument");
	load_data();
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
	cOptions.instrument = null;
	
	if (!isNaN(sText)){
		select_sol(sText);		//numeric search is a sol
	}else{
		var sUrl=cBrowser.buildUrl("php/rest/search.php", {s:sText});
		cHttp.fetch_json(sUrl, search_callback);
	}
}

//***************************************************************
function onCheckThumbsEvent(poEvent){
	stop_queue();
	load_data();
}

//***************************************************************
function onImageClick(poEvent, poOptions){
	stop_queue();
	var sURL = cBrowser.buildUrl("detail.php",{s:poOptions.sol,i:poOptions.instrument,p:poOptions.product});
	cBrowser.openWindow(sURL, "detail");
}

//***************************************************************
function onSelectSolInstrEvent( poEvent, poData){
	stop_queue();	
	// enable the thumbs checkbox
	
	//load the data 
	cOptions.sol = poData.sol;
	cOptions.instrument = poData.instrument;
	load_data();
}

//***************************************************************
function onStatusEvent(poEvent, paHash){
	set_status(paHash.text);
}

//***************************************************************
function onThumbClickEvent(poEvent, poData){
	stop_queue();
	var sURL = "detail.php?s=" + poData.sol + "&i=" + poData.instr +"&p=" + poData.product;
	cBrowser.openWindow(sURL, "detail");
}

//***************************************************************
function onImagesLoadedEvent(poEvent, piStartImage){
	//enable thumbnails
	$("#solthumbs").removeAttr('disabled');	
	cOptions.start_image = piStartImage;
	update_url();
}

//###############################################################
//# Utility functions 
//###############################################################
function update_url(){
	var oParams = {}
	oParams["s"] = cOptions.sol;
	if (cOptions.instrument)	oParams["i"] = cOptions.instrument;
	if (is_thumbs_checked())	oParams[THUMB_QUERYSTRING] = "1";
	if (cOptions.start_image)		oParams[BEGIN_QUERYSTRING] =cOptions.start_image;
	var sUrl = cBrowser.buildUrl(cBrowser.pageUrl() , oParams);
	cBrowser.pushState("Index", sUrl);
}

//***************************************************************
function stop_queue(){
	var oDiv;
	try{
		oDiv = $("#"+ IMAGE_CONTAINER_ID);
		oDiv.thumbnailview("stop_queue");
	}
	catch (e){}
	window.stop();
}

//***************************************************************
function is_thumbs_checked(){
	return $("#"+CHKTHUMBS_ID).is(':checked');
}

//***************************************************************
function load_data(){
	var oChkThumb;
	update_url();
	
	$("#solButtons").solButtons("set_sol", cOptions.sol);
	cDebug.write("selecting sol:"+cOptions.sol + " instr:" + cOptions.instrument);
	oChkThumb = $("#"+CHKTHUMBS_ID);
	
	if (cOptions.instrument){
		oChkThumb.removeAttr("disabled");
		oChkThumb.off("change");
		if (cBrowser.data[THUMB_QUERYSTRING] ){
			oChkThumb.prop('checked', true);
			show_thumbs(cOptions.sol, cOptions.instrument);
		}else
			show_images(cOptions.sol, cOptions.instrument,1);
		oChkThumb.on("change",onCheckThumbsEvent);
	}else{
		oChkThumb.attr('disabled', "disabled");
		show_thumbs(cOptions.sol, ALL_INSTRUMENTS);
	}
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
		onClick: onThumbClickEvent,
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


