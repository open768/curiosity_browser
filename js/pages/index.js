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
var INSTRUMENT_DIV = "instruments";
var INSTRUMENT_RADIO = "IR";
var MAX_ID="max";
var MAX_ID2="max2";
var CURRENT_ID = "current";
var CURRENT_ID2 = "current2";
var IMAGE_ID="images";
var SOL_ID = "this_sol";
var SOL_QUERYSTRING = "s";
var INSTR_QUERYSTRING = "i";
var MAXIMAGES_QUERYSTRING = "m";
var IMAGE_QUERYSTRING = "b";

var RADIO_BACK_COLOUR = "gold";
var BODY_COLOUR = "LemonChiffon";

var HOW_MANY_IMAGES = 5;
var current_image_index = 0;
var current_sol = null;
var current_instrument = null;
var max_images = -1;
var reload_after_instr = false;
var reset_image_number = true;

//###############################################################
//* JQUERY
//###############################################################
function onloadJQuery(){	
	//set up the onchange handler for sols
	$("#sol_list").change( OnChangeSolList);
	
	//hide things
	$("#nav1").hide();
	$("#nav2").hide();
	
	//go and load stuff
	set_status("loading static data...");
	if (cBrowser.data[MAXIMAGES_QUERYSTRING] )
		HOW_MANY_IMAGES = parseInt(cBrowser.data[MAXIMAGES_QUERYSTRING]);
	if (cBrowser.data[IMAGE_QUERYSTRING] ){
		current_image_index = cBrowser.data[IMAGE_QUERYSTRING];
		reset_image_number = false;
	}
		
	cHttp.fetch_json("php/rest/instruments.php", load_instruments_callback);
	cHttp.fetch_json("php/rest/sols.php", load_sols_callback);
	cTagging.getTagNames(tagnames_callback);
}

//###############################################################
//# Event Handlers
//###############################################################
function onClickSearch(){
	var sText = $("#search_text").val();
	if (sText !== ""){
		sUrl="php/rest/search.php?s=" + sText;
		cHttp.fetch_json(sUrl, search_callback);
	}
}

//***************************************************************
function OnChangeSolList(poEvent){
	if (loading) return;
	reset_image_number = true;
	set_sol(poEvent.target.value);
}

//***************************************************************
function OnChangeInstrument(poEvent){
	reset_image_number = true;
	do_set_instrument(poEvent.target.value);
}

//***************************************************************
function onClickCalendar(){
	var sURL;
	
	sURL = "cal.html?s=" + current_sol ;
	window.open(sURL, "calendar");
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
	if (oPrev.length>0){
		oPrev.attr('selected', 'selected');
		set_sol(oPrev.val());
	}
	
	//find value of previous
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
	if (oNext.length>0){
		oNext.attr('selected', 'selected');
		set_sol(oNext.val());
	}

	return false;
}

//***************************************************************
function onClickMslNotebook(){
	var sURL;
	
	sURL = "https://an.rsl.wustl.edu/msl/mslbrowser/br2.aspx?tab=solsumm&sol=" + current_sol;
	window.open(sURL, "date");
}

//***************************************************************
function onClickMslNotebookMap(){
	var sURL;
	
	sURL = "https://an.rsl.wustl.edu/msl/mslbrowser/tab.aspx?t=mp&i=A&it=MT&ii=SOL," + current_sol;
	window.open(sURL, "map");
}

//***************************************************************
function onClickRefresh(){
	if (!current_sol){ 	
		set_error_status("NO Sol Selected...");
		return false;
	}
	
	get_instruments(current_sol,true);
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
	var oRadio;
	
	//hide the navigation
	$("#nav1").hide();
	$("#nav2").hide();

	//find and mark the selected instrument remaining
	oRadio = $("[name="+INSTRUMENT_RADIO+"][value="+psInstr+"]")
	if (oRadio.length>0){
		oRadio.prop("checked",true);
		do_set_instrument(psInstr);
	}
}

//***************************************************************
function do_set_instrument(psInstr){
	cDebug.write("setting instrument: " + psInstr);
	current_instrument = psInstr;
	reload_data();
}

//***************************************************************
function mark_sol(psSol){
	var aSols, sol_idx, oSol;
	
	$("#"+SOLS_LIST + " option[value="+psSol+"]").attr("selected", true);
	reload_after_instr = true;
	set_sol(psSol);
}

//***************************************************************
function set_sol(psSol){
	cDebug.write("setting sol: " + psSol);
	current_sol = psSol;
	$("#"+SOL_ID).html(current_sol);
	
	$("#nav1").hide();
	$("#nav2").hide();

	get_instruments(current_sol,false);
	get_sol_tag_count(current_sol);
	get_sol_hilite_count(current_sol);
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
		
	if (!current_instrument){
		set_error_status("Now select an instrument")
		return false;
	}
	
	return true;
}

//***************************************************************
function reload_data(){
	var sUrl;
	
	if (!OKToReload()) return;

	//go ahead and get the data starting at position 0
	if (reset_image_number)
		get_image_data(current_sol, current_instrument,1,HOW_MANY_IMAGES);
	else
		get_image_data(current_sol, current_instrument,current_image_index,current_image_index+HOW_MANY_IMAGES-1);
}

//###############################################################
//* GETTERS
//###############################################################
function get_instruments(psSol, pbRefresh){
	set_status("getting instruments");

	//hide instruments using obfuscated jQUERY - yeuchhhh!!!! 
	$("input[name=" + INSTRUMENT_RADIO + "]").each( function(){$(this).parent().hide();});
	
	//get the instruments for this sol
	$("#instr_load").show();
	sUrl = "php/rest/instruments.php?s=" + psSol + "&r=" + pbRefresh;
	cHttp.fetch_json(sUrl, get_instruments_callback);
}

//***************************************************************
function get_image_data( piSol, psInstr, piStart, piEnd){
	var sUrl;
	
	// update the content in the address bar
	sUrl = cBrowser.pageUrl() +"?s=" + current_sol + "&i=" + current_instrument +"&b=" + piStart;
	cBrowser.pushState("Detail", sUrl);
	
	//clear out the image data
	$("#"+IMAGE_ID).html("<p class='subtitle'>loading images");
	
	// load the image data
	loading=true;
	sUrl = "php/rest/images.php?s=" + piSol + "&i=" + psInstr +"&b=" + piStart + "&e=" + piEnd;
	set_status("fetching image data...");
	cHttp.fetch_json(sUrl, load_images_callback);
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

// ***************************************************************
function get_image_info(psSol, psInstr, psProd){
	var sUrl;
	
	sUrl = "php/rest/img_info.php?s="+psSol +"&i=" +psInstr + "&p=" + psProd;
	cHttp.fetch_json(sUrl, imginfo_callback);
	
	cTagging.getTags(psSol,psInstr, psProd, tag_callback);
}

//###############################################################
//* call backs 
//###############################################################
function solhighcount_callback(piJS){
	//RETURNS ALL THE TAGS
	if (piJS > 0)
		$("#solhighs").html("<a target='solhigh' href='solhigh.html?s="+current_sol+"'>" + piJS + "</a>");
	else
		$("#solhighs").html("none");
}

//***************************************************************
function tagcount_callback(piJS){
	//RETURNS ALL THE TAGS
	if (piJS > 0)
		$("#soltags").html("<a target='soltag' href='soltag.html?s="+current_sol+"'>" + piJS + "</a>");
	else
		$("#soltags").html("none");
}

//***************************************************************
function search_callback(poJS){
	var sUrl;
	
	if (!poJS)
		set_status("not a valid search");
	else{
		set_status("got search callback");
		sUrl = "detail.html?s=" + poJS.s + "&i=" + poJS.d.instrument + "&p=" + poJS.d.itemName;
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
	var iIndex, oSol, oList, sHTML;
	
	
	$("#"+SOLS_LIST).empty();
	
	sHTML = ""
	for (iIndex = 0; iIndex < paJS.length; iIndex++){
		oSol = paJS[iIndex];
		sHTML += "<option value='" + oSol.sol + "'>Sol: " + oSol.sol + "  |  " + oSol.date + "</option>"		
	}
	
	$("#"+SOLS_LIST).html(sHTML);
	
	// mark the sol
	if (cBrowser.data[SOL_QUERYSTRING] ) 
		mark_sol(cBrowser.data[SOL_QUERYSTRING]);
	
}

//***************************************************************
function load_instruments_callback(paJS){
	var sHTML, iIndex, oInstr, oDiv, sID, oInput,oSpan;
	
	
	oDiv = $("#"+INSTRUMENT_DIV);
	oDiv.empty();
	for (iIndex = 0; iIndex < paJS.length; iIndex++){
		oInstr = paJS[iIndex];
		sID = "instr_"+iIndex;
		
		oSpan= $("<SPAN>");
		oInput = $("<input>").attr({type: "radio", name: INSTRUMENT_RADIO, value: oInstr.name, id: sID}).change(OnChangeInstrument);
		oSpan.append(oInput).append(oInstr.caption+"<br>");
		oDiv.append(oSpan);
	}
	loading=false;
	set_status("ready");

	//click the buttons if stuff was passed in the query string
	if (cBrowser.data[INSTR_QUERYSTRING] ) 
		set_instrument(cBrowser.data[INSTR_QUERYSTRING]);

}

//***************************************************************
function imginfo_callback(paJS){
	var oImgSpan, sProd, iTagCount, iHighCount;
	
	//add a "T" if the tagcount is 
	oImgSpan = $("#"+paJS.p);
	/*
	if (paJS.t >0)
		oImgSpan.append($("<span>").attr({class:"imginfo"}).html("T"));
	*/
	
	if (paJS.h >0){
		oImgSpan.append(" ");
		oImgSpan.append($("<span>").attr({class:"imginfo"}).html("H"));
	}
}

//***************************************************************
function load_images_callback(paJS){
	var oDiv, sHTML, iIndex, oItem;
	
	max_images = 0;
	
	if (reset_image_number)
		current_image_index = -1;
	
	//clear out the image div
	$("#"+IMAGE_ID).empty();
		
	//build the html to put into the div
	if (paJS.max == 0)
		$("#"+IMAGE_ID).html("No instrument data found");
	else{
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
		var oOuterDiv = $("#"+IMAGE_ID);
		for (iIndex = 0; iIndex < paJS.images.length; iIndex++){
			var oDiv, oImgDiv, oA, oImg;
			
			// get the img details
			oItem = paJS.images[iIndex];
			sImgURL = "detail.html?s="+ current_sol + "&i=" + current_instrument + "&p=" + oItem.p;
			
			//build up the div
			oDiv = $("<DIV>");
			
			//build up the image div
			oImgDiv = $("<DIV>").attr({id:oItem.p});
			oA= $("<A>").attr({target:"detail", href:sImgURL});
			oImg = $("<IMG>").attr({src:oItem.i, width:"100%"}); 
			
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
			
			//in parallel go and get the count of highlights and tags
			get_image_info(current_sol, current_instrument, oItem.p);
			
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
		sHTML += "<a target='tags' href='tag.html?t=" + sTag + "'>#" + sTag + "</a> ";
	}
	oDiv.html( sHTML);
	
}

// ***************************************************************
function get_instruments_callback(paJS){
	var instr_idx, sInstr;

	set_status("got instruments");
	$("#instr_load").hide();
	
	//mark the instruments remaining
	for ( instr_idx = 0; instr_idx<paJS.length; instr_idx++){
		sInstr = paJS[instr_idx];
		$("[name="+INSTRUMENT_RADIO+"][value="+sInstr+"]").parent().show();
	}
	
	if 	(current_instrument || reload_after_instr){
		reload_after_instr = false;
		reload_data();
	}
	set_status("ready");
}