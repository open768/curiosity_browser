//functions
var cFacebook = {
	AppID:null,
	callBackCalled:false,
	subscribed:{},
	
	//--------------------------------------------------------------------
	loadFacebook:function(){
	     (function(d, s, id){
         var js, fjs = d.getElementsByTagName(s)[0];
         if (d.getElementById(id)) {return;}
         js = d.createElement(s); js.id = id;
         js.src = "//connect.facebook.net/en_GB/sdk.js";
         fjs.parentNode.insertBefore(js, fjs);
       }(document, 'script', 'facebook-jssdk'));
	},
	   
	//--------------------------------------------------------------------
	onFBBeforeInit:function(){
		bean.fire(cFacebook,"init");

		if (!cFacebook.subscribed['auth.statusChange']){
			FB.Event.subscribe('auth.authResponseChange', cFacebook.onFBAuthResponseChange);
			cFacebook.subscribed['auth.authResponseChange'] = true;
		}
		if (cFacebook.subscribed['auth.statusChange'])
			FB.Event.unsubscribe('auth.statusChange', cFacebook.onFBAuthResponseChange);
		
		cDebug.write("calling Facebook with AppID " + cFacebook.AppID);
		//cant avoid calling a FB.init
		FB.init({
		  appId      : cFacebook.AppID,
		  xfbml      : true,
		  version    : 'v2.1',
		  status	:true
		});
		
		//FB.init goes silent when user has not given permissions to app, set a timer to check
		setTimeout(cFacebook.forceCheck, 3000);
	},
	
	//--------------------------------------------------------------------
	//this doesnt get called if the user has not used the facebook app, or removed the app from their profile
	onFBAuthResponseChange:function(poResponse){
		cFacebook.callBackCalled = true;
		cDebug.write("in onFBAuthResponseChange " + cFacebook.AppID);
		if (poResponse.status == "connected"){
			$("#username").html("Nearly there..");
			bean.on(cAuth, "onGetFBUser",cFacebook.onFBgetUser);
			cAuth.getFBUser(poResponse.authResponse);
		}else{
			cDebug.write("facebook status is " + poResponse.status);
			$("#username").hide();
			$("#FBloginButton").show();
		}
	},
	
	//--------------------------------------------------------------------
	onFBgetUser:function (psUser){
		$("#username").html("Welcome " + psUser);
		bean.fire(cFacebook,"gotUser");
	},
	
	//--------------------------------------------------------------------
	forceCheck:function(){
		if (cFacebook.callBackCalled) {
			cDebug.write("callback was called before dont need to login");
			return;
		}
		
		if (cFacebook.subscribed['auth.authResponseChange'])
			FB.Event.unsubscribe('auth.authResponseChange', cFacebook.onFBAuthResponseChange);
		if (cFacebook.subscribed['auth.statusChange'])
			FB.Event.unsubscribe('auth.statusChange', cFacebook.onFBAuthResponseChange);
		
		cDebug.write("calling FB to get details");
		FB.getLoginStatus(cFacebook.onFBAuthResponseChange);
	},
	
	//--------------------------------------------------------------------
	//we dont need the email or other permissions at the moment
	onClickLogin: function(){
		cDebug.write("logging on to FB");
		cFacebook.callBackCalled = false;
		FB.login(cFacebook.onFBLogin);
	},
	
	//--------------------------------------------------------------------
	onFBLogin:function(poResponse){
		if (poResponse.authResponse){
			cDebug.write("getting FB user details");
			$("#username").show();
			$("#FBloginButton").hide();
			cFacebook.forceCheck();
		}else
			set_error_status("Facebook not connected");
	}
}

	
	
//--------------------------------------------------------------------
