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
	var oData, sUrl, oDiv, oImg, oImgDiv, oA, sId;
	
	oDiv = $("#"+poJS.p);
	oDiv.empty();
	
	oData = poJS.d
	if (oData == null){
		oDiv.html("<span class=subtitle>no image found</span>");
		return;
	}
	
	//display details of the product
	sUrl = "detail.html?s=" + poJS.s + "&i=" + poJS.i + "&p=" + poJS.p;
	sId = "i" + poJS.p;
	oImgDiv = $("<DIV>").attr({"id":sId});
	
	oA = $("<A>").attr({href:sUrl, target:"detail"});
	oImg = $("<IMG>").attr({"src": poJS.d.i});
	oImg.on("load", function (){cImgHilite.getHighlights(poJS.s,poJS.i,poJS.p, highlight_callback);});
	oA.append(oImg);
	oImgDiv.append(oA);
	oDiv.append(oImgDiv);
}

//***************************************************************
function highlight_callback(paJS){
	var i, sID, oDiv, oRedBox, iLeft, iTop, iPos, oParentLoc;
	
	if (!paJS.d) return;
	sID = "i" + paJS.p;
	oDiv = $("#"+sID);
	
	for (i=0; i<paJS.d.length; i++){
		aItem = paJS.d[i];
		cDebug.write("orig: top=" + aItem.t + " left=" + aItem.l);
		
		//create a redbox and display it
		oRedBox = $("<DIV>").attr({class:"redbox"});
		oDiv.append(oRedBox);
		
		//place it relative to the parent location
		oParentLoc = oDiv.offset();
		iTop = parseInt(aItem.t) + oParentLoc.top;
		iLeft = parseInt(aItem.l) + oParentLoc.left;
		oRedBox.css({position: 'absolute',	top: iTop,	left: iLeft})
	}
}

//***************************************************************
function tagnames_callback(poJs){
	cTagging.showTagCloud("tags",poJs);
}

//***************************************************************
function tagdetails_callback(paJs){
	var sHTML, i, sItem, aParts;
	var sSol, sInstr, sProd;
	var oList, oLi, sUrl;
	
	set_status("got tag names");
	
	oList = $("#tagdata")
	oList.empty();
	if (!paJs){
		oList.append($("<li>").html("<span class='subtitle'>No instances of this tag found</span>"));
		return;
	}

	//create placeholders for each tag
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

		//load images async
		get_product_data(sSol, sInstr, sProd);
	}
}
