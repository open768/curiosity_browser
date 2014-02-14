var DEBUG_ON = true;
var query_string = getQueryString();
const STATUS_ID = "status";

//***************************************************************
function set_status(psStatus){
	document.getElementById(STATUS_ID).innerHTML= psStatus;
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
