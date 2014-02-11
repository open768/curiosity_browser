var DEBUG_ON = true;
var loading = true;
const SOLS_LIST = "sol_list";
const INSTRUMENT_DIV = "instruments";
const INSTRUMENT_RADIO = "IR";
const MAX_ID="max";
const CURRENT_ID = "current";
const IMAGE_ID="images";
const STATUS_ID = "status";
const SOL_ID = "this_sol";
const SOL_QUERYSTRING = "sol";
const INSTR_QUERYSTRING = "instr";
const IMAGES_QUERYSTRING = "max";

var HOW_MANY_IMAGES = 5;
var current_image_index = 0;
var current_sol = null;
var current_instrument = null;
var max_images = -1;
var query_string = getQueryString();

//###############################################################
//# Event Handlers
//###############################################################
function OnChangeSolList(){
	if (loading) return;
	set_sol(event.target.value);
}

//***************************************************************
function OnChangeInstrument(){
	set_instrument(getRadioButtonValue(event.target.id));
}

//***************************************************************
function set_status(psStatus){
	document.getElementById(STATUS_ID).innerHTML= psStatus;
}

//***************************************************************
function OnClickNext(){
	var iNext;
	
	if (!OKToReload) return;
	iNext = current_image_index + HOW_MANY_IMAGES;
	if (iNext > max_images) return;
	
	//go ahead and get the data 
	get_image_data(current_sol, current_instrument,iNext,iNext+HOW_MANY_IMAGES);
}

//***************************************************************
function OnClickPrevious(){
	var iPrevious;
	
	if (!OKToReload) return;
	iPrevious = current_image_index - HOW_MANY_IMAGES;
	if (iPrevious <= 0 ) return;

	//go ahead and get the data 
	get_image_data(current_sol, current_instrument,iPrevious,iPrevious+HOW_MANY_IMAGES);
}

//###############################################################
//# Utility functions 
//###############################################################
function set_instrument(psInstr){
	debug_console("instrument: " + psInstr);

	current_instrument = psInstr;
	reload();
}

//***************************************************************
function set_sol(piSol){
	debug_console("sol: " + piSol);
	current_sol = piSol;
	document.getElementById(SOL_ID).innerHTML = current_sol;
	mark_instruments(current_sol);
}

//***************************************************************
function mark_instruments(piSol){
	sUrl = "php/instruments.php?s=" + piSol;
	debug_console(sUrl);
	RGraph.AJAX.getJSON(sUrl, mark_instruments_callback);
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
		set_status("NO Sol Selected...");
		return false;
	}
		
	if (!current_instrument){
		set_status("No instrument Selected")
		return false;
	}
	
	return true;
}

//***************************************************************
function reload(){
	var sUrl;
	
	if (!OKToReload) return;

	//go ahead and get the data starting at position 0
	get_image_data(current_sol, current_instrument,1,HOW_MANY_IMAGES);
}

//***************************************************************
function get_image_data( piSol, psInstr, piStart, piEnd){
	var sUrl;
	
	loading=true;
	sUrl = "php/images.php?s=" + piSol + "&i=" + psInstr +"&b=" + piStart + "&e=" + piEnd;
	set_status("fetching image data...");
	debug_console(sUrl);
	RGraph.AJAX.getJSON(sUrl, load_images_callback);
}

//***************************************************************
function load_data(){
	set_status("loading static data...");
	if (query_string[IMAGES_QUERYSTRING] )
		HOW_MANY_IMAGES = parseInt(query_string[IMAGES_QUERYSTRING]);
		

	RGraph.AJAX.getJSON("php/instruments.php", load_instruments_callback);
	RGraph.AJAX.getJSON("php/sols.php", load_sols_callback);
}

//###############################################################
//* call backs 
//###############################################################
function load_sols_callback(paJS){
	var iIndex, oSol, oList, sHTML;
	
	oList = document.getElementById(SOLS_LIST);
	oList.innerHTML = "";
	debug_console(oList);
	
	sHTML = ""
	for (iIndex = 0; iIndex < paJS.length; iIndex++){
		oSol = paJS[iIndex];
		sHTML += "<option value='" + oSol.sol + "'>Sol: " + oSol.sol + "  |  " + oSol.date + "</option>"		
	}
	
	oList.innerHTML = sHTML;
	
}

//***************************************************************
function load_instruments_callback(paJS){
	var sHTML, iIndex, oInstr;
	
	sHTML = "";
	for (iIndex = 0; iIndex < paJS.length; iIndex++){
		oInstr = paJS[iIndex];
		sHTML += "<input type='radio' id='"+ INSTRUMENT_RADIO +"' name='" + INSTRUMENT_RADIO + "' value='" + oInstr.name + "'onchange='OnChangeInstrument()'>" + oInstr.caption + "</input><br>";
	}
	document.getElementById(INSTRUMENT_DIV).innerHTML = sHTML;
	loading=false;
	set_status("ready");

	//click the buttons if stuff was passed in the query string
	if (query_string[SOL_QUERYSTRING] ) set_sol(query_string[SOL_QUERYSTRING]);
	if (query_string[INSTR_QUERYSTRING] ) set_instrument(query_string[INSTR_QUERYSTRING]);

}

//***************************************************************
function load_images_callback(paJS){
	var oDiv, sHTML, iIndex, oItem;
	
	max_images = 0;
	current_image_index = -1;
	
	//build the html to put into the div
	if (paJS.max == 0)
		sHTML = "No instrument data found";
	else{
		// update the maximum display
		max_images = parseInt(paJS.max);
		document.getElementById(MAX_ID).innerHTML= max_images;
		
		current_image_index = parseInt(paJS.start);
		document.getElementById(CURRENT_ID).innerHTML= current_image_index;
		
		//build the html
		sHTML = "<table class='images'>";
		
		for (iIndex = 0; iIndex < paJS.images.length; iIndex++){
			oItem = paJS.images[iIndex];
			sImgURL = "php/detail.php?sol="+ current_sol + "&instr=" + current_instrument + "&product=" + oItem.p;

			sHTML += 
				"<tr><td>" +
					"<a target='detail' href='" + sImgURL + "'><img src='" +oItem.i + "'></a><br>" +
					"Date: " + oItem.d + "<br>" +
					"Product: " + oItem.p + "<br>" +
					"PDS label: <target='PDS' href='" + oItem.l + "'>" + oItem.l + "</a>" +
				"</td></tr>";
		}
		sHTML += "</table>";
	}
	
	//write out the html
	document.getElementById(IMAGE_ID).innerHTML= sHTML;
	
	loading=false;
	set_status("ready");
}

//***************************************************************
function mark_instruments_callback(paJS){
	var oRadios, i, oRadio;

	set_status("got instruments");
	
	//unmark all instruments
	oRadios= document.getElementsByName(INSTRUMENT_RADIO);
	for ( i = 0; i<oRadios.length; i++){
		oRadio = oRadios[i];
		//oRadio.style.backgroundColour = document.body.style.backgroundColour;
		oRadio.style.backgroundColor = "red";
	}
	

	//mark the instruments remaining
	
	//and reload
	reload();

}


//###############################################################
//# DEBUG
//###############################################################
function debug_console(psMessage){
	if (DEBUG_ON && console) console.log("DEBUG> " + psMessage);
}

//***************************************************************
function write_console(psMessage){
	if (console) console.log(psMessage);
}

//***************************************************************
function getRadioButtonValue(psID){
	var oRadios = document.getElementsByName(psID);
	var sValue = null;
	var oRadio;
	
	for (var i = 0; i<oRadios.length; i++){
		oRadio = oRadios[i];
		if (oRadio.checked) {
			debug_console("found a checked radio");
			sValue = oRadio.value;
			break;
		}
	}
		
	return sValue;
}

//***************************************************************
function getQueryString() {
    var result = {}, keyValuePairs = location.search.slice(1).split('&');

    keyValuePairs.forEach(function(keyValuePair) {
        keyValuePair = keyValuePair.split('=');
        result[keyValuePair[0]] = keyValuePair[1] || '';
    });

    return result;
}
