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
var USGS_MARS_KML = "http://planetarynames.wr.usgs.gov/shapefiles/MARS_nomenclature.kmz";

var cGoogleEarth = {
	oEarth:null,
	sDiv:null,
	callback:null,
	
	//***********************************************************
	pr_init_callback:function(poInstance){
	  this.oEarth = poInstance;
	  poInstance.getWindow().setVisibility(true);
	  
	  //add the nomenclature layer
	  set_status("adding mars names");
	  this.addKML(USGS_MARS_KML);
	  
	  if (this.callback)this.callback();
	},
	
	//***********************************************************
	init: function(psDiv){
		this.sDiv = psDiv;
		set_status("init earth");
		google.earth.createInstance(psDiv, pr_GE_onInit, pr_GE_onFail, { database: 'http://khmdb.google.com/?db=mars' });
	},
	
	//***********************************************************
	addKML:function(psUrl){
		var ge = this.oEarth;
		var link = ge.createLink('');
		link.setHref(psUrl);
		var networkLink = ge.createNetworkLink('');
		networkLink.set(link, true, false); // Sets the link, refreshVisibility, and flyToView
		ge.getFeatures().appendChild(networkLink);	
	},
	
	//***********************************************************
	makePlacemark:function (pfLat, pfLong, psCaption, psDescription){
		var ge = this.oEarth;
		
		if (psDescription == null|| psCaption == null) {
			cDebug.write("incorrect number of parameters");
			return;
		}
		
		// Create the placemark.
		var oPlace = ge.createPlacemark('');
		oPlace.setName(psCaption);

		// Set the placemark's location.  
		var oPt = ge.createPoint('');
		oPt.setLatitude(pfLat);
		oPt.setLongitude(pfLong);
		oPlace.setGeometry(oPt);
		oPlace.setDescription(psDescription);
		
		// Add the placemark to Earth.
		ge.getFeatures().appendChild(oPlace);		
		
		return oPlace;
	},
	
	//***********************************************************
	makeVector:function (paCoords){
		var i, oCoords;
		var ge = this.oEarth;
		

		var oVector = ge.createLineString('');		
		
		for (i=0; i<paCoords.length; i++){
			oCoords = paCoords[i];
			oVector.getCoordinates().pushLatLngAlt(oCoords.lat, oCoords.lon, 0);
		}
		
		var oPlace = ge.createPlacemark('');
		oPlace.setGeometry(oVector);
		ge.getFeatures().appendChild(oPlace);	

		return 	oPlace;
	},
	
	//***********************************************************
	makeRect:function(paCoords){
		var ge = this.oEarth;
		var oCoords = null;
		
		var oVector = ge.createLineString('');
		oCoords = oVector.getCoordinates();
		if (paCoords.lat1){
			oCoords.pushLatLngAlt(paCoords.lat1, paCoords.long1, 0);
			oCoords.pushLatLngAlt(paCoords.lat1, paCoords.long2, 0);
			oCoords.pushLatLngAlt(paCoords.lat2, paCoords.long2, 0);
			oCoords.pushLatLngAlt(paCoords.lat2, paCoords.long1, 0);
			oCoords.pushLatLngAlt(paCoords.lat1, paCoords.long1, 0);
		}else{
			oCoords.pushLatLngAlt(paCoords.P1.x, paCoords.P1.y, 0);
			oCoords.pushLatLngAlt(paCoords.P1.x, paCoords.P2.y, 0);
			oCoords.pushLatLngAlt(paCoords.P2.x, paCoords.P2.y, 0);
			oCoords.pushLatLngAlt(paCoords.P2.x, paCoords.P1.y, 0);
			oCoords.pushLatLngAlt(paCoords.P1.x, paCoords.P1.y, 0);
		}
		
		var oPlace = ge.createPlacemark('');
		oPlace.setGeometry(oVector);
		ge.getFeatures().appendChild(oPlace);

		return oPlace;
	},
	
	//***********************************************************
	//color is aabbggrr in hex a=alpha, b=blue, g=green, r=red
	setLineColour:function (poPlace, psColour){
		var oStyle;
		var ge = this.oEarth;
		
		oStyle = poPlace.getStyleSelector();
		if(!oStyle){
			oStyle = ge.createStyle('');
			poPlace.setStyleSelector(oStyle);
		}
		oStyle.getLineStyle().getColor().set(psColour);
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
	},
	
	//***********************************************************
	addListener: function(psEvent, pfnCallback){
		var ge = this.oEarth;
		google.earth.addEventListener(ge, psEvent, pfnCallback);
	},
	
	//***********************************************************
	removeListener: function(psEvent, pfnCallback){
		var ge = this.oEarth;
		google.earth.removeEventListener(ge, psEvent, pfnCallback);
	}
}
