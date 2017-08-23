var goHighlightQueue = new cHttpQueue;

//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//% Definition
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
$.widget( "chickenkatsu.solhighlights",{
	//#################################################################
	//# Definition
	//#################################################################
	options:{
		mission:null,
		sol:null,
		onStatus:null,
		onClick:null
	},
	
	//#################################################################
	//# Constructor
	//#################################################################
	_create: function(){
		var oThis = this;
		var oOptions = this.options;
		var oElement = this.element;
		
		//check for necessary classes
		if (!bean){				$.error("bean class is missing! check includes");	}
		if (!cHttp2){			$.error("http2 class is missing! check includes");	}
		if (!oElement.gSpinner){ 	$.error("gSpinner is missing! check includes");		}

		//check that the options are passed correctly
		if (oOptions.mission == null) $.error("mission is not set");
		if (oOptions.sol == null) $.error("Sol is not set");
		oElement.uniqueId();
		
		//check that the element is a div
		var sElementName = oElement.get(0).tagName;
		if (sElementName !== "DIV")
			$.error("needs a DIV. this element is a: " + sElementName);
		
		//clear out the DIV and put some text in it
		oElement.empty();
		var oLoader = $("<DIV>");
		oLoader.gSpinner({scale: .25});
		oElement.append(oLoader)
		oElement.append("Please wait, loading....")
		
		//ok get the data
		var goHighlightQueue = new cHttpQueue;
		this.pr__get_sol_highlights();
	},
	
	//***************************************************************************
	pr__get_sol_highlights: function(){
		var oParams = {};
		var oThis = this;
		
		this._trigger("onStatus",null,{text:"fetching highlights"});

		oParams[cSpaceBrowser.SOL_QUERYSTRING ] = this.options.sol;
		
		var oHttp = new cHttp2();
		if (cBrowser.data[cSpaceBrowser.MOSAIC_QUERYSTRING] != null){
			oParams[cSpaceBrowser.OUTPUT_QUERYSTRING ] = "mosaic";
			bean.on(oHttp, "result", 	function(poHttp){ oThis.onMosaicResponse(poHttp)}	 );
		}else {
			oParams[cSpaceBrowser.OUTPUT_QUERYSTRING ] = "soldata";
			bean.on(oHttp, "result", 	function(poHttp){ oThis.onSheetResponse(poHttp)}	 );
		}
		
		sUrl = cBrowser.buildUrl("php/rest/img_highlight.php", oParams);
		oHttp.fetch_json(sUrl);
	},
			
	//***************************************************************************
	onMosaicResponse: function(poHttp){
		var oElement = this.element;
		
		oElement.empty();
		var oData = poHttp.response;
		
		if (oData.u == null){
			var oDiv = $("<DIV>",{class:"ui-state-error"});
			oDiv.append("Sorry no Highlights found");
			oElement.append(oDiv);
		}else{
			oImg = $("<IMG>").attr({"src":oData.u});
			oElement.append(oImg);
		}
		this._trigger("onStatus",null,{text:"ok"});
	},
	
	//***************************************************************************
	onSheetResponse: function(poHttp){
		var oElement = this.element;
		var oThis = this;
		
		//-----------------------------------------------------------------
		this._trigger("onStatus",null,{text:"got some data.. processing"});
		oElement.empty();
		
		//-----------------------------------------------------------------
		var iCount = 0;
		var aData = poHttp.response;
		var sInstrument;
		for ( sInstrument in aData){
			var oDiv = $("<DIV>").instrhighlight({
				mission: this.options.mission,
				sol: this.options.sol,
				instr: sInstrument,
				products: aData[sInstrument],
				onClick: function(poEvent,poData){	oThis._trigger("onClick",null,poData)	}
			});
			oElement.append(oDiv);
			oElement.append("<P>");
			iCount ++;
		}
		
		if (iCount == 0){
			var oDiv = $("<DIV>",{class:"ui-state-error"});
			oDiv.append("Sorry no Highlights found");
			oElement.append(oDiv);
		}
	},
});	


//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//% Definition
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
$.widget( "chickenkatsu.instrhighlight",{
	//#################################################################
	//# Definition
	//#################################################################
	options:{
		mission:null,
		sol: null,
		instr: null,
		products: null,
		onClick:null
	},
	
	//#################################################################
	//# Constructor
	//#################################################################
	_create: function(){
		var oThis = this;
		var oOptions = this.options;
		var oElement = this.element;
		
		//check that the options are passed correctly
		if (oOptions.mission == null) $.error("mission is not set");
		if (oOptions.sol == null) $.error("sol is not set");
		if (oOptions.instr == null) $.error("instr is not set");
		if (oOptions.products == null) $.error("products not set");
		oElement.uniqueId();
		
		//check that the element is a div
		var sElementName = oElement.get(0).tagName;
		if (sElementName !== "DIV")
			$.error("needs a DIV. this element is a: " + sElementName);
		
		//clear out the DIV and get it ready for content
		this.initialise();
		//fill the body with widgets for the products
	},
	
	initialise:function (){
		var oOptions = this.options;
		var oElement = this.element;
		var sProduct;
		var oThis = this;
		
		//use the query CSS styles
		oElement.empty();
		oElement.addClass("ui-widget-content");
		
		var oHeader = $("<DIV>", {class:"ui-widget-header"});
		oHeader.append(oOptions.instr);
		oElement.append(oHeader);
		
		var oBody = $("<DIV>",{class:"ui-widget-body"});
		oElement.append(oBody);
		
		//get the list of products
		for (sProduct in oOptions.products){
			var oDiv = $("<DIV>").prodhighlight({
				sol:oOptions.sol, 
				instr:oOptions.instr, 
				product:sProduct, 
				mission:oOptions.mission,
				onClick: function(poEvent,poData){	oThis._trigger("onClick",null,poData)	}
			});
			oBody.append(oDiv);
			oBody.append("<br>");
		}
		
	}
		
});	



//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//% Definition
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
$.widget( "chickenkatsu.prodhighlight",{
	//#################################################################
	//# Definition
	//#################################################################
	options:{
		mission:null,
		sol: null,
		instr: null,
		product: null,
		bodyID:null,
		onClick:null
	},
	consts:{
		WAIT_VISIBLE:750,
		HIGHLIGHT_URL:"php/rest/img_highlight.php"
	},
	//#################################################################
	//# Constructor
	//#################################################################
	_create: function(){
		var oThis = this;
		var oOptions = this.options;
		var oElement = this.element;
		
		//check for necessary classes
		if (!bean){				$.error("bean class is missing! check includes");	}
		if (!cHttp2){			$.error("http2 class is missing! check includes");	}
		if (!oElement.gSpinner){ 	$.error("gSpinner is missing! check includes");		}
		if (!oElement.visible){ 	$.error("visible is missing! check includes");		}
		if (!$.event.special.inview){		$.error("inview class is missing! check includes");	}

		//check that the options are passed correctly
		if (oOptions.mission == null) $.error("mission is not set");
		if (oOptions.sol == null) $.error("sol is not set");
		if (oOptions.instr == null) $.error("instr is not set");
		if (oOptions.product == null) $.error("product not set");
		oElement.uniqueId();
		oOptions.bodyID = oElement.attr("id") + "BODY";
		
		
		//check that the element is a div
		var sElementName = oElement.get(0).tagName;
		if (sElementName !== "DIV")
			$.error("needs a DIV. this element is a: " + sElementName);
		
		//dont do anything if the queue is stopping
		if (goHighlightQueue.stopping) return;
		
		//wait for element to become visible
		oElement.empty();
		var oDiv = $("<DIV>",{class:"highlight_product"});
		oDiv.append("Squeezing limes...");
		oElement.append(oDiv);
		oElement.on('inview', 	function(poEvent, pbIsInView){oThis.onInView(pbIsInView);}	);
		
		this.initialise();
	},

	//*******************************************************************
	//*
	//*******************************************************************
	onInView:function(pbIsInView){
		var oThis = this;
		var oOptions = this.options;
		var oElement = this.element;
		
		//dont do anything if the queue is stopping
		if (goHighlightQueue.stopping) return;

		if (!pbIsInView) return;
		oElement.off("inview");
		
		setTimeout(	
			function(){	oThis.initialise()},
			this.consts.WAIT_VISIBLE
		);
	},
	
	//*******************************************************************
	initialise:function (){
		var oOptions = this.options;
		var oElement = this.element;
		var oThis = this;
		
		//dont do anything if the queue is stopping
		if (goHighlightQueue.stopping) return;
		
		if (!oElement.visible()){
			oElement.on('inview', 	function(poEvent, pbIsInView){oThis.onInView(pbIsInView);}	);
			return;
		}
		
		//get ready to load the data
		oElement.empty();
		var oSpan = $("<SPAN>",{class:"highlight_product"});
		oSpan.append(oOptions.product);
		oElement.append(oSpan);
		
		oSpan = $("<SPAN>",{id:oOptions.bodyID,class:"highlight_body"});
		var oLoader =  $("<DIV>");
		oLoader.gSpinner({scale: .25});
		oSpan.append(oLoader).append( "Catching Dodos... this may take a while");
		oElement.append(oSpan);
		
		//add products to the http queue
		this.load_highlights();
	},
	
	//*******************************************************************
	load_highlights: function(){
		var oOptions = this.options;
		var oThis = this;
		
		var oParams = {};
		oParams[cSpaceBrowser.SOL_QUERYSTRING] = oOptions.sol;
		oParams[cSpaceBrowser.INSTR_QUERYSTRING] = oOptions.instr;
		oParams[cSpaceBrowser.PRODUCT_QUERYSTRING] = oOptions.product;
		oParams[cSpaceBrowser.OUTPUT_QUERYSTRING] = "thumbs";
		oParams[cSpaceBrowser.MISSION_QUERYSTRING] = oOptions.mission.ID;
		var sUrl = cBrowser.buildUrl(this.consts.HIGHLIGHT_URL, oParams);
		
		var oItem = new cHttpQueueItem();
		oItem.url = sUrl;
		bean.on(oItem, "result", 	function(poHttp){oThis.onHighlightResponse(poHttp);}	);				
		bean.on(oItem, "error", 	function(poHttp){oThis.onHighlightError(poHttp);}	);				
		goHighlightQueue.add(oItem);
	},
	
	//*******************************************************************
	onHighlightError: function(poHttp){
		var oOptions = this.options;
		
		var oBody = $("#"+oOptions.bodyID);
		oBody.empty();
		var oDiv = $("<DIV>",{class:"ui-state-error"});
		oDiv.append("Unable to fetch highlights");
		oBody.append(oDiv);
	},	
	
	//*******************************************************************
	onHighlightResponse: function(poHttp){
		var oOptions = this.options;
		var oBody = $("#"+oOptions.bodyID);
		var aUrls = poHttp.response.u;
		
		oBody.empty();

		if (aUrls.length == 0){
			oError = $("<DIV>",{class:"ui-state-error"});
			oError.append("no thumbnails found");
			oBody.append(oError);
		}else{
			var i;
			var oThis = this;
			
			for (i=0 ; i< aUrls.length; i++){
				oImg = $("<IMG>").attr({"src":aUrls[i],"class":"polaroid"});
				oImg.click( 
					function(){		
						goHighlightQueue.stop();
						oThis._trigger(
							"onClick",null,
							{s:oOptions.sol,i:oOptions.instr,p:oOptions.product}
						);
					});
				oBody.append(oImg);
			}
		}
	},
});	

