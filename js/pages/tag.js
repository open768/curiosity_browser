/**************************************************************************
Copyright (C) Chicken Katsu 2014 

This code is protected by copyright under the terms of the 
Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License
http://creativecommons.org/licenses/by-nc-nd/4.0/legalcode

For licenses that allow for commercial use please contact cluck@chickenkatsu.co.uk

// USE AT YOUR OWN RISK - NO GUARANTEES OR ANY FORM ARE EITHER EXPRESSED OR IMPLIED
**************************************************************************/


var DEBUG_ON = true;
var SOL_ATTR = "sa";
var INSTRUMENT_ATTR = "ia";
var PRODUCT_ATTR = "pa";
var goQueue = null;
var MAX_TRANSFERS = 5;

//###############################################################
//# Utility functions 
//###############################################################
bean.on(cJQueryObj, "OnJqueryLoad", onLoadJQuery_TAG);
function onLoadJQuery_TAG()
{
	var sTag = cBrowser.data["t"];
	
	//restart the queue
	if (goQueue) goQueue.stop();
	goQueue= new cActionQueue();
	goQueue.MAX_TRANSFERS = MAX_TRANSFERS; 
	
	bean.on(goQueue, "response", onQueueResponse);

	//get the data for the page
	$("#tagname").html(sTag);
	cTagging.getTagDetails(sTag, tagdetails_callback);
	cTagging.getTagNames(tagnames_callback);
}

//***************************************************************
function get_product_data( psSol, psInstr, psProd){
	var sURL;
	
	loading = true;
	sURL = "php/rest/detail.php?s=" + psSol + "&i=" + psInstr +"&p=" + psProd;
	set_status("fetching data for "+ psProd);
	goQueue.add(psProd, sURL);
	goQueue.start();
}

//###############################################################
//* call backs 
//###############################################################
function onQueueResponse(poJson){
	var  oDiv, oImg;
	var sProd, sSol, sInstr, sImgUrl, sID;
	
	sID = poJson.p;
	
	//--- get the DIV ready
	oDiv = $("#"+sID);
	oDiv.empty();
	oData = poJson.d;
	if (oData == null){
		oDiv.html("<span class=subtitle>no image found</span>");
		return;
	}
	
	//display Image
	oImg = $("<IMG>").attr({"src": poJson.d.i});
	oImg.data(SOL_ATTR,poJson.s);
	oImg.data(INSTRUMENT_ATTR,poJson.i);
	oImg.data(PRODUCT_ATTR,poJson.p);
	oImg.load(onImageLoad);
	
	oDiv.append(oImg);
}

//***************************************************************
function onImageLoad(){
	var oImg = $(this);
	var sSol = oImg.data(SOL_ATTR);
	var sInstr = oImg.data(INSTRUMENT_ATTR);
	var sProd = oImg.data(PRODUCT_ATTR);
	oImg.click(onImageClick);

	cImgHilite.getHighlights(sSol,sInstr,sProd, highlight_callback);
}

//***************************************************************
function onImageClick(){
	if (goQueue) goQueue.stop();
	
	var oImg = $(this);
	var sSol = oImg.data(SOL_ATTR);
	var sInstr = oImg.data(INSTRUMENT_ATTR);
	var sProd = oImg.data(PRODUCT_ATTR);
	
	sUrl = "detail.php?s=" + sSol + "&i=" + sInstr + "&p=" + sProd;
	cBrowser.openWindow(sUrl, "detail");
}

//***************************************************************
function highlight_callback(paJS){
	var i, oDiv, oRedBox, iLeft, iTop, iPos, oParentLoc;
	
	if (!paJS.d) return;
	oDiv = $("#"+paJS.p);
	
	for (i=0; i<paJS.d.length; i++){
		aItem = paJS.d[i];
		cDebug.write("orig: top=" + aItem.t + " left=" + aItem.l);
		
		//create a redbox and display it
		oRedBox = $("<DIV>").attr({class:"redbox"});
		oDiv.append(oRedBox);
		
		//place it relative to the parent location
		iTop = parseInt(aItem.t);
		iLeft = parseInt(aItem.l);
		oRedBox.css({position: 'absolute',	top: iTop,	left: iLeft})
	}
}

//***************************************************************
function tagnames_callback(poJs){
	cTagging.showTagCloud("tags",poJs);
}

//***************************************************************
function tagdetails_callback(paJs){
	var i, sItem, aParts, sSol, sInstr, sProd, oList, oLi, oDiv;
	
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
		
		
		oDiv = $("<div>").attr({"id": sProd}).css({position: 'relative'});
		
		oLi = $("<LI>");
		oLi.append(sSol + ", " + sInstr + ", " + sProd );
		oLi.append(oDiv).append("Loading image...");
		oList.append(oLi);

		//load images async
		get_product_data(sSol, sInstr, sProd);
	}
}
