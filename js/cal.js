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

