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
const SOL_QUERYSTRING = "s";
const INSTR_QUERYSTRING = "i";
const PRODUCT_QUERYSTRING = "p";

var current_sol = null;
var current_instrument = null;
var current_product = null;
var current_date_utc = null;
var current_date_lmst = null;

//###############################################################
//# Event Handlers
//###############################################################
//***************************************************************
function OnClickNext(){
	//find the next product
	var sUrl;
	
	sUrl = "php/next.php?d=n&s=" + current_sol + "&i=" + current_instrument +"&p=" + current_product;
	set_status("fetching next image details...");
	async_http_get(sUrl, next_callback);
}

//***************************************************************
function onClickPrevious(){
	//find the previous product
	var sUrl;
	
	sUrl = "php/next.php?d=p&s=" + current_sol + "&i=" + current_instrument +"&p=" + current_product;
	set_status("fetching previous image details...");
	async_http_get(sUrl, next_callback);
}

//***************************************************************
function onClickCal(){
	var sURL;
	
	sURL = "cal.html?s=" + current_sol + "&t=" + current_date_utc;
		
	window.open(sURL, "date");
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

//###############################################################
//# Utility functions 
//###############################################################
function load_data(){
	
	get_product_data( query_string[SOL_QUERYSTRING], query_string[INSTR_QUERYSTRING], query_string[PRODUCT_QUERYSTRING]);
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
function load_detail_callback(paJS){

	var sLink, sMapLink, sURL, oData;
	set_status("received data...");
	
	//rely upon what came back rather than the query string
	current_sol = paJS.s;
	current_instrument = paJS.i;
	current_product = paJS.p;
	
	//update the address bar
	sURL = getBaseURL() +"?s=" + current_sol + "&i=" + current_instrument + "&p=" + current_product;
	window.history.pushState("", "Detail", sURL);
	
	//check whether there was any data
	oData = paJS.d
	if (oData == null){
		set_status("EMPTY DATA RESPONSE - <font color=red><b>ERROR?</b></font>");
		return;
	}

	//figure out the map link
	sMapLink = "http://curiosityrover.com/imgpoint.php?name=" + current_product;
	document.getElementById("sol").innerHTML = current_sol;
	document.getElementById("product").innerHTML = "<a target='map' href='" + sMapLink + "'>" + current_product + "</a>";
	document.getElementById("instrument").innerHTML = current_instrument;

	
	current_date_lmst = oData.dm;
	current_date_utc = oData.du;
	document.getElementById("date_utc").innerHTML = current_date_utc;
	document.getElementById("date_lmst").innerHTML = current_date_lmst;
	document.getElementById("image_link").innerHTML = "<a target='nasa' href='"+ oData.i + "'>" + oData.i + "</a>";
	document.getElementById("image").innerHTML = "<a target='nasa' href='"+ oData.i + "'><img id='img' src='" + oData.i + "' onload='OnImageLoaded()'></a>";
	document.getElementById("pagelink").innerHTML = "<a href='" + sURL + "'>"+ sURL + "</a>";
	
	sLink = oData.l;
	if (sLink=="UNK"){
		document.getElementById("label_link").innerHTML = "No Product Label data found";
		document.getElementById("label").innerHTML = "No Product Label data found";
	}else{
		document.getElementById("label_link").innerHTML = "<a target='nasa' href='"+ sLink + "'>" + sLink + "</a>";
		document.getElementById("label").src = sLink;
	}

	set_status("OK");
}

//***************************************************************
function next_callback(poJson){
	get_product_data( current_sol, current_instrument, poJson["p"]);
}

//***************************************************************
function OnImageLoaded(){
	var iHeight= event.target.height;
	var iWidth= (event.target.width/2) - 2;
	document.getElementById("rbut").style.height=iHeight;
	document.getElementById("lbut").style.height=iHeight;
	document.getElementById("rbut_top").style.width=iWidth;
	document.getElementById("lbut_top").style.width=iWidth;
	document.getElementById("rbut_bot").style.width=iWidth;
	document.getElementById("lbut_bot").style.width=iWidth;
}

