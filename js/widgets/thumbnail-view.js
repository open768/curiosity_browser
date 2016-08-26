$.widget( "chickenkatsu.thumbnail_view",{
	state:{
		currentThumbnail :0
	},
	options:{
		ThumbsPerPage: 100,
	},
	
	//#################Constructor##########################
	_create: function(){
		//check that the element is a div
		var sElementName = this.element.get(0).tagName;
		if (sElementName !== "DIV")
			$.error("thumbnail view needs a DIV. this element is a: " + sElementName);
	}
});	