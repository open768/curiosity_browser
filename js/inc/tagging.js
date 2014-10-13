var cTagging = {
	phpBaseURL:"php/rest/tag.php",
	maxFont:24,
	minFont:10,
	
	//********************************************************************************
	getTags: function(psSol,psInstr, psProduct, pfnCallback){
		sUrl = this.phpBaseURL + "?o=get&s=" + psSol + "&i=" + psInstr + "&p=" + psProduct;
		set_status("getting tag");
		cHttp.fetch_json(sUrl, pfnCallback);
	},

	//********************************************************************************
	setTag: function(psSol,psInstr, psProduct, psTagname, pfnCallback){
		var sUrl;
		sUrl = this.phpBaseURL + "?o=set&s=" + psSol + "&i=" + psInstr + "&p=" + psProduct+"&v="+psTagname;
		set_status("setting tag " + sUrl);
		cHttp.fetch_json(sUrl, pfnCallback);
	},
	
	//********************************************************************************
	getTagNames: function(pfnCallback){
		var sUrl;
		sUrl = this.phpBaseURL + "?o=all" ;
		set_status("fetching tagnames");
		cHttp.fetch_json(sUrl, pfnCallback);
	},
	
	//********************************************************************************
	getTagDetails:function(psTag, pfnCallback){
		var sUrl;
		set_status("fetching tag details");
		sUrl = this.phpBaseURL + "?o=detail&t=" + psTag;
		cHttp.fetch_json(sUrl, pfnCallback);
	},
	
	//********************************************************************************
	showTagCloud:function(psElement, poData){
		var sHTML = "";
		var sKey, iCount, iSize, iWeight, iMax, fsRatio, fwRatio;
		
		iMax = 0;
		for (sKey in poData)
			iMax = Math.max(iMax, poData[sKey]);
		fsRatio = (this.maxFont - this.minFont)/ iMax;
		fwRatio = 800/ iMax;
		
			
		for (sKey in poData){
			iCount = poData[sKey];
			iSize = this.minFont + iCount * fsRatio;
			iWeight = 100 + Math.round(iCount * fwRatio);
			
			var sTarget = ( SINGLE_WINDOW ? "" : "target='tags'");
			sHTML += "<a " + sTarget + " style='font-size:" + iSize + "px;font-weight:" + iWeight + "' href='tag.php?t=" + sKey  + "'>" + sKey +"</a> ";
		}
		$("#"+psElement).html(sHTML);
	}
}