//#TODO# use chttpqueue
var goBetterThumbQueue = new cHttpQueue;


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
		loaded_better: false,
		mission:null
	},
	consts:{
		THUMB_SIZE:144,
		THUMB_ORIG_COLOR: "aliceblue",
		THUMB_WORKING_COLOR: "mediumorchid",
		THUMB_ERROR_COLOR: "#ffe5ff",
		THUMB_FINAL_COLOR: "white",
		THUMB_MISSING_COLOR: "mistyrose",
		BETTER_URL:"php/rest/solthumb.php",
		DEFAULT_THUMBNAIL:"images/browser/chicken_icon.png",
		WAIT_VISIBLE:300
	},

	//#################################################################
	//# Constructor
	//#################################################################`
	_create: function(){
		var oImg, oThis, oElement;
		var oOptions = this.options;
		
		oThis = this;
		oElement = oThis.element;
		
		//check for necessary classes
		if (!bean){		$.error("bean class is missing! check includes");	}
		if (!cHttp2){		$.error("http2 class is missing! check includes");	}
		if (!$.event.special.inview){		$.error("inview class is missing! check includes");	}

		//init
		if (oOptions.sol == null) $.error("sol is not set");
		if (oOptions.instrument == null) $.error("instrument is not set");
		if (oOptions.product == null) $.error("product is not set");
		if (oOptions.url == null) $.error("url is not set");
		if (oOptions.mission == null) $.error("mission is not set");
		
		oThis.element.uniqueId(); //sets a unique ID on the SPAN.
		var sSpanID = oThis.element.attr("id");
		var sImgID = sSpanID +"i";
		
		oImg = 
			$("<IMG>",{
				title:oThis.options.product,
				border:0,
				height:oThis.consts.THUMB_SIZE,
				src:this.consts.DEFAULT_THUMBNAIL,
				ID:sImgID,
				class:"polaroid-frame"
				}
			);
		oImg.click(		function(){oThis.onThumbClick(); }	);
		oThis.options.img=oImg;
		oImg.css("border-color",oThis.consts.THUMB_ORIG_COLOR); 
		
		//optimise server requests, only display thumbnail if its in viewport
		oImg.on('inview', 	function(poEvent, pbIsInView){oThis.onBasicThumbInView(pbIsInView);}	);

		oThis.element.append(oImg);
	},
	
	//#################################################################
	//# methods
	//#################################################################`
	stop_queue:function(){
		goBetterThumbQueue.stop();
	},
		
	//#################################################################
	//# events
	//#################################################################`
	//******************************************************************
	onBasicThumbInView: function(pbIsInView){
		var oThis= this;
		
		if (goBetterThumbQueue.stopping) return;
		if (!pbIsInView) return;
		
		oImg = this.options.img;
		oImg.off('inview');	//turn off the inview listener
		
		setTimeout(	
			function(){	oThis.onBasicThumbViewDelay()},
			this.consts.WAIT_VISIBLE
		);
	},
	
	//******************************************************************
	onBasicThumbViewDelay:function(){
		var oImg, oThis;
		oThis= this;
		if (goBetterThumbQueue.stopping) return;
		
		oImg = this.options.img;
		if (oImg.visible()){
			//we dont really want to blast nasa with thousands of thumbnail requests, so add these to a queue.
			
			oImg.load(function(){oThis.onBasicThumbLoaded(); }); 	//when basic thumbnail loaded
			oImg.attr("src", this.options.url);						//load basic thumbnail
		}else{
			//image is not visible - reset the inview trigger
			oImg.on('inview', 	function(poEvent, pbIsInView){oThis.onBasicThumbInView(pbIsInView);}	);
		}
	},
	
	
	//******************************************************************
	onBetterThumbInView: function(pbIsInView){
		var oThis= this;
		if (goBetterThumbQueue.stopping) return;
		
		if (!pbIsInView) return;
		
		oImg = this.options.img
		oImg.off('inview');	//turn off the inview listener
		this.onBasicThumbLoaded()
	},
	
	//******************************************************************
	onBasicThumbLoaded: function(){
		var oThis= this;
		var oImg = this.options.img
		if (goBetterThumbQueue.stopping) return;
		oImg.off("load"); //remove the load event so it doesnt fire again
		
		if (goBetterThumbQueue.stopping) return;
		setTimeout(	
			function(){	oThis.onBetterThumbViewDelay()},
			this.consts.WAIT_VISIBLE
		);
	},
	
	//******************************************************************
	onBetterThumbViewDelay:function(){
		var sUrl;
		var oThis = this;
		var oOptions = this.options;
		var oImg = this.options.img
		var sSpanID = this.element.attr("id");
		
		if (goBetterThumbQueue.stopping) return;
		if (oImg.visible()){
			//cDebug.write("basic thumb loaded: " + oOptions.product + " imgID: " + this.options.img + " span:" +  sSpanID );		
			var oItem = new cHttpQueueItem();
			oItem.url = cBrowser.buildUrl(this.consts.BETTER_URL,{s:oOptions.sol,i:oOptions.instrument,p:oOptions.product,m:oOptions.mission.name});

			bean.on(oItem, "result", 	function(poHttp){oThis.onBetterThumbResponse(poHttp);}	);				
			bean.on(oItem, "error", 	function(poHttp){oThis.onBetterThumbError(poHttp);}	);				
			bean.on(oItem, "start", 	function(){oThis.onStartBetterThumb();}	);				
			goBetterThumbQueue.add(oItem);
		}else{
			oImg.on('inview', 	function(poEvent, pbIsInView){oThis.onBetterThumbInView(pbIsInView);}	);
		}
	},
	
	//******************************************************************
	onStartBetterThumb:function(){
		var oThis = this;
		var oImg = this.options.img
		if (goBetterThumbQueue.stopping) return;
		oImg.css("border-color",this.consts.THUMB_WORKING_COLOR); 
	},
	
	//******************************************************************
	onBetterThumbResponse: function( poHttp){
		var oOptions = this.options;
		var oImg = this.options.img
		var oData = poHttp.response;

		if (goBetterThumbQueue.stopping) return;
		if (!oData.u) {
			cDebug.write("missing image for: "+oData.p);
			oImg.css("border-color",this.consts.THUMB_MISSING_COLOR); 
		}else{
			cDebug.write("got better thumbnail: "+oData.p);
			oImg.css("border-color",this.consts.THUMB_FINAL_COLOR); 
			//update the displayed image - on a Timer to be in a different non-blocking thread
			setTimeout(	
				function(){		oImg.attr("src", cBrowser.buildUrl(oData.u,{r:Math.random()}))	},
				0
			);
		}
	},

	//******************************************************************
	onBetterThumbError: function( poHttp){
		var oImg = this.options.img
		oImg.css("border-color",this.consts.THUMB_ERROR_COLOR); 
		cDebug.write("ERROR: " + poHttp.data + "\n" + poHttp.url + "\n" + poHttp.errorStatus + " - " + poHttp.error);		
	},
	
	
	//******************************************************************
	onThumbClick: function(){
		var oOptions = this.options;
		goBetterThumbQueue.stop();		
		this._trigger("onStatus",null,{text:"clicked: " + oOptions.product});
		this._trigger ("onClick", null,{sol:oOptions.sol, instr:oOptions.instrument, product:oOptions.product});
	}
});