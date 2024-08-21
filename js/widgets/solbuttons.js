// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
/*jshint esversion: 6 */
class cSolButtons {
   consts = {
      TAG_ID: "t",
      HIGH_ID: "h",
      GIGA_ID: "g",
      NOTEBOOK_ID: "n",
      NOTEBOOKMAP_ID: "ni",
      CAL_ID: "c",
      REFRESH_ID: "r",
      ALLTHUMB_ID: "at",
      SITE_ID: "s",
   }
   options = null
   element = null

   //****************************************************************
   constructor(poOptions, poElement) {
      this.options = poOptions
      this.element = poElement
      this.init()
   }

   //****************************************************************
   pr_create_widget(psTitle) {
      var oWidget, oHeader, oBody
      var oWidget = $("<DIV>", { class: "w3-card w3-theme-widget" })
      {
         oHeader = $("<DIV>", { class: "w3-container w3-theme-widget-header" })
         {
            oHeader.append(psTitle)
            oWidget.append(oHeader)
         }

         oBody = $("<DIV>", { class: "w3-container" })
         oWidget.append(oBody)
         oWidget.body = oBody
      }
      return oWidget
   }

   //****************************************************************
   pr_make_button(psID, psCaption, psTitle, pbDisabled, pfnOnClick) {
      var oOptions = {
         title: psTitle,
         class: "w3-button w3-theme-action",
      }
      if (pbDisabled) oOptions.disabled = "disabled"
      if (psID) oOptions.id = psID

      var oButton = $("<button>", oOptions)
      {
         oButton.append(psCaption)
         oButton.click(pfnOnClick)
      }
      return oButton
   }

   //****************************************************************
   pr_render_sol_buttons() {
      var oWidget, oButton, sbutID
      var oElement = this.element
      var sID = oElement.attr("id")

      oWidget = this.pr_create_widget("Sol Information:")
      {
         var oBody = oWidget.body
         // ----------------------------------------------------
         oButton = this.pr_make_button(
            sID + this.consts.TAG_ID,
            "Tags",
            "Tags",
            true,
            () => oThis.onClickTag(),
         )
         oBody.append(oButton)

         // ----------------------------------------------------
         oButton = this.pr_make_button(
            sID + this.consts.HIGH_ID,
            "Highlights",
            "Highlights",
            true,
            () => oThis.onClickHighlights(),
         )
         oBody.append(oButton)

         // ----------------------------------------------------
         oButton = this.pr_make_button(
            sID + this.consts.GIGA_ID,
            "Gigapans",
            "Gigapans",
            true,
            () => oThis.onClickGigapans(),
         )
         oBody.append(oButton)

         // ----------------------------------------------------
         oButton = this.pr_make_button(
            sID + this.consts.NOTEBOOK_ID,
            "Notebook",
            "Notebook",
            true,
            () => oThis.onClickMSLNotebook(),
         )
         oBody.append(oButton)

         // ----------------------------------------------------
         oButton = this.pr_make_button(
            sID + this.consts.NOTEBOOKMAP_ID,
            "notebook Map",
            "notebook Map",
            true,
            () => oThis.onClickMSLNotebook(),
         )
         oBody.append(oButton)

         // ----------------------------------------------------
         oButton = this.pr_make_button(
            sID + this.consts.NOTEBOOKMAP_ID,
            "Calendar",
            "Calendar",
            true,
            () => oThis.onClickCalender(),
         )
         oBody.append(oButton)

         // ----------------------------------------------------
         oButton = this.pr_make_button(
            sID + this.consts.REFRESH_ID,
            "Calendar",
            "Calendar",
            true,
            () => oThis.onClickRefresh(),
         )
         oBody.append(oButton)

         // ----------------------------------------------------
         oButton = this.pr_make_button(
            sID + this.consts.ALLTHUMB_ID,
            "All thumbnails",
            "All thumbnails",
            true,
            () => oThis.onClickAllThumbs(),
         )
         oBody.append(oButton)

         // ----------------------------------------------------
         oButton = this.pr_make_button(
            sID + this.consts.SITE_ID,
            "Site",
            "Site",
            true,
            () => oThis.onClickSite(),
         )
         oBody.append(oButton)
      }
      oElement.append(oWidget)
   }

   //****************************************************************
   pr_render_info() {
      var oElement = this.element
      var oButton = null
      var oWidget = this.pr_create_widget("information:")
      {
         var oBody = oWidget.body
         // ----------------------------------------------------
         oButton = this.pr_make_button(null, "about", "about", false, () =>
            cBrowser.openWindow("about.php", "about"),
         )
         oBody.append(oButton)

         // ----------------------------------------------------
         oButton = this.pr_make_button(
            null,
            "curiosity?",
            "Where is curiosity now?",
            false,
            () =>
               cBrowser.openWindow(
                  "http://mars.jpl.nasa.gov/msl/mission/whereistherovernow/",
                  "whereami",
               ),
         )
         oBody.append(oButton)
      }
      oElement.append(oWidget)
   }

   //****************************************************************
   pr_render_all_sols() {
      var oElement = this.element
      var oButton

      var oWidget = this.pr_create_widget("All Sols:")
      {
         var oBody = oWidget.body
         // ----------------------------------------------------
         oButton = this.pr_make_button(
            null,
            "All Tags",
            "All Tags",
            false,
            () => cBrowser.openWindow("allsoltags.php", "alltags"),
         )
         oBody.append(oButton)

         // ----------------------------------------------------
         oButton = this.pr_make_button(
            null,
            "All Highlights",
            "All Highlights",
            false,
            () => cBrowser.openWindow("allsolhighs.php", "allhighs"),
         )
         oBody.append(oButton)

         // ----------------------------------------------------
         oButton = this.pr_make_button(
            null,
            "All Gigapans",
            "All Gigapans",
            false,
            () => cBrowser.openWindow("allgigas.php", "allgigas"),
         )
         oBody.append(oButton)

         // ----------------------------------------------------
         oButton = this.pr_make_button(
            null,
            "All Comments",
            "All Comments",
            false,
            () => cBrowser.openWindow("allcomments.php", "allcomments"),
         )
         oBody.append(oButton)

         // ----------------------------------------------------
         oButton = this.pr_make_button(
            null,
            "All Sites",
            "All Sites",
            false,
            () => cBrowser.openWindow("allsites.php", "allsites"),
         )
         oBody.append(oButton)
      }
      oElement.append(oWidget)
   }

   //****************************************************************
   init() {
      var oElement

      // check for necessary classes
      if (!bean) {
         $.error("bean class is missing! check includes")
      }
      if (!cHttp2) {
         $.error("http2 class is missing! check includes")
      }
      if (this.options.mission == null) $.error("mission is not set")

      //prepare element
      oElement = this.element
      oElement.uniqueId()
      oElement.empty()

      //make buttons
      this.pr_render_sol_buttons()
      this.pr_render_all_sols()
      this.pr_render_info()
   }

   //*****************************************************************
   set_sol(psSol) {
      const oThis = this

      // store the sol
      const oOptions = this.options
      oOptions.sol = psSol

      // disable all buttons in this widget;
      this.element.children("button").each(function () {
         $(this).attr("disabled", "disabled")
      })

      // enable selected
      var sID = this.element.attr("id")
      $("#" + sID + this.consts.NOTEBOOK_ID).removeAttr("disabled")
      $("#" + sID + this.consts.NOTEBOOKMAP_ID).removeAttr("disabled")
      $("#" + sID + this.consts.CAL_ID).removeAttr("disabled")
      $("#" + sID + this.consts.REFRESH_ID).removeAttr("disabled")
      $("#" + sID + this.consts.ALLTHUMB_ID).removeAttr("disabled")
      $("#" + sID + this.consts.SITE_ID).removeAttr("disabled")

      // fetch tags, highlights and gigapans
      var sUrl = cBrowser.buildUrl(cAppLocations.rest + "/gigapans.php", {
         o: "sol",
         s: this.options.sol,
         m: oOptions.mission.ID,
      })
      var oHttp = new cHttp2()
      bean.on(oHttp, "result", function (poHttp) {
         oThis.onFetchedGigapans(poHttp)
      })
      oHttp.fetch_json(sUrl)

      sUrl = cBrowser.buildUrl(cAppLocations.rest + "/tag.php", {
         o: "solcount",
         s: this.options.sol,
         m: oOptions.mission.ID,
      })
      oHttp = new cHttp2()
      bean.on(oHttp, "result", function (poHttp) {
         oThis.onFetchedTagCount(poHttp)
      })
      oHttp.fetch_json(sUrl)

      sUrl = cBrowser.buildUrl(cAppLocations.rest + "/img_highlight.php", {
         o: "solcount",
         s: this.options.sol,
         m: oOptions.mission.ID,
      })
      oHttp = new cHttp2()
      bean.on(oHttp, "result", function (poHttp) {
         oThis.onHiLiteCount(poHttp)
      })
      oHttp.fetch_json(sUrl)
   }

   // #################################################################
   // # Events
   // #################################################################
   onHiLiteCount(poHttp) {
      if (poHttp.response > 0) {
         const sID = "#" + this.element.attr("id") + this.consts.HIGH_ID
         $(sID).removeAttr("disabled")
      }
   }

   //*****************************************************************
   onFetchedTagCount(poHttp) {
      if (poHttp.response > 0) {
         const sID = "#" + this.element.attr("id") + this.consts.TAG_ID
         $(sID).removeAttr("disabled")
      }
   }

   //*****************************************************************
   onFetchedGigapans(poHttp) {
      if (poHttp.response) {
         const sID = "#" + this.element.attr("id") + this.consts.GIGA_ID
         $(sID).removeAttr("disabled")
      }
   }

   //*****************************************************************
   onClickTag() {
      this._trigger("onClick", null)
      cBrowser.openWindow(
         cBrowser.buildUrl("soltag.php", { s: this.options.sol }),
         "soltag",
      )
   }
   //*****************************************************************
   onClickHighlights() {
      this._trigger("onClick", null)
      cBrowser.openWindow(
         cBrowser.buildUrl("solhigh.php", { sheet: 1, s: this.options.sol }),
         "solhigh",
      )
   }
   //*****************************************************************
   onClickGigapans() {
      this._trigger("onClick", null)
      cBrowser.openWindow(
         cBrowser.buildUrl("solgigas.php", { s: this.options.sol }),
         "solgigas",
      )
   }
   //*****************************************************************
   onClickMSLNotebook() {
      this._trigger("onClick", null)
      const sUrl = cBrowser.buildUrl(
         "https://an.rsl.wustl.edu/msl/mslbrowser/br2.aspx",
         {
            tab: "solsumm",
            sol: this.options.sol,
         },
      )
      window.open(sUrl, "date")
   }
   //*****************************************************************
   onClickMSLNotebookMap() {
      this._trigger("onClick", null)
      const sUrl = cBrowser.buildUrl(
         "https://an.rsl.wustl.edu/msl/mslbrowser/tab.aspx?t=mp&i=A&it=MT&ii=SOL",
         {
            t: "mp",
            i: "A",
            it: "MT",
            ii: "SOL," + this.options.sol,
         },
      )
      window.open(sUrl, "map")
   }
   //*****************************************************************
   onClickCalender() {
      this._trigger("onClick", null)
      const sUrl = cBrowser.buildUrl("cal.php", { s: this.options.sol })
      cBrowser.openWindow(sUrl, "calendar")
   }
   //*****************************************************************
   onClickRefresh() {
      this._trigger("onClick", null)
   }
   //*****************************************************************
   onClickAllThumbs() {
      this._trigger("onClick", null)
      this._trigger("onAllSolThumbs", null, { s: this.options.sol })
   }
   //*****************************************************************
   onClickSite() {
      this._trigger("onClick", null)
      cBrowser.openWindow(
         cBrowser.buildUrl("site.php", { sol: this.options.sol }),
         "site",
      )
   }
}

//#########################################################################
//#
//#########################################################################
$.widget("ck.solButtons", {
   options: {
      sol: null,
      onStatus: null,
      onClick: null,
      onAllSolThumbs: null,
      mission: null,
   },
   instance: null,

   _create: function () {
      this.instance = new cSolButtons(this.options, this.element)
   },

   //*****************************************************************
   set_sol: function (psSol) {
      return this.instance.set_sol(psSol)
   },
})
