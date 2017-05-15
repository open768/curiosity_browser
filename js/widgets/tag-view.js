
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
		queue:null
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
		var oDiv = poHttp.data;
		var aData = poHttp.json;
		var oWidget = this;
		var oElement = this.element;
		
		oDiv.empty();		
		if (!aData){
			oDiv.append("<span class='subtitle'>This tag is not known</span>");
			return;
		}

		//create a queue
		var oQueue = new cActionQueue();
		this.options.queue = oQueue;
		oQueue.MAX_TRANSFERS = this.consts.MAX_TRANSFERS;
		bean.on(oQueue, "response", 	function(poJson){oWidget.onProductDetails(poJson);}	);
		
		//create image
		for (i=0 ; i<aData.length; i++){
			sItem = aData[i];

			cDebug.write("got a detail: " + sItem);
			aParts = sItem.split("/");			
			sSol = aParts[0];
			sInstr = aParts[1];
			sProd = aParts[2];
			
			var sID = oElement.attr("id")+sProd;
			var oDiv = $("<DIV>",{id:sID}).append("loading ... " + sProd);
			oElement.append(oDiv);

			cDebug.write("getting details for :"+ sProd);
			var sURL =cBrowser.buildUrl("php/rest/detail.php", {s:sSol, i:sInstr, p:sProd});
			oQueue.add(sProd, sURL);
			oQueue.start();
		}
	},
	
	//***************************************************************
	onError:function(poHttp){
		var oDiv = poHttp.data;
		oDiv.empty();
		oDiv.html("There was an error getting the tag details:<br>url: " + poHttp.url + "<br>Error: " + poHttp.error);
	},
	
	//***************************************************************
	onProductDetails:function(poItem){		
		var oWidget = this;
		var oElement = this.element;
		var sID = oElement.attr("id")+poItem.p;
		var oDiv = $("#"+sID);
		
		if (!poItem.d){
			oDiv.empty().append("unable to find product:" + poItem.p);
			return;
		}
		
		oDiv.instrumentimage({			//shouldnt have to pass a src or date attribute
				sol:poItem.s,
				instrument:poItem.i,
				product:poItem.p,
				src:poItem.d.i,
				date:poItem.d.du,
				onClick: function(poEvent,poData){	oWidget.onClick(poEvent,poData);		},
				onStatus: function(poEvent,paData){	oWidget._trigger("onStatus",poEvent,paData);	}
		});
	},
	
	//***************************************************************
	onClick:function(poEvent,poData){
		this.options.queue.stop();
		this.options.queue = null;
		this._trigger("onClick",poEvent,poData);
	}
		
	
});	

