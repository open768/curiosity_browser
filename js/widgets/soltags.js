
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//% Definition
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
$.widget( "ck.soltags",{
	//#################################################################
	//# Definition
	//#################################################################
	options:{
		mission:null,
		aSolsWithTags: null
	},
	
	//#################################################################
	//# Constructor
	//#################################################################
	_create: function(){
		var oThis = this;
		var oOptions = this.options;
		var oElement = this.element;
		
		//check for necessary classes
		if (!bean){				$.error("bean class is missing! check includes");	}
		if (!cHttp2){			$.error("http2 class is missing! check includes");	}
		if (!oElement.gSpinner){ 	$.error("gSpinner is missing! check includes");		}

		//check that the options are passed correctly
		if (oOptions.mission == null) $.error("mission is not set");
		oElement.uniqueId();
		
		//check that the element is a div
		var sElementName = oElement.get(0).tagName;
		if (sElementName !== "DIV")
			$.error("needs a DIV. this element is a: " + sElementName);
		
		//clear out the DIV and put some text in it
		oElement.empty();
		
		var oLoader = $("<DIV>");
		oLoader.gSpinner({scale: .25});
		oElement.append(oLoader).append("Loading sol tags:")
		
		//get the sols with Tags
		var oHttp = new cHttp2();
		bean.on(oHttp, "result", 	function(poHttp){oThis.onTagResponse(poHttp);}	);				
		var sUrl=cBrowser.buildUrl(cLocations.rest + "/tag.php", {o:"topsolindex",m:oOptions.mission.ID});
		oHttp.fetch_json(sUrl);
	},
	
	
	//#################################################################
	//# Events
	//#################################################################
	onTagResponse: function(poHttp){
		var oThis = this;
		var oOptions = this.options;
		var oElement = this.element;
		
		oOptions.aSolsWithTags = poHttp.response;
		
		if (oOptions.aSolsWithTags == null){
			oElement.empty();
			oElement.attr("class", ".ui-state-error");
			oElement.append("No Tag information found");
		}else{
			oElement.append("<br>");
			oElement.append("loading Sols...");
			
			var sUrl = cBrowser.buildUrl(cLocations.rest + "/sols.php", {m:oOptions.mission.ID});
			var oHttp = new cHttp2();
			bean.on(oHttp, "result", function(poHttp){ oThis.onSolsResponse(poHttp)} 	);
			oHttp.fetch_json(sUrl);
		}
	},
	
	//**************************************************************
	onSolsResponse:function(poHttp){
		var oThis = this;
		var oOptions = this.options;
		var oElement = this.element;
		var aData = poHttp.response;
		var sSol,i;
		
		oElement.empty();
		for (i = 0; i < aData.length; i++){
			sSol = aData[i].sol.toString();
			var oDiv = $("<DIV>",{class:"solbuttonDiv"});
			
			if (oOptions.aSolsWithTags[sSol]){
				var oButton = $("<button>",{class:"solbutton",sol:sSol}).append(sSol);
				oButton.click( 	function(poEvent){oThis.onButtonClick(poEvent);} 	);
				oDiv.append(oButton);
			}else{
				var sUrl = cBrowser.buildUrl("index.php", {s:sSol});
				var oA = $("<a>", {href:sUrl}).append(sSol);
				oDiv.append(oA);
			}

			oElement.append(oDiv);
		}
		
	},
	
	//**************************************************************
	onButtonClick:function(poEvent){
		var oButton = $(poEvent.target);
		var sSol = oButton.attr("sol");
		var sUrl = cBrowser.buildUrl("soltag.php",{s:sSol});
		cBrowser.openWindow(sUrl, "soltag");
	}
		
});	

