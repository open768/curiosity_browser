"use strict"

class cCuriosity {
   static WHERE_IS_ROVER =
      "http://mars.jpl.nasa.gov/msl/mission/whereistherovernow/"

   static get_msl_notebook_link(psSol) {
      const sUrl = cBrowser.buildUrl(
         "https://an.rsl.wustl.edu/msl/mslbrowser/bookmarkLink.aspx",
         {
            it: "SS",
            ii: psSol,
         },
      )
      return sUrl
   }

   static get_raw_image(psSol, psProduct) {
      const sUrl = cBrowser.buildUrl(
         "http://mars.nasa.gov/msl/multimedia/raw",
         {
            rawid: psProduct,
            s: psSol,
         },
      )
      return sUrl
   }
}
