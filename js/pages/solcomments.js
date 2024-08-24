/**************************************************************************
Copyright (C) Chicken Katsu 2013 - 2024

This code is protected by copyright under the terms of the
Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License
http://creativecommons.org/licenses/by-nc-nd/4.0/legalcode

For licenses that allow for commercial use please contact cluck@chickenkatsu.co.uk

// USE AT YOUR OWN RISK - NO GUARANTEES OR ANY FORM ARE EITHER EXPRESSED OR IMPLIED
**************************************************************************/
"use strict"

//eslint-disable-next-line no-unused-vars
class cSolComments {
   static current_sol = null

   //###############################################################
   //# Entry point
   //###############################################################
   static onLoadJQuery() {
      this.current_sol = cBrowser.data[cSpaceBrowser.SOL_QUERYSTRING]
      if (this.current_sol == null) {
         $("#solhigh").append("no SOL provided!!!!")
         return
      }

      // change status of checkbox
      this.set_browser_url()
      this.render_buttons()
      this.load_sol_comments()
   }

   //###############################################################
   //# Utility functions
   //###############################################################
   static set_browser_url() {
      $("#sol").html(this.current_sol)
      $("#solbutton").html(this.current_sol)
      const oParams = {}

      oParams[cSpaceBrowser.SOL_QUERYSTRING] = this.current_sol

      const sUrl = cBrowser.buildUrl(cBrowser.pageUrl(), oParams)
      cBrowser.pushState("solcomments", sUrl)
   }

   //###############################################################
   //# events
   //###############################################################
   static render_buttons() {
      var oDiv, oButton, oThis
      oThis = this
      oDiv = cJquery.element("buttons")
      {
         oDiv.empty()
         oButton = cAppRender.make_button(
            null,
            "previous sol",
            "previous sol",
            false,
            () => oThis.onClickPrevious_sol(),
         )
         oDiv.append(oButton)

         oButton = cAppRender.make_button(
            "solbut",
            "Sol ???",
            "go to sol",
            false,
            () => oThis.onClickGoToSol(),
         )
         oDiv.append(oButton)

         oButton = cAppRender.make_button(
            null,
            "next sol",
            "next sol",
            false,
            () => oThis.onClickNext_sol(),
         )
         oDiv.append(oButton)

         oButton = cAppRender.make_button(
            null,
            "All",
            "go to All comments",
            false,
            () => oThis.onClickAll(),
         )
         oDiv.append(oButton)
      }
   }

   //***************************************************************
   static load_sol_comments() {
      var sUrl, oHttp

      //update the displayed sol
      var oSolDiv = cJquery.element("solbut")
      oSolDiv.html("Sol: " + this.current_sol)

      //fetch sol data
      sUrl = cBrowser.buildUrl(cAppLocations.rest + "/comments.php", {
         o: "sol",
         s: this.current_sol,
         m: cMission.ID,
      })
      oHttp = new cHttp2()
      bean.on(oHttp, "result", (e) => this.onLoadSolComments(e))
      oHttp.fetch_json(sUrl)
   }
   //###############################################################
   //# events
   //###############################################################
   static onClickPrevious_sol() {
      this.current_sol--
      this.set_browser_url()
      this.load_sol_comments()
   }

   //***************************************************************
   static onClickNext_sol() {
      this.current_sol++
      this.set_browser_url()
      this.load_sol_comments()
   }

   //***************************************************************
   static onClickGoToSol() {
      const oParams = {}
      oParams[cSpaceBrowser.SOL_QUERYSTRING] = this.current_sol
      const sUrl = cBrowser.buildUrl("index.php", oParams)
      cBrowser.openWindow(sUrl, "index")
   }

   static onLoadSolComments(poHttp) {
      var oJson = poHttp.response
      var oDiv = cJquery.element("comments")

      oDiv.html("not implemented")
   }
}
