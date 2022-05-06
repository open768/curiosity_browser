/**************************************************************************
Copyright (C) Chicken Katsu 2014 

This code is protected by copyright under the terms of the 
Creative Commons Attribution-Ncercial-NoDerivatives 4.0 International License
http://creativecommons.org/licenses/by-nc-nd/4.0/legalcode

For licenses that allow for commercial use please contact cluck@chickenkatsu.co.uk

// USE AT YOUR OWN RISK - NO GUARANTEES OR ANY FORM ARE EITHER EXPRESSED OR IMPLIED
**************************************************************************/
var DEBUG_ON = true;

var goItem = null;
var gaTags = null;
var giNum = null;


//###############################################################
//# Event Handlers
//###############################################################

//***************************************************************
function onClickComment(){
	var sText = $("#Commentsbox").sceditor('instance').val(); //gets the bbcode - MUST BE PARSED AT SERVER
	cComments.set(goItem.s,goItem.i,goItem.p, sText, get_comments_callback);
}

//***************************************************************
function onClickNextTime(){
	var sUrl = cBrowser.buildUrl(cLocations.rest + "/nexttime.php",{d:"n",s:goItem.s,p:goItem.p,m:cMission.ID});
	set_status("fetching next image details...");
	var oHttp = new cHttp2();
	bean.on(oHttp,"result",nexttime_callback);
	oHttp.fetch_json(sUrl);
}

//***************************************************************
function onClickPreviousTime(){
	var sUrl = cBrowser.buildUrl(cLocations.rest + "/nexttime.php",{d:"p",s:goItem.s,p:goItem.p,m:cMission.ID});
	set_status("fetching previous image details...");
	var oHttp = new cHttp2();
	bean.on(oHttp,"result",nexttime_callback);
	oHttp.fetch_json(sUrl);
}

//***************************************************************
function onClickNext(){
	//find the next product
	var sUrl;
	
	set_status("fetching next image details...");
	var sUrl = cBrowser.buildUrl(cLocations.rest + "/next.php",{d:"n",s:goItem.s,i:goItem.i,p:goItem.p,m:cMission.ID});
	var oHttp = new cHttp2();
	bean.on(oHttp,"result",next_callback);
	oHttp.fetch_json(sUrl);
}

//***************************************************************
function onClickPrevious(){
	set_status("fetching previous image details...");
	var sUrl = cBrowser.buildUrl(cLocations.rest + "/next.php",{d:"p",s:goItem.s,i:goItem.i,p:goItem.p,m:cMission.ID});
	var oHttp = new cHttp2();
	bean.on(oHttp,"result",next_callback);
	oHttp.fetch_json(sUrl);
}

//***************************************************************
function onClickCal(){
	var sUrl;
	
	sUrl = "cal.php?s=" + goItem.s + "&t=" + goItem.d.du;
	cBrowser.openWindow(sUrl, "calendar");
}

//***************************************************************
function onClickMap(){
	var sUrl = "http://curiosityrover.com/imgpoint.php?name=" + goItem.p;
	window.open(sUrl, "map");
}

//***************************************************************
function onClickSol(){
	var sUrl="index.php?s="+ goItem.s + "&i=" + goItem.i + "&b=" + giNum;
	cBrowser.openWindow(sUrl, "index");
}

//***************************************************************
function onClickThumbnails(){
	var sUrl="index.php?s="+ goItem.s + "&i=" + goItem.i + "&t=1";
	cBrowser.openWindow(sUrl, "solthumb");
}

//***************************************************************
function onClickHighlights(){
	var sUrl="solhigh.php?sheet&s=" + goItem.s;
	cBrowser.openWindow(sUrl, "solthumb");
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
function onClickMSLRaw(){
	var sUrl = "http://mars.nasa.gov/msl/multimedia/raw/?rawid=" + goItem.p + "&s=" + goItem.s;
	window.open(sUrl, "mslraw");
}

//***************************************************************
function onClickPDS(){
	var sUrl = "pds.php?s="+ goItem.s + "&i=" + goItem.i +"&p=" + goItem.p +"&t=" + escape(goItem.d.du);
	cBrowser.openWindow(sUrl, "pds");
}

//***************************************************************
function onClickAddTag(){
	var sKey, sTag;

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
	pixlr.edit({image:goItem.d.i, service:'editor', exit:document.location, referer:'mars browser', redirect:false});
}

//***************************************************************
function onKeyPress(poEvent){
	var sChar = String.fromCharCode(poEvent.which);
	switch(sChar){
		case "n": onClickNext();break;
		case "N": onClickNextTime();break;
		case "p": onClickPrevious();break;
		case "P": onClickPreviousTime();break;
	}
	
}

//***************************************************************
function onClickGoogle(){
	var sUrl = "https://www.google.com/#q=%22" + goItem.p + "%22";
	window.open(sUrl, "map");
}

//***************************************************************
function onFacebookUser(){
	cDebug.write("detail.js got Facebook user");
	$("#tagtext").removeAttr('disabled');
	$("#submittag").removeAttr('disabled');
	$("#btnComment").removeAttr('disabled');

	$("#Commentsbox").sceditor({
		plugins: 'bbcode',
		style: "../jsinc/sceditor/minified/jquery.sceditor.default.min.css",
		toolbarExclude: "print,code,email,source,maximize",
		height:100,
		resizeEnabled: false
	});
	$('#Commentsbox').sceditor('instance').blur(onInputDefocus);
	$('#Commentsbox').sceditor('instance').focus(onInputFocus);
};

//###############################################################
//# Utility functions 
//###############################################################
bean.on(cFacebook, "gotUser", onFacebookUser);

function onLoadJQuery_DETAIL(){
	
	//disable edit controls
	$("#tagtext").attr('disabled', "disabled");
	$("#submittag").attr('disabled', "disabled");
	$("#Commentsbox").attr('disabled', "disabled");
	$("#btnComment").attr('disabled', "disabled");
	
	//catch key presses but not on text inputs
	$(window).keypress(onKeyPress);
	$(":input").each(function(index,oObj){
		if ($(oObj).attr("type")==="text"){
			$(oObj).focus(onInputFocus);
			$(oObj).blur(onInputDefocus);
		}
	});
	
	//get user data
	set_status("loading user data...");
	get_product_data( 
		cBrowser.data[cSpaceBrowser.SOL_QUERYSTRING], 
		cBrowser.data[cSpaceBrowser.INSTR_QUERYSTRING], 
		cBrowser.data[cSpaceBrowser.PRODUCT_QUERYSTRING]);
	cTagging.getTags(alltagnames_callback);
}


function onInputFocus(){
	$(window).unbind("keypress");
}

function onInputDefocus(){
	$(window).keypress(onKeyPress);
}

//***************************************************************
function get_product_data( psSol, psInstr, psProd){
	var sUrl = cBrowser.buildUrl(cLocations.rest + "/detail.php",{s:psSol,i:psInstr,p:psProd,m:cMission.ID});
	set_status("fetching data for "+ psProd);
	var oHttp = new cHttp2();
	bean.on(oHttp,"result",load_detail_callback);
	oHttp.fetch_json(sUrl);
}
//###############################################################
//* call backs 
//###############################################################
//***************************************************************
function alltagnames_callback(poJs){
	set_status("got tag names");
	gaTags = new Array();
	for (sKey in poJs)
		gaTags.push(sKey);
    $( "#tagtext" ).autocomplete({source: gaTags});
}

//***************************************************************
function highlight_callback(paJS){
	var i, aItem, oBox, oNumber;
	if (!paJS.d){
		cDebug.write("no highlights");
		return;
	}
	
	for (i=0; i<paJS.d.length; i++){
		aItem = paJS.d[i];
		cDebug.write("adding highlight: top=" + aItem.t + " left=" + aItem.l);
		oBox = cImgHilite.make_fixed_box(aItem.t, aItem.l);
		
		oNumber = $(oBox).find(cImgHilite.numberID);
		oNumber.html(i+1);
	}
}

//***************************************************************
function addtag_callback(paJS){
	tag_callback(paJS);
	cTagging.getTagNames(alltagnames_callback);
}

//***************************************************************
function tag_callback(paJS){
	var sHTML, i, sTag;
	
	set_status("got tag");
	if (paJS.d.length== 0){
		sHTML = "No Tags found, be the first to add one";
	}else{
		sHTML = "";
		for (i=0; i<paJS.d.length; i++){
			sTag = paJS.d[i];
			
			var sTarget = ( SINGLE_WINDOW ? "" : "target='tags'");
			sHTML += "<a " + sTarget + " href='tag.php?t=" + sTag + "'>#" + sTag + "</a> ";
		}
	}
	$("#tags").html( sHTML);

	
	set_status("ok");
}

//***************************************************************
function load_detail_callback(poHttp){

	var sLink, sUrl, oData;
	set_status("received data...");
	
	//rely upon what came back rather than the query string
	goItem = poHttp.response;
	
	//check whether there was any data
	oData = goItem.d;
	if (oData === null){
		if (goItem.migrate !== null){
			sUrl = "migrate.php?s=" + goItem.s + "&i=" + goItem.i + "&pfrom=" + goItem.p + "&pto=" + goItem.migrate;
			cBrowser.openWindow(sUrl, "migrate");
		}else
			cBrowser.openWindow("error.php?m=product " + goItem.p + " was not found", "error");
		return;
	}
	
	//update the title
	document.title = "detail: s:" + goItem.s + " i:" + goItem.i + " p:" + goItem.p + " (Curiosity Browser)";
	$("#toptitle").html(goItem.p);
	
	//update the address bar
	sUrl = cBrowser.pageUrl() +"?s=" + goItem.s + "&i=" + goItem.i + "&p=" + goItem.p;
	cBrowser.pushState("Detail", sUrl);
	

	//tags 
	if (!oData.tags)
		$("#tags").html( "no Tags - be the first to add one");
	else{
		$("#tags").html( oData.tags);
	}
	
	//update image index details
	giNum = goItem.item;
	$("#img_index").html( giNum);
	
	$("#max_images").html( goItem.max);
	$("#sol").html( goItem.s);
	$("#instrument").html( goItem.i);
	
	//populate the remaining fields
	$("#date_utc").html( goItem.d.du);
	//$("#date_lmst").html( goItem.d.dm);
	var sDump = cDebug.getvardump(oData.data,1);
	$("#msldata").html( $("<pre>").append(sDump));
	
	//add the image 
	$("#image").empty();
	var oImg = $("<img/>").attr({"src":oData.i, "id":"baseimg", "onload":"OnImageLoaded()"});
	$("#image").append(oImg);
	$("meta[property='og:image']").attr("content", oData.i);		//facebook tag for image
	
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
function nexttime_callback(poHttp){
	var oData = poHttp.response;
	if (!oData)
		set_error_status("unable to find");
	else
		get_product_data( oData.s, oData.d.instrument, oData.d.itemName);
}

//***************************************************************
function next_callback(poHttp){
	var oData = poHttp.response;
	get_product_data( oData.s, goItem.i, oData.d.p);
}

//***************************************************************
function OnImageLoaded(){
	var iWidth, iHeight, iImgW, iButW;
	
	iHeight= $(event.target).height();
	iImgW = $(event.target).width();
	iButW = $("#ltimebut_top").innerWidth();
	iWidth= iImgW/2 - iButW ;
	
	//make the buttons the right size
	cDebug.write("setting button sizes");
	cDebug.write("imageWidth: " + iImgW);
	cDebug.write("button width: " + iButW);
	cDebug.write("width: " + iWidth);
	cDebug.write("height: " + iHeight);
	
	$("#rbut").height(iHeight);
	$("#lbut").height(iHeight);
	$("#rbut_top").innerWidth(iWidth);
	$("#lbut_top").innerWidth(iWidth);
	$("#rbut_bot").innerWidth(iWidth);
	$("#lbut_bot").innerWidth(iWidth);
	
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
	if (cAuth.user)
		cImgHilite.makeBox(poEvent.pageX, poEvent.pageY,true);
	else
		alert("log in to highlight");
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


