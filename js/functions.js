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
	if (loading) return;
	loading=true;

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
		sHTML += "<input type='radio' name='" + INSTRUMENT_RADIO + "' value='" + oInstr.value + "' onchange='reload()'>" + oInstr.caption + "</input><br>";
	}
	oDiv.innerHTML = sHTML;
	loading=false;
}


//###############################################################
//# DEBUG
//###############################################################
function debug_console(psMessage){
	if (DEBUG_ON && console) console.log("DEBUG> " + psMessage);
}
function write_console(psMessage){
	if (console) console.log(psMessage);
}