"use strict"

class cCuriosity {
   static get_msl_notbook_link(psSol) {
      const sUrl = cBrowser.buildUrl(
         "https://an.rsl.wustl.edu/msl/mslbrowser/bookmarkLink.aspx",
         {
            it: "SS",
            ii: psSol,
         },
      )
      return sUrl
   }
}
