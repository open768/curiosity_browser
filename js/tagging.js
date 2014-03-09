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
	}
}