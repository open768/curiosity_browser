
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
$.widget( "chickenkatsu.solinstrumentChooser",{
	//#################################################################
	//# Definition
	//#################################################################
	options:{
		sol: null,
		instrument: null,
		onSelect: null,
		onStatus: null
	},
	consts:{
		THIS_SOL_ID:	"ts",
		SOL_SUMMARY_ID:	"ss",
		SOL_LIST_ID:	"sl",
		LATEST_ID:		"la",
		INSTR_ID:	"i"
	},

	//#################################################################
	//# Constructor
	//#################################################################`
	_create: function(){
		var oWidget, oElement, sID, sOID, oObj, oDiv;
		
		oWidget = this;
		oElement = oWidget.element;
		oElement.uniqueId();
		sID = oElement.attr("id");
		
		oElement.empty();
		oElement.addClass("ui-widget");
		
		// sols part of the widget
		oDiv = $("<DIV>", {class:"ui-widget-content"});
			oObj = $("<DIV>", {class:"ui-widget-header"});
				oObj.append("Sol: ");
				sOID = sID+this.consts.THIS_SOL_ID;
				oObj.append(	$("<SPAN>", {id:sOID}).append("???")	);
			oDiv.append(oObj);
			
			oObj = $("<SELECT>", {id:sID+this.consts.SOL_SUMMARY_ID});
			oObj.append($("<Option>").append("loading..."));
			oDiv.append(oObj);

			oObj = $("<SELECT>", {id:sID+this.consts.SOL_LIST_ID});
			oObj.append($("<Option>").append("loading..."));
			oDiv.append(oObj);
		
		
			var oTable,oRow,oCell,oButton;
			oTable = $("<TABLE>", {border:0,width:"100%"});
			oRow = $("<TR>");
				oCell = $("<TD>",{align:"left"});
				oButton = $("<button>", {class:"solnav leftarrow",title:"previous Sol ([)"});
				oButton.click(	function(){oWidget.onPrevious()}	);
				oCell.append(oButton);
				oRow.append(oCell);
				
				sOID = sID+this.consts.LATEST_ID;
				oCell = $("<TD>",{align:"middle"});
				oButton = $("<button>", {class:"roundbutton",title:"latest",disabled:"disabled", id:sOID}).append("latest");
				oButton.click(	function(){oWidget.onLatest()}	);
				oCell.append(oButton);
				oRow.append(oCell);
				
				oCell = $("<TD>",{align:"right"});
				oButton = $("<button>", {class:"solnav rightarrow",title:"Next Sol (])"});
				oButton.click(	function(){oWidget.onNext()}	);
				oCell.append(oButton);
				oRow.append(oCell);
		
			oTable.append(oRow);
		oDiv.append(oTable);
		oElement.append(oDiv);
		
		// sols part of the widget
		oDiv = $("<DIV>", {class:"ui-widget-content"});
			oObj = $("<DIV>", {class:"ui-widget-header"}).append("Instruments");
			oElement.append(oObj);
			
			oObj = $("<SELECT>", {id:sID+this.consts.INSTR_ID});
			oObj.append($("<Option>").append("loading..."));
		oDiv.append(oObj);
		oElement.append(oDiv);
		
		this.prLoadLists();
	},
	
	//#################################################################
	//# Privates
	//#################################################################
	set_sol:function(psSol){
		var sID = this.element.attr("id") + this.consts.SOL_LIST_ID ;
		$("#"+sID + " option[value="+psSol+"]").attr("selected", true).change();
	},
	
	//*****************************************************************
	get_sol_instruments:function(psSol){
		var oWidget = this;
		var sListID = this.element.attr("id") + this.consts.INSTR_ID;
		
		this._trigger("onStatus",null,{data:"getting instruments for sol" + psSol});
		
		//hide instruments jQUERY 
		$("#"+ sListID + " option").each(
			function (pIndex, pObj){ $(pObj).attr({disabled:"disabled"})}
		);
	
		//get the instruments for this sol
		sUrl = "php/rest/instruments.php?s=" + psSol + "&r=0";
		cHttp.fetch_json(sUrl, function(paJS){oWidget.onLoadSolInstruments(paJS)}	);
	},

	//#################################################################
	//# Privates
	//#################################################################
	prLoadLists: function(){
		var oWidget = this;
		cHttp.fetch_json("php/rest/instruments.php", function(paJS){oWidget.onLoadInstruments(paJS)});
		cHttp.fetch_json("php/rest/sols.php", function(paJS){oWidget.onLoadSols(paJS)});
	},
	
	//#################################################################
	//# Events
	//#################################################################
	onPrevious:function(){
		var sID = this.element.attr("id");
		
		var oSelected, oPrev;
		var sListID = sID+this.consts.SOL_LIST_ID;
			
		oSelected = $("#"+sListID+" option:selected");
		if (oSelected.length == 0)	{
			this._trigger("onStatus",null,{text:"Select a sol!!!"});
			return true;
		}

		oPrev = oSelected.prev('option');
		if (oPrev.attr("disabled")=="disabled")
			oPrev = oPrev.prev('option');		//skip over disabled items
			
		if (oPrev.length>0)
			oPrev.prop('selected', true).change();
		
		return false;

	},

	//*****************************************************************
	onLatest:function(){
		var sID = this.element.attr("id");
		cDebug.write("setting latest sol: ");
		
		//deslect instruments
		var sListID = sID + this.consts.INSTR_ID;
		$("#"+sListID+" option:first").prop('selected',true);
		this.options.instrument = null;
		
		//select the list item
		var sListID = sID + this.consts.SOL_LIST_ID;
		$( "#"+sListID+" :last" ).prop('selected', true).change(); //call the change event on the sol list	
	},

	//*****************************************************************
	onNext:function(){
		var oSelected, oNext;
		var sID = this.element.attr("id");
		var sListID = sID+this.consts.SOL_LIST_ID;
			
		oSelected = $("#"+sListID+" option:selected");
		if (oSelected.length == 0)	{
			this._trigger("onStatus",null,{text:"Select a sol!!!"});
			return true;
		}
		
		oNext = oSelected.next('option');
		if (oNext.attr("disabled")=="disabled")
			oNext = oNext.next('option'); //skip over disabled items
			
		if (oNext.length>0)
			oNext.prop('selected', true).change();

		return false;
	},
	
	//*****************************************************************
	onLoadSolInstruments:function(paJS){
		var i, sInstr, oList;
		var oWidget = this;

		var sID = this.element.attr("id");
		oList = $("#" + sID + this.consts.INSTR_ID);
		
		//mark the instruments remaining
		for ( i = 0; i<paJS.length; i++){
			
			sInstr = paJS[i];
			oList.find('option[value=\"'+ sInstr + '\"]').removeAttr('disabled');
		}
		oList.change(	function(poEvent){oWidget.OnChangeInstrList(poEvent)})
	},
	
	//*****************************************************************
	onLoadInstruments:function(paJS){
		var i, oInstr, oList, sID;
		
		var sID = this.element.attr("id");
		
		oList = $("#"+sID + this.consts.INSTR_ID );
		oList.empty();
		
		oList.append( $("<option>",{value:"",disabled:"disabled"}).html("Select an Instrument..."));
		
		for (i = 0; i < paJS.length; i++){
			oInstr = paJS[i];
			oList.append( $("<option>",{value:oInstr.name,disabled:"disabled"}).html(oInstr.caption));
		}

		//click the buttons if stuff was passed in the query string
		if (cBrowser.data[INSTR_QUERYSTRING] ) 
			set_instrument(cBrowser.data[INSTR_QUERYSTRING]);
	},
	
	//*****************************************************************
	onLoadSols:function(paJS){
		var i, oSol, oList, oSumList, oOption, iSol, iLastRange, iRange ;
		var oWidget = this;

		cDebug.write("got sols callback");
		var sID = this.element.attr("id");
		
		oList = $("#"+sID + this.consts.SOL_LIST_ID );
		oList.empty();
		oSumList = $("#"+sID + this.consts.SOL_SUMMARY_ID );
		oSumList.empty();
		iLastRange = -1;
		
		for (i = 0; i < paJS.length; i++){
			oSol = paJS[i];
			iSol = parseInt(oSol.sol);
			iRange = Math.floor(iSol/SOL_DIVISIONS);
			
			if (iRange != iLastRange){
				oOption = $("<option>",{value:iSol}).html(oSol.sol + " to ...");
				oSumList.append(oOption);
				
				oOption = $("<option>",{value:"NaN",disabled:"disabled"}).html("-- " + oSol.sol + " --");
				oList.append(oOption);
				iLastRange = iRange;
			}

			oOption = $("<option>",{value:oSol.sol}).html(oSol.sol);
			oList.append(oOption);
		}
		
		//enable latest button
		sOID = sID+this.consts.LATEST_ID;
		$("#"+sOID).removeAttr('disabled');
		
		//set up the change handler
		oSumList.change( function(poEvent){oWidget.OnChangeSolSummaryList(poEvent)});
		oList.change(	function(poEvent){oWidget.OnChangeSolList(poEvent)})

		// mark the sol
		if (cBrowser.data[SOL_QUERYSTRING] ) 
			this.set_sol(cBrowser.data[SOL_QUERYSTRING]);	

		this._on( window, {	keypress: function(poEvent){oWidget.onKeypress(poEvent)}});
	},
	
	
	//#################################################################
	//# events
	//#################################################################
	onKeypress:function(poEvent){
		if (poEvent.target.tagName === "INPUT") return;
		
		var sChar = String.fromCharCode(poEvent.which);
		
		switch(sChar){
			case "[": this.onPrevious();break;
			case "]": this.onNext();break;
		}	
	},
	
	
	//*****************************************************************
	OnChangeSolList: function(poEvent){
		this.options.sol = poEvent.target.value;
		this._trigger("onSelect", null,{sol:this.options.sol, instrument:this.options.instrument});
		this.get_sol_instruments(poEvent.target.value);
	},
	
	//*****************************************************************
	OnChangeSolSummaryList: function(poEvent){
		this.set_sol(poEvent.target.value);
	},
	
	//*****************************************************************
	OnChangeInstrList: function(poEvent){
		this.options.instrument = poEvent.target.value;
		this._trigger("onSelect", null, {sol:this.options.sol, instrument:this.options.instrument});
	}
});