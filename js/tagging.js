var cTagging = {
	baseURL:"php/tag.php",
	realm:"UNK",
	
	getTags: function(psFolder, pfnCallback){
		sUrl = this.baseURL + "?o=get&r="+ this.realm +"&f="+psFolder;
		set_status("getting tag");
		cHttp.fetch_json(sUrl, pfnCallback);
	},

	setTag: function(psFolder, psTagname, pfnCallback){
		var sUrl;
		sUrl = this.baseURL + "?o=set&r="+ this.realm +"&f="+psFolder+"&v="+psTagname;
		set_status("setting tag " + sUrl);
		cHttp.fetch_json(sUrl, pfnCallback);
	},
	
	getTagNames: function(pfnCallback){
		var sUrl;
		sUrl = this.baseURL + "?o=all&r="+ this.realm ;
		set_status("fetching tagnames");
		cHttp.fetch_json(sUrl, pfnCallback);
	},
	
	getTagDetails:function(psTag, pfnCallback){
		var sUrl;
		set_status("fetching tag details");
		sUrl = this.baseURL + "?o=detail&r="+ this.realm + "&t=" + psTag;
		cHttp.fetch_json(sUrl, pfnCallback);
	}
}