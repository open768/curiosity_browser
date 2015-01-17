/**************************************************************************
Copyright (C) Chicken Katsu 2014 

This code is protected by copyright under the terms of the 
Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License
http://creativecommons.org/licenses/by-nc-nd/4.0/legalcode

For licenses that allow for commercial use please contact cluck@chickenkatsu.co.uk

// USE AT YOUR OWN RISK - NO GUARANTEES OR ANY FORM ARE EITHER EXPRESSED OR IMPLIED
**************************************************************************/

var DEBUG_ON = true;

//requires Jquery cookie from https://github.com/carhartl/jquery-cookie

var cAuth = {
	user:null,
	//**********************************************************
	getFBUser:function ( poFBResponse ){
		if (this.user){
			cDebug.write("previously authenticated");
			bean.fire(cAuth, "onGetFBUser",[sUser]);
			return
		}
			
		var sUser = $.cookie("user");
		if (sUser){
			cDebug.write("user is cached: " + sUser);
			this.setUser(sUser);
			bean.fire(cAuth, "onGetFBUser",[sUser]);
			return;
		}
		
		cDebug.write("getting Facebook user details for user " + poFBResponse.userID);
		cDebug.write("Access token: " + poFBResponse.accessToken);
		var oData = {
			o:"getuser",
			user: poFBResponse.userID,
			token: poFBResponse.accessToken
		}
		cHttp.post("php/rest/facebook.php", oData, cAuth.FBCallback);
	},
	
	//**********************************************************
	FBCallback:function(psData){
		var sUser;
		cDebug.write("Auth got response from FB");
		sUser = $.parseJSON(psData);
		cDebug.write(sUser);
		cAuth.setUser(sUser);
		bean.fire(cAuth, "onGetFBUser",[sUser]);
	},
	
	//**********************************************************
	setUser:function (psUser){
		this.user = psUser;
		$.cookie("user",psUser);
	}
}
