/****************************************************************************
Copyright (C) Chicken Katsu 2016 www.chickenkatsu.co.uk

This code is protected by copyright under the terms of the 
Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License
http://creativecommons.org/licenses/by-nc-nd/4.0/legalcode

For licenses that allow for commercial use please contact cluck@chickenkatsu.co.uk

// USE AT YOUR OWN RISK - NO GUARANTEES OR ANY FORM ARE EITHER EXPRESSED OR IMPLIED
**************************************************************************/

var DEBUG_ON = true;
var IMAGE_CONTAINER_ID="images";
var CHKTHUMBS_ID="chkThumbs";
var keep_start_image = true;

var cOptions = {
	start_image:1,
	sol:null,
	instrument:null
};

//###############################################################
//* JQUERY
//###############################################################
var cIndexPage = {
	
	onLoadJQuery: function(){	
		var self = this;
		//show the intro blurb if nothing on the querystring
		if (document.location.search.length == 0)
			$("#intro").show();
		
		//load the tabs and show the first one
		instrumentTabs();
		$("#sol-tab").show();

		//remember the start_image if its there
		if (cBrowser.data[cSpaceBrowser.BEGIN_QUERYSTRING] ){
			cOptions.start_image = parseInt(cBrowser.data[cSpaceBrowser.BEGIN_QUERYSTRING]);
		}
		
		//render the sol instrument chooser widget
		//this widget will kick off the image display thru onSelectSolInstrEvent
		$("#sichooser").solinstrumentChooser({
			onStatus: function(poEvent, paHash){self.onStatusEvent(poEvent, paHash)},
			onSelect: function( poEvent, poData){ self.onSelectSolInstrEvent( poEvent, poData)},
			mission:cMission
		});
		
		//render the solbuttons
		$("#solButtons").solButtons({
			onStatus:function(poEvent, paHash){self.onStatusEvent(poEvent, paHash)},
			mission:cMission,
			onClick: function(){ self.stop_queue()},
			onAllSolThumbs: function(){ self.onClickAllSolThumbs()}
		});
		
		//disable thumbs checkbox until something happens
		$("#"+CHKTHUMBS_ID).attr('disabled', "disabled");
		
		//set up keypress monitor
		$("#search_text").keypress( function(e){self.onSearchKeypress(e)} );
		
		// load tagcloud
		$("#tags").tagcloud({mission:cMission});
	},

	//###############################################################
	//# Event Handlers
	//###############################################################
	onClickAllSolThumbs: function(){
		this.stop_queue();
		cOptions.instrument = null;
		cOptions.start_image = -1;
		$("#"+CHKTHUMBS_ID).prop("checked", true).attr('disabled', "disabled");
		$("#sichooser").solinstrumentChooser("deselectInstrument");
		this.load_data();
	},

	//***************************************************************
	onSearchKeypress: function (e){
		this.stop_queue();
		if(e.which == 13) this.onClickSearch();
	},

	//***************************************************************
	onClickSearch: function(){
		this.stop_queue();
		var sText = $("#search_text").val();
		if (sText == "") return;
		cOptions.instrument = null;
		
		if (!isNaN(sText))
			$("#sichooser").solinstrumentChooser("set_sol", sText);
		else{
			var sUrl=cBrowser.buildUrl(cLocations.rest + "/search.php", {s:sText,m:cMission.ID});
			var oHttp = new cHttp2();
			bean.on(oHttp, "result", search_callback);
			oHttp.fetch_json(sUrl);
		}
	},

	//***************************************************************
	onCheckThumbsEvent:function(poEvent){
		this.stop_queue();
		this.load_data();
	},

	//***************************************************************
	onImageClick:function(poEvent, poOptions){
		this.stop_queue();
		var sUrl = cBrowser.buildUrl("detail.php",{s:poOptions.sol,i:poOptions.instrument,p:poOptions.product});
		cBrowser.openWindow(sUrl, "detail");
	},

	//***************************************************************
	onSelectSolInstrEvent: function ( poEvent, poData){
		this.stop_queue();	
		//load the data 
		cDebug.write("selected sol " + poData.sol);
		cOptions.sol = poData.sol;
		cDebug.write("selected instr " + poData.instrument);
		cOptions.instrument = poData.instrument;
		if (!keep_start_image)		cOptions.start_image = 1
		keep_start_image = false;
		this.load_data();
	},

	//***************************************************************
	onStatusEvent: function(poEvent, paHash){
		set_status(paHash.data);
	},

	//***************************************************************
	onThumbClickEvent: function(poEvent, poData){
		
		this.stop_queue();
		var sUrl = cBrowser.buildUrl("detail.php",{s:poData.sol,i:poData.instr,p:poData.product});
		cDebug.write("loading page " + sUrl);
		$("#"+ IMAGE_CONTAINER_ID).empty().html("redirecting to: "+ sUrl);
		setTimeout(	
			function(){		cBrowser.openWindow(sUrl, "detail");},
			0
		);
	},

	//***************************************************************
	onImagesLoadedEvent:function(poEvent, piStartImage){
		//enable thumbnails
		$("#solthumbs").removeAttr('disabled');	
		cOptions.start_image = piStartImage;
		this.update_url();
	},

	//###############################################################
	//# Utility functions 
	//###############################################################
	update_url:function(){
		var oParams = {}
		oParams[cSpaceBrowser.SOL_QUERYSTRING] = cOptions.sol;
		if (cOptions.instrument)	oParams[cSpaceBrowser.INSTR_QUERYSTRING] = cOptions.instrument;
		if (this.is_thumbs_checked())	oParams[cSpaceBrowser.THUMB_QUERYSTRING] = "1";
		if (cOptions.start_image)		oParams[cSpaceBrowser.BEGIN_QUERYSTRING] =cOptions.start_image;
		var sUrl = cBrowser.buildUrl(cBrowser.pageUrl() , oParams);
		cBrowser.pushState("Index", sUrl);
	},

	//***************************************************************
	stop_queue: function(){
		var oDiv;
		try{
			oDiv = $("#"+ IMAGE_CONTAINER_ID);
			oDiv.thumbnailview("stop_queue");
		}
		catch (e){}
	},

	//***************************************************************
	is_thumbs_checked:function(){
		return $("#"+CHKTHUMBS_ID).is(':checked');
	},

	//***************************************************************
	load_data: function(){
		var oChkThumb;
		var self = this;
		this.update_url();
		
		cDebug.write("loading data: " + cOptions.sol+ ":" + cOptions.instrument);
		
		$("#solButtons").solButtons("set_sol", cOptions.sol);
		oChkThumb = $("#"+CHKTHUMBS_ID);
		
		if (cOptions.instrument){
			oChkThumb.removeAttr("disabled");
			oChkThumb.off("change");
			if (cBrowser.data[cSpaceBrowser.THUMB_QUERYSTRING] ){
				oChkThumb.prop('checked', true);
				this.show_thumbs(cOptions.sol, cOptions.instrument);
			}else
				this.show_images(cOptions.sol, cOptions.instrument, cOptions.start_image);
			oChkThumb.on("change", function(poEvent){self.onCheckThumbsEvent(poEvent)} );
		}else{
			oChkThumb.attr('disabled', "disabled");
			this.show_thumbs(cOptions.sol, cSpaceBrowser.ALL_INSTRUMENTS);
		}
	},


	//###############################################################
	//* GETTERS
	//###############################################################
	show_thumbs: function(psSol, psInstrument){
		var oWidget, oDiv;
		cDebug.write("showing  thumbs for " + psSol + " : " + psInstrument);
		var self=this;
		
		var oDiv = $("#"+ IMAGE_CONTAINER_ID);
		if (oDiv.length == 0) $.error("image DIV not found ");
		
		if(oDiv.thumbnailview("instance") != undefined) 
			oDiv.thumbnailview("destroy");
		
		cDebug.write("creating widget");
		oWidget = oDiv.thumbnailview({		 // apply widget
			sol:psSol, 
			instrument:psInstrument,
			onStatus:function(poEvent, paHash){self.onStatusEvent(poEvent, paHash)}, 			//TODO replace with events
			onClick: function(poEvent, poData){ self.onThumbClickEvent(poEvent, poData)},
			mission:cMission
		});
	},

	//***************************************************************
	show_images: function( piSol, psInstr, piStartImage){
		var sUrl;
		var self = this;
		cDebug.write("showing  images for " + piSol + " : " + psInstr);
		
		var oWidget, oDiv;
		
		var oDiv = $("#"+ IMAGE_CONTAINER_ID);
		if (oDiv.length == 0) $.error("image DIV not found");
		
		oWidget = oDiv.data("ckImageview");
		if ( oWidget){ oWidget.destroy();}
		
		cDebug.write("creating widget");
		oWidget = oDiv.imageview({		 // apply widget
			sol:piSol, 
			instrument:psInstr,
			start_image: piStartImage,
			onStatus:function(poEvent, paHash){self.onStatusEvent(poEvent, paHash)},
			onLoaded:function(poEvent, piStartImage){ self.onImagesLoadedEvent(poEvent, piStartImage)},
			onClick: function(poEvent, poOptions){ self.onImageClick(poEvent, poOptions)},
			mission:cMission
		});
	},


	//###############################################################
	//* call backs 
	//###############################################################
	search_callback: function(poHttp){
		var sUrl;
		
		var oData = poHttp.response;
		if (!oData)
			set_status("not a valid search");
		else{
			set_status("got search callback");
			var sUrl = cBrowser.buildUrl("detail.php" , {s:oData.s,i:oData.d.instrument,p:oData.d.itemName});
			document.location.href = sUrl;
		}
	}
}

