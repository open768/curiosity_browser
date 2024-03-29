
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//% Definition
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
$.widget( "ck.solcalendar",{
	//#################################################################
	//# Definition
	//#################################################################
	options:{
		mission: null,
		sol: null,
		onLoadedCal: null,
		onClick: null
	},
	
	//#################################################################
	//# Constructor
	//#################################################################
	_create: function(){
		//check that the element is a div
		var oWidget = this;
		var oElement = this.element;
		var oOptions = this.options;
		
		//check for necessary classes
		if (!bean)		$.error("bean class is missing! check includes");	
		if (!cHttp2)		$.error("http2 class is missing! check includes");	
		if (oOptions.mission == null) $.error("mission is not set");
		if (oOptions.sol == null) $.error("sol is not set");
		if (oOptions.onClick == null) $.error("onClick is not set");
		if (!oElement.gSpinner)	$.error("gspinner class is missing! check includes");	

		//make sure this is a DIV
		var sElementName = oElement.get(0).tagName;
		if (sElementName !== "DIV")
			$.error("calendar view needs a DIV. this element is a: " + sElementName);
		oElement.uniqueId();
		
		this.prv__getData();
	},
	
	//#################################################################
	//# Private
	//#################################################################
	prv__getData:function(){
		var oWidget = this;
		var oElement = this.element;
		var oOptions = this.options;

		//clear out the DIV and put some text in it
		oElement.empty();
		oDiv = $("<DIV>",{class:"ui-widget-body"}).width("100%").append("Loading calendar for sol: " + oOptions.sol);
		var oLoader = $("<SPAN>").gSpinner({scale: .25});
		oDiv.append(oLoader);
		oElement.append(oDiv);
		
		var oHttp = new cHttp2();		
		var sUrl = cBrowser.buildUrl(cLocations.rest + "/cal.php",{s:oOptions.sol,m:oOptions.mission.ID});
		bean.on(oHttp, "result", function(poHttp){oWidget.onCalResponse(poHttp);}	);
		bean.on(oHttp, "error",  function(poHttp){oWidget.onError(poHttp);}			);
		oHttp.fetch_json(sUrl, oElement);
	},
	
	//***************************************************************
	prv__get_Headings:function(paDates){
		var aHeadings = Array();
		var sDateKey;
		
		for (sDateKey in paDates)
			aHeadings.push(sDateKey);
		return aHeadings
	},
	
	//***************************************************************
	prv__get_Times:function(paDates){
		var sDate,sTime;
		var aTimes = Array();
		
		for (sDate in paDates)
			for (sTime in paDates[sDate])
				if (aTimes.indexOf(sTime) == -1)
					aTimes.push(sTime);
		aTimes.sort();

		return aTimes;
	},
	
	//#################################################################
	//# render functions
	//#################################################################
	prv__build_colour_part:function(paInstr){
		var oElement = this.element;
		var oColours = {};		
		
		var oDiv = $("<DIV>",{class:"ui-widget-header"}).append("legend");
		oElement.append(oDiv);
		
		oDiv = $("<DIV>",{class:"ui-widget-body"});
		for (i=0 ; i<paInstr.length; i++){
			var oInstr = paInstr[i];
			var oOuterSpan = $("<span>").attr({class:'greybox'})
				oOuterSpan.append(oInstr.name).append("&nbsp;");
				var oInnerSpan = $("<span>").attr({style:"background-color:" + oInstr.colour});
				oInnerSpan.append("&nbsp;&nbsp;&nbsp;");
				oOuterSpan.append(oInnerSpan);
			oDiv.append(oOuterSpan);
			oDiv.append(" ");
			oColours[oInstr.abbr] = oInstr.colour;
		}
		oElement.append(oDiv);
		
		return oColours;
	},
	
	//***************************************************************
	prv__build_cal_part:function(paHeadings, paDates, paTimes, poColours){
		var i, oTable, oRow, oCell;
		var oElement = this.element;
		
		var oDiv = $("<DIV>",{class:"ui-widget-body"});
		var oTable = $("<TABLE>",{class:"cal"});
		oDiv.append(oTable);
		oElement.append(oDiv);

		//header row of table
		oRow = $("<TR>");
		oRow.append($("<TD>"));
		for (i=0; i<paHeadings.length; i++){
			oCell = $("<TH>").attr({class:"caldate"}).append("UTC:" + paHeadings[i] );
			oRow.append(oCell);
		}
		oTable.append(oRow);
		
		// now the calendar entries
		for (i=0; i<paTimes.length; i++){
			var sTime = paTimes[i];
			oRow = this.prv_renderRow( sTime, paHeadings, paDates , poColours);
			oTable.append(oRow);
		}
	},
	
	//***************************************************************
	prv_renderRow: function( sTime, paHeadings, paDates, poColours ){
		var i, oRow, oCell;
		var oDate, sDate, sTime, aItems;
		
		oRow = $("<tr>",{class:"caltime"});
		
		oCell = $("<th>").append(sTime);
		oRow.append(oCell);
		
		for (i=0; i<paHeadings.length; i++){
			sDate = paHeadings[i];
			oCell = $("<td>");
			oRow.append(oCell);
			
			oDate = paDates[sDate];
			if (oDate.hasOwnProperty(sTime)){
				aItems = oDate[sTime];
				this.prv_render_items(oCell, aItems, poColours );
			}
		}
		
		return oRow;
	},
	
	//***************************************************************
	prv_render_items: function(poCell, paItems, poColours){
		var i, oItem, oButton, sColour, sStyle;
		var oWidget = this;
		
		for (i=0; i<paItems.length; i++){
			oItem = paItems[i];
			sColour = poColours[oItem.i];
			sStyle = "background-color:" + sColour;
			if (oItem.d === current_date)
				sStyle += ";border:4px double black" 

			oButton = $("<button>", {
					class:"calbutton roundbutton",style:sStyle,
					i:oItem.i,p:oItem.p,
					title:oItem.i + "," + oItem.p 
				});
			oButton.append("&nbsp;");
			oButton.click( function(poEvent){ 	oWidget.onButtonClick(poEvent.target)}	);
			
			poCell.append(oButton);
		}
	},
	
	//#################################################################
	//# Events
	//#################################################################
	onButtonClick: function(poButton){
		var oOptions = this.options;
		var oItem = $(poButton);
		
		this._trigger("onClick", null, {s:oOptions.sol,i:oItem.attr("i"),p:oItem.attr("p"),m:oOptions.mission.ID});
	},
	
	//***************************************************************
	onError:function(poHttp){
		var oElement = this.element;

		oElement.empty();
		var oDiv = $("<DIV>",{class:"ui-state-error"});
		oDiv.append("Sorry no data was found");
		oElement.append(oDiv);
	},
	
	//***************************************************************
	onCalResponse:function(poHttp){
		var oElement = this.element;
		var oOptions = this.options;
		
		oElement.empty();
		oElement.addClass("ui-widget-content");
		
		var oData = poHttp.response;
		var sSol = oData.sol;
		var aDates = oData.cal;
		var aInstr = oData.instr;
		
		var oColours = this.prv__build_colour_part(aInstr);

		oElement.append("<p>");

		var aHeadings = this.prv__get_Headings(aDates);
		var aTimes = this.prv__get_Times(aDates);
		
		this.prv__build_cal_part(aHeadings, aDates, aTimes,oColours );
		this._trigger("onLoadedCal", null, oOptions.sol);
	},		

});	
