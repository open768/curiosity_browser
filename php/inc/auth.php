<?php
/**************************************************************************
Copyright (C) Chicken Katsu 2014 

This code is protected by copyright under the terms of the 
Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License
http://creativecommons.org/licenses/by-nc-nd/4.0/legalcode

For licenses that allow for commercial use please contact cluck@chickenkatsu.co.uk

// USE AT YOUR OWN RISK - NO GUARANTEES OR ANY FORM ARE EITHER EXPRESSED OR IMPLIED
**************************************************************************/

class cAuth{
	public static $user;
	
	//**********************************************************
	public static function must_get_user(){
		$sUser = self::get_user();
		if (!$sUser) cDebug::error("must be logged in");
		cDebug::write("user is $sUser");
		return $sUser;
	}
	
	//**********************************************************
	public static function get_user(){
		global $_SESSION;
		
		if (session_status() == PHP_SESSION_NONE) session_start();
		
		$sUser = null;
		if (isset( $_SESSION["user"])) $sUser = $_SESSION["user"];
		
		return $sUser;
	}
	
	//**********************************************************
	public static function check(){
		global $_SESSION, $_POST, $_GET;
		//allready set the session
		$sUser = self::get_user();
		if ($sUser){
			header("location:".$_SESSION['url']);
			die;
		}

		//got a form
		if (isset($_POST["user"] )){
			//----
			$sUser = $_POST["user"];
			if ($sUser === "") return "err how about a username?";
			
			//---
			$oAyah = new AYAH();
			$score = $oAyah->scoreResult();
			
			if (! $score ) return "try the human game again please";
			
			//--- everything is ok
			$_SESSION["user"] = $_POST["user"];
			header("location:".$_SESSION["url"]);
			die;
		}
		//none of the above
		$_SESSION['url'] = $_GET["l"];
	}
	
	//**********************************************************
	public static function show_form(){
		cDebug::write("loadig AYAH");
		$oAyah = new AYAH();
		cDebug::write("done loadig AYAH");
		?>
		We pardon the interruption but we need a name to continue.
		<p>
		<form method="POST">
			<input name="user" type="text" size="10">
			<p>
			<?=$oAyah->getPublisherHTML();?>
			<p>
			<input type="submit">
		</form>
		<?php
	}
	
	

}
?>