
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
		onClick:null,
		anyThumbElement:null
	},
	
	//#################################################################
	//# Constructor
	//#################################################################
	_create: function(){
		var oThis = this;
		
		//check for necessary classes
		if (!bean){		$.error("bean class is missing! check includes");	}
		if (!cHttp2){		$.error("http2 class is missing! check includes");	}
		
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
		var sUrl = cBrowser.buildUrl(this.consts.BASIC_URL,{s:this.options.sol,i:this.options.instrument});
		var oHttp = new cHttp2();
		bean.on(oHttp,"result",function(poHttp){oThis.onThumbsJS(poHttp)});
		oHttp.fetch_json(sUrl);
	},
	
	//#################################################################
	//# methods
	//#################################################################
	stop_queue: function(){
		if (this.options.anyThumbElement != null)
			this.options.anyThumbElement.thumbnail("stop_queue");
	},
	
	//#################################################################
	//# Events
	//#################################################################
	onThumbsJS: function(poHttp){
		var i, aData, oItem;
		var oThis = this;
		var oElement = oThis.element;

		this._trigger("onStatus",null,{text:"got basic thumbnails"});
		this._trigger("onBasicThumbnail");
		
		// ok load the thumbnails
		oElement.empty();
		
		aData = poHttp.response.d.data;
		if (aData.length == 0){
			oElement.append("<p class='subtitle'>Sorry no thumbnails found</p>");
			this._trigger("onStatus", null,{text:"No thumbnails defined"});
		}else{
			
			if (this.options.anyThumbElement)
			this.options.anyThumbElement.thumbnail("reset_queue");
				
			for (i=0; i< aData.length; i++){
				oItem = aData[i];
				var oThumbnailWidget = $("<SPAN>").thumbnail({
					sol:poHttp.response.s, 
					instrument:oItem.data.instrument, 
					product:oItem.p, 
					url:oItem.i,
					onStatus:function(poEvent,poData){ oThis._trigger("onStatus", poEvent, poData)},
					onClick: function(poEvent, poData){ oThis.onThumbClick(poEvent, poData);}
				});
				if (this.options.anyThumbElement == null)
					this.options.anyThumbElement = oThumbnailWidget;
				
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

