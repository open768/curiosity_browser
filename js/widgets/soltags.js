// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// % Definition
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
/* global cSolGridRenderer */

$.widget("ck.soltags", {
   //#################################################################
   //# Definition
   //#################################################################
   options: {
      mission: null,
   },

   //#################################################################
   //# Constructor
   //#################################################################
   _create: function () {
      // create a grid
      var oGrid = new cSolGridRenderer(
         this.options.mission.ID,
         this.element,
         "tag.php", //rest call
         "soltag.php", //onclick
      )
      oGrid.show_sol_grid({ o: "topsolindex" })
   },
})
