/**************************************************************************
Copyright (C) Chicken Katsu 2014 

This code is protected by copyright under the terms of the 
Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License
http://creativecommons.org/licenses/by-nc-nd/4.0/legalcode

For licenses that allow for commercial use please contact cluck@chickenkatsu.co.uk

// USE AT YOUR OWN RISK - NO GUARANTEES OR ANY FORM ARE EITHER EXPRESSED OR IMPLIED
**************************************************************************/


var DEBUG_ON = true;
//###############################################################
//# Utility functions 
//###############################################################

function load_data(){
	var sTag = cBrowser.data["t"];
	document.getElementById("tagname").innerHTML = sTag;
	cTagging.realm="Curiosity";
	
	cTagging.getTagDetails(sTag, tagdetails_callback);
	cTagging.getTagNames(tagnames_callback);
}

//###############################################################
//* call backs 
//###############################################################
function tagnames_callback(poJs){
	var sHTML = "";
	var sKey, iCount;
	
	for (sKey in poJs){
		iCount = poJs[sKey];
		sHTML += "<a href='tag.html?t=" + sKey  + "'>" + sKey + "[" + iCount + "]</a> ";
	}
	document.getElementById("tags").innerHTML = sHTML;
	
	set_status("got tag names");
}

//***************************************************************
function tagdetails_callback(paJs){
	var sHTML, i, sItem, aParts;
	var sSol, sInstr, sProd;
	
	sHTML = "";
	set_status("got tag names");
	
	if (!paJs)
		sHTML = "<li>No instances of this tag found";
	else
		for (i=0 ; i<paJs.length; i++){
			cDebug.write("got a detail: " + sItem);
			sItem = paJs[i];
			aParts = sItem.split("/");
			sSol = aParts[0];
			sInstr = aParts[1];
			sProd = aParts[2];
			sUrl = "detail.html?s="+sSol +"&i=" + sInstr + "&p=" + sProd;
			
			sHTML += "<li>sol:<i>" + sSol + "</i> Instrument:<i>" + sInstr +"</i> Product: <a target='detail' href='" + sUrl + "'>" + sProd + "</a>";
		}
		
	document.getElementById("tagdata").innerHTML = sHTML;
}
