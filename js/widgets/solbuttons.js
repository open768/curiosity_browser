// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
$.widget("ck.solButtons", {
   // #################################################################
   // # Definition
   // #################################################################
   options: {
      sol: null,
      onStatus: null,
      onClick: null,
      onAllSolThumbs: null,
      mission: null,
   },

   consts: {
      TAG_ID: "t",
      HIGH_ID: "h",
      GIGA_ID: "g",
      NOTEBOOK_ID: "n",
      NOTEBOOKMAP_ID: "ni",
      CAL_ID: "c",
      REFRESH_ID: "r",
      ALLTHUMB_ID: "at",
      SITE_ID: "s",
   },

   // #################################################################
   // # Constructor
   // #################################################################
   _create: function () {
      let oThis, oElement, sID, sOID, oButton, oDiv

      // check for necessary classes
      if (!bean) {
         $.error("bean class is missing! check includes")
      }
      if (!cHttp2) {
         $.error("http2 class is missing! check includes")
      }
      if (this.options.mission == null) $.error("mission is not set")

      oThis = this
      oElement = oThis.element
      oElement.uniqueId()
      sID = oElement.attr("id")

      oElement.empty()

      //* ******************* buttons for sol *********************************************
      oDiv = $("<DIV>", { class: "ui-widget-content" })
      let oObj
      oObj = $("<DIV>", { class: "ui-widget-header" })
      oObj.append("Sol Information:")
      oDiv.append(oObj)

      oObj = $("<DIV>", { class: "ui-widget-body" })
      // ----------------------------------------------------
      oButton = $("<button>", {
         title: "Tags",
         class: "leftbutton",
         id: sID + this.consts.TAG_ID,
         disabled: "disabled",
      })
      oButton.append("Tags")
      oButton.click(function () {
         oThis.onClickTag()
      })
      oObj.append(oButton)

      // ----------------------------------------------------
      oButton = $("<button>", {
         title: "Highlights",
         class: "leftbutton",
         id: sID + this.consts.HIGH_ID,
         disabled: "disabled",
      })
      oButton.append("Highlights")
      oButton.click(function () {
         oThis.onClickHighlights()
      })
      oObj.append(oButton)

      // ----------------------------------------------------
      oButton = $("<button>", {
         title: "Gigapans",
         class: "leftbutton",
         id: sID + this.consts.GIGA_ID,
         disabled: "disabled",
      })
      oButton.append("Gigapans")
      oButton.click(function () {
         oThis.onClickGigapans()
      })
      oObj.append(oButton)

      // ----------------------------------------------------
      oButton = $("<button>", {
         title: "notebook",
         class: "leftbutton",
         id: sID + this.consts.NOTEBOOK_ID,
         disabled: "disabled",
      })
      oButton.append("Notebook")
      oButton.click(function () {
         oThis.onClickMSLNotebook()
      })
      oObj.append(oButton)

      // ----------------------------------------------------
      oButton = $("<button>", {
         title: "notebook Map",
         class: "leftbutton",
         id: sID + this.consts.NOTEBOOKMAP_ID_ID,
         disabled: "disabled",
      })
      oButton.append("Notebook Map")
      oButton.click(function () {
         oThis.onClickMSLNotebookMap()
      })
      oObj.append(oButton)

      // ----------------------------------------------------
      oButton = $("<button>", {
         title: "Calendar",
         class: "leftbutton",
         id: sID + this.consts.CAL_ID,
         disabled: "disabled",
      })
      oButton.append("Calendar")
      oButton.click(function () {
         oThis.onClickCalender()
      })
      oObj.append(oButton)

      // ----------------------------------------------------
      oButton = $("<button>", {
         title: "Force Refresh Cache",
         class: "leftbutton",
         id: sID + this.consts.REFRESH_ID,
      })
      oButton.append("Refresh")
      oButton.click(function () {
         oThis.onClickRefresh()
      })
      oObj.append(oButton)

      // ----------------------------------------------------
      oButton = $("<button>", {
         title: "All thumbnails",
         class: "leftbutton",
         id: sID + this.consts.ALLTHUMB_ID,
         disabled: "disabled",
      })
      oButton.append("All Thumbnails")
      oButton.click(function () {
         oThis.onClickAllThumbs()
      })
      oObj.append(oButton)

      // ----------------------------------------------------
      oButton = $("<button>", {
         title: "Site",
         class: "leftbutton",
         id: sID + this.consts.SITE_ID,
         disabled: "disabled",
      })
      oButton.append("Site")
      oButton.click(function () {
         oThis.onClickSite()
      })
      oObj.append(oButton)
      oDiv.append(oObj)
      oElement.append(oDiv)

      //* ******************* buttons for all sols *********************************************
      oDiv = $("<DIV>", { class: "ui-widget-content" })
      oObj = $("<DIV>", { class: "ui-widget-header" })
      oObj.append("All Sols:")
      oDiv.append(oObj)

      oObj = $("<DIV>", { class: "ui-widget-body" })
      // ----------------------------------------------------
      oButton = $("<button>", { title: "All Tags", class: "leftbutton" })
      oButton.append("All Tags")
      oButton.click(function () {
         cBrowser.openWindow("allsoltags.php", "alltags")
      })
      oObj.append(oButton)

      // ----------------------------------------------------
      oButton = $("<button>", { title: "All Highlights", class: "leftbutton" })
      oButton.append("All Highlights")
      oButton.click(function () {
         cBrowser.openWindow("allsolhighs.php", "allhighs")
      })
      oObj.append(oButton)

      // ----------------------------------------------------
      oButton = $("<button>", { title: "All Gigapans", class: "leftbutton" })
      oButton.append("All Gigapans")
      oButton.click(function () {
         cBrowser.openWindow("allgigas.php", "allgigas")
      })
      oObj.append(oButton)

      // ----------------------------------------------------
      oButton = $("<button>", { title: "All Sites", class: "leftbutton" })
      oButton.append("All Sites")
      oButton.click(function () {
         cBrowser.openWindow("allsites.php", "allsites")
      })
      oObj.append(oButton)

      oDiv.append(oObj)
      oElement.append(oDiv)

      //* ******************* buttons for all sols *********************************************
      oDiv = $("<DIV>", { class: "ui-widget-content" })
      oObj = $("<DIV>", { class: "ui-widget-header" })
      oObj.append("Information:")
      oDiv.append(oObj)

      oObj = $("<DIV>", { class: "ui-widget-body" })

      oButton = $("<button>", { title: "about", class: "homebutton" })
      oButton.append("About")
      oButton.click(function () {
         cBrowser.openWindow("about.php", "about")
      })
      oObj.append(oButton)

      // ----------------------------------------------------
      oButton = $("<button>", {
         title: "Where is curiosity now?",
         class: "leftbutton",
      })
      oButton.append("curiosity?")
      oButton.click(function () {
         window.open(
            "http://mars.jpl.nasa.gov/msl/mission/whereistherovernow/",
            "whereami",
         )
      })
      oObj.append(oButton)
      oDiv.append(oObj)
      oElement.append(oDiv)
   },

   //* ****************************************************************
   set_sol: function (psSol) {
      const oThis = this

      // store the sol
      const oOptions = this.options
      oOptions.sol = psSol

      // disable all buttons in this widget;
      this.element.children("button").each(function () {
         $(this).attr("disabled", "disabled")
      })

      // enable selected
      sID = this.element.attr("id")
      $("#" + sID + this.consts.NOTEBOOK_ID).removeAttr("disabled")
      $("#" + sID + this.consts.NOTEBOOKMAP_ID).removeAttr("disabled")
      $("#" + sID + this.consts.CAL_ID).removeAttr("disabled")
      $("#" + sID + this.consts.REFRESH_ID).removeAttr("disabled")
      $("#" + sID + this.consts.ALLTHUMB_ID).removeAttr("disabled")
      $("#" + sID + this.consts.SITE_ID).removeAttr("disabled")

      // fetch tags, highlights and gigapans
      var sUrl = cBrowser.buildUrl(cLocations.rest + "/gigapans.php", {
         o: "sol",
         s: this.options.sol,
         m: oOptions.mission.ID,
      })
      var oHttp = new cHttp2()
      bean.on(oHttp, "result", function (poHttp) {
         oThis.onFetchedGigapans(poHttp)
      })
      oHttp.fetch_json(sUrl)

      var sUrl = cBrowser.buildUrl(cLocations.rest + "/tag.php", {
         o: "solcount",
         s: this.options.sol,
         m: oOptions.mission.ID,
      })
      var oHttp = new cHttp2()
      bean.on(oHttp, "result", function (poHttp) {
         oThis.onFetchedTagCount(poHttp)
      })
      oHttp.fetch_json(sUrl)

      var sUrl = cBrowser.buildUrl(cLocations.rest + "/img_highlight.php", {
         o: "solcount",
         s: this.options.sol,
         m: oOptions.mission.ID,
      })
      var oHttp = new cHttp2()
      bean.on(oHttp, "result", function (poHttp) {
         oThis.onHiLiteCount(poHttp)
      })
      oHttp.fetch_json(sUrl)
   },

   // #################################################################
   // # Privates
   // #################################################################

   // #################################################################
   // # Events
   // #################################################################
   onHiLiteCount: function (poHttp) {
      if (poHttp.response > 0) {
         const sID = "#" + this.element.attr("id") + this.consts.HIGH_ID
         $(sID).removeAttr("disabled")
      }
   },

   //* ****************************************************************
   onFetchedTagCount: function (poHttp) {
      if (poHttp.response > 0) {
         const sID = "#" + this.element.attr("id") + this.consts.TAG_ID
         $(sID).removeAttr("disabled")
      }
   },

   //* ****************************************************************
   onFetchedGigapans: function (poHttp) {
      if (poHttp.response) {
         const sID = "#" + this.element.attr("id") + this.consts.GIGA_ID
         $(sID).removeAttr("disabled")
      }
   },

   //* ****************************************************************
   onClickTag: function () {
      this._trigger("onClick", null)
      cBrowser.openWindow(
         cBrowser.buildUrl("soltag.php", { s: this.options.sol }),
         "soltag",
      )
   },
   //* ****************************************************************
   onClickHighlights: function () {
      this._trigger("onClick", null)
      cBrowser.openWindow(
         cBrowser.buildUrl("solhigh.php", { sheet: 1, s: this.options.sol }),
         "solhigh",
      )
   },
   //* ****************************************************************
   onClickGigapans: function () {
      this._trigger("onClick", null)
      cBrowser.openWindow(
         cBrowser.buildUrl("solgigas.php", { s: this.options.sol }),
         "solgigas",
      )
   },
   //* ****************************************************************
   onClickMSLNotebook: function () {
      this._trigger("onClick", null)
      const sUrl = cBrowser.buildUrl(
         "https://an.rsl.wustl.edu/msl/mslbrowser/br2.aspx",
         {
            tab: "solsumm",
            sol: this.options.sol,
         },
      )
      window.open(sUrl, "date")
   },
   //* ****************************************************************
   onClickMSLNotebookMap: function () {
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
   },
   //* ****************************************************************
   onClickCalender: function () {
      this._trigger("onClick", null)
      const sUrl = cBrowser.buildUrl("cal.php", { s: this.options.sol })
      cBrowser.openWindow(sUrl, "calendar")
   },
   //* ****************************************************************
   onClickRefresh: function () {
      this._trigger("onClick", null)
   },
   //* ****************************************************************
   onClickAllThumbs: function () {
      this._trigger("onClick", null)
      this._trigger("onAllSolThumbs", null, { s: this.options.sol })
   },
   //* ****************************************************************
   onClickSite: function () {
      this._trigger("onClick", null)
      cBrowser.openWindow(
         cBrowser.buildUrl("site.php", { sol: this.options.sol }),
         "site",
      )
   },
})
