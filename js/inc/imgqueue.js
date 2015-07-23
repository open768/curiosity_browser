
//###############################################################
// CImgQueue
//###############################################################
var MAX_IMGQ_TRANSFERS=10;

var cImgQueue = {
	aBacklog:[],
	aTransfers:new cQueue(),
	
	//***************************************************************
	clear:function(){
		cDebug.write("clearing image queue");
		this.aBacklog = [];
	},
	
	//***************************************************************
	add:function(psSol, psInstr, psProduct){
		this.aBacklog.push({s:psSol,i:psInstr,p:psProduct});
	},

	//***************************************************************
	start:function(){
		var oItem, iLen;
		
		if (this.aTransfers.length() >= MAX_IMGQ_TRANSFERS)
			cDebug.write("too many items being transferred");
		else if (this.aBacklog.length == 0)
			cDebug.write("no items in queue");
		else{
			oItem = this.aBacklog.pop();
			this.aTransfers.push(oItem.p,null);
			cDebug.write("getting thumbnail for "+oItem.p);
			sUrl = "php/rest/solthumb.php?s=" + oItem.s + "&i=" + oItem.i + "&p=" + oItem.p;
			cHttp.fetch_json(sUrl, cImgQueue_callback);
			this.start();
		}
	},
	
	//***************************************************************
	process_response:function(poJson){
		cDebug.write("processing response");
		this.aTransfers.remove(poJson.p);
		bean.fire(this,"thumbnail", poJson);
		this.start();
	}
}

function cImgQueue_callback(poJson){
	cDebug.write("in imgqueue callback " + poJson.p);
	cImgQueue.process_response(poJson);
}

