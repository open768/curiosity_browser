
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//% Definition
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
$.widget( "chickenkatsu.thumbnailview",{
	//#################################################################
	//# Definition
	//#################################################################
	consts:{
		BASIC_URL:"php/rest/solthumbs.php",
	},
	options:{
		ThumbsPerPage: 100,
		sol: null,
		instrument: null,
		onClick:null
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
		this._trigger("onStatus",null,{text:"loading basic thumbnails"});
		sUrl = cBrowser.buildUrl(this.consts.BASIC_URL,{s:this.options.sol,i:this.options.instrument});
		var oWidget = this;
		cHttp.fetch_json(sUrl, function(poJS){oWidget.onThumbsJS(poJS)});
	},
	
	//#################################################################
	//# methods
	//#################################################################
	stop_queue: function(){
		goBetterThumbnailQueue.stop();
		window.stop();
	},
	
	//#################################################################
	//# Events
	//#################################################################
	onThumbsJS: function(poJS){
		var i, aData, oItem;
		var oWidget = this;
		var oElement = oWidget.element;

		this._trigger("onStatus",null,{text:"got basic thumbnails"});
		this._trigger("onBasicThumbnail");
		
		// ok load the thumbnails
		oElement.empty();
		
		aData = poJS.d.data;
		if (aData.length == 0){
			oElement.append("<p class='subtitle'>Sorry no thumbnails found</p>");
			this._trigger("onStatus", null,{text:"No thumbnails defined"});
		}else{
			goBetterThumbnailQueue.reset();
			for (i=0; i< aData.length; i++){
				oItem = aData[i];
				var oThumbnailWidget = $("<SPAN>").thumbnail({
					sol:poJS.s, 
					instrument:oItem.data.instrument, 
					product:oItem.p, 
					url:oItem.i,
					onStatus:function(poEvent,poData){ oWidget._trigger("onStatus", poEvent, poData)},
					onClick: function(poEvent, poData){ oWidget.onThumbClick(poEvent, poData);}
				});
				
				// draw the widget;
				oElement.append(oThumbnailWidget);
			}
		}
	},
	
	//************************************************************************
	onThumbClick:function(poEvent,poData){
		this.stop_queue();
		this._trigger("onClick", poEvent, poData);
	}
	
});	

