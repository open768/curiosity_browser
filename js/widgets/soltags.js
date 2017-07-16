
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//% Definition
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
$.widget( "chickenkatsu.soltags",{
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
			$.error("thumbnail view needs a DIV. this element is a: " + sElementName);
		
		//clear out the DIV and put some text in it
		oElement.empty();
		//oElement.attr("class", "ui-widget-content");
		
		var oLoader = $("<DIV>");
		oLoader.gSpinner({scale: .25});
		oElement.append(oLoader).append("Loading sol tags:")
		
		//get the sols with Tags
		var oHttp = new cHttp2();
		bean.on(oHttp, "result", 	function(poHttp){oThis.onTagResponse(poHttp);}	);				
		var sUrl=cBrowser.buildUrl("php/rest/tag.php", {o:"topsolindex"});
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
			
			var oHttp = new cHttp2();
			bean.on(oHttp, "result", function(poHttp){ oThis.onSolsResponse(poHttp)} 	);
			oHttp.fetch_json("php/rest/sols.php");
		}
	},
	
	//**************************************************************
	onSolsResponse:function(poHttp){
		var oThis = this;
		var oOptions = this.options;
		var oElement = this.element;
		var aData = poHttp.response;
		var sSol;
		
		oElement.empty();
		for (var i = 0; i < aData.length; i++){
			var oDiv = $("<DIV>",{class:"solbuttonDiv"});
			sSol = aData[i].sol.toString();
			
			if (oOptions.aSolsWithTags[sSol]){
				var oButton = $("<button>",{class:"solbutton"}).append(sSol);
				oDiv.append(oButton);
				oButton.click( 	function(){oThis.onButtonClick(sSol)} 	);
			}else{
				var sUrl = cBrowser.buildUrl("index.php", {s:sSol});
				var oA = $("<a>", {href:sUrl}).append(sSol);
				oDiv.append(oA);
			}

			oElement.append(oDiv);
		}
		
	},
	
	onButtonClick:function(psSol){
		var sUrl = cBrowser.buildUrl("soltag.php",{s:psSol});
		cBrowser.openWindow(sUrl, "soltag");
	}
		
});	

