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

var current_sol = null;
var current_date = null;
var oColours = {};

//###############################################################
//# Event Handlers
//###############################################################
function onClick(){
	var sInstr = event.target.attributes.i.value;
	var sProduct = event.target.attributes.p.value;
	var sUrl = cBrowser.buildUrl("detail.php",{s:current_sol,i:sInstr,p:sProduct});
	cBrowser.openWindow(sUrl, "detail");
}

function onClickGotoSol(){
	var sUrl = cBrowser.buildUrl("index.php",{s:current_sol});
	cBrowser.openWindow(sUrl, "index");
}

function onClickNext(){
	var iSol = parseInt(current_sol) +1;
	cBrowser.pushState("Detail", cBrowser.pageUrl() +"?s=" + iSol);
	get_calendar_data(iSol);
}
function onClickPrevious(){
	var iSol = parseInt(current_sol) -1;
	cBrowser.pushState("Detail", cBrowser.pageUrl() +"?s=" + iSol);
	get_calendar_data(iSol);
}

function onClickRefresh(){
	set_status("refreshing data");
	
	var sUrl = cBrowser.buildUrl("php/rest/instruments.php",{s:current_sol,r:"true",m:cMission.ID}); //force a refresh on the server
	var oHttp = new cHttp2();
	bean.on(oHttp,"result",onLoadJQuery_CAL);
	oHttp.fetch_json(sUrl);

}


//###############################################################
//# Utility functions 
//###############################################################
function onLoadJQuery_CAL(){
	current_date = cBrowser.data[cSpaceBrowser.DATE_QUERYSTRING];
	get_calendar_data( cBrowser.data[cSpaceBrowser.SOL_QUERYSTRING]);
}

//***************************************************************
function get_calendar_data( psSol){
	var sUrl;
	
	$("#sol").html(psSol);
	$("#gotoSOL").html(psSol);
	current_sol = psSol;
	
	loading=true;
	set_status("fetching calendar data for sol:"+ psSol);

	var sUrl = cBrowser.buildUrl("php/rest/cal.php",{s:psSol,m:cMission.ID});
	var oHttp = new cHttp2();
	oHttp.sol = psSol;
	bean.on(oHttp,"result",onCalResponse);
	bean.on(oHttp,"error",onCalError);
	oHttp.fetch_json(sUrl);
}
//###############################################################
//* call backs 
//###############################################################
function onCalError(poHttp){
	set_status("Error getting calendar for sol" + poHttp.sol);
	$("#colours").empty();
	$("#calendar").empty();
	$("#calendar").html("Sorry there was an error");
}

function onCalResponse(poHttp){
	var sSol, aDates, aHeadings, aTimes, i,j,k, sDKey, sTKey, sHTML, aItems, oItem, sID, sColour, sStyle, oDiv;
	var oOuterSpan, oInnerSpan;
	var aInstr, oInstr;
	
	set_status("received data...");

	var oData = poHttp.response;
	sSol = oData.sol;
	aDates = oData.cal;
	aInstr = oData.instr;
	
	//display the colours and build the colour array
	oDiv = $("#colours").empty();
	for (i=0 ; i<aInstr.length; i++){
		oInstr = aInstr[i];
		oInnerSpan = $("<span>").attr({style:"background-color:" + oInstr.colour}).append("&nbsp;&nbsp;&nbsp;");
		oOuterSpan = $("<span>").attr({class:'greybox'}).append(oInstr.name).append("&nbsp;");
		oOuterSpan.append(oInnerSpan);
		oDiv.append(oOuterSpan);
		oDiv.append("&nbsp;");
		oColours[oInstr.abbr] = oInstr.colour;
	}
	
	
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
	
	//build the table
	var oTable, oRow, oCell, oButton;
	$("#calendar").empty();
	
	oTable = $("<table>").attr({class:"cal"});
	//--the header row of the table
	oRow = $("<TR>");
	oRow.append($("<TD>"));
	for (i=0; i<aHeadings.length; i++){
		oCell = $("<TH>").attr({class:"caldate"}).append("UTC:" + aHeadings[i] );
		oRow.append(oCell);
	}
	oTable.append(oRow);
	
	//render the table
		for (i=0; i<aTimes.length; i++){
			sTKey = aTimes[i];
			oRow = $("<TR>").attr({class:"caltime"});
			oCell = $("<TH>").append(aTimes[i]);
			oRow.append(oCell);
			
			for (j=0; j<aHeadings.length; j++){
				sDKey = aHeadings[j];
				oCell = $("<td>");
				if (aDates[sDKey].hasOwnProperty(sTKey)){
					aItems = aDates[sDKey][sTKey];
					for (k=0; k<aItems.length; k++){
						oItem = aItems[k];
						sColour = oColours[oItem.i];
						sStyle = "background-color:" + sColour;
						if (oItem.d === current_date){
							cDebug.write("found a match");
							sStyle += ";border:4px double black" 
						}

						oButton = $("<button>").attr({
								class:"calbutton roundbutton",style:sStyle,
								i:oItem.i,p:oItem.p,
								title:oItem.p 
						}).append("&nbsp;");
						oButton.click(onClick);
						
						oCell.append(oButton);
					}
				}
				oRow.append(oCell);
			}
			oTable.append(oRow);
		}
	
	//render the table
	$("#calendar").append(oTable);
	
	//we're done
	set_status("OK");
}

