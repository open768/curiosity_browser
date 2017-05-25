//#TODO# use chttpqueue
var goBetterThumbnailQueue = new cHttpQueue;


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
		loaded_better: false
	},
	consts:{
		THUMB_SIZE:144,
		THUMB_ORIG_COLOR: "aliceblue",
		THUMB_WORKING_COLOR: "blanchedalmond",
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
		var oImg, oWidget, oElement;
		var oOptions = this.options;
		
		if (oOptions.sol == null) $.error("sol is not set");
		if (oOptions.instrument == null) $.error("instrument is not set");
		if (oOptions.product == null) $.error("product is not set");
		if (oOptions.url == null) $.error("url is not set");
		
		oWidget = this;
		oElement = oWidget.element;
		oWidget.element.uniqueId(); //sets a unique ID on the SPAN.
		var sSpanID = oWidget.element.attr("id");
		var sImgID = sSpanID +"i";
		
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
		oWidget.options.img=oImg;
		oImg.css("border-color",oWidget.consts.THUMB_ORIG_COLOR); 
		
		//optimise server requests, only display thumbnail if its in viewport
		oImg.on('inview', 	function(poEvent, pbIsInView){oWidget.onBasicThumbInView(pbIsInView);}	);

		oWidget.element.append(oImg);
	},
	
	//#################################################################
	//# events
	//#################################################################`
	onBasicThumbViewDelay:function(){
		var oImg, oWidget;
		oWidget= this;
		
		oImg = this.options.img;
		if (oImg.visible()){
			oImg.load(function(){oWidget.onBasicThumbLoaded(); }); 	//when basic thumbnail loaded
			oImg.attr("src", this.options.url);						//load basic thumbnail
		}else{
			oImg.on('inview', 	function(poEvent, pbIsInView){oWidget.onBasicThumbInView(pbIsInView);}	);
		}
	},
	
	//******************************************************************
	onBasicThumbInView: function(pbIsInView){
		var oWidget= this;
		
		if (!pbIsInView) return;
		
		oImg = this.options.img;
		oImg.off('inview');	//turn off the inview listener
		
		setTimeout(	
			function(){	oWidget.onBasicThumbViewDelay()},
			this.consts.WAIT_VISIBLE
		);
	},
	
	//******************************************************************
	onBetterThumbInView: function(pbIsInView){
		var oWidget= this;
		
		if (!pbIsInView) return;
		
		oImg = this.options.img
		oImg.off('inview');	//turn off the inview listener
		this.onBasicThumbLoaded()
	},
	
	//******************************************************************
	onBetterThumbViewDelay:function(){
		var sUrl;
		var oWidget = this;
		var oOptions = this.options;
		var oImg = this.options.img
		var sSpanID = this.element.attr("id");
		
		if (oImg.visible()){
			//cDebug.write("basic thumb loaded: " + oOptions.product + " imgID: " + this.options.img + " span:" +  sSpanID );		
			var oItem = new cHttpQueueItem();
			oItem.url = cBrowser.buildUrl(this.consts.BETTER_URL,{s:oOptions.sol,i:oOptions.instrument,p:oOptions.product});

			bean.on(oItem, "result", 	function(poHttp){oWidget.onBetterThumbResponse(poHttp);}	);				
			bean.on(oItem, "error", 	function(poHttp){oWidget.onBetterThumbError(poHttp);}	);				
			bean.on(oItem, "start", 	function(){oWidget.onStartBetterThumb();}	);				
			goBetterThumbnailQueue.add(oItem);
		}else{
			oImg.on('inview', 	function(poEvent, pbIsInView){oWidget.onBetterThumbInView(pbIsInView);}	);
		}
	},
	
	//******************************************************************
	onBasicThumbLoaded: function(){
		var oWidget= this;
		var oImg = this.options.img
		oImg.off("load"); //remove the load event so it doesnt fire again
		
		setTimeout(	
			function(){	oWidget.onBetterThumbViewDelay()},
			this.consts.WAIT_VISIBLE
		);
	},
	
	//******************************************************************
	onStartBetterThumb:function(){
		var oWidget = this;
		var oImg = this.options.img
		oImg.click(		function(){oWidget.onThumbClick(); }	);
		oImg.css("border-color",this.consts.THUMB_WORKING_COLOR); 
	},
	
	//******************************************************************
	onBetterThumbError: function( poHttp){
		var oImg = this.options.img
		oImg.css("border-color",this.consts.THUMB_ERROR_COLOR); 
		cDebug.write("ERROR: " + poHttp.data + "\n" + poHttp.url + "\n" + poHttp.errorStatus + " - " + poHttp.error);		
	},
	
	//******************************************************************
	onBetterThumbResponse: function( poHttp){
		var oOptions = this.options;
		var oImg = this.options.img
		var oData = poHttp.json;

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
	onThumbClick: function(){
		var oOptions = this.options;
		goBetterThumbnailQueue.stop();		
		this._trigger("onStatus",null,{text:"clicked: " + oOptions.product});
		this._trigger ("onClick", null,{sol:oOptions.sol, instr:oOptions.instrument, product:oOptions.product});
	}
	
});