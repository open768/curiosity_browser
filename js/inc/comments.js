var cComments = {
	phpBaseURL:"php/rest/comments.php",
	
	//********************************************************************************
	get: function(psSol,psInstr, psProduct, pfnCallback){
		sUrl = this.phpBaseURL + "?o=get&s=" + psSol + "&i=" + psInstr + "&p=" + psProduct;
		set_status("getting comments");
		cHttp.fetch_json(sUrl, pfnCallback);
	},

	//********************************************************************************
	set: function(psSol,psInstr, psProduct, psComment, pfnCallback){
		var sUrl;
		sUrl = this.phpBaseURL + "?o=set&s=" + psSol + "&i=" + psInstr + "&p=" + psProduct+"&v="+escape(psComment);
		set_status("setting tag " + sUrl);
		cHttp.fetch_json(sUrl, pfnCallback);
	}
}