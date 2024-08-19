// #TODO# use chttpqueue
const goBetterThumbQueue = new cHttpQueue()

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
$.widget("ck.thumbnail", {
   // #################################################################
   // # Definition
   // #################################################################
   options: {
      sol: null,
      instrument: null,
      product: null,
      base_id: null,
      url: null,
      img: null,
      loaded_better: false,
      mission: null,
   },
   consts: {
      SIZE: 144,
      DEFAULT_STYLE: "polaroid",
      STYLES: {
         ORIG: "thumb-orig",
         WAITING1: "thumb-wait",
         WAITING2: "thumb-wait2",
         WAITING3: "thumb-wait3",
         WORKING: "thumb-work",
         ERROR: "thumb-error",
         FINAL: "thumb-final",
         MISSING: "thumb-missing",
      },
      BETTER_URL: cAppLocations.rest + "/solthumb.php",
      DEFAULT_THUMBNAIL:
         cAppLocations.home + "/images/browser/chicken_icon.png",
      WAIT_VISIBLE: 2000,
   },

   // #################################################################
   // # Constructor
   // #################################################################
   _create: function () {
      var oImg, oThis, oElement
      const oOptions = this.options

      oThis = this
      oElement = this.element

      // check for necessary classes
      if (!bean) {
         $.error("bean class is missing! check includes")
      }
      if (!cHttp2) {
         $.error("http2 class is missing! check includes")
      }
      if (!$.event.special.inview) {
         $.error("inview class is missing! check includes")
      }
      if (!oElement.visible) $.error("visible class is missing! check includes")

      // init
      if (oOptions.sol == null) $.error("sol is not set")
      if (oOptions.instrument == null) $.error("instrument is not set")
      if (oOptions.product == null) $.error("product is not set")
      if (oOptions.url == null) $.error("url is not set")
      if (oOptions.mission == null) $.error("mission is not set")

      oElement.uniqueId() // sets a unique ID on the SPAN.
      const sImgID = oElement.attr("id") + "i"

      oElement.attr("class", this.consts.DEFAULT_STYLE)

      oImg = $("<IMG>", {
         title: this.options.product,
         border: 0,
         height: this.consts.SIZE,
         src: this.consts.DEFAULT_THUMBNAIL,
         ID: sImgID,
      })
      oImg.click(function () {
         oThis.onThumbClick()
      })
      this.options.img = sImgID
      this.pr__set_style(this.consts.STYLES.ORIG)

      // optimise server requests, only display thumbnail if its in viewport
      oElement.append(oImg)
      oElement.on("inview", function (poEvent, pbIsInView) {
         oThis.onPlaceholderInView(pbIsInView)
      })
   },

   // #################################################################
   // # methods
   // #################################################################
   stop_queue: function () {
      goBetterThumbQueue.stop()
   },

   //* *****************************************************************
   pr__set_style: function (psStyle) {
      this.element.attr("class", this.consts.DEFAULT_STYLE + " " + psStyle)
   },

   // #################################################################
   // # events
   // #################################################################
   //* *****************************************************************
   onPlaceholderInView: function (pbIsInView) {
      const oThis = this

      if (goBetterThumbQueue.stopping) return
      if (!pbIsInView) return

      this.element.off("inview") // turn off the inview listener
      this.pr__set_style(oThis.consts.STYLES.WAITING1)

      setTimeout(() => oThis.onPlaceholderDelay(), this.consts.WAIT_VISIBLE)
   },

   //* *****************************************************************
   onPlaceholderDelay: function () {
      var oImg, oThis
      const oElement = this.element
      oThis = this
      if (goBetterThumbQueue.stopping) return

      if (oElement.visible()) {
         // load the basic thumbnail
         oImg = $("#" + this.options.img)
         oImg.on("load", function () {
            oThis.onBasicThumbLoaded()
         }) // do something when thumbnail loaded
         oImg.attr("src", this.options.url) // load basic thumbnail
      } else {
         // image is not visible - reset the inview trigger
         cDebug.write("placeholder not visible  " + this.options.product)
         oElement.on("inview", function (poEvent, pbIsInView) {
            oThis.onPlaceholderInView(pbIsInView)
         })
      }
   },

   //* *****************************************************************
   onBasicThumbLoaded: function () {
      const oThis = this
      const oImg = $("#" + this.options.img)

      if (goBetterThumbQueue.stopping) return
      oImg.off("load") // remove the load event so it doesnt fire again

      if (goBetterThumbQueue.stopping) return
      this.pr__set_style(oThis.consts.STYLES.WAITING2)
      setTimeout(() => oThis.onBasicThumbViewDelay(), this.consts.WAIT_VISIBLE)
   },

   //* *****************************************************************
   onBasicThumbViewDelay: function () {
      const oThis = this
      const oOptions = this.options
      const oImg = $("#" + this.options.img)
      const oElement = this.element

      if (goBetterThumbQueue.stopping) return
      if (oImg.visible()) {
         this.pr__set_style(oThis.consts.STYLES.WAITING3)
         const oItem = new cHttpQueueItem()
         oItem.url = cBrowser.buildUrl(this.consts.BETTER_URL, {
            s: oOptions.sol,
            i: oOptions.instrument,
            p: oOptions.product,
            m: oOptions.mission.ID,
         })

         bean.on(oItem, "result", function (poHttp) {
            oThis.onBetterThumbResponse(poHttp)
         })
         bean.on(oItem, "error", function (poHttp) {
            oThis.onBetterThumbError(poHttp)
         })
         bean.on(oItem, "start", function () {
            oThis.onBetterThumbStarting()
         })

         // add request for the better thumbnail to the queue
         goBetterThumbQueue.add(oItem)
      } else {
         cDebug.write("Basic thumb not in view: ")
         oElement.on("inview", function (poEvent, pbIsInView) {
            oThis.onBasicThumbInView(pbIsInView)
         })
      }
   },

   //* *****************************************************************
   onBasicThumbInView: function (pbIsInView) {
      if (goBetterThumbQueue.stopping) return

      if (!pbIsInView) return

      this.element.off("inview") // turn off the inview listener
      this.onBasicThumbLoaded() // go back to
   },

   //* *****************************************************************
   onBetterThumbStarting: function () {
      if (goBetterThumbQueue.stopping) return

      // ** TBD ** at this stage is the div is not visible stop the request
      this.pr__set_style(this.consts.STYLES.WORKING)
   },

   //* *****************************************************************
   onBetterThumbResponse: function (poHttp) {
      const oImg = $("#" + this.options.img)
      const oData = poHttp.response

      if (goBetterThumbQueue.stopping) return
      if (!oData.u) {
         cDebug.write("missing image for: " + oData.p)
         this.pr__set_style(this.consts.STYLES.MISSING)
      } else {
         cDebug.write("got better thumbnail: " + oData.p)
         this.pr__set_style(this.consts.STYLES.FINAL)
         // update the displayed image - on a Timer to be in a different non-blocking thread
         var sUrl = cBrowser.buildUrl(cAppLocations.home + "/" + oData.u, {
            r: Math.random(),
         })
         setTimeout(() => oImg.attr("src", sUrl), 0)
      }
   },

   //* *****************************************************************
   onBetterThumbError: function (poHttp) {
      this.pr__set_style(this.consts.STYLES.ERROR)
      cDebug.write(
         "ERROR: " +
            poHttp.data +
            "\n" +
            poHttp.url +
            "\n" +
            poHttp.errorStatus +
            " - " +
            poHttp.error,
      )
   },

   //* *****************************************************************
   onThumbClick: function () {
      const oOptions = this.options
      goBetterThumbQueue.stop()
      this._trigger("onStatus", null, { text: "clicked: " + oOptions.product })
      this._trigger("onClick", null, {
         sol: oOptions.sol,
         instr: oOptions.instrument,
         product: oOptions.product,
      })
   },
})
