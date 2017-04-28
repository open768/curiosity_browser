function cBetterThumbnailQueue(){
	this.queue = null;
	
	//#################################################################
	//# public functions
	//#################################################################
	this.init = function(){
		
		if ( this.queue == null){
			var oThis = this;
			this.queue = new cActionQueue();
			bean.on(this.queue, "response", function(poJS){ oThis._priv_onBetterThumbJS(poJS); });
			bean.on(this.queue, "starting", function(psID){oThis._priv_on_prod_start(psID); });
			bean.on(this.queue, "error", function(poHttp){ oThis._priv_on_q_error(poHttp); });
		}
	};
	
	//****************************************************************************************
	this.add= function(psID, psURL){
		this.init();
		this.queue.add(psID, psURL)
	};
	
	//****************************************************************************************
	this.start = function(){	
		this.queue.start();
	};
	
	//****************************************************************************************
	this.stop = function(){
		this.queue.stop();
	};
	
	//#################################################################
	//# Event Handlers
	//#################################################################
	this._priv_onBetterThumbJS = function(poJS){
		var sID = poJS._actionqueue_name;
		$("#"+sID).thumbnail("onBetterThumbResponse",poJS);
	};
	
	//****************************************************************************************
	this._priv_on_prod_start = function(psID){
		$("#"+psID).thumbnail("onStartBetterThumb");
	};
	
	//****************************************************************************************
	this._priv_on_q_error = function(poHttp){
		$("#"+poHttp._actionqueue_name).thumbnail("onBetterThumbError", poHttp);
	};
	
};

//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
$.widget( "chickenkatsu.thumbnail",{
	//#################################################################
	//# Definition
	//#################################################################
	options:{
		sol: null,
		instrument: null,
		product: null,
		base_id: null,
		url: null,
		img :null,
		queue : null,
		loaded: false
	},
	consts:{
		THUMB_SIZE:144,
		THUMB_ORIG_COLOR: "aliceblue",
		THUMB_WORKING_COLOR: "blanchedalmond",
		THUMB_ERROR_COLOR: "#ffe5ff",
		THUMB_FINAL_COLOR: "white",
		THUMB_MISSING_COLOR: "mistyrose",
		BETTER_URL:"php/rest/solthumb.php",
		DEFAULT_THUMBNAIL:"images/chicken_icon.png"
	},

	//#################################################################
	//# Constructor
	//#################################################################`
	_create: function(){
		var oImg, oWidget, oElement;
		var oOptions = this.options;
		
		if (oOptions.sol == null) $.error("sol is not set");
		if (oOptions.instrument == null) $.error("instrument is not set");
		if (oOptions.product == null) $.error("product is not set");
		if (oOptions.url == null) $.error("url is not set");
		if (oOptions.queue == null) $.error("queue is not set");
		oOptions.queue.init();
		
		oWidget = this;
		oElement = oWidget.element;
		oWidget.element.uniqueId(); //sets a unique ID on the SPAN.
		var sSpanID = oWidget.element.attr("id");
		var sImgID = sSpanID +"i";
		oWidget.options.img=sImgID;
		
		//cDebug.write("creaing widget: " + oOptions.product + " imgID: " + oWidget.options.img + " span:" +  sSpanID );		

		oImg = 
			$("<IMG>",{
				title:oWidget.options.product,
				border:0,
				height:oWidget.consts.THUMB_SIZE,
				src:this.consts.DEFAULT_THUMBNAIL,
				ID:sImgID,
				class:"polaroid-frame"
				}
			);
		oImg.css("border-color",oWidget.consts.THUMB_ORIG_COLOR); 
		
		//optimise server requests, only display thumbnail if its in viewport
		oImg.on('inview', 	function(poEvent, pbIsInView){oWidget.onInView(pbIsInView);}	);

		oWidget.element.append(oImg);
	},
	
	//#################################################################
	//# events
	//#################################################################`
	onInView: function(pbIsInView){
		var oImg, oWidget;
		oWidget= this;
		
		if (!pbIsInView) return;
		if (this.options.loaded) return;
		
		this.options.loaded = true;
		oImg = $("#"+this.options.img);
		oImg.off('inview');	//turn off the inview listener
		
		oImg.load(function(){oWidget.onBasicThumbLoaded(); }); 	//when basic thumbnail loaded
		oImg.attr("src", this.options.url);						//load basic thumbnail
	},
	
	//******************************************************************
	onBasicThumbLoaded: function(){
		var sUrl;
		var oOptions = this.options;
		var oImg = $("#"+this.options.img);
		var sSpanID = this.element.attr("id");
		
		//cDebug.write("basic thumb loaded: " + oOptions.product + " imgID: " + this.options.img + " span:" +  sSpanID );		
		oImg.off("load"); //remove the load event so it doesnt fire again
		
		sUrl = cBrowser.buildUrl(this.consts.BETTER_URL,{s:oOptions.sol,i:oOptions.instrument,p:oOptions.product});
		oOptions.queue.add(sSpanID, sUrl);
		oOptions.queue.start();
	},
	
	//******************************************************************
	onStartBetterThumb:function(){
		var oOptions = this.options;
		var oWidget = this;
		var sSpanID = this.element.attr("id");
		//cDebug.write("starting better thumb : " + oOptions.product + " imgID: " + this.options.img + " span:" +  sSpanID );		
		var oImg = $("#"+this.options.img);
		oImg.click(function(){oWidget.onThumbClick(); });
		oImg.css("border-color",this.consts.THUMB_WORKING_COLOR); 
	},
	
	//******************************************************************
	onBetterThumbError: function( poHttp){
		var oImg = $("#"+this.options.img);
		oImg.css("border-color",this.consts.THUMB_ERROR_COLOR); 
		cDebug.write("ERROR: " + poHttp.data + "\n" + poHttp.url + "\n" + poHttp.errorStatus + " - " + poHttp.error);		
	},
	
	//******************************************************************
	onBetterThumbResponse: function( poJS){
		var oOptions = this.options;
		var oImg = $("#"+this.options.img);
		var sSpanID = this.element.attr("id");

		//cDebug.write("better thumb response: " + oOptions.product + " imgID: " + this.options.img + " span:" +  sSpanID );		
		if (!poJS.u) {
			cDebug.write("missing image for: "+poJS.p);
			oImg.css("border-color",this.consts.THUMB_MISSING_COLOR); 
			//poJS.u = MISSING_THUMBNAIL_IMAGE;
		}else{
			cDebug.write("got better thumbnail: "+poJS.p);
			oImg.css("border-color",this.consts.THUMB_FINAL_COLOR); 
			//update the displayed image - on a Timer to be ina different non-blocking thread
			setTimeout(	
				function(){		oImg.attr("src", cBrowser.buildUrl(poJS.u,{r:Math.random()}))	},
				0
			);
		}
	},
	
	//******************************************************************
	onThumbClick: function(){
		var oOptions = this.options;
		oOptions.queue.stop();		
		this._trigger("onStatus",null,{text:"clicked: " + oOptions.product});
		this._trigger ("onClick", null,{sol:oOptions.sol, instr:oOptions.instrument, product:oOptions.product});
	}
	
});