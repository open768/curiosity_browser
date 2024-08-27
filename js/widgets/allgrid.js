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
    },

    //#################################################################
    //# Constructor
    //#################################################################
    _create: function () {
        var oGrid = new cSolGridRenderer(
            this.options.mission.ID,
            this.element,
            this.options.data_url,
            this.options.sol_url,
        );
        oGrid.show_sol_grid({ o: 'topsolindex' });
    },
});
