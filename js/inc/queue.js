function cQueue(){
	this.prKey = null;
	this.prData = null;
	this.prNext = null;
	
	//**********************************************************
	this.length = function(){
		if (this.prNext === null)
			return 0;
		else
			return (1+ this.prNext.length());
	};
	
	//**********************************************************
	this.push = function(psKey, poData){
		var oNew;
		oNew = new cQueue();
		oNew.prData = poData;
		oNew.prKey = psKey;
		oNew.prNext = this.prNext;
		this.prNext = oNew;
	};
	
	//**********************************************************
	this.exists = function (psKey){
		if (this.prKey === psKey)
			return true;
		else if (this.prNext)
			return this.prNext.exists(psKey);
		else
			return false;
	};
	
	//**********************************************************
	this.remove = function (psKey){
		if (this.prNext){ 
			if (this.prNext.prKey === psKey)
				this.prNext = this.prNext.prNext;
			else
				this.prNext.remove(psKey);
		}
	};
	
	//**********************************************************
	this.pop = function (){
		var oResult = null;
		if (this.prNext !== null){
			oResult = this.prNext.prData;
			this.prNext = this.prNext.prNext;
		}
		return oResult;
	};
}