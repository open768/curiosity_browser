// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// % Definition
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
/* global cSolGridRenderer */

$.widget("ck.solhighgrid", {
   // #################################################################
   // # Definition
   // #################################################################
   options: {
      mission: null,
      aSolWithHighs: null,
   },

   // #################################################################
   // # Constructor
   // #################################################################
   _create: function () {
      var oGrid = new cSolGridRenderer(
         this.options.mission.ID,
         this.element,
         "img_highlight.php",
         "solhigh.php",
      )
      oGrid.show_sol_grid({ o: "topsolindex" })
   },
})
