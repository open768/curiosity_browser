// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// % Definition
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
$.widget("ck.tagcloud", {
   // #################################################################
   // # Definition
   // #################################################################
   options: {
      mission: null,
      maxFont: 24,
      minFont: 10,
      minWidth: "200px",
   },

   // #################################################################
   // # Constructor
   // #################################################################
   _create: function () {
      var oDiv, oElement, oWidget

      oElement = this.element

      // check for necessary classes
      if (!bean) {
         $.error("bean class is missing! check includes")
      }
      if (!cHttp2) {
         $.error("http2 class is missing! check includes")
      }
      if (this.options.mission == null) $.error("mission is not set")
      if (!oElement.gSpinner) {
         $.error("gSpinner is missing! check includes")
      }
      if (!$.event.special.inview) $.error("jquery inview is missing")

      // check that the element is a div
      const sElementName = oElement.get(0).tagName
      if (sElementName !== "DIV") {
         $.error("thumbnail view needs a DIV. not a: " + sElementName)
      }

      // initialise
      oElement.uniqueId()
      oElement.css("min-width", this.options.minWidth)
      oWidget = this

      // clear out the DIV and put some text in it
      oElement.empty()
      oDiv = $("<DIV>", { class: "ui-widget-header" })
      oDiv.width("100%")
      oDiv.append("Tag Cloud")
      oElement.append(oDiv)

      oDiv = $("<DIV>", { class: "ui-widget-body" })
      oDiv.width("100%")
      oDiv.uniqueId()
      oDiv.append("doing nuthing")
      oElement.append(oDiv)

      // only do something when the div is visible
      oDiv.on("inview", function () {
         oWidget.onInView()
      })
   },

   // #################################################################
   // # methods
   // #################################################################
   process_response: function (poHttp) {
      let sKey, iCount, iSize, iWeight, iMax, fsRatio, fwRatio
      let oA, sUrl

      const oElement = this.element
      const oData = poHttp.response

      oElement.empty()

      iMax = 0
      for (sKey in oData) {
         iMax = Math.max(iMax, oData[sKey])
      }
      fsRatio = (this.options.maxFont - this.options.minFont) / iMax
      fwRatio = 800 / iMax

      for (sKey in oData) {
         iCount = oData[sKey]
         iSize = this.options.minFont + iCount * fsRatio
         iWeight = 100 + Math.round(iCount * fwRatio)

         sUrl = cBrowser.buildUrl("tag.php", { t: sKey })
         oA = $("<A>", { href: sUrl })
            .css("font-size", "" + iSize + "px")
            .css("font-weight", iWeight)
            .append(sKey)
         oElement.append(oA).append(" ")
      }
   },

   //* **************************************************************
   process_error: function () {
      const oElement = this.element
      oElement.empty()
      oElement.html("There was an error getting the tagcloud")
   },

   // #################################################################
   // # Events
   // #################################################################
   onInView: function () {
      const oWidget = this
      var oElement = this.element
      oElement.off("inview") // turn off the inview listener

      oElement.empty()

      const oLoader = $("<DIV>")
      oLoader.gSpinner({ scale: 0.25 })

      const oDiv = $("<div>", { class: "ui-widget-header" })
         .append("Loading Tags...")
         .append(oLoader)
      oElement.append(oDiv)

      const oHttp = new cHttp2()
      const sUrl = cBrowser.buildUrl(cLocations.rest + "/tag.php", {
         o: "all",
         m: this.options.mission.ID,
      })
      bean.on(oHttp, "result", function (poHttp) {
         oWidget.process_response(poHttp)
      })
      bean.on(oHttp, "error", function (poHttp) {
         oWidget.process_error(poHttp)
      })
      oHttp.fetch_json(sUrl)
   },
})
