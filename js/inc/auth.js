/**************************************************************************
Copyright (C) Chicken Katsu 2014 

This code is protected by copyright under the terms of the 
Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License
http://creativecommons.org/licenses/by-nc-nd/4.0/legalcode

For licenses that allow for commercial use please contact cluck@chickenkatsu.co.uk

// USE AT YOUR OWN RISK - NO GUARANTEES OR ANY FORM ARE EITHER EXPRESSED OR IMPLIED
**************************************************************************/

var DEBUG_ON = true;

var cAuth = {
	user:null,
	
	//**********************************************************
	forceLogin:function(){
		if (!this.user){
			location.href = "login.php?l="+ escape(document.URL);
			cDebug.error("forcing login");
		}
	},
	
	//**********************************************************
	getUser:function ( pfnCallback ){
		cHttp.fetch_json("php/auth.php?o=getuser", pfnCallback);
	},
	
	//**********************************************************
	gotoLogin:function (psReturnUrl){
	}
}
