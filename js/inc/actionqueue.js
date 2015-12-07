
//###############################################################
// CActionQueue
// A simple generic class to manage the batch processing of stuff
//###############################################################

function cActionQueue(){
	this.aBacklog=[];
	this.aTransfers = new cQueue();
	this.bStopping=false;
	this.MAX_IMGQ_TRANSFERS=10;
	
	//***************************************************************
	this.clear = function(){
		cDebug.write("clearing image queue");
		this.aBacklog = [];
		this.bStopping = false;
	};
	
	//***************************************************************
	this.stop = function(){
		this.bStopping = true;
	};
	
	//***************************************************************
	this.add = function(psSol, psInstr, psProduct, psActionUrl){
		this.aBacklog.push({s:psSol,i:psInstr,p:psProduct, u:psActionUrl});
	};

	//***************************************************************
	this.start = function(){
		var oItem, iLen;
		var oParent = this;
		
		function pfnCallback(poJson){
			cDebug.write("actionqueue callback " + poJson.p);
			oParent.process_response(poJson);
		}
		
		if (this.bStopping) exit();
				
		if (this.aTransfers.length() >= this.MAX_IMGQ_TRANSFERS)
			cDebug.write("too many items being transferred");
		else if (this.aBacklog.length == 0)
			cDebug.write("no items in queue");
		else{
			oItem = this.aBacklog.pop();
			this.aTransfers.push(oItem.p,null);
			cDebug.write("performing action for "+oItem.p);
			bean.fire(this,"starting", oItem.p);
			cHttp.fetch_json(oItem.u, pfnCallback);
			this.start();
		}
	};
	
	//***************************************************************
	this.process_response = function(poJson){
		if (this.bStopping) exit();
		cDebug.write("processing response");
		this.aTransfers.remove(poJson.p);
		bean.fire(this,"response", poJson);
		this.start();
	};
}

