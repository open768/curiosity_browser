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
var CHKTHUMBS_ID="chkThumbs";

var cOptions = {
	start_image:1,
	sol:null,
	instrument:null
};

//###############################################################
//* JQUERY
//###############################################################
function onLoadJQuery_INDEX(){	

	//show the intro blurb if nothing on the querystring
	if (document.location.search.length == 0)
		$("#intro").show();
	
	//load the tabs and show the first one
	instrumentTabs();
	$("#sol-tab").show();

	//remember the start_image if its there
	if (cBrowser.data[cSpaceBrowser.BEGIN_QUERYSTRING] ){
		cOptions.start_image = parseInt(cBrowser.data[cSpaceBrowser.BEGIN_QUERYSTRING]);
	}
	
	//render the sol instrument chooser widget
	//this widget will kick off the image display thru onSelectSolInstrEvent
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
	
	// load tagcloud
	$("#tags").tagcloud({mission:cMission});
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
	
	if (!isNaN(sText))
		$("#sichooser").solinstrumentChooser("set_sol", sText);
	else{
		var sUrl=cBrowser.buildUrl("php/rest/search.php", {s:sText,m:cMission.ID});
		var oHttp = new cHttp2();
		bean.on(oHttp, "result", search_callback);
		oHttp.fetch_json(sUrl);
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
	var sUrl = cBrowser.buildUrl("detail.php",{s:poOptions.sol,i:poOptions.instrument,p:poOptions.product});
	cBrowser.openWindow(sUrl, "detail");
}

//***************************************************************
function onSelectSolInstrEvent( poEvent, poData){
	stop_queue();	
	//load the data 
	cOptions.sol = poData.sol;
	cOptions.instrument = poData.instrument;
	load_data();
}

//***************************************************************
function onStatusEvent(poEvent, paHash){
	set_status(paHash.data);
}

//***************************************************************
function onThumbClickEvent(poEvent, poData){
	
	stop_queue();
	var sUrl = cBrowser.buildUrl("detail.php",{s:poData.sol,i:poData.instr,p:poData.product});
	cDebug.write("loading page " + sUrl);
	$("#"+ IMAGE_CONTAINER_ID).empty().html("redirecting to: "+ sUrl);
	setTimeout(	
		function(){		cBrowser.openWindow(sUrl, "detail");},
		0
	);
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
	oParams[cSpaceBrowser.SOL_QUERYSTRING] = cOptions.sol;
	if (cOptions.instrument)	oParams[cSpaceBrowser.INSTR_QUERYSTRING] = cOptions.instrument;
	if (is_thumbs_checked())	oParams[cSpaceBrowser.THUMB_QUERYSTRING] = "1";
	if (cOptions.start_image)		oParams[cSpaceBrowser.BEGIN_QUERYSTRING] =cOptions.start_image;
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
		if (cBrowser.data[cSpaceBrowser.THUMB_QUERYSTRING] ){
			oChkThumb.prop('checked', true);
			show_thumbs(cOptions.sol, cOptions.instrument);
		}else
			show_images(cOptions.sol, cOptions.instrument, cOptions.start_image);
		oChkThumb.on("change",onCheckThumbsEvent);
	}else{
		oChkThumb.attr('disabled', "disabled");
		show_thumbs(cOptions.sol, cSpaceBrowser.ALL_INSTRUMENTS);
	}
}


//###############################################################
//* GETTERS
//###############################################################
function show_thumbs(psSol, psInstrument){
	var oWidget, oDiv;
	
	
	var oDiv = $("#"+ IMAGE_CONTAINER_ID);
	oWidget = oDiv.data("ckThumbnailview");
	if ( oWidget){ oWidget.destroy();} //capitalise the first letter of the widget
	
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
	oWidget = oDiv.data("ckImageview");
	if ( oWidget){ oWidget.destroy();}
	
	oWidget = oDiv.imageview({		 // apply widget
		sol:piSol, 
		instrument:psInstr,
		start_image: piStartImage,
		onStatus:onStatusEvent,
		onLoaded:onImagesLoadedEvent,
		onClick: onImageClick,
		mission:cMission
	});
}


//###############################################################
//* call backs 
//###############################################################
function search_callback(poHttp){
	var sUrl;
	
	var oData = poHttp.response;
	if (!oData)
		set_status("not a valid search");
	else{
		set_status("got search callback");
		var sUrl = cBrowser.buildUrl("detail.php" , {s:oData.s,i:oData.d.instrument,p:oData.d.itemName});
		document.location.href = sUrl;
	}
}


