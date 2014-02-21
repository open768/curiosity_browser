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
const DATE_QUERYSTRING = "d";

var current_sol = null;
var current_date = null;

//###############################################################
//# Event Handlers
//###############################################################

//###############################################################
//# Utility functions 
//###############################################################
function load_data(){
	get_calendar_data( query_string[SOL_QUERYSTRING]);
}

//***************************************************************
function get_calendar_data( psSol){
	var sUrl;
	
	document.getElementById("sol").innerHTML = psSol;
	current_sol = psSol;
	
	loading=true;
	sUrl = "php/cal.php?s=" + psSol ;
	set_status("fetching calendar data for sol:"+ psSol);
	debug_console(sUrl);
	RGraph.AJAX.getJSON(sUrl, load_cal_callback);
}
//###############################################################
//* call backs 
//###############################################################
function load_cal_callback(paJS){
	set_status("received data...");

	document.getElementById("calendar").innerHTML = paJS;

	set_status("OK");
}

