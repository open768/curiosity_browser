
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//% Definition
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
$.widget( "chickenkatsu.imageview",{
	//#################################################################
	//# Definition
	//#################################################################
	consts:{
		IMAGES_URL:"php/rest/images.php",
		IMAGES_TO_SHOW: 5,
		CurrentID:"C",
		LeftID:"L",
		RightID:"R",
		MaxID:"M"
	},
	options:{
		sol: null,
		instrument: null,
		start_image: 0,
		max_images: -1,
		keypress_done: false
	},
	
	//#################################################################
	//# Constructor
	//#################################################################
	_create: function(){
		//check that the element is a div
		var oWidget = this;
		var sElementName = this.element.get(0).tagName;
		
		if (sElementName !== "DIV")
			$.error("thumbnail view needs a DIV. this element is a: " + sElementName);

		//check that the options are passed correctly
		if (this.options.sol == null) $.error("sol is not set");
		if (this.options.instrument == null) $.error("instrument is not set");
				
		//clear out the DIV and put some text in it
		this.element.empty();
		this.element.append("Loading Images for sol:" + this.options.sol);
		if (this.options.instrument) this.element.append(", instr:" + this.options.instrument);

		//start the images load 
		this._trigger("onStatus",null,{text:"loading Images"});	
		this._load_images(this.options.start_image);
	},
	
	//#################################################################
	//# Methods
	//#################################################################
	_load_images:function(piStartImage){
		var oWidget = this;
		var sUrl = cBrowser.buildUrl(
			this.consts.IMAGES_URL,	{
				s:this.options.sol,
				i:this.options.instrument,
				b:piStartImage, 
				e:piStartImage+this.consts.IMAGES_TO_SHOW
			}
		);
		
		this.element.empty();
		this.element.append("Loading Images ...");
		
		cHttp.fetch_json(sUrl, function(paJS){oWidget.onFullImages(paJS)});
	},
	
	
	//#################################################################
	//# events
	//#################################################################
	onKeypress:function(poEvent){
		if (poEvent.target.tagName === "INPUT") return;
		
		var sChar = String.fromCharCode(poEvent.which);
		
		switch(sChar){
			case "n": this.onClickNextPage();break;
			case "p": this.onClickPreviousPage();break;
		}	
	},
	
	//**************************************************************************************************
	onFullImages: function( paJS){
		var oWidget = this;
		this._trigger("onStatus",null,{text:"showing images"});	
		var oDiv, iIndex, oItem, oOuterDiv;
		
		gi_max_images = 0;
		
		//clear out the image div
		this.element.empty();
			
		//build the html to put into the div
		if (paJS.max == 0)
			this.element.html("No data found");
		else{
			//nothing in this div
			this.element.empty();
			this.options.max_images = paJS.max;
			
			//update title
			this.options.start_image = parseInt(paJS.start);

			//create the navigation div
			var sID = this.element.id;
			var oNavTable = $("<table>",{class:"gold",width:"100%"});
				var oRow = $("<TR>");
					var oCell = $("<TD>",{width:"40%"});
					var oButton = $("<button>", {class:"leftarrow imagenav",title:"Previous Page",id:sID+ this.consts.LeftID} );
					if (this.options.start < this.consts.IMAGES_TO_SHOW) 
						oButton.attr('disabled', "disabled");
					else
						oButton.html("Previous Page").click( function(){		oWidget.onClickPreviousPage();	});
					oCell.append(oButton);
				oRow.append(oCell);
					oCell = $("<TD>",{width:"10%",id: sID + this.consts.CurrentID,align:"middle"}).html(paJS.start);
				oRow.append(oCell);
					oCell = $("<TD>",{width:"40%"});
					oButton = $("<button>", {class:"rightarrow imagenav",title:"Previous Page",id:sID+ this.consts.LeftID} );
					if (this.options.start >= paJS.max - this.consts.IMAGES_TO_SHOW) 
						oButton.attr('disabled', "disabled");
					else
						oButton.html("Next Page").click( function(){		oWidget.onClickNextPage();	});
					oCell.append(oButton);
				oRow.append(oCell);
					oCell = $("<TD>",{align:"right"});
					oCell.append(" Max:" + paJS.max);
				oRow.append(oCell);
			oNavTable.append(oRow);
			this.element.append(oNavTable);
			

			//display the images
			for (iIndex = 0; iIndex < paJS.images.length; iIndex++){
				var oDiv, oImgDiv, oA, oImg;
				
				// get the img details
				oItem = paJS.images[iIndex];
				
				//build up the div
				oDiv = $("<DIV>").instrumentimage({
							sol:this.options.sol,
							instrument:this.options.instrument,
							product:oItem.p,
							src:oItem.i,
							date:oItem.du,
							onClick: function(poEvent,poData){	oWidget._trigger("onClick",poEvent,poData);		},
							onStatus: function(poEvent,paData){	oWidget._trigger("onStatus",poEvent,paData);	}
					});
				this.element.append(oDiv);
			}
			
			//add the navigation controls again (have to clone)
			this.element.append(oNavTable.clone(true));
		}
		
		//set up keypress
		if (!this.options.keypress_done){
			this._on( window, {	keypress: function(poEvent){oWidget.onKeypress(poEvent)}});
			this.options.keypress_done = true;
		}

		this._trigger("onLoaded",null,this.options.start);
	},
	
	//**************************************************************************************************
	onClickPreviousPage: function(){
		if (this.options.start_image < this.consts.IMAGES_TO_SHOW) return;
		this._load_images( this.options.start_image - this.consts.IMAGES_TO_SHOW);
	},

	//**************************************************************************************************
	onClickNextPage: function(){
		if (this.options.start_image >= this.options.max_images - this.consts.IMAGES_TO_SHOW) return;
		this._load_images( this.options.start_image + this.consts.IMAGES_TO_SHOW);
	}
	
});	
