var DEBUG_ON = true;
var loading = true;
const SOL_QUERYSTRING = "s";
const INSTR_QUERYSTRING = "i";
const PRODUCT_QUERYSTRING = "p";

var current_sol = null;
var current_instrument = null;
var current_product = null;

//###############################################################
//# Event Handlers
//###############################################################
//***************************************************************
function OnClickNext(){
	//find the next product and reload
}

//***************************************************************
function OnClickPrevious(){
	//find the previous product and reload
}

//###############################################################
//# Utility functions 
//###############################################################
function load_data(){
	var sSol, sInstr, sProd;
	
	sSol = query_string[SOL_QUERYSTRING];
	sInstr = query_string[INSTR_QUERYSTRING];
	sProd = query_string[PRODUCT_QUERYSTRING];
	
	document.getElementById("product").innerHTML = sProd;
	document.getElementById("instrument").innerHTML = sInstr;
	
	get_product_data( sSol, sInstr, sProd);
}

//***************************************************************
function get_product_data( psSol, psInstr, psProd){
	var sUrl;
	
	loading=true;
	sUrl = "php/detail.php?s=" + psSol + "&i=" + psInstr +"&p=" + psProd;
	set_status("fetching data...");
	debug_console(sUrl);
	RGraph.AJAX.getJSON(sUrl, load_detail_callback);
}
//###############################################################
//* call backs 
//###############################################################
function load_detail_callback(paJS){
	var sLink;
	set_status("received data...");
	
	document.getElementById("date").innerHTML = paJS["d"];
	document.getElementById("image_link").innerHTML = "<a target='nasa' href='"+ paJS["i"] + "'>" + paJS["i"] + "</a>";
	document.getElementById("image").innerHTML = "<a target='nasa' href='"+ paJS["i"] + "'><img src='" + paJS["i"] + "'></a>";
	
	sLink = paJS["l"];
	if (sLink=="UNK"){
		document.getElementById("label_link").innerHTML = "No Product Label data found";
		document.getElementById("label").innerHTML = "No Product Label data found";
	}else{
		document.getElementById("label_link").innerHTML = "<a target='nasa' href='"+ sLink + "'>" + sLink + "</a>";
		document.getElementById("label").src = sLink;
	}
}
