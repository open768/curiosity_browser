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

var current_sol = null;
var current_instrument = null;
var current_product = null;
var current_date_utc = null;
var current_date_lmst = null;
var nasa_link = null;
var mapLink = null;

//###############################################################
//# Event Handlers
//###############################################################
//***************************************************************
function OnClickNext(){
	//find the next product
	var sUrl;
	
	sUrl = "php/next.php?d=n&s=" + current_sol + "&i=" + current_instrument +"&p=" + current_product;
	set_status("fetching next image details...");
	cHttp.fetch_json(sUrl, next_callback);
}

//***************************************************************
function onClickPrevious(){
	//find the previous product
	var sUrl;
	
	sUrl = "php/next.php?d=p&s=" + current_sol + "&i=" + current_instrument +"&p=" + current_product;
	set_status("fetching previous image details...");
	cHttp.fetch_json(sUrl, next_callback);
}

//***************************************************************
function onClickCal(){
	var sURL;
	
	sURL = "cal.html?s=" + current_sol + "&t=" + current_date_utc;
		
	window.open(sURL, "date");
}

//***************************************************************
function onClickMap(){
	window.open(mapLink, "map");
}

//***************************************************************
function onClickSol(){
	var sURL="index.html?s="+ current_sol + "&i=" + current_instrument;
	window.open(sURL, "index");
}

//***************************************************************
function onClickInstr(){
	onClickSol();
}

//***************************************************************
function onClickNASA(){
	window.open(nasa_link, "nasa");
}

//***************************************************************
function onAddTag(){
	var sKey, sTag;

	//check something was entered
	sTag = document.getElementById("tagtext").value;
	if (sTag === ""){
		alert ("no tag text");
		return;
	}
	
	set_status("setting tag");
	sKey = cTagging.setTag(current_sol+"/"+current_instrument+"/"+current_product, sTag, tag_callback);
}

//###############################################################
//# Utility functions 
//###############################################################
function load_data(){
	cTagging.realm="Curiosity";
	get_product_data( cBrowser.data[SOL_QUERYSTRING], cBrowser.data[INSTR_QUERYSTRING], cBrowser.data[PRODUCT_QUERYSTRING]);
}

//***************************************************************
function get_product_data( psSol, psInstr, psProd){
	var sUrl;
	
	current_sol = psSol;
	current_instrument = psInstr;
	current_product = psProd;
	
	loading=true;
	sUrl = "php/detail.php?s=" + psSol + "&i=" + psInstr +"&p=" + psProd;
	set_status("fetching data for "+ psProd);
	cHttp.fetch_json(sUrl, load_detail_callback);
}
//###############################################################
//* call backs 
//###############################################################
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
	document.getElementById("tags").innerHTML = sHTML;
	
	set_status("ok");
}

//***************************************************************
function load_detail_callback(paJS){

	var sLink, sURL, oData;
	set_status("received data...");
	
	//rely upon what came back rather than the query string
	current_sol = paJS.s;
	current_instrument = paJS.i;
	current_product = paJS.p;
	
	//update the title
	document.title = "Curiosity Browser - details - sol:" + current_sol + " instrument:" + current_instrument;
	
	//update the address bar
	sURL = cBrowser.baseUrl() +"?s=" + current_sol + "&i=" + current_instrument + "&p=" + current_product;
	cBrowser.pushState("Detail", sURL);
	
	//check whether there was any data
	oData = paJS.d
	if (oData == null){
		set_status("EMPTY DATA RESPONSE - <font color=red><b>ERROR?</b></font>");
		return;
	}
	nasa_link = oData.i;

	//tags 
	if (!paJS.tags)
		document.getElementById("tags").innerHTML = "no Tags - be the first to add one";
	else{
		document.getElementById("tags").innerHTML = paJS.tags;
		//not full implemented!
	}
		
	
	//update image index details
	document.getElementById("img_index").innerHTML = paJS.item;
	document.getElementById("max_images").innerHTML = paJS.max;

	document.getElementById("sol").innerHTML = current_sol;
	document.getElementById("instrument").innerHTML = current_instrument;
	
	//figure out the map link
	mapLink = "http://curiosityrover.com/imgpoint.php?name=" + current_product;

	//populate the remaining fields
	current_date_lmst = oData.dm;
	current_date_utc = oData.du;
	document.getElementById("date_utc").innerHTML = current_date_utc;
	document.getElementById("date_lmst").innerHTML = current_date_lmst;
	document.getElementById("msldata").innerHTML = "<pre>" + cDebug.vardump(oData.data,1) + "</pre>";
	document.getElementById("image").innerHTML = "<a target='nasa' href='"+ oData.i + "'><img id='img' src='" + oData.i + "' onload='OnImageLoaded()'></a>";
	
	sLink = oData.l;
	if (sLink=="UNK"){
		document.getElementById("label_link").innerHTML = "No Product Label data found";
		document.getElementById("label").innerHTML = "No Product Label data found";
	}else{
		document.getElementById("label_link").innerHTML = "<a target='nasa' href='"+ sLink + "'>" + sLink + "</a>";
		document.getElementById("label").src = sLink;
	}

	//get the tags
	sKey = cTagging.getTags(current_sol+"/"+current_instrument+"/"+current_product, tag_callback);
	
	//set status
	set_status("Image Loading");
}

//***************************************************************
function next_callback(poJson){
	get_product_data( poJson.s, current_instrument, poJson.d.p);
}

//***************************************************************
function OnImageLoaded(){
	var iHeight= event.target.height;
	var iWidth= (event.target.width/2) - 4;
	
	cDebug.write("setting button sizes");
	cDebug.write("width: " + iWidth);
	cDebug.write("height: " + iHeight);
	
	document.getElementById("rbut").style.height=iHeight;
	document.getElementById("lbut").style.height=iHeight;
	document.getElementById("rbut_top").style.width=iWidth;
	document.getElementById("lbut_top").style.width=iWidth;
	document.getElementById("rbut_bot").style.width=iWidth;
	document.getElementById("lbut_bot").style.width=iWidth;
	set_status("OK");
}

