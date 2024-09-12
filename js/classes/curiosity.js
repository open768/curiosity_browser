'use strict'

/* global cSpaceUrlParams */ //these are defined spaceinc/misc/constannts and in added by the app php eg in title.php
// eslint-disable-next-line no-unused-vars
class cCuriosity {
	static WHERE_IS_ROVER = 'http://mars.jpl.nasa.gov/msl/mission/whereistherovernow/'

	//*********************************************************************
	static get_msl_notebook_link(psSol) {
		const sUrl = cBrowser.buildUrl('https://an.rsl.wustl.edu/msl/mslbrowser/bookmarkLink.aspx', {
			it: 'SS',
			ii: psSol
		})
		return sUrl
	}

	//*********************************************************************
	static get_raw_image(psSol, psProduct) {
		const sUrl = cBrowser.buildUrl('http://mars.nasa.gov/msl/multimedia/raw', {
			rawid: psProduct,
			s: psSol
		})
		return sUrl
	}

	//*********************************************************************
	static make_url_params(psSol, psInstr, psProduct) {
		if (cString.is_string_empty(psSol)) cDebug.error('must have Sol')
		var oParams = {}
		oParams[cSpaceUrlParams.SOL] = psSol
		if (!cString.is_string_empty(psInstr)) {
			oParams[cSpaceUrlParams.INSTR] = psInstr
			if (!cString.is_string_empty(psProduct)) oParams[cSpaceUrlParams.PRODUCT] = psInstr
		}

		return oParams
	}
}
