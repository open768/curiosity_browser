
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//% Definition
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
$.widget( "chickenkatsu.tagcloud",{
	//#################################################################
	//# Definition
	//#################################################################
	options:{
		mission: null,
		maxFont:24,
		minFont:10,
		minWidth:"200px"
	},
	
	//#################################################################
	//# Constructor
	//#################################################################
	_create: function(){
		var oDiv, oElement, oWidget;
		
		oElement = this.element;
		
		//check for necessary classes
		if (!bean){		$.error("bean class is missing! check includes");	}
		if (!cHttp2){		$.error("http2 class is missing! check includes");	}
		
		//check that the element is a div
		var sElementName = oElement.get(0).tagName;
		if (sElementName !== "DIV")
			$.error("thumbnail view needs a DIV. this element is a: " + sElementName);
		
		//initialise
		oElement.uniqueId();
		oElement.css("min-width", this.options.minWidth);
		oWidget = this;
		
		//clear out the DIV and put some text in it
		oElement.empty();
		var oDiv = $("<DIV>",{class:"ui-widget-header"}).width("100%").append("Tag Cloud");
		oElement.append(oDiv);
		
		oDiv = $("<DIV>",{class:"ui-widget-body"}).width("100%").uniqueId().append("doing nuthing");
		oElement.append(oDiv);

		//only do something when the div is visible	
		oDiv.on('inview', 	function(poEvent, pbIsInView){oWidget.onInView();}	);

	},
	
	//#################################################################
	//# methods
	//#################################################################
	process_response:function(poHttp){
		var sKey, iCount, iSize, iWeight, iMax, fsRatio, fwRatio;
		var oA, sUrl;
		
		var oElement = this.element;
		var oData = poHttp.response;
		
		oElement.empty();
		
		iMax = 0;
		for (sKey in oData)
			iMax = Math.max(iMax, oData[sKey]);
		fsRatio = (this.options.maxFont - this.options.minFont)/ iMax;
		fwRatio = 800/ iMax;
		
		for (sKey in oData){
			iCount = oData[sKey];
			iSize = this.options.minFont + iCount * fsRatio;
			iWeight = 100 + Math.round(iCount * fwRatio);
			
			sUrl = cBrowser.buildUrl("tag.php" , {t:sKey});
			oA = $("<A>", {href:sUrl}).css("font-size",""+iSize+"px").css("font-weight",iWeight).append(sKey);
			oElement.append(oA).append(" ");
		}		
	},
	
	//***************************************************************
	process_error:function(poHttp){
		var oElement = this.element;
		oElement.empty();
		oElement.html("There was an error getting the tagcloud");
	},
	
	
	//#################################################################
	//# Events
	//#################################################################
	onInView: function(){
		var oWidget = this;
		oElement = this.element;
		oElement.off('inview');	//turn off the inview listener
		
		oElement.empty()
		var oDiv = $("<div>",{class:"ui-widget-header"}).append("Loading Tags...");
		oElement.append(oDiv);
		
		var oHttp = new cHttp2();
		var sURL =cBrowser.buildUrl("php/rest/tag.php", {o:"all"});
		bean.on(oHttp, "result", function(poHttp){oWidget.process_response(poHttp);});
		bean.on(oHttp, "error",  function(poHttp){oWidget.process_error(poHttp);});
		oHttp.fetch_json(sURL);
	}
	
});	

