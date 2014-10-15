var cImgHilite = {
	templateID:"#box_template",
	containerID:"#highlight",
	baseImageID:"#baseimg",
	url:"php/rest/img_highlight.php",
	controlsID:"#controls",
	numberID:"#number",
	imgTarget:null,
	ID:0,
	currentBox:null,
	
	//**************************************************
	rejectBox:function(poButton){
		var oBox = poButton.parentNode.parentNode;
		$("#"+oBox.id).remove();
		this.currentBox  = null;
	},
		
	//**************************************************
	getBoxFromButton:function(poButton){
		//find the parent div and hide
		return poButton.parentNode.parentNode;
	},
	
	//**************************************************
	makeBox:function(piX, piY, bDraggable){
		var oClone;
		var oContainer = $(this.containerID);
		
		if (bDraggable && this.currentBox)
			oBox = this.currentBox;
		else{
			//make a unique ID
			var sID = "box"+this.ID;
			this.ID++;
			
			//create a clone of the template and add to container
			var oTemplate = $(this.templateID);
			if (oTemplate.length == 0) throw new Error("no template found");
			oClone = oTemplate.clone(true);
			oClone[0].id = sID
			oClone.appendTo(oContainer);
			
			//find the offset of the image
			var oImg = $(this.imgTarget);
			if (oImg.length==0) throw new Error ("Oops cant find image");
					
			//add it to the container and make it visible and draggable
			var oBox, iX, iY;
			oBox = $("#"+sID);
			oBox.show();		//has to be shown otherwise the maths goes scewy as width/height isnt set
			
			//save it
			if (bDraggable) this.currentBox = oBox;
		}
		
		//position relative to the image
		var oParent = oContainer.parent()[0];
		var iParentTop = oParent.offsetTop;
		var iParentLeft = oParent.offsetLeft;
		
		iX = piX - iParentLeft - oBox.width()/2 ;
		iY = piY  - iParentTop - oBox.height()/2 ;
		oBox.css({position: 'absolute',	top: ""+iY+"px",	left: ""+iX+"px"})
		
		//make it draggable to the image	
		oBox.draggable({ containment: oImg});
		
		return oBox;
	},
	
	//**************************************************
	make_fixed_box:function(psTop, psLeft){
		var oBox, oControls, oNumber;

		//make and position the box
		oBox = this.makeBox(100,100,false);
		oBox.css({position: 'absolute',	top: psTop,	left: psLeft})
		
		//disable dragging and make it blue
		oBox.draggable('disable');
		oBox.attr("class","bluebox");
		
		//find and disable controls
		oControls = oBox.find(this.controlsID);
		$(oControls).hide()
		
		//find and enable number
		oNumber = oBox.find(this.numberID);
		$(oNumber).show();
		
		return oBox;
	},
	
	//**************************************************
	remove_boxes:function(){
		//remove everything other than the img div from the container
		$(this.containerID).empty();
	},
	
	//**************************************************
	save_highlight:function(psSol,psInstr, psProduct, psID, pfnCallback){
		var oBox = $(psID);
		sUrl = this.url+"?o=add&s=" + psSol + "&i=" + psInstr + "&p=" + psProduct +"&t=" + oBox.css("top") + "&l=" + oBox.css("left");
		 this.currentBox  = null;
		cHttp.fetch_json(sUrl, pfnCallback);
	},
	
	//**************************************************
	getHighlights:function(psSol,psInstr, psProduct, pfnCallBack){
		sUrl = this.url+"?o=get&s=" + psSol + "&i=" + psInstr + "&p=" + psProduct;
		cHttp.fetch_json(sUrl, pfnCallBack);
	},
}