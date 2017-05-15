//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
$.widget( "chickenkatsu.instrumentimage",{
	//#################################################################
	//# Definition
	//#################################################################
	options:{
		sol: null,
		instrument: null,
		product: null,
		src: null,
		date:null,
		image_div:null,
		tags_div:null
	},

	//#################################################################
	//# Constructor
	//#################################################################`
	_create: function(){
		var oWidget = this;
		var oOptions = oWidget.options;
		var oElement = oWidget.element;
		
		if (oOptions.sol == null) $.error("sol is not set");
		if (oOptions.instrument == null) $.error("instrument is not set");
		if (oOptions.product == null) $.error("product is not set");
		if (oOptions.src == null) $.error("src is not set");
		
		//build image
		oImg = $("<IMG>",{src:oOptions.src});
		oImg.load(		function(){oWidget.onLoadedImage();}							);
		oImg.click(		function(){oWidget._trigger("onClick", null, oOptions);} 	);
		
		oOptions.image_div = $("<DIV>").css({position: 'relative'});
		oOptions.image_div.append(oImg);	
		
		//add the lot to the new div
		oElement.empty();
		oElement.append(oOptions.image_div);
		oElement.append($("<SPAN>",{class:"subtitle"}).html("Date: "));
		oElement.append(oOptions.date);
		oElement.append($("<SPAN>",{class:"subtitle"}).html(" Product: "));
		oElement.append(oOptions.product );
		oElement.append($("<SPAN>",{class:"subtitle"}).html(" Tags: "));

		oOptions.tags_div = $("<SPAN>",{class:"soltags"}).html("Loading ...");
		oElement.append(oOptions.tags_div);
	},
	
	//#################################################################
	//# Events
	//#################################################################`
	onLoadedImage: function(){
		var oOptions = this.options;
		var oWidget = this;
		
		cDebug.write("loaded image: " + this.options.src);
		
		//get the image and tag highlights TODO add these to a queue that can be stopped
		cImgHilite.getHighlights(
			oOptions.sol,oOptions.instrument,oOptions.product, 
			function(paJS){		oWidget.onHighlights(paJS)	}
		);
		cTagging.getTags(
			oOptions.sol,oOptions.instrument,oOptions.product, 
			function(paJS){		oWidget.onTags(paJS)	}
		);
	},
	
	// ***************************************************************
	onHighlights: function(paJS){
		var i, oDiv, oRedBox, iLeft, iTop;
		
		if (!paJS.d) return;
		oDiv = this.options.image_div;
		
		for (i=0; i<paJS.d.length; i++){
			aItem = paJS.d[i];
			
			//create a redbox and display it
			oRedBox = $("<DIV>",{class:"redbox"});
			oDiv.append(oRedBox);
			
			//place it relative to the parent location
			iTop = parseInt(aItem.t);
			iLeft = parseInt(aItem.l);
			oRedBox.css({position: 'absolute',	top: iTop,	left: iLeft})
		}
	},
	
	// ***************************************************************
	onTags: function( paJS){
		var oDiv, oA, sTag, i;
		
		oDiv = this.options.tags_div;
		oDiv.empty();
		
		if (paJS.d.length== 0) {
			oDiv.html( "no Tags");
			return;
		}

		//put in the tags
		for (i=0; i<paJS.d.length; i++){
			sTag = paJS.d[i];
			oA = $("<A>",{href:"tag.php?t=" + sTag}).html(sTag);
			oDiv.append(oA).append(" ");
		}
	},
	
});