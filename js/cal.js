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
function onClick(){
	alert("not implemented yet");
}

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
	var sSol, aDates, aHeadings, aTimes, i,j,k, sDKey, sTKey, sHTML, aItems, oItem, sID;
	set_status("received data...");

	sSol = paJS.sol;
	aDates = paJS.cal;
	
	// get the headings
	aHeadings=Array();
	for (sDKey in aDates)
		aHeadings.push(sDKey);
	
	//get and sort the times
	aTimes = Array();
	for (sDKey in aDates)
		for (sTKey in aDates[sDKey])
			if (aTimes.indexOf(sTKey) == -1)
				aTimes.push(sTKey);
	aTimes.sort();
	
	//build the html
	sHTML = "<table class='cal'>";
		sHTML += "<tr><td></td>";
			for (i=0; i<aHeadings.length; i++)
				sHTML += "<TH class='caldate'>" + aHeadings[i] +"</TH>";
		sHTML += "</tr>";
		for (i=0; i<aTimes.length; i++){
			sTKey = aTimes[i];
			sHTML += "<tr><TH class='caltime'>" + aTimes[i] +"</TH>";
			for (j=0; j<aHeadings.length; j++){
				sDKey = aHeadings[j];
				sHTML += "<td>" ;
					if (aDates[sDKey].hasOwnProperty(sTKey)){
						aItems = aDates[sDKey][sTKey];
						for (k=0; k<aItems.length; k++){
							oItem = aItems[k];
							sID = oItem.i + ":" + oItem.p ; //TBD
							sHTML += "<button class='calbutton' id='"+ sID + "' onclick='onClick();'>"+oItem.i + "</button> ";
						}
					}
				sHTML += "</td>";
			}
			sHTML += "</tr>";
		}
				
	sHTML += "</table>";
	
	document.getElementById("calendar").innerHTML = sHTML;
	
	//we're done
	set_status("OK");
}

