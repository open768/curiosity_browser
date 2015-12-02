/**************************************************************************
Copyright (C) Chicken Katsu 2014 

This code is protected by copyright under the terms of the 
Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License
http://creativecommons.org/licenses/by-nc-nd/4.0/legalcode

For licenses that allow for commercial use please contact cluck@chickenkatsu.co.uk

// USE AT YOUR OWN RISK - NO GUARANTEES OR ANY FORM ARE EITHER EXPRESSED OR IMPLIED
**************************************************************************/


var DEBUG_ON = true;
var loading = true;
var SOLS_LIST = "sol_list";
var SOL_SUMMARY = "sol_summary";
var INSTRUMENT_LIST = "instruments";
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
var IMAGE_QUERYSTRING = "b";
var SOL_DIVISIONS=50;
var THUMB_SIZE=144;

var RADIO_BACK_COLOUR = "gold";
var BODY_COLOUR = "LemonChiffon";
var MISSING_THUMBNAIL_IMAGE = "images/missing.jpg";

var HOW_MANY_IMAGES = 5;
var current_image_index = 0;
var current_sol = null;
var current_instrument = null;
var max_images = -1;
var reload_after_instr = false;
var reset_image_number = true;
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
	
	
	//set up the onchange handler for sols
	$("#"+SOLS_LIST).change( OnChangeSolList);
	$("#"+SOL_SUMMARY).change( OnChangeSolSummaryList);
	$("#"+INSTRUMENT_LIST).change(OnChangeInstrument)
	if (cBrowser.data[THUMB_QUERYSTRING])
		$("#"+sCheckThumbs).prop('checked', true);
	$("#"+sCheckThumbs).change(onChangeThumbs);
	
	//hide things
	$("#nav1").hide();
	$("#nav2").hide();
	$("#solgiga").attr('disabled', "disabled");
	$("#soltag").attr('disabled', "disabled");
	$("#solhigh").attr('disabled', "disabled");
	$("#solnotebook").attr('disabled', "disabled");
	$("#solmap").attr('disabled', "disabled");
	$("#solcalendar").attr('disabled', "disabled");
	$("#solrefresh").attr('disabled', "disabled");
	$("#solsite").attr('disabled', "disabled");
	$("#solprev").attr('disabled', "disabled");
	$("#solnext").attr('disabled', "disabled");
	$("#sollatest").attr('disabled', "disabled");
	$("#solsite").attr('disabled', "disabled");
	$("#allsolthumbs").attr('disabled', "disabled");
	$("#search_text").keypress(onSearchKeypress);
	
	//go and load stuff
	set_status("loading static data...");
	if (cBrowser.data[MAXIMAGES_QUERYSTRING] )
		HOW_MANY_IMAGES = parseInt(cBrowser.data[MAXIMAGES_QUERYSTRING]);
	if (cBrowser.data[IMAGE_QUERYSTRING] ){
		current_image_index = parseInt(cBrowser.data[IMAGE_QUERYSTRING]);
		reset_image_number = false;
	}
		
	cHttp.fetch_json("php/rest/instruments.php", load_instruments_callback);
	cHttp.fetch_json("php/rest/sols.php", load_sols_callback);
	cTagging.getTagNames(tagnames_callback);
}

//###############################################################
//# Event Handlers
//###############################################################
function onClickSolGiga(){
	cBrowser.openWindow("solgigas.php?s=" + current_sol, "solgigas");
}
function onClickSolTag(){
	cBrowser.openWindow("soltag.php?s=" + current_sol, "soltag");
}
function onClickLatestSol(){
	cDebug.write("setting latest sol: ");
	$( "#sol_list :last" ).attr('selected', 'selected').change();

}
function onClickSolHighs(){
	cBrowser.openWindow("solhigh.php?sheet&s=" + current_sol, "solhigh");
}
function onClickAllSolThumbs(){
	current_instrument = null;
	reload_data();
}
function onClickSolSite(){
	cBrowser.openWindow("site.php?sol=" + current_sol , "site");
}

function onSearchKeypress(e){
    if(e.which == 13) onClickSearch();
}




//***************************************************************
function onClickSearch(){
	var sText = $("#search_text").val();
	if (sText == "") return;
	current_instrument = null;
	
	if (!isNaN(sText))
		mark_sol(sText);
	else{
		sUrl="php/rest/search.php?s=" + sText;
		cHttp.fetch_json(sUrl, search_callback);
	}
}

//***************************************************************
function OnChangeSolSummaryList(poEvent){
	mark_sol(poEvent.target.value);
}

//***************************************************************
function OnChangeSolList(poEvent){
	if (loading) return;
	reset_image_number = true;
	set_sol(poEvent.target.value);
}

//***************************************************************
function OnChangeInstrument(poEvent){
	cDebug.write("changing instrument: ");

	reset_image_number = true;
	do_set_instrument(poEvent.target.value);
}

//***************************************************************
function onChangeThumbs(poEvent){
	
	var sURL = 
		cBrowser.pageUrl() + 
			"?s=" +  current_sol + 
			(current_instrument?"&i=" + current_instrument:"") +
			(is_thumbs_checked()? "&" +THUMB_QUERYSTRING + "=1":"");
			
	cBrowser.pushState("Index", sURL);
	reload_data();
}

//***************************************************************
function onClickCalendar(){
	var sUrl;
	
	sUrl = "cal.php?s=" + current_sol;
	cBrowser.openWindow(sUrl, "calendar");
}

//***************************************************************
function onClickNextImage(){
	var iNext;
	
	if (!OKToReload()) return;
	iNext = current_image_index + HOW_MANY_IMAGES;
	if (iNext > max_images) 
		onClickNextSol();
	else
	//go ahead and get the data 
		get_image_data(current_sol, current_instrument,iNext,iNext+HOW_MANY_IMAGES);
}

//***************************************************************
function onClickPreviousImage(){
	var iPrevious;
	
	if (!OKToReload()) return;
	iPrevious = current_image_index - HOW_MANY_IMAGES;
	
	if (iPrevious <= 0 ) {
		if (current_image_index >1)
			iPrevious =1;
		else
			onClickPreviousSol();
	}else
		//go ahead and get the data 
		get_image_data(current_sol, current_instrument,iPrevious,iPrevious+HOW_MANY_IMAGES-1);
}

//***************************************************************
function onClickPreviousSol(){
	var oItem, oPrev;
	oItem = $('#sol_list option:selected');
	if (oItem.length == 0)	{
		set_error_status("select a Sol");
		return true;
	}

	oPrev = oItem.prev('option')
	if (oPrev.attr("disabled")=="disabled")
		oPrev = oPrev.prev('option');
		
	if (oPrev.length>0){
		oPrev.attr('selected', 'selected');
		oPrev.change();
	}
}

//***************************************************************
function onClickNextSol(){	
	var oItem, oNext;
	oItem = $('#sol_list option:selected');
	if (oItem.length == 0)	{
		set_error_status("select a Sol");
		return true;
	}
	
	oNext = oItem.next('option')
	if (oNext.attr("disabled")=="disabled")
		oNext = oNext.next('option');
		
	if (oNext.length>0){
		oNext.attr('selected', 'selected');
		oNext.change();
	}

	return false;
}

//***************************************************************
function onClickMslNotebook(){
	var sUrl;
	
	sUrl = "https://an.rsl.wustl.edu/msl/mslbrowser/br2.aspx?tab=solsumm&sol=" + current_sol;
	window.open(sUrl, "date");
}

//***************************************************************
function onClickMslNotebookMap(){
	var sUrl;
	
	sUrl = "https://an.rsl.wustl.edu/msl/mslbrowser/tab.aspx?t=mp&i=A&it=MT&ii=SOL," + current_sol;
	window.open(sUrl, "map");
}

//***************************************************************
function onClickRefresh(){
	if (!current_sol){ 	
		set_error_status("NO Sol Selected...");
		return false;
	}
	
	get_sol_instruments(current_sol,true);
}


//###############################################################
//# keypress functions 
//###############################################################
function setup_keypress(){
	if (this.keypress) return;
	this.keypress=true;
	
	//catch key presses but not on text inputs
	$(window).keypress(onKeyPress);
	$(":input").each(function(index,oObj){
		if ($(oObj).attr("type")==="text"){
			$(oObj).focus(onInputFocus);
			$(oObj).blur(onInputDefocus);
		}
	});
}

function onKeyPress(poEvent){
	var sChar = String.fromCharCode(poEvent.which);
	switch(sChar){
		case "[": onClickPreviousSol();break;
		case "]": onClickNextSol();break;
		case "n": onClickNextImage();break;
		case "p": onClickPreviousImage();break;
	}	
}

function onInputFocus(){
	$(window).unbind("keypress");
}

function onInputDefocus(){
	$(window).keypress(onKeyPress);
}


//###############################################################
//# Utility functions 
//###############################################################
function set_instrument(psInstr){
	//hide the navigation
	$("#nav1").hide();
	$("#nav2").hide();

	$("#"+ INSTRUMENT_LIST +" option[value='" + psInstr + "']").attr("selected", true);
	do_set_instrument(psInstr);
}

//***************************************************************
function do_set_instrument(psInstr){
	cDebug.write("setting instrument: " + psInstr);
	current_instrument = psInstr;
	reload_data();
}

//***************************************************************
function mark_sol(psSol){
	var oOption;
	
	oOption = $("#"+SOLS_LIST + " option[value="+psSol+"]");
	if ((oOption.length > 0) && (oOption.attr("disabled")!=="disabled")){
		$("#"+SOLS_LIST + " option[value="+psSol+"]").attr("selected", true);
		reload_after_instr = true;
		set_sol(psSol);
	}else{
		set_error_status("No such SOL...");
	}
}

//***************************************************************
function set_sol(psSol){

	cDebug.write("setting sol: " + psSol);
	$("#"+IMAGE_CONTAINER_ID).html("<span class='subtitle'>to see images for sol " + psSol + " - select an instrument</span>");
	current_sol = psSol;
	$("#"+SOL_ID).html(current_sol);
	
	// update the content in the address bar
	sUrl = cBrowser.pageUrl() +"?s=" + psSol ;
	if (current_instrument ) 
		sUrl += "&" + INSTR_QUERYSTRING + "=" + current_instrument;
	if (cBrowser.data[THUMB_QUERYSTRING])
		sUrl += "&" + THUMB_QUERYSTRING + "=1";
	
	cBrowser.pushState("Index", sUrl);
	
	$("#nav1").hide();
	$("#nav2").hide();

	$("#solnotebook").removeAttr('disabled');
	$("#solmap").removeAttr('disabled');
	$("#solcalendar").removeAttr('disabled');
	$("#solnext").removeAttr('disabled');
	$("#solprev").removeAttr('disabled');
	$("#solrefresh").removeAttr('disabled');
	$("#solsite").removeAttr('disabled');
	$("#solsite").removeAttr('disabled');
	$("#allsolthumbs").removeAttr('disabled');

	get_sol_instruments(current_sol,false);	//this reloads the data
	get_sol_tag_count(current_sol);
	get_sol_hilite_count(current_sol);
	
	$("#solgiga").attr('disabled', "disabled");
	get_gigapans(current_sol);
}


//***************************************************************
function OKToReload(){
	//mutex
	if (loading){
		set_status("allready loading data");
		return false;
	}
	
	// TODO Validate that a list item and instrument are selected
	// otherwise do nothing
	if (!current_sol){ 	
		set_error_status("NO Sol Selected...");
		return false;
	}
	
	return true;
}

function is_thumbs_checked(){
	return $("#"+sCheckThumbs).is(':checked');
}

//***************************************************************
function reload_data(){
	var sUrl;
	
	if (!OKToReload()) return;

	if (!current_instrument)
		get_sol_thumbs(current_sol, sAllInstruments);
	else if (is_thumbs_checked())
		get_sol_thumbs(current_sol, current_instrument);
	else{
		//go ahead and get the data starting at position 0
		if (reset_image_number)
			get_image_data(current_sol, current_instrument,1,HOW_MANY_IMAGES);
		else
			get_image_data(current_sol, current_instrument,current_image_index,current_image_index+HOW_MANY_IMAGES-1);		
	}
}

//###############################################################
//* GETTERS
//###############################################################
function get_sol_thumbs(psSol, psInstrument){
	var sUrl;
	
	sUrl = "php/rest/solthumbs.php?s=" + psSol + "&i=" + psInstrument;
	cHttp.fetch_json(sUrl, load_thumbs_callback);
}

//***************************************************************
function get_sol_instruments(psSol, pbRefresh){
	set_status("getting instruments for sol" + psSol);

	//hide instruments jQUERY 
	$("#"+ INSTRUMENT_LIST  + " option").each(
		function (pIndex, pObj){ $(pObj).attr({disabled:"disabled"})}
	);
	
	//get the instruments for this sol
	$("#instr_load").show();
	sUrl = "php/rest/instruments.php?s=" + psSol + "&r=" + pbRefresh;
	cHttp.fetch_json(sUrl, get_sol_instruments_callback);
}

//***************************************************************
function get_image_data( piSol, psInstr, piStart, piEnd){
	var sUrl;
	
	// update the content in the address bar
	sUrl = cBrowser.pageUrl() +"?s=" + current_sol 
	if (current_instrument)
		sUrl +="&i=" + current_instrument +"&b=" + piStart;
	if (cBrowser.data[THUMB_QUERYSTRING])
		sUrl += "&" + THUMB_QUERYSTRING +"=1";
		
	cBrowser.pushState("Index", sUrl);
	
	//clear out the image data
	$("#"+IMAGE_CONTAINER_ID).html("<p class='subtitle'>loading images");
	
	// load the image data
	loading=true;
	sUrl = "php/rest/images.php?s=" + piSol + "&i=" + psInstr +"&b=" + piStart + "&e=" + piEnd;
	set_status("fetching image data...");
	cHttp.fetch_json(sUrl, load_images_callback);
}

//***************************************************************
function get_gigapans(psSol){
	cHttp.fetch_json("php/rest/gigapans.php?o=sol&s=" + psSol, gigapans_callback);
}

//***************************************************************
function get_sol_tag_count(psSol){
	var sUrl;
	set_status("fetching tagcount");
	sUrl = "php/rest/tag.php?s=" + psSol + "&o=solcount";
	cHttp.fetch_json(sUrl, tagcount_callback);
}

//***************************************************************
function get_sol_hilite_count(psSol){
	var sUrl;
	set_status("fetching hilite count");
	sUrl = "php/rest/img_highlight.php?s=" + psSol + "&o=solcount";
	cHttp.fetch_json(sUrl, solhighcount_callback);
}

//###############################################################
//* call backs 
//###############################################################
function gigapans_callback(paJS){
	if (paJS == null) return;
	$("#solgiga").removeAttr('disabled');
}

function solhighcount_callback(piJS){
	//RETURNS ALL THE TAGS
	if (piJS > 0)
		$("#solhigh").removeAttr('disabled');
	else
		$("#solhigh").attr('disabled', "disabled");
}

//***************************************************************
function tagcount_callback(piJS){
	//RETURNS ALL THE TAGS
	if (piJS > 0)
		$("#soltag").removeAttr('disabled');
	else
		$("#soltag").attr('disabled', "disabled");
}

//***************************************************************
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

//***************************************************************
function load_sols_callback(paJS){
	var iIndex, oSol, oList, oSumList, oOption, iSol, iLastRange, iRange, iDivision, iDivision2;

	cDebug.write("got sols callback");
	
	
	oList = $("#"+SOLS_LIST);
	oList.empty();
	oSumList = $("#"+SOL_SUMMARY);
	oSumList.empty();
	iLastRange = -1;
	
	
	for (iIndex = 0; iIndex < paJS.length; iIndex++){
		oSol = paJS[iIndex];
		iSol = parseInt(oSol.sol);
		iRange = Math.floor(iSol/SOL_DIVISIONS);
		
		if (iRange != iLastRange){
			oOption = $("<option>").attr({value:iSol}).html(oSol.sol + " to ...");
			oSumList.append(oOption);
			
			oOption = $("<option>").attr({value:"NaN",disabled:"disabled"}).html("-- " + oSol.sol + " --");
			oList.append(oOption);
			iLastRange = iRange;
		}

		oOption = $("<option>").attr({value:oSol.sol}).html(oSol.sol);
		oList.append(oOption);
	}
	
	//enable latest button
	$("#sollatest").removeAttr('disabled');
	
	// mark the sol
	if (cBrowser.data[SOL_QUERYSTRING] ) 
		mark_sol(cBrowser.data[SOL_QUERYSTRING]);
	
}

//***************************************************************
function load_thumbs_callback(poJS){
	var oDiv, i, oItem, aData, sURL, sID;
	
	set_status("loading thumbnails");

	cImgQueue.clear();
	bean.off(cImgQueue);
	
	$("#nav1").hide();
	$("#nav2").hide();
	oDiv = $("#"+ IMAGE_CONTAINER_ID);
	oDiv.empty();
	
	aData = poJS.d.data;
	if (aData.Length == 0)
		oDiv.append("<p class='subtitle'>Sorry no thumbnails found</p>");
	else{
		var sTarget = ( SINGLE_WINDOW ? "" : "detail");
		for (i=0; i< aData.length; i++){
			oItem = aData[i];
			
			oImg = $("<IMG>").attr({title:oItem.p,border:0,height:THUMB_SIZE,src:oItem.i,class:"polaroid-frame"});
			//TODO show a placeholder image in a different SPAN that is hidden when proper image loads
			
			sURL = "detail.php?s=" + poJS.s + "&i=" + oItem.data.instrument +"&p=" +oItem.p;
			oA = $("<A>").attr({href:sURL,target:sTarget,id:oItem.p,}).append(oImg);
			oDiv.append(oA);
			
			// add to the image thumbnail queue
			cImgQueue.add(poJS.s,oItem.data.instrument,oItem.p);
		}
		
		//start the image thumbnail queue
		bean.on(cImgQueue, "thumbnail", thumbnail_callback);
		cImgQueue.start();
	}
	
	set_status("done thumbnails");
}

//***************************************************************
function load_instruments_callback(paJS){
	var iIndex, oInstr, oList, sID;
	
	$("#instr_load").hide();
	oList = $("#"+INSTRUMENT_LIST);
	oList.empty();
	
	oList.append( $("<option>").attr({value:"",disabled:"disabled"}).html("Select an Instrument..."));
	
	for (iIndex = 0; iIndex < paJS.length; iIndex++){
		oInstr = paJS[iIndex];
		sID= INSTRUMENT_LIST + oInstr.name;
		oList.append( $("<option>").attr({value:oInstr.name,disabled:"disabled",ID:sID}).html(oInstr.caption));
	}
	loading=false;
	set_status("ready");

	//click the buttons if stuff was passed in the query string
	if (cBrowser.data[INSTR_QUERYSTRING] ) 
		set_instrument(cBrowser.data[INSTR_QUERYSTRING]);

}

//***************************************************************
function load_images_callback(paJS){
	var oDiv, sHTML, iIndex, oItem;
	
	max_images = 0;
	
	if (reset_image_number)
		current_image_index = -1;
	
	//clear out the image div
	$("#"+IMAGE_CONTAINER_ID).empty();
		
	//build the html to put into the div
	if (paJS.max == 0)
		$("#"+IMAGE_CONTAINER_ID).html("No instrument data found");
	else{
		//enable thumbnails
		$("#solthumbs").removeAttr('disabled');
		
		//update title
		document.title = "Index - s:" + current_sol + " i:" + current_instrument + "(curiosity browser)";
		
		// update the maximum display
		max_images = parseInt(paJS.max);
		$("#"+MAX_ID).html(max_images);
		$("#"+MAX_ID2).html(max_images);
		
		current_image_index = parseInt(paJS.start);
		$("#"+CURRENT_ID).html(current_image_index);
		$("#"+CURRENT_ID2).html(current_image_index);
		
		sHTML = "";
		var oOuterDiv = $("#"+IMAGE_CONTAINER_ID);
		for (iIndex = 0; iIndex < paJS.images.length; iIndex++){
			var oDiv, oImgDiv, oA, oImg;
			
			// get the img details
			oItem = paJS.images[iIndex];
			sImgURL = "detail.php?s="+ current_sol + "&i=" + current_instrument + "&p=" + oItem.p;
			
			//build up the div
			oDiv = $("<DIV>");
			
			//build up the image div
			oImgDiv = $("<DIV>").attr({id:oItem.p});
			oImgDiv.css({position: 'relative'});

			if (SINGLE_WINDOW)
				oA= $("<A>").attr({href:sImgURL});
			else
				oA= $("<A>").attr({target:"detail", href:sImgURL});
				
			oImg = $("<IMG>").attr({src:oItem.i}); 
			
			oA.append(oImg);
			oImgDiv.append(oA);	
			
			//add the lot to the new div
			oDiv.append(oImgDiv);
			oDiv.append($("<SPAN>").attr({class:"subtitle"}).html("Date:"));
			oDiv.append(" " +oItem.du +" ");
			oDiv.append($("<SPAN>").attr({class:"subtitle"}).html("Product:"));
			oDiv.append(" " +oItem.p );
			oDiv.append(" <span class='subtitle'>Tags:</span> <span id='T"+oItem.p+"' class='soltags'>Loading ...</span>");
			oDiv.append("<HR>");
			
			//add new div to uber div
			oOuterDiv.append(oDiv);
			
			//get the image and tag highlights
			cImgHilite.getHighlights(current_sol,current_instrument,oItem.p, highlight_callback);
			cTagging.getTags(current_sol,current_instrument,oItem.p, tag_callback);
			
			//unhide the navigation controls
			$("#nav1").show();
			$("#nav2").show();
			setup_keypress();
		}
	}
	
	loading=false;
	set_status("ready");
}

// ***************************************************************
function tag_callback(paJS){
	var oDiv, sHTML, sTag, i;
	
	oDiv = $("#T" + paJS.p);
	oDiv.empty();
	
	if (paJS.d.length== 0) {
		oDiv.html( "no Tags");
		return;
	}

	//put in the tags
	sHTML = "";
	for (i=0; i<paJS.d.length; i++){
		sTag = paJS.d[i];
		var sTarget = ( SINGLE_WINDOW ? "" : "target='tags'");
		sHTML += "<a " + sTarget +" href='tag.php?t=" + sTag + "'>#" + sTag + "</a> ";
	}
	oDiv.html( sHTML);
	
}

// ***************************************************************
function get_sol_instruments_callback(paJS){
	var instr_idx, sInstr, oSelect;

	set_status("got instruments");
	$("#instr_load").hide();
	oSelect = $("#" + INSTRUMENT_LIST);
	
	//mark the instruments remaining
	for ( instr_idx = 0; instr_idx<paJS.length; instr_idx++){
		
		sInstr = paJS[instr_idx];
		oSelect.find('option[value=\"'+ sInstr + '\"]').removeAttr('disabled');
	}
	
	reload_data();
	set_status("ready");
}

// ***************************************************************
function highlight_callback(paJS){
	var i, oDiv, oImg, oRedBox, iLeft, iTop, iPos;
	
	if (!paJS.d) return;
	oDiv = $("#"+paJS.p);
	
	for (i=0; i<paJS.d.length; i++){
		aItem = paJS.d[i];
		
		//create a redbox and display it
		oRedBox = $("<DIV>").attr({class:"redbox"});
		oDiv.append(oRedBox);
		
		//place it relative to the parent location
		iTop = parseInt(aItem.t);
		iLeft = parseInt(aItem.l);
		oRedBox.css({position: 'absolute',	top: iTop,	left: iLeft})
	}
}

// ***************************************************************
function thumbnail_callback(poJS){
	var oParent, oImg;

	cDebug.write("callback " + poJS.p);
	oParent = $("#" + poJS.p);
	if (!poJS.u) poJS.u = MISSING_THUMBNAIL_IMAGE;

	oImg = $("<IMG>").attr({title:poJS.p,src:poJS.u,class:"polaroid-frame"});
	oParent.empty().append(oImg);
}
