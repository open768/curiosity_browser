
//###############################################################
// CActionQueue
// A simple generic class to manage the batch processing of stuff
//###############################################################

function cActionQueue(){
	this.aBacklog=[];
	this.aTransfers = new cQueue();
	this.bStopping=false;
	this.MAX_TRANSFERS=10;
	
	//***************************************************************
	this.clear = function(){
		cDebug.write("clearing image queue");
		this.aBacklog = [];
		this.bStopping = false;
	};
	
	//***************************************************************
	this.stop = function(){
		this.bStopping = true;
		this.aBacklog=[];
	};
	
	//***************************************************************
	this.add = function(psName, psActionUrl){
		if (this.bStopping) return;
		this.aBacklog.push({n:psName, u:psActionUrl});
	};

	//***************************************************************
	this.start = function(){
		var oItem, iLen, oHttp;
		var oParent = this;
		
		if (this.bStopping) return;

		//-------------- set up the closure
		function pfnHttpCallback(poHttp){
			if (oParent.bStopping) return;
			oParent.process_response(poHttp);
		}
				
		//------------ queue logic
		if (this.aTransfers.length() >= this.MAX_TRANSFERS)
			cDebug.write("Queue full ...");
		else if (this.aBacklog.length > 0){
			oItem = this.aBacklog.pop(); //Take item off backlog
			this.aTransfers.push(oItem.n,null); //put onto transfer list
			
			bean.fire(this,"starting", oItem.n); //notify subscriber 
			
			oHttp = new cHttp2();
			bean.on(oHttp, "result", pfnHttpCallback);
			oHttp.fetch_json(oItem.u, oItem.n ); //start transfer
			
			this.start();			//continue the processing of the queue
		}
	};
	
	//***************************************************************
	this.process_response = function(poHttp){
		if (this.bStopping) exit();
		this.aTransfers.remove(poHttp.data);
		bean.fire(this,"response", poHttp.json);
		this.start();
	};
}

