/**************************************************************************
Copyright (C) Chicken Katsu 2014 

This code is protected by copyright under the terms of the 
Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License
http://creativecommons.org/licenses/by-nc-nd/4.0/legalcode

For licenses that allow for commercial use please contact cluck@chickenkatsu.co.uk

// USE AT YOUR OWN RISK - NO GUARANTEES OR ANY FORM ARE EITHER EXPRESSED OR IMPLIED
**************************************************************************/


var DEBUG_ON = true;
var COLUMNS = 12;

//###############################################################
//# Utility functions 
//###############################################################

function onLoadJQuery(){
	set_status("fetching sites");
	cHttp.fetch_json("php/rest/sites.php?&o=all", sites_callback);
}

//###############################################################
//* call backs 
//###############################################################
function sites_callback(paJS){
	if (paJS == null)
		set_error_status("No sites found");
	else{
		sHTML = "<form target='site' method='GET' action='site.html'><center><table cellpadding=5>";
		iCount =0;
		for (i = 0; i < paJS.length; i++){
			if (iCount == 0) sHTML += "<tr>";
			sHTML += "<TD>";
			if (paJS[i]==1)
				sHTML += "<button name='s' value='"+i+"'>"+i+"</button>";
			else
				sHTML += i;

			sHTML += "</TD>"
				
			iCount++;
			if (iCount >=COLUMNS){
				sHTML+="</tr>";
				iCount = 0;
			}
				
		}
		if (iCount >0) sHTML+="</tr>";

		sHTML += "</table></center></form>";
		$("#sites").html(sHTML);
		set_status("ok");
	}
}

