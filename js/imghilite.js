var cImgHilite = {
	templateID:"#box_template",
	containerID:"#highlight",
	baseImageID:"#baseimg",
	url:"php/img_highlight.php",
	imgTarget:null,
	ID:0,
	
	//**************************************************
	rejectBox:function(poButton){
		var oBox = poButton.parentNode.parentNode;
		$("#"+oBox.id).remove();
	},
		
	//**************************************************
	acceptBox:function(poButton){
		//find the parent div and hide
		var oControlBox = poButton.parentNode;
		$(oControlBox).hide()
		
		//no longer draggable
		var oBox= oControlBox.parentNode;
		$(oBox).draggable('disable');
		
		//change the class to be a blue box
		oBox.className="bluebox";
		
		return oBox;
	},
	
	//**************************************************
	makeBox:function(piX, piY){
		var oClone;
		var oContainer = $(this.containerID);
		
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
		
		//position relative to the image
		var oParent = oContainer.parent()[0];
		var iParentTop = oParent.offsetTop;
		var iParentLeft = oParent.offsetLeft;
		
		iX = piX - iParentLeft - oBox.width()/2 ;
		iY = piY  - iParentTop - oBox.height()/2 ;
		oBox.css({position: 'absolute',	top: ""+iY+"px",	left: ""+iX+"px"})
		
		//make it draggable to the image	
		oBox.draggable({ containment: oImg});
		
		return sID;
	},
	
	//**************************************************
	remove_boxes:function(){
		//remove everything other than the img div from the container
		$(this.containerID).empty();
	},
	
	//**************************************************
	save_highlight:function(psPath, psID){
		var oBox = $(psID);
		sUrl = this.url+"o=add&f=" + psPath + "&t=" + oBox.css("top") + "&l=" + oBox.css("left");
		cHttp.fetch_json(sUrl, null);
	},
	
	//**************************************************
	getHighlights:function(psPath, pfnCallBack){
	},
}