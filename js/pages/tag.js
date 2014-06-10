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

function onLoadJQuery(){
	var sTag = cBrowser.data["t"];
	$("#tagname").html(sTag);
	cTagging.getTagDetails(sTag, tagdetails_callback);
	cTagging.getTagNames(tagnames_callback);
}

//***************************************************************
function get_product_data( psSol, psInstr, psProd){
	var sURL;
	
	loading=true;
	sURL = "php/rest/detail.php?s=" + psSol + "&i=" + psInstr +"&p=" + psProd;
	set_status("fetching data for "+ psProd);
	cHttp.fetch_json(sURL, load_product_callback);
}

//###############################################################
//* call backs 
//###############################################################
function load_product_callback(poJS){
	var oData, sUrl, oDiv, oA;
	
	oDiv = $("#"+poJS.p);
	oDiv.empty();
	
	oData = poJS.d
	if (oData == null){
		oDiv.html("<span class=subtitle>no image found</span>");
		return;
	}
	
	sUrl = "detail.html?s=" + poJS.s + "&i=" + poJS.i + "&p=" + poJS.p;
	oA = $("<A>").attr({"href":sUrl, "target":"detail"});
	
	oA.append($("<IMG>").attr({"src": poJS.d.i, "width":"100%"}));
	
	oDiv.append(oA);
}

function tagnames_callback(poJs){
	cTagging.showTagCloud("tags",poJs);
	set_status("got tag names");
}

//***************************************************************
function tagdetails_callback(paJs){
	var sHTML, i, sItem, aParts;
	var sSol, sInstr, sProd;
	var oList, oLi, sUrl;
	
	set_status("got tag names");
	
	oList = $("#tagdata")
	oList.empty();
	if (!paJs)
		oList.append($("<li>").html("<span class='subtitle'>No instances of this tag found</span>"));
	else{
		for (i=0 ; i<paJs.length; i++){
			cDebug.write("got a detail: " + sItem);
			sItem = paJs[i];
			aParts = sItem.split("/");
			sSol = aParts[0];
			sInstr = aParts[1];
			sProd = aParts[2];
			
			
			oLi = $("<LI>");
			oLi.append(sSol + ", " + sInstr + ", " + sProd );
			oLi.append($("<div>").attr({"id": sProd}).append("Loading image..."));
			
			oList.append(oLi);
			
			get_product_data(sSol, sInstr, sProd);
		}
	}
}
