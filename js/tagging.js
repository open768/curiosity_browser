var cTagging = {
	baseURL:"php/tag.php",
	realm:"UNK",
	maxFont:24,
	minFont:8,
	
	//********************************************************************************
	getTags: function(psFolder, pfnCallback){
		sUrl = this.baseURL + "?o=get&r="+ this.realm +"&f="+psFolder;
		set_status("getting tag");
		cHttp.fetch_json(sUrl, pfnCallback);
	},

	//********************************************************************************
	setTag: function(psFolder, psTagname, pfnCallback){
		var sUrl;
		sUrl = this.baseURL + "?o=set&r="+ this.realm +"&f="+psFolder+"&v="+psTagname;
		set_status("setting tag " + sUrl);
		cHttp.fetch_json(sUrl, pfnCallback);
	},
	
	//********************************************************************************
	getTagNames: function(pfnCallback){
		var sUrl;
		sUrl = this.baseURL + "?o=all&r="+ this.realm ;
		set_status("fetching tagnames");
		cHttp.fetch_json(sUrl, pfnCallback);
	},
	
	//********************************************************************************
	getTagDetails:function(psTag, pfnCallback){
		var sUrl;
		set_status("fetching tag details");
		sUrl = this.baseURL + "?o=detail&r="+ this.realm + "&t=" + psTag;
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
			sHTML += "<a target='tags' style='font-size:"+iSize+"px;font-weight:"+ iWeight +"' href='tag.html?t=" + sKey  + "'>" + sKey +"</a> ";
		}
		document.getElementById(psElement).innerHTML = sHTML;
	}
}