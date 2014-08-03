/**************************************************************************
Copyright (C) Chicken Katsu 2014 

This code is protected by copyright under the terms of the 
Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License
http://creativecommons.org/licenses/by-nc-nd/4.0/legalcode

For licenses that allow for commercial use please contact cluck@chickenkatsu.co.uk

// USE AT YOUR OWN RISK - NO GUARANTEES OR ANY FORM ARE EITHER EXPRESSED OR IMPLIED
**************************************************************************/

//###############################################################
//# google earth
//###############################################################
function pr_GE_onInit(poInstance){ cGoogleEarth.pr_init_callback(poInstance); }
function pr_GE_onFail(){}

var cGoogleEarth = {
	oEarth:null,
	sDiv:null,
	callback:null,
	
	//***********************************************************
	pr_init_callback:function(poInstance){
	  this.oEarth = poInstance;
	  poInstance.getWindow().setVisibility(true);
	  if (this.callback)this.callback();
	},
	
	//***********************************************************
	init: function(psDiv){
		this.sDiv = psDiv;
		set_status("init earth");
		google.earth.createInstance(psDiv, pr_GE_onInit, pr_GE_onFail, { database: 'http://khmdb.google.com/?db=mars' });
	},
	
	//***********************************************************
	makePlacemark:function (pfLat, pfLong, psCaption){
		var ge = this.oEarth;
		
		// Create the placemark.
		var oMark = ge.createPlacemark('');
		oMark.setName(psCaption);

		// Set the placemark's location.  
		var oPt = ge.createPoint('');
		oPt.setLatitude(pfLat);
		oPt.setLongitude(pfLong);
		oMark.setGeometry(oPt);

		// Add the placemark to Earth.
		ge.getFeatures().appendChild(oMark);		
		
		return oMark;
	},
	
	//***********************************************************
	flyTo:function(pfLat, pfLong, pfAltitude){
		var ge = this.oEarth;
		
		// Create a new LookAt.
		var oLookAt = ge.createLookAt('');

		// Set the position values.
		oLookAt.setLatitude(pfLat);
		oLookAt.setLongitude(pfLong);
		oLookAt.setRange(pfAltitude);

		// Update the view in Google Earth.
		ge.getView().setAbstractView(oLookAt);	
	}
}
