// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// % Definition
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
/* global cSolGridRenderer */

$.widget('ck.allgrid', {
	//#################################################################
	//# Definition
	//#################################################################
	options: {
		mission: null,
		data_url: null,
		sol_url: null,
		caption: null
	},

	//#################################################################
	//# Constructor
	//#################################################################
	_create: function () {
		const oOptions = this.options
		var oGrid = new cSolGridRenderer(oOptions.mission.ID, this.element, oOptions.caption, oOptions.data_url, oOptions.sol_url)
		oGrid.show_sol_grid({ o: 'topsolindex' })
	}
})
