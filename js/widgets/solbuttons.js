
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
$.widget( "chickenkatsu.solButtons",{
	//#################################################################
	//# Definition
	//#################################################################
	options:{
		sol: null,
		onStatus: null,
		onClick:null,
		onAllSolThumbs:null
	},
	
	consts:{
		TAG_ID:"t",
		HIGH_ID:"h",
		GIGA_ID:"g",
		NOTEBOOK_ID:"n",
		NOTEBOOKMAP_ID: "ni",
		CAL_ID: "c",
		REFRESH_ID: "r",
		ALLTHUMB_ID: "at",
		SITE_ID: "s"
	},

	//#################################################################
	//# Constructor
	//#################################################################`
	_create: function(){
		var oWidget, oElement, sID, sOID, oButton, oDiv;
		
		oWidget = this;
		oElement = oWidget.element;
		oElement.uniqueId();
		sID = oElement.attr("id");
		
		oElement.empty();
		oElement.addClass("ui-widget");
		
		// header part
		oDiv = $("<DIV>", {class:"ui-widget-header"});
			oDiv.append("Sol Information:");
		oElement.append(oDiv);
		
		oDiv = $("<DIV>", {class:"ui-widget-body"});
			//----------------------------------------------------
			oButton = $("<button>", {title:"Tags",class:"leftbutton",id:sID+this.consts.TAG_ID,disabled:"disabled"});
			oButton.append("Tags")
			oButton.click(	function(){ oWidget.onClickTag()}	);
			oDiv.append(oButton);	
			
			//----------------------------------------------------
			oButton = $("<button>", {title:"Highlights",class:"leftbutton",id:sID+this.consts.HIGH_ID,disabled:"disabled"});
			oButton.append("Highlights")
			oButton.click(	function(){ oWidget.onClickHighlights()}	);
			oDiv.append(oButton);	
			
			//----------------------------------------------------
			oButton = $("<button>", {title:"Gigapans",class:"leftbutton",id:sID+this.consts.GIGA_ID,disabled:"disabled"});
			oButton.append("Gigapans")
			oButton.click(	function(){ oWidget.onClickGigapans()}	);
			oDiv.append(oButton);	
			
			//----------------------------------------------------
			oButton = $("<button>", {title:"notebook",class:"leftbutton",id:sID+this.consts.NOTEBOOK_ID,disabled:"disabled"});
			oButton.append("Notebook")
			oButton.click(	function(){ oWidget.onClickMSLNotebook()}	);
			oDiv.append(oButton);	

			//----------------------------------------------------
			oButton = $("<button>", {title:"notebook Map",class:"leftbutton",id:sID+this.consts.NOTEBOOKMAP_ID_ID,disabled:"disabled"});
			oButton.append("Notebook Map")
			oButton.click(	function(){ oWidget.onClickMSLNotebookMap()}	);
			oDiv.append(oButton);	

			//----------------------------------------------------
			oButton = $("<button>", {title:"Calendar",class:"leftbutton",id:sID+this.consts.CAL_ID,disabled:"disabled"});
			oButton.append("Calendar")
			oButton.click(	function(){ oWidget.onClickCalender()}	);
			oDiv.append(oButton);	

			//----------------------------------------------------
			oButton = $("<button>", {title:"Force Refresh Cache",class:"leftbutton",id:sID+this.consts.REFRESH_ID});
			oButton.append("Refresh")
			oButton.click(	function(){ oWidget.onClickRefresh()}	);
			oDiv.append(oButton);	

			//----------------------------------------------------
			oButton = $("<button>", {title:"All thumbnails",class:"leftbutton",id:sID+this.consts.ALLTHUMB_ID,disabled:"disabled"});
			oButton.append("All Thumbnails")
			oButton.click(	function(){ oWidget.onClickAllThumbs()}	);
			oDiv.append(oButton);	

			//----------------------------------------------------
			oButton = $("<button>", {title:"Site",class:"leftbutton",id:sID+this.consts.SITE_ID,disabled:"disabled"});
			oButton.append("Site")
			oButton.click(	function(){ oWidget.onClickSite()}	);
			oDiv.append(oButton);	

		oElement.append(oDiv);
	},
	
	//*****************************************************************
	set_sol:function( psSol){

		var oWidget = this;
		
		//store the sol
		this.options.sol = psSol;
		
		//disable all buttons in this widget;
		this.element.children("button").each( function(){ $(this).attr("disabled","disabled");})
		
		//enable selected 
		sID = this.element.attr("id");
		$("#"+sID+this.consts.NOTEBOOK_ID).removeAttr("disabled");
		$("#"+sID+this.consts.NOTEBOOKMAP_ID).removeAttr("disabled");
		$("#"+sID+this.consts.CAL_ID).removeAttr("disabled");
		$("#"+sID+this.consts.REFRESH_ID).removeAttr("disabled");
		$("#"+sID+this.consts.ALLTHUMB_ID).removeAttr("disabled");
		$("#"+sID+this.consts.SITE_ID).removeAttr("disabled");
		
		//fetch tags, highlights and gigapans
		var sURL = cBrowser.buildUrl("php/rest/gigapans.php",{o:"sol",s:this.options.sol});
		cHttp.fetch_json(sURL , function(paJS){		oWidget.onFetchedGigapans(paJS)		});

		var sURL = cBrowser.buildUrl("php/rest/tag.php",{o:"solcount",s:this.options.sol});
		cHttp.fetch_json(sURL , function(piCount){		oWidget.onFetchedTagCount(piCount)		});

		var sURL = cBrowser.buildUrl("php/rest/img_highlight.php",{o:"solcount",s:this.options.sol});
		cHttp.fetch_json(sURL , function(piCount){		oWidget.onHiLiteCount(piCount)		});

	},
	
	//#################################################################
	//# Privates
	//#################################################################

	//#################################################################
	//# Events
	//#################################################################
	onHiLiteCount:function(piJS){
		if (piJS > 0){
			var sID = "#" + this.element.attr("id")+this.consts.HIGH_ID;
			$(sID).removeAttr("disabled");
		}
	},
	
	//*****************************************************************
	onFetchedTagCount:function(piJS){
		if (piJS > 0){
			var sID = "#" + this.element.attr("id")+this.consts.TAG_ID;
			$(sID).removeAttr("disabled");
		}
	},
	
	//*****************************************************************
	onFetchedGigapans:function(paJS){
		if (paJS){
			var sID = "#" + this.element.attr("id")+this.consts.GIGA_ID;
			$(sID).removeAttr("disabled");
		}
	},
	
	//*****************************************************************
	onClickTag:function(){
		this._trigger("onClick",null);
		cBrowser.openWindow(cBrowser.buildUrl("soltag.php",{s:this.options.sol}), "soltag");
	},
	//*****************************************************************
	onClickHighlights:function(){
		this._trigger("onClick",null);
		cBrowser.openWindow(cBrowser.buildUrl("solhigh.php", {sheet:1,s:this.options.sol}), "solhigh");
	},
	//*****************************************************************
	onClickGigapans:function(){
		this._trigger("onClick",null);
		cBrowser.openWindow( cBrowser.buildUrl("solgigas.php",{s:this.options.sol}), "solgigas");
	},
	//*****************************************************************
	onClickMSLNotebook:function(){
		this._trigger("onClick",null);
		var sUrl=cBrowser.buildUrl(
			"https://an.rsl.wustl.edu/msl/mslbrowser/br2.aspx",{
				tab:"solsumm", sol:this.options.sol
			});
		window.open(sUrl, "date");
	},
	//*****************************************************************
	onClickMSLNotebookMap:function(){
		this._trigger("onClick",null);
		var sUrl=cBrowser.buildUrl(
			"https://an.rsl.wustl.edu/msl/mslbrowser/tab.aspx?t=mp&i=A&it=MT&ii=SOL",{
				t:"mp", i:"A", it:"MT", ii:"SOL,"+this.options.sol
			});
		window.open(sUrl, "map");
	},
	//*****************************************************************
	onClickCalender:function(){
		this._trigger("onClick",null);
		var sUrl=cBrowser.buildUrl("cal.php", {s:this.options.sol});
		cBrowser.openWindow(sUrl, "calendar");
	},
	//*****************************************************************
	onClickRefresh:function(){
		this._trigger("onClick",null);
	},
	//*****************************************************************
	onClickAllThumbs:function(){
		this._trigger("onClick",null);
		this._trigger("onAllSolThumbs",null,{s:this.options.sol});
	},
	//*****************************************************************
	onClickSite:function(){
		this._trigger("onClick",null);
		cBrowser.openWindow(cBrowser.buildUrl("site.php", {sol:this.options.sol}), "site");
	}
});