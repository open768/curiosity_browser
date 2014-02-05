function clicklist(){
	var oTextBox;
	
	oTextBox = document.getElementById("sol");
	oTextBox.value = event.target.value;
}

function submitform(){
	document.forms["sols"].submit();
}