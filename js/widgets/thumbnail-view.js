$.widget( "chickenkatsu.thumbnailview",{
	//#################################################################
	//# Definition
	//#################################################################
	consts:{
		BASIC_URL:"php/rest/solthumbs.php",
		BETTER_URL:"php/rest/solthumb.php",
		THUMB_ORIG_COLOR: "aliceblue",
		THUMB_WORKING_COLOR: "blanchedalmond",
		THUMB_ERROR_COLOR: "#ffe5ff",
		THUMB_FINAL_COLOR: "white",
		THUMB_MISSING_COLOR: "mistyrose"
	},
	state:{
		currentThumbnail :0,
		queue: null
	},
	options:{
		ThumbsPerPage: 100,
		StopOnClick: true,
		sol: null,
		instrument: null,
	},
	
	//#################################################################
	//# Constructor
	//#################################################################
	_create: function(){
		//check that the options are passed correctly
		if (this.options.sol == null) $.error("sol is not set");
		this.element.uniqueId();
		
		//check that the element is a div
		var sElementName = this.element.get(0).tagName;
		if (sElementName !== "DIV")
			$.error("thumbnail view needs a DIV. this element is a: " + sElementName);
		
		//clear out the DIV and put some text in it
		this.element.empty();
		this.element.append("Loading thumbnails for sol:" + this.options.sol);
		if (this.options.instrument) this.element.append(", instr:" + this.options.instrument);

		//start the normal thumbnail download
		this._priv_load_basic_thumbnails();
	},
	
	//#################################################################
	//# Privates
	//#################################################################
	_priv_load_basic_thumbnails: function(){
		var oWidget = this;
		
		this._trigger("onStatus", null, {text:"loading basic thumbnails"});
		sUrl = this.consts.BASIC_URL + "?s=" + this.options.sol + "&i=" + this.options.instrument;
		cHttp.fetch_json(sUrl, function(poJS){oWidget._priv_onThumbsJS(poJS)});
	},
	
	//******************************************************************
	stop_queue: function(){
		cDebug.write("stopping queue");
		if (this.state.queue){
			this.state.queue.stop();
			this.state.queue = null;
		}
	},
	
	//#################################################################
	//# Events
	//#################################################################
	_priv_onThumbsJS: function(poJS){
		var i, aData, oItem, oQueue;
		var oWidget = this;

		this._trigger("onStatus", null, {text:"got basic thumbnails"});
		this._trigger("onBasicThumbnail");
		
		// set up the processing queue for better thumbnails
		this.stop_queue();		//just in case stop any existing queue
		
		this.state.queue = new cActionQueue();
		bean.on(this.state.queue, "response", function(poJS){ oWidget._priv_onBetterThumbJS(poJS); });
		bean.on(this.state.queue, "starting", function(psProduct){oWidget._priv_on_queue_start(psProduct); });
		bean.on(this.state.queue, "error", function(poHttp){ oWidget._priv_on_q_error(poHttp); });
		
		// ok load the thumbnails
		this.element.empty();
		
		aData = poJS.d.data;
		if (aData.Length == 0){
			this.element.append("<p class='subtitle'>Sorry no thumbnails found</p>");
			this._trigger("onStatus", null, {text:"finished thumbnails"});
		}else{
			for (i=0; i< aData.length; i++){
				
				oItem = aData[i];

				oImg = $("<IMG>",{title:oItem.p,border:0,height:THUMB_SIZE,src:oItem.i,class:"polaroid-frame",id:this.element.id+oItem.p});
				oImg.css("border-color",this.consts.THUMB_ORIG_COLOR); 
				oImg.data(SOL_ATTR,poJS.s);
				oImg.data(INSTRUMENT_ATTR,oItem.data.instrument);
				oImg.data(PRODUCT_ATTR,oItem.p);
				oImg.load( function(){oWidget._priv_onBasicThumbLoaded(this) }); //this triggers the queue
				oImg.click(function(){oWidget._priv_onThumbClick(this) });
				
				this.element.append(oImg);
			}
		}
	},
	
	//******************************************************************
	_priv_onBasicThumbLoaded: function(poElement){
		var sQUrl, sSol, sInstr, sProd;
		var oImg = $(poElement);
		oImg.off("load"); //remove the load event so it doesnt fire again
		
		sSol = oImg.data(SOL_ATTR);
		sInstr = oImg.data(INSTRUMENT_ATTR);
		sProd = oImg.data(PRODUCT_ATTR);
		
		sQUrl = this.consts.BETTER_URL + "?s=" + sSol + "&i=" + sInstr + "&p=" + sProd;
		this.state.queue.add(sProd, sQUrl);
		this.state.queue.start();
	},
	
	//******************************************************************
	_priv_onBetterThumbJS: function (poJS){
		var oImg = $("#" + this.element.id + poJS.p);	
		if (!poJS.u) {
			cDebug.write("missing image for: "+poJS.p);
			oImg.css("border-color",this.consts.THUMB_MISSING_COLOR); 
			//poJS.u = MISSING_THUMBNAIL_IMAGE;
		}else{
			cDebug.write("got thumbnail: "+poJS.p);
			oImg.css("border-color",this.consts.THUMB_FINAL_COLOR); 
			oImg.attr("src",poJS.u );
		}
	},
	
	//******************************************************************
	_priv_onThumbClick:function(poElement){
		if (this.options.StopOnClick)	this.stop_queue();

		var oImg = $(poElement);
		this._trigger("onClick", null, {sol:oImg.data(SOL_ATTR), instr:oImg.data(INSTRUMENT_ATTR), product:oImg.data(PRODUCT_ATTR)});
	},
	
	// ***************************************************************
	_priv_on_queue_start:function(psProduct){
		var oImg;
		cDebug.write("fetching thumb: "+psProduct);
		oImg = $("#" + this.element.id + psProduct);
		oImg.css("border-color",this.consts.THUMB_WORKING_COLOR); 
	},
	
	// ***************************************************************
	_priv_on_q_error:function (poHttp){
		oImg = $("#" + poHttp.data);
		oImg.css("border-color",this.consts.THUMB_ERROR_COLOR); 
		cDebug.write("ERROR: " + poHttp.data + "\n" + poHttp.url + "\n" + poHttp.errorStatus + " - " + poHttp.error);		
	}



});	