
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//% Definition
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
$.widget( "chickenkatsu.tagview",{
	//#################################################################
	//# Definition
	//#################################################################
	consts:{
		MAX_TRANSFERS:5
	},
	options:{
		tag: null,
		queue:null,
		onStatus:null
	},
	
	//#################################################################
	//# Constructor
	//#################################################################
	_create: function(){
		//check that the element is a div
		var oWidget = this;
		var oElement = this.element;
		
		//check for necessary classes
		if (!bean){		$.error("bean class is missing! check includes");	}
		if (!cHttp2){		$.error("http2 class is missing! check includes");	}
		if (!cActionQueue){		$.error("cActionQueue class is missing! check includes");	}

		//make sure this is a DIV
		var sElementName = oElement.get(0).tagName;
		if (sElementName !== "DIV")
			$.error("thumbnail view needs a DIV. this element is a: " + sElementName);
		oElement.uniqueId();

		//check that the options are passed correctly
		var sTag = this.options.tag;
		if (sTag == null) $.error("tag is not set");
						
		//clear out the DIV and put some text in it
		oElement.html("Loading Images for tag: " + sTag);
		
		var oHttp = new cHttp2();
		var sURL =cBrowser.buildUrl("php/rest/tag.php", {t:sTag,o:"detail"});
		
		bean.on(oHttp, "result", function(poHttp){oWidget.onTagUsage(poHttp);});
		bean.on(oHttp, "error",  function(poHttp){oWidget.onError(poHttp);});
		oHttp.fetch_json(sURL, oElement);
	},
	
	//#################################################################
	//# Events
	//#################################################################
	onTagUsage:function(poHttp){
		var i, sItem, aParts, sSol, sInstr, sProd;
		var aData = poHttp.json;
		var oWidget = this;
		var oElement = this.element;
		
		oElement.empty();		
		if (!aData){
			oElement.append("<span class='subtitle'>This tag is not known</span>");
			return;
		}

		//create image
		for (i=0 ; i<aData.length; i++){
			sItem = aData[i];
			aParts = sItem.split("/");			
			cDebug.write("got a detail: " + sItem);
			
			var oDiv = $("<DIV>");
			oDiv.instrumentimage({			//shouldnt have to pass a src or date attribute
					sol:aParts[0],
					instrument:aParts[1],
					product:aParts[2],
					onClick: function(poEvent,poData){	oWidget.onClick(poEvent,poData);		},
					onStatus: function(poEvent,paData){	oWidget._trigger("onStatus",poEvent,paData);	}
			});
			oElement.append(oDiv);
		}
	},
	
	
	//***************************************************************
	onClick:function(poEvent,poData){
		goImageQueue.stop();
		this._trigger("onClick",poEvent,poData);
	}
		
	
});	

