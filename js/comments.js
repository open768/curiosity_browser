var cComments = {
	phpBaseURL:"php/comments.php",
	
	//********************************************************************************
	get: function(psFolder, pfnCallback){
		sUrl = this.phpBaseURL + "?o=get&f="+psFolder;
		set_status("getting comments");
		cHttp.fetch_json(sUrl, pfnCallback);
	},

	//********************************************************************************
	set: function(psFolder, psComment, pfnCallback){
		var sUrl;
		sUrl = this.phpBaseURL + "?o=set&f="+psFolder+"&v="+psComment;
		set_status("setting tag " + sUrl);
		cHttp.fetch_json(sUrl, pfnCallback);
	}
}