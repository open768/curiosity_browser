// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// % Definition
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
$.widget("ck.soltags", {
   // #################################################################
   // # Definition
   // #################################################################
   options: {
      mission: null,
      aSolsWithTags: null,
   },

   // #################################################################
   // # Constructor
   // #################################################################
   _create: function () {
      const oOptions = this.options
      const oElement = this.element

      // check for necessary classes
      if (!bean) {
         $.error("bean class is missing! check includes")
      }
      if (!cHttp2) {
         $.error("http2 class is missing! check includes")
      }
      if (!oElement.gSpinner) {
         $.error("gSpinner is missing! check includes")
      }

      // check that the options are passed correctly
      if (oOptions.mission == null) $.error("mission is not set")
      oElement.uniqueId()

      // check that the element is a div
      const sElementName = oElement.get(0).tagName
      if (sElementName !== "DIV") {
         $.error("needs a DIV. this element is a: " + sElementName)
      }

      // ok do it
      var oGrid = new cSolGridRenderer(
         oOptions.mission.ID,
         oElement,
         cLocations.rest + "/tag.php",
         "soltag.php",
      )
      oGrid.show_sol_grid()
   }
})
