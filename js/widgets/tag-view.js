
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//% Definition
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
$.widget( "chickenkatsu.tagview",{
	//#################################################################
	//# Definition
	//#################################################################
	consts:{
		MAX_TRANSFERS:5,
		MAX_TO_SHOW: 10,
		MAX_TO_SHOW_QS: "starttag"
	},
	options:{
		tag: null,
		queue:null,
		onStatus:null, 
		mission: null
	},
	
	//#################################################################
	//# Constructor
	//#################################################################
	_create: function(){
		//check that the element is a div
		var oWidget = this;
		var oElement = this.element;
		
		//check for necessary classes
		if (!bean)		$.error("bean class is missing! check includes");	
		if (!cHttp2)		$.error("http2 class is missing! check includes");	
		if (!cActionQueue)		$.error("cActionQueue class is missing! check includes");	
		if (this.options.mission == null) $.error("mission is not set");
		if (!oElement.gSpinner)	$.error("gspinner class is missing! check includes");	

		//make sure this is a DIV
		var sElementName = oElement.get(0).tagName;
		if (sElementName !== "DIV")
			$.error("thumbnail view needs a DIV. this element is a: " + sElementName);
		oElement.uniqueId();

		//check that the options are passed correctly
		var sTag = this.options.tag;
		if (sTag == null) $.error("tag is not set");
						
		//clear out the DIV and put some text in it
		oElement.empty();
		oDiv = $("<DIV>",{class:"ui-widget-body"}).width("100%").append("Loading Images for tag: " + sTag);
		var oLoader = $("<SPAN>").gSpinner({scale: .25});
		oDiv.append(oLoader);
		oElement.append(oDiv);
		
		var oHttp = new cHttp2();
		var sURL =cBrowser.buildUrl("php/rest/tag.php", {t:sTag,o:"detail",m:this.options.mission.ID});
		
		bean.on(oHttp, "result", function(poHttp){oWidget.onTagUsage(poHttp);});
		bean.on(oHttp, "error",  function(poHttp){oWidget.onError(poHttp);});
		oHttp.fetch_json(sURL, oElement);
	},
	
	//#################################################################
	//# Events
	//#################################################################
	onTagUsage:function(poHttp){
		var i, sItem, aParts, sSol, sInstr, sProd;
		var aData = poHttp.response;
		var oWidget = this;
		var oElement = this.element;
		
		oElement.empty();		
		if (!aData){
			oElement.append("<span class='subtitle'>This tag is not known</span>");
			return;
		}

		//remove duplicates from list
		var aList = [];
		for (i=0 ; i<aData.length; i++){
			sItem = aData[i];
			if (aList.indexOf(sItem) == -1)
				aList.push(sItem)
		}
		aList.sort();
		
		//create image
		for (i=0 ; i<aList.length; i++){
			sItem = aList[i];
			aParts = sItem.split("/");			
			cDebug.write("got a detail: " + sItem);
			
			var oDiv = $("<DIV>");
			oDiv.instrumentimage({			//shouldnt have to pass a src or date attribute
					sol:aParts[0],
					instrument:aParts[1],
					product:aParts[2],
					mission:this.options.mission,
					onClick: function(poEvent,poData){	oWidget.onClick(poEvent,poData);		},
					onStatus: function(poEvent,paData){	oWidget._trigger("onStatus",poEvent,paData);	}
			});
			oElement.append(oDiv);
			oElement.append("<P>");
		}
	},
	
	
	//***************************************************************
	onClick:function(poEvent,poData){
		goImageQueue.stop();
		this._trigger("onClick",poEvent,poData);
	}
		
	
});	

