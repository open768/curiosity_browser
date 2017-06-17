var goImageQueue = new cHttpQueue;

//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
$.widget( "chickenkatsu.instrumentimage",{
	//#################################################################
	//# Definition
	//#################################################################
	options:{
		sol: null,
		instrument: null,
		product: null,
		src: null,				//used when multiple images are requested for the same sol. reduced network bandwidth in this case
		date:null,
		image_div:null,
		tags_div:null,
		mission:null
	},
	consts:{
		WAIT_VISIBLE:1000,
		WAIT_IMAGE: "images/browser/chicken_icon.png",
	},

	//#################################################################
	//# Constructor
	//#################################################################`
	_create: function(){
		var oThis = this;
		var oOptions = oThis.options;
		var oElement = oThis.element;
		
		if (oOptions.sol == null) $.error("sol is not set");
		if (oOptions.instrument == null) $.error("instrument is not set");
		if (oOptions.product == null) $.error("product is not set");
		if (oOptions.mission == null) $.error("mission is not set");
		if (!$.event.special.inview){		$.error("inview class is missing! check includes");	}

		//make sure this is a DIV
		var sElementName = oElement.get(0).tagName;
		if (sElementName !== "DIV")
			$.error("image view needs a DIV. this element is a: " + sElementName);
		oElement.uniqueId();

		oElement.empty();
		var oInfoDiv = $("<DIV>",{class:"ui-widget-header"});
		var oWaitImg = $("<IMG>",{src:this.consts.WAIT_IMAGE});
		oInfoDiv.append(oWaitImg);
		oInfoDiv.append(" One Moment please: " + oOptions.product);
		oElement.on('inview', 	function(poEvent, pbIsInView){oThis.onVisible(pbIsInView);}	);
		oElement.append(oInfoDiv);
		
		oElement.append("<p>");
	},
	
	// ***************************************************************
	onVisible: function(pbIsInView){
		if (pbIsInView){
			var oThis = this;
			var oElement = oThis.element;
			oElement.off('inview');
			setTimeout(	
				function(){	oThis.onVisibleDelay()},
				this.consts.WAIT_VISIBLE
			);
		}
	},

	// ***************************************************************
	onVisibleDelay: function(){
		var oElement = this.element;
		if (!this.visible){
			var oThis = this;
			oElement.on('inview', 	function(poEvent, pbIsInView){oThis.onVisible(pbIsInView);}	);
		}
		
		var oOptions = oThis.options;
		if (oOptions.src == null){
			this.prv__getDetails();
		}else
			this.prv__render();
	},
	
	//#################################################################
	//# Privates
	//#################################################################`
	prv__getDetails: function(){
		var oThis = this;
		var oOptions = oThis.options;
		var oElement = oThis.element;
		
		oElement.empty();
		var oInfoDiv = $("<DIV>",{class:"ui-widget-header"}).append("Loading details for: " + oOptions.product);
		oElement.append(oInfoDiv);
		oElement.append("<p>");
		
		var oItem = new cHttpQueueItem();
		oItem.url = cBrowser.buildUrl("php/rest/detail.php", {s:oOptions.sol, i:oOptions.instrument, p:oOptions.product});
		bean.on(oItem, "result", 	function(poHttp){oThis.onProductDetails(poHttp);}	);				
		bean.on(oItem, "error", 	function(poHttp){oThis.onProductError(poHttp);}	);				
		goImageQueue.add(oItem);
	},

	// ***************************************************************
	prv__render:function(){
		var oThis = this;
		var oOptions = oThis.options;
		var oElement = oThis.element;
		
		oElement.empty();
		oElement.addClass("ui-widget");
		oElement.addClass("ui-corner-all");
		
		//build image div
		
		var oImgDiv = $("<DIV>",{class:"ui-widget-content"}).css({position: 'relative'});
		oOptions.image_div = oImgDiv;
		oImg = $("<IMG>",{src:oOptions.src});
		oImg.load(		function(){oThis.onLoadedImage();}							);
		oImg.click(		function(){oThis._trigger("onClick", null, oOptions);} 	);
		oImgDiv.append(oImg);	
		
		//build information div
		var oInfoDiv = $("<DIV>",{class:"ui-widget-header"});
		oInfoDiv.append($("<SPAN>",{class:"ui-state-highlight"}).html("Date: "));
		oInfoDiv.append(oOptions.date);
		oInfoDiv.append($("<SPAN>",{class:"ui-state-highlight"}).html(" Product: "));
		oInfoDiv.append(oOptions.product );
		oInfoDiv.append($("<SPAN>",{class:"ui-state-highlight"}).html(" Tags: "));
		oOptions.tags_div = $("<SPAN>",{class:"soltags"}).html("Loading ...");
		oInfoDiv.append(oOptions.tags_div);
		
		//add the lot to the new div
		oElement.empty();
		oElement.append(oInfoDiv);
		oElement.append(oImgDiv);
		oElement.append("<p>");
	},
	
	//#################################################################
	//# Events
	//#################################################################`
	onLoadedImage: function(){
		var oOptions = this.options;
		var oThis = this;
		
		cDebug.write("loaded image: " + this.options.src);
		
		//get the image and tag highlights 
		//#TODO# add these to a queue that can be stopped
		cImgHilite.getHighlights(
			oOptions.sol,oOptions.instrument,oOptions.product, 
			function(paJS){		oThis.onHighlights(paJS)	}
		);
		cTagging.getTags(
			oOptions.sol,oOptions.instrument,oOptions.product, 
			function(paJS){		oThis.onTags(paJS)	}
		);
	},
	
	// ***************************************************************
	onHighlights: function(paJS){
		var i, oDiv, oRedBox, iLeft, iTop;
		
		if (!paJS.d) return;
		oDiv = this.options.image_div;
		
		for (i=0; i<paJS.d.length; i++){
			aItem = paJS.d[i];
			
			//create a redbox and display it
			oRedBox = $("<DIV>",{class:"redbox"});
			oDiv.append(oRedBox);
			
			//place it relative to the parent location
			iTop = parseInt(aItem.t);
			iLeft = parseInt(aItem.l);
			oRedBox.css({position: 'absolute',	top: iTop,	left: iLeft})
		}
	},
	
	// ***************************************************************
	onTags: function( paJS){
		var oDiv, oA, sTag, i;
		
		oDiv = this.options.tags_div;
		oDiv.empty();
		
		if (paJS.d.length== 0) {
			oDiv.html( "no Tags");
			return;
		}

		//put in the tags
		for (i=0; i<paJS.d.length; i++){
			sTag = paJS.d[i];
			var sURL = cBrowser.buildUrl("tag.php",{t:sTag});
			oA = $("<A>",{href:sURL}).html(sTag);
			oDiv.append(oA).append(" ");
		}
	},
	
	// ***************************************************************
	onProductDetails:function(poHttp){
		if (poHttp.response.d){
			this.options.src = poHttp.response.d.i;
			this.prv__render();
		}else
			this.onProductError(poHttp);
	},
	
	// ***************************************************************
	onProductError:function(poHttp){
		var oElement = this.element;
		
		oElement.empty();
		var oDiv = $("<DIV>",{class:"ui-state-error"});
		oDiv.html("There was an error with :" + this.options.product)
		oElement.append(oDiv);
		oElement.append("<p>");
	},
	
});