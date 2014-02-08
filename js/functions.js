var DEBUG_ON = true;
var loading = true;
const SOLS_LIST = "sol_list";
const INSTRUMENT_DIV = "instruments";
const INSTRUMENT_RADIO = "IR";

//***************************************************************
function clicklist(){
	var oDiv;
	
	if (loading) return;
	
	oDiv = document.getElementById("this_sol");
	oDiv.innerHTML = event.target.value;
	reload();
}

//***************************************************************
function reload(){
	var sUrl, sSol, sInstrument;
	var oList, oRadio;
	
	//mutex
	if (loading) return;
	
	// TODO Validate that a list item and instrument are selected
	// otherwise do nothing
	oList = document.getElementById(SOLS_LIST);
	sSol=oList.value;
	if (!sSol){ 	
		debug_console("No Sol Selected")
		return;
	}
		
	sInstrument = getRadioButtonValue(INSTRUMENT_RADIO);
	if (!sInstrument){
		debug_console("No instrument Selected")
		return;
	}
	
	//go ahead and get the data starting at position 0
	loading=true;
	sUrl = "php/images.php?sol=" + sSol + "&instr=" + sInstrument +"&index=0";
	RGraph.AJAX.getJSON(sUrl, load_images_callback);
	
	debug_console("reloading");
}

//***************************************************************
function load_data(){
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
	oDiv = document.getElementById(INSTRUMENT_DIV);
	
	sHTML = "";
	for (iIndex = 0; iIndex < paJS.length; iIndex++){
		oInstr = paJS[iIndex];
		sHTML += "<input type='radio' id='"+ INSTRUMENT_RADIO +"' name='" + INSTRUMENT_RADIO + "' value='" + oInstr.name + "' onchange='reload()'>" + oInstr.caption + "</input><br>";
	}
	oDiv.innerHTML = sHTML;
	loading=false;
}

//***************************************************************
function load_images_callback(paJS){
	loading=false;
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

