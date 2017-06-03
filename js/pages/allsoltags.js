/**************************************************************************
Copyright (C) Chicken Katsu 2014 

This code is protected by copyright under the terms of the 
Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License
http://creativecommons.org/licenses/by-nc-nd/4.0/legalcode

For licenses that allow for commercial use please contact cluck@chickenkatsu.co.uk

// USE AT YOUR OWN RISK - NO GUARANTEES OR ANY FORM ARE EITHER EXPRESSED OR IMPLIED
**************************************************************************/


var DEBUG_ON = true;
var COLUMNS = 18;
var goSolIndex = null;

//###############################################################
//# Utility functions 
//###############################################################
function onLoadJQuery_TAGS(){
	set_status("fetching tags");
	
	var oHttp = new cHttp2();
	bean.on(oHttp, "result", onTagResponse);
	oHttp.fetch_json("php/rest/tag.php?&o=topsolindex");
}


//###############################################################
//* call backs 
//###############################################################
function onTagResponse(poHttp){
	goSolIndex = poHttp.response;
	if (goSolIndex == null)
		set_error_status("No Tags found");
	else{
		set_status("fetching sols");
		var oHttp = new cHttp2();
		bean.on(oHttp, "result", onSolsResponse);
		oHttp.fetch_json("php/rest/sols.php");
	}
}

function onSolsResponse(poHttp){
	var sHTML, i, iCount, sSol;
	var aData = poHttp.response;
	sHTML = "<form method='GET' action='soltag.php'><center><table cellpadding=5>";
	iCount =0;
	for (i = 0; i < aData.length; i++){
		if (iCount == 0) sHTML += "<tr>";
		sSol = aData[i].sol.toString();
		sHTML += "<TD align=middle>"

		if (goSolIndex[sSol])
			sHTML += "<button name='s' value='"+sSol+"'>"+sSol+"</button>";
		else
			sHTML += "<a href='index.php?s=" + sSol+"'>"+sSol+"</a>";

		sHTML += "</TD>"
			
		iCount++;
		if (iCount >=COLUMNS){
			sHTML+="</tr>";
			iCount = 0;
		}
			
	}
	if (iCount >0) sHTML+="</tr>";

	sHTML += "</table></center></form>";
	
	$("#soltag").html(sHTML);
	set_status("ok");
}

