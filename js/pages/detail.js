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
var SOL_QUERYSTRING = "s";
var INSTR_QUERYSTRING = "i";
var PRODUCT_QUERYSTRING = "p";

var goItem = null;

//###############################################################
//# Event Handlers
//###############################################################
//***************************************************************
function onClickNext(){
	//find the next product
	var sURL;
	
	sURL = "php/rest/next.php?d=n&s=" + goItem.s + "&i=" + goItem.i +"&p=" + goItem.p;
	set_status("fetching next image details...");
	cHttp.fetch_json(sURL, next_callback);
}

//***************************************************************
function onClickComment(){
	cAuth.forceLogin();
	var sText = $("#Commentsbox").val();
	cComments.set(goItem.s,goItem.i,goItem.p, sText, get_comments_callback);
}

//***************************************************************
function onClickNextTime(){
	sURL = "php/rest/nexttime.php?d=n&s=" + goItem.s + "&p=" + goItem.p;
	set_status("fetching next image details...");
	cHttp.fetch_json(sURL, nexttime_callback);
}

//***************************************************************
function onClickPreviousTime(){
	sURL = "php/rest/nexttime.php?d=p&s=" + goItem.s + "&p=" + goItem.p;
	set_status("fetching previous image details...");
	cHttp.fetch_json(sURL, nexttime_callback);
}

//***************************************************************
function onClickPrevious(){
	//find the previous product
	var sURL;
	
	sURL = "php/rest/next.php?d=p&s=" + goItem.s + "&i=" + goItem.i +"&p=" + goItem.p;
	set_status("fetching previous image details...");
	cHttp.fetch_json(sURL, next_callback);
}

//***************************************************************
function onClickCal(){
	var sURL;
	
	sURL = "cal.html?s=" + goItem.s + "&t=" + goItem.d.du;
	window.open(sURL, "calendar");
}

//***************************************************************
function onClickMap(){
	var sURL = "http://curiosityrover.com/imgpoint.php?name=" + goItem.p;
	window.open(sURL, "map");
}

//***************************************************************
function onClickSol(){
	var sURL="index.html?s="+ goItem.s + "&i=" + goItem.i;
	window.open(sURL, "index");
}

//***************************************************************
function onClickInstr(){
	onClickSol();
}

//***************************************************************
function onClickNASA(){
	window.open(goItem.d.i, "nasa");
}

//***************************************************************
function onClickNotebook(){
	//var sURL = "https://an.rsl.wustl.edu/msl/mslbrowser/br2.aspx?tab=solsumm&sol=" + goItem.s;
	var sURL = "https://an.rsl.wustl.edu/msl/mslbrowser/br2.aspx?tab=solsumm&p=" + goItem.p;
	window.open(sURL, "notebook");
}

//***************************************************************
function onClickMSLRaw(){
	var sURL = "http://mars.nasa.gov/msl/multimedia/raw/?rawid=" + goItem.p + "&s=" + goItem.s;
	window.open(sURL, "mslraw");
}

//***************************************************************
function onClickPDS(){
	var sURL = "pds.html?s="+ goItem.s + "&i=" + goItem.i +"&p=" + goItem.p +"&t=" + escape(goItem.d.du);
	window.open(sURL, "pds");
}

//***************************************************************
function onClickAddTag(){
	var sKey, sTag;

	cAuth.forceLogin();
	
	//check something was entered
	sTag = $("#tagtext").val();
	if (sTag === ""){
		alert ("no tag text");
		return;
	}
	
	set_status("setting tag: " + sTag);
	sKey = cTagging.setTag(goItem.s,goItem.i,goItem.p, sTag, addtag_callback);
}

//***************************************************************
function onClickPixlr(){
	pixlr.edit({image:goItem.d.i, service:'editor', exit:document.location});
}

function onKeyPress(poEvent){
	var sChar = String.fromCharCode(poEvent.which);
	switch(sChar){
		case "n": onClickNext();break;
		case "N": onClickNextTime();break;
		case "p": onClickPrevious();break;
		case "P": onClickPreviousTime();break;
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
function onLoadJQuery(){
	//set up event handler on screen elements
	$(":input").each(function(index,oObj){
		if ($(oObj).attr("type")==="text"){
			$(oObj).focus(onInputFocus);
			$(oObj).blur(onInputDefocus);
		}
	});
	$("textarea").each(function(index,oObj){
		$(oObj).focus(onInputFocus);
		$(oObj).blur(onInputDefocus);
	});
	$(window).keypress(onKeyPress);
	
	//get user data
	set_status("loading user data...");
	cAuth.getUser(authCallback);
}

//***************************************************************
function authCallback(psUser){
	cAuth.user = psUser;
	if (cAuth.user) set_status("welcome " + cAuth.user);
	get_product_data( cBrowser.data[SOL_QUERYSTRING], cBrowser.data[INSTR_QUERYSTRING], cBrowser.data[PRODUCT_QUERYSTRING]);
	cTagging.getTagNames(tagnames_callback);
}

//***************************************************************
function get_product_data( psSol, psInstr, psProd){
	var sURL;
	
	loading=true;
	sURL = "php/rest/detail.php?s=" + psSol + "&i=" + psInstr +"&p=" + psProd;
	set_status("fetching data for "+ psProd);
	cHttp.fetch_json(sURL, load_detail_callback);
}
//###############################################################
//* call backs 
//###############################################################
//***************************************************************
function tagnames_callback(poJs){
	cTagging.showTagCloud("tagcloud",poJs);
	set_status("got tag names");
}

//***************************************************************
function highlight_callback(paJS){
	var i, aItem, oBox, oNumber;
	if (!paJS){
		cDebug.write("no highlights");
		return;
	}
	
	for (i=0; i<paJS.length; i++){
		aItem = paJS[i];
		cDebug.write("adding highlight: top=" + aItem.t + " left=" + aItem.l);
		oBox = cImgHilite.make_fixed_box(aItem.t, aItem.l);
		
		oNumber = $(oBox).find(cImgHilite.numberID);
		oNumber.html(i+1);
	}
}

//***************************************************************
function addtag_callback(paJS){
	tag_callback(paJS);
	cTagging.getTagNames(tagnames_callback);
}

//***************************************************************
function tag_callback(paJS){
	var sHTML, i, sTag;
	
	set_status("got tag");
	if (paJS.length== 0){
		sHTML = "No Tags found, be the first to add one";
	}else{
		sHTML = "";
		for (i=0; i<paJS.length; i++){
			sTag = paJS[i];
			sHTML += "<a target='tags' href='tag.html?t=" + sTag + "'>#" + sTag + "</a> ";
		}
	}
	$("#tags").html( sHTML);
	
	set_status("ok");
}

//***************************************************************
function load_detail_callback(paJS){

	var sLink, sURL, oData;
	set_status("received data...");
	
	//rely upon what came back rather than the query string
	goItem = paJS;
	
	//update the title
	document.title = "Curiosity Browser - details - sol:" + goItem.s + " instrument:" + goItem.i;
	
	//update the address bar
	sURL = cBrowser.pageUrl() +"?s=" + goItem.s + "&i=" + goItem.i + "&p=" + goItem.p;
	cBrowser.pushState("Detail", sURL);
	
	//check whether there was any data
	oData = paJS.d
	if (oData == null){
		set_status("EMPTY DATA RESPONSE - <font color=red><b>ERROR?</b></font>");
		return;
	}

	//tags 
	if (!paJS.tags)
		$("#tags").html( "no Tags - be the first to add one");
	else{
		$("#tags").html( paJS.tags);
		//not full implemented!
	}
	
	//update image index details
	$("#img_index").html( paJS.item);
	$("#max_images").html( paJS.max);
	$("#sol").html( goItem.s);
	$("#instrument").html( goItem.i);
	
	//populate the remaining fields
	$("#date_utc").html( goItem.d.du);
	$("#date_lmst").html( goItem.d.dm);
	$("#msldata").html( "<pre>" + cDebug.dump(oData.data,1) + "</pre>");
	
	//add the image 
	$("#image").empty();
	var oImg = $("<img/>").attr({"src":oData.i, "id":"baseimg", "onload":"OnImageLoaded()"});
	$("#image").append(oImg);
	
	
	sLink = oData.l;
	if (sLink=="UNK"){
		$("#label_link").html( "No Product Label data found");
		$("#label").html( "No Product Label data found");
	}else{
		$("#label_link").html( "<a target='nasa' href='"+ sLink + "'>" + sLink + "</a>");
		$("#label").html (sLink);
	}

	//get the tags and comments
	sKey = cTagging.getTags(goItem.s,goItem.i,goItem.p, tag_callback);
	cComments.get(goItem.s,goItem.i,goItem.p, get_comments_callback);
	
	//empty highligths
	cImgHilite.remove_boxes();
	
	//set status
	set_status("Image Loading");
}

//***************************************************************
function get_comments_callback(paJson){
	var i, oText, sHTML;
	
	if (!paJson)
		sHTML = "No Comments - be the first !";
	else{
		sHTML = "";
		for (i=0; i<paJson.length; i++)
			sHTML += paJson[i].u +":" + paJson[i].c + "<p>";
	}
	
	oText = $("#comments");
	oText.html(sHTML);
	set_status("ok");
}

//***************************************************************
function nexttime_callback(poJson){
	if (!poJson)
		set_error_status("unable to find");
	else
		get_product_data( poJson.s, poJson.d.instrument, poJson.d.itemName);
}

//***************************************************************
function next_callback(poJson){
	get_product_data( poJson.s, goItem.i, poJson.d.p);
}

//***************************************************************
function OnImageLoaded(){
	var iWidth, iHeight, iImgW, iButW;
	
	iHeight= $(event.target).height();
	iImgW = $(event.target).width();
	iButW = $("#ltimebut_top").width();
	iWidth= iImgW/2 - iButW - 28 ;
	
	//make the buttons the right size
	cDebug.write("setting button sizes");
	cDebug.write("imageWidth: " + iImgW);
	cDebug.write("button width: " + iButW);
	cDebug.write("width: " + iWidth);
	cDebug.write("height: " + iHeight);
	
	$("#rbut").height(iHeight);
	$("#lbut").height(iHeight);
	$("#rbut_top").width(iWidth);
	$("#lbut_top").width(iWidth);
	$("#rbut_bot").width(iWidth);
	$("#lbut_bot").width(iWidth);
	
	//make the image clickable
	$(event.target).click(OnImageClick);
	cImgHilite.imgTarget = event.target;
	
	//get the highlights if any
	cImgHilite.getHighlights(goItem.s,goItem.i,goItem.p, highlight_callback);
	
	set_status("OK");
}

//***************************************************************
function onSaveHighCallback(poEvent){
	cImgHilite.remove_boxes();
	cImgHilite.getHighlights(goItem.s,goItem.i,goItem.p, highlight_callback);
}

//***************************************************************
function OnImageClick(poEvent){
	cAuth.forceLogin();
	cImgHilite.makeBox(poEvent.pageX, poEvent.pageY);
}

//**************************************************
function onClickBoxAccept(){
	var oBox = cImgHilite.getBoxFromButton(event.currentTarget);
	cImgHilite.save_highlight(goItem.s,goItem.i,goItem.p, oBox, onSaveHighCallback);
}

//**************************************************
function onClickBoxCancel(){
	cImgHilite.rejectBox(event.currentTarget);
}


