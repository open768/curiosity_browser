var DEBUG_ON = true;
var loading = true;
const SOLS_LIST = "sol_list";
const INSTRUMENT_DIV = "instruments";
const INSTRUMENT_RADIO = "IR";
const MAX_ID="max";
const MAX_ID2="max2";
const CURRENT_ID = "current";
const CURRENT_ID2 = "current2";
const IMAGE_ID="images";
const SOL_ID = "this_sol";
const SOL_QUERYSTRING = "s";
const INSTR_QUERYSTRING = "i";
const MAXIMAGES_QUERYSTRING = "m";
const IMAGE_QUERYSTRING = "b";

const RADIO_BACK_COLOUR = "gold";
const BODY_COLOUR = "LemonChiffon";

var HOW_MANY_IMAGES = 5;
var current_image_index = 0;
var current_sol = null;
var current_instrument = null;
var max_images = -1;
var reload_after_instr = false;

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
function OnClickNext(){
	var iNext;
	
	if (!OKToReload()) return;
	iNext = current_image_index + HOW_MANY_IMAGES;
	if (iNext > max_images) return;
	
	//go ahead and get the data 
	get_image_data(current_sol, current_instrument,iNext,iNext+HOW_MANY_IMAGES);
}

//***************************************************************
function OnClickPrevious(){
	var iPrevious;
	
	if (!OKToReload()) return;
	iPrevious = current_image_index - HOW_MANY_IMAGES;
	if (iPrevious <= 0 ) return;

	//go ahead and get the data 
	get_image_data(current_sol, current_instrument,iPrevious,iPrevious+HOW_MANY_IMAGES);
}

//###############################################################
//# Utility functions 
//###############################################################

function mark_instrument(psInstr){
	var aRadios, radio_idx, oRadio;
	
	//find and mark the selected instrument remaining
	aRadios= document.getElementsByName(INSTRUMENT_RADIO);
	for ( radio_idx = 0; radio_idx<aRadios.length; radio_idx++){
		oRadio = aRadios[radio_idx];
		if (oRadio.value == psInstr){
			oRadio.checked=true;
			set_instrument(psInstr);
			break;
		}
	}
}

//***************************************************************
function set_instrument(psInstr){
	debug_console("setting instrument: " + psInstr);
	current_instrument = psInstr;
	reload_data();
}

//***************************************************************
function mark_sol(psSol){
	var aSols, sol_idx, oSol;
	
	aSols = document.getElementById(SOLS_LIST).children;

	for ( sol_idx = 0; sol_idx<aSols.length; sol_idx++){
		oSol = aSols[sol_idx];
		if (oSol.value == psSol){
			debug_console("found it");
			oSol.selected=true;
			reload_after_instr = true;
			set_sol(psSol);
			break;
		}
	}
}

//***************************************************************
function set_sol(psSol){
	debug_console("setting sol: " + psSol);
	current_sol = psSol;
	document.getElementById(SOL_ID).innerHTML = current_sol;
	mark_instruments(current_sol);
}

//***************************************************************
function mark_instruments(psSol){
	sUrl = "php/instruments.php?s=" + psSol;
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
		set_status("Now select an instrument")
		return false;
	}
	
	return true;
}

//***************************************************************
function reload_data(){
	var sUrl;
	
	if (!OKToReload()) return;

	//go ahead and get the data starting at position 0
	get_image_data(current_sol, current_instrument,1,HOW_MANY_IMAGES);
}

//***************************************************************
function get_image_data( piSol, psInstr, piStart, piEnd){
	var sUrl;
	
	sUrl = getBaseURL() +"?s=" + current_sol + "&i=" + current_instrument +"&b=" + piStart;
	window.history.pushState("", "Detail", sUrl);
	
	loading=true;
	sUrl = "php/images.php?s=" + piSol + "&i=" + psInstr +"&b=" + piStart + "&e=" + piEnd;
	set_status("fetching image data...");
	debug_console(sUrl);
	RGraph.AJAX.getJSON(sUrl, load_images_callback);
}

//***************************************************************
function load_data(){
	set_status("loading static data...");
	if (query_string[MAXIMAGES_QUERYSTRING] )
		HOW_MANY_IMAGES = parseInt(query_string[MAXIMAGES_QUERYSTRING]);
		

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
	
	// mark the sol
	if (query_string[SOL_QUERYSTRING] ) 
		mark_sol(query_string[SOL_QUERYSTRING]);
	
}

//***************************************************************
function load_instruments_callback(paJS){
	var sHTML, iIndex, oInstr;
	
	sHTML = "";
	for (iIndex = 0; iIndex < paJS.length; iIndex++){
		oInstr = paJS[iIndex];
		sHTML += "<span><input type='radio' id='"+ INSTRUMENT_RADIO +"' name='" + INSTRUMENT_RADIO + "' value='" + oInstr.name + "'onchange='OnChangeInstrument()'>" + oInstr.caption + "</input></span><br>";
	}
	document.getElementById(INSTRUMENT_DIV).innerHTML = sHTML;
	loading=false;
	set_status("ready");

	//click the buttons if stuff was passed in the query string
	if (query_string[INSTR_QUERYSTRING] ) 
		mark_instrument(query_string[INSTR_QUERYSTRING]);

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
		document.getElementById(MAX_ID2).innerHTML= max_images;
		
		current_image_index = parseInt(paJS.start);
		document.getElementById(CURRENT_ID).innerHTML= current_image_index;
		document.getElementById(CURRENT_ID2).innerHTML= current_image_index;
		
		//build the html
		sHTML = "<table class='images'>";
		
		for (iIndex = 0; iIndex < paJS.images.length; iIndex++){
			oItem = paJS.images[iIndex];
			sImgURL = "detail.html?s="+ current_sol + "&i=" + current_instrument + "&p=" + oItem.p;

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
	var aRadios, instr_idx, radio_idx, oRadio, oSpan, sInstr;

	set_status("got instruments");
	
	//unmark all instruments
	aRadios= document.getElementsByName(INSTRUMENT_RADIO);
	for ( radio_idx = 0; radio_idx<aRadios.length; radio_idx++){
		oRadio = aRadios[radio_idx];
		oRadio.parentNode.style.visibility = "hidden";
	}
	
	//mark the instruments remaining
	for ( instr_idx = 0; instr_idx<paJS.length; instr_idx++){
		sInstr = paJS[instr_idx];
		for ( radio_idx = 0; radio_idx<aRadios.length; radio_idx++){
			oRadio = aRadios[radio_idx];
			if (oRadio.value == sInstr)
				oRadio.parentNode.style.visibility = "visible";
		}
	}
	
	set_status("ready");
	
	if 	(current_instrument || reload_after_instr){
		reload_after_instr = false;
		reload_data();
	}
}
