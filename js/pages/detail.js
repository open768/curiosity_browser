/**************************************************************************
Copyright (C) Chicken Katsu 2013 - 2024

This code is protected by copyright under the terms of the
Creative Commons Attribution-Ncercial-NoDerivatives 4.0 International License
http://creativecommons.org/licenses/by-nc-nd/4.0/legalcode

For licenses that allow for commercial use please contact cluck@chickenkatsu.co.uk

// USE AT YOUR OWN RISK - NO GUARANTEES OR ANY FORM ARE EITHER EXPRESSED OR IMPLIED
**************************************************************************/
"use strict"
//eslint-disable-next-line no-unused-vars
class cDetail {
   static oItem = null
   static aTags = null
   static iNum = null

   // ###############################################################
   // # entry point
   // ###############################################################
   static onLoadJQuery() {
      // disable edit controls
      $("#tagtext").attr("disabled", "disabled")
      $("#submittag").attr("disabled", "disabled")
      $("#Commentsbox").attr("disabled", "disabled")
      $("#btnComment").attr("disabled", "disabled")

      // catch key presses but not on text inputs
      $(window).keypress((poEvent) => this.onKeyPress(poEvent))
      $(":input").each(function (index, oObj) {
         if ($(oObj).attr("type") === "text") {
            $(oObj).focus(() => this.onInputFocus())
            $(oObj).blur(() => this.onInputDefocus())
         }
      })

      //set click handlers
      $("#sol").click((poEvent) => this.onClickSol(poEvent))
      $("#instrument").click((poEvent) => this.onClickInstr(poEvent))
      $("#solCal").click((poEvent) => this.onClickCal(poEvent))
      $("#showthumb").click((poEvent) => this.onClickThumbnails(poEvent))
      $("#highlights").click((poEvent) => this.onClickHighlights(poEvent))
      $("#maplink").click((poEvent) => this.onClickMap(poEvent))
      $("#nasalink").click((poEvent) => this.onClickNASA(poEvent))
      $("#mslrawlink").click((poEvent) => this.onClickMSLRaw(poEvent))
      $("#pds_product").click((poEvent) => this.onClickonClickPDS(poEvent))
      $("#pixlr").click((poEvent) => this.onClickPixlr(poEvent))
      $("#google").click((poEvent) => this.onClickGoogle(poEvent))

      $("#submittag").click((poEvent) => this.onClickAddTag(poEvent))

      $("#prev_prod_top").click((poEvent) =>
         this.onClickPreviousProduct(poEvent),
      )
      $("#prev_top").click((poEvent) => this.onClickPrevious(poEvent))
      $("#next_top").click((poEvent) => this.onClickNext(poEvent))
      $("#next_prod_top").click((poEvent) => this.onClickNextProduct(poEvent))

      $("#prev_left").click((poEvent) => this.onClickPrevious(poEvent))

      $("#tmpl_accept").click((poEvent) => this.onClickBoxAccept(poEvent))
      $("#tmpl_cancel").click((poEvent) => this.onClickBoxCancel(poEvent))

      $("#next_right").click((poEvent) => this.onClickNext(poEvent))

      $("#prev_prod_bottom").click((poEvent) =>
         this.onClickPreviousProduct(poEvent),
      )
      $("#prev_bottom").click((poEvent) => this.onClickPrevious(poEvent))
      $("#next_bottom").click((poEvent) => this.onClickNext(poEvent))
      $("#next_prod_bottom").click((poEvent) =>
         this.onClickNextProduct(poEvent),
      )

      $("submit_comment").click((poEvent) => this.onClickComment(poEvent))

      // get user data
      cCommonStatus.set_status("loading user data...")
      this.get_product_data(
         cBrowser.data[cSpaceBrowser.SOL_QUERYSTRING],
         cBrowser.data[cSpaceBrowser.INSTR_QUERYSTRING],
         cBrowser.data[cSpaceBrowser.PRODUCT_QUERYSTRING],
      )
      cTagging.getTags(() => this.onGotAllTagNames())
   }

   // ###############################################################
   // # Click Event Handlers
   // ###############################################################
   static onClickComment() {
      const sText = $("#Commentsbox").sceditor("instance").val() // gets the bbcode - MUST BE PARSED AT SERVER
      cComments.set(this.oItem.s, this.oItem.i, this.oItem.p, sText, () =>
         this.onGotComments(),
      )
   }

   //* **************************************************************
   static onClickNextProduct() {
      const sUrl = cBrowser.buildUrl(cLocations.rest + "/nexttime.php", {
         d: "n",
         s: this.oItem.s,
         p: this.oItem.p,
         m: cMission.ID,
      })
      cCommonStatus.set_status("fetching next image details...")
      const oHttp = new cHttp2()
      bean.on(oHttp, "result", (oData) => this.nexttime_callback(oData))
      oHttp.fetch_json(sUrl)
   }

   //* **************************************************************
   static onClickPreviousProduct() {
      const sUrl = cBrowser.buildUrl(cLocations.rest + "/nexttime.php", {
         d: "p",
         s: this.oItem.s,
         p: this.oItem.p,
         m: cMission.ID,
      })
      cCommonStatus.set_status("fetching previous image details...")
      const oHttp = new cHttp2()
      bean.on(oHttp, "result", (oData) => this.nexttime_callback(oData))
      oHttp.fetch_json(sUrl)
   }

   //* **************************************************************
   static onClickNext() {
      // find the next product
      cCommonStatus.set_status("fetching next image details...")
      var sUrl = cBrowser.buildUrl(cLocations.rest + "/next.php", {
         d: "n",
         s: this.oItem.s,
         i: this.oItem.i,
         p: this.oItem.p,
         m: cMission.ID,
      })
      const oHttp = new cHttp2()
      bean.on(oHttp, "result", (oData) => this.next_callback(oData))
      oHttp.fetch_json(sUrl)
   }

   //* **************************************************************
   static onClickPrevious() {
      cCommonStatus.set_status("fetching previous image details...")
      const sUrl = cBrowser.buildUrl(cLocations.rest + "/next.php", {
         d: "p",
         s: this.oItem.s,
         i: this.oItem.i,
         p: this.oItem.p,
         m: cMission.ID,
      })
      const oHttp = new cHttp2()
      bean.on(oHttp, "result", (oData) => this.next_callback(oData))
      oHttp.fetch_json(sUrl)
   }

   //* **************************************************************
   static onClickCal() {
      var sUrl

      sUrl = "cal.php?s=" + this.oItem.s + "&t=" + this.oItem.d.du
      cBrowser.openWindow(sUrl, "calendar")
   }

   //* **************************************************************
   static onClickMap() {
      const sUrl = "http://curiosityrover.com/imgpoint.php?name=" + this.oItem.p
      window.open(sUrl, "map")
   }

   //* **************************************************************
   static onClickSol() {
      const sUrl =
         "index.php?s=" +
         this.oItem.s +
         "&i=" +
         this.oItem.i +
         "&b=" +
         this.iNum
      cBrowser.openWindow(sUrl, "index")
   }

   //* **************************************************************
   static onClickThumbnails() {
      const sUrl = "index.php?s=" + this.oItem.s + "&i=" + this.oItem.i + "&t=1"
      cBrowser.openWindow(sUrl, "solthumb")
   }

   //* **************************************************************
   static onClickHighlights() {
      const sUrl = "solhigh.php?sheet&s=" + this.oItem.s
      cBrowser.openWindow(sUrl, "solthumb")
   }

   //* **************************************************************
   static onClickInstr() {
      this.onClickSol()
   }

   //* **************************************************************
   static onClickNASA() {
      window.open(this.oItem.d.i, "nasa")
   }

   //* **************************************************************
   static onClickMSLRaw() {
      const sUrl =
         "http://mars.nasa.gov/msl/multimedia/raw/?rawid=" +
         this.oItem.p +
         "&s=" +
         this.oItem.s
      window.open(sUrl, "mslraw")
   }

   //* **************************************************************
   static onClickPDS() {
      const sUrl =
         "pds.php?s=" +
         this.oItem.s +
         "&i=" +
         this.oItem.i +
         "&p=" +
         this.oItem.p +
         "&t=" +
         escape(this.oItem.d.du)
      cBrowser.openWindow(sUrl, "pds")
   }

   //* **************************************************************
   static onClickAddTag() {
      var sTag

      // check something was entered
      sTag = $("#tagtext").val()
      if (sTag === "") {
         alert("no tag text")
         return
      }

      cCommonStatus.set_status("setting tag: " + sTag)
      cTagging.setTag(this.oItem.s, this.oItem.i, this.oItem.p, sTag, () =>
         this.onSetTag(),
      )
   }

   //* **************************************************************
   static onClickPixlr() {
      /* global pixlr */
      pixlr.edit({
         image: this.oItem.d.i,
         service: "editor",
         exit: document.location,
         referer: "mars browser",
         redirect: false,
      })
   }

   //* **************************************************************
   static onKeyPress(poEvent) {
      const sChar = String.fromCharCode(poEvent.which)
      switch (sChar) {
         case "n":
            this.onClickNext()
            break
         case "N":
            this.onClickNextProduct()
            break
         case "p":
            this.onClickPrevious()
            break
         case "P":
            this.onClickPreviousProduct()
            break
      }
   }

   //* **************************************************************
   static onClickGoogle() {
      const sUrl = "https://www.google.com/#q=%22" + this.oItem.p + "%22"
      window.open(sUrl, "map")
   }

   //* **************************************************************
   static OnImageClick(poEvent) {
      if (cAuth.user) {
         cImgHilite.makeBox(poEvent.pageX, poEvent.pageY, true)
      } else {
         alert("log in to highlight")
      }
   }

   //* *************************************************
   static onClickBoxAccept(poEvent) {
      const oBox = cImgHilite.getBoxFromButton(poEvent.currentTarget)
      cImgHilite.save_highlight(
         this.oItem.s,
         this.oItem.i,
         this.oItem.p,
         oBox,
         () => this.onSaveHighlight(),
      )
   }

   //* *************************************************
   static onClickBoxCancel(poEvent) {
      cImgHilite.rejectBox(poEvent.currentTarget)
   }

   // ###############################################################
   // # Focus Event Handlers
   // ###############################################################
   static onInputFocus() {
      $(window).unbind("keypress")
   }

   static onInputDefocus() {
      $(window).keypress(() => this.onKeyPress())
   }

   // ###############################################################
   // # Event Handlers
   // ###############################################################
   static onFacebookUser() {
      cDebug.write("detail.js got Facebook user")
      $("#tagtext").removeAttr("disabled")
      $("#submittag").removeAttr("disabled")
      $("#btnComment").removeAttr("disabled")

      $("#Commentsbox").sceditor({
         plugins: "bbcode",
         style:
            cLocations.jsextra +
            "/sceditor/minified/jquery.sceditor.default.min.css",
         toolbarExclude: "print,code,email,source,maximize",
         height: 100,
         resizeEnabled: false,
      })
      $("#Commentsbox")
         .sceditor("instance")
         .blur(() => this.onInputDefocus())
      $("#Commentsbox")
         .sceditor("instance")
         .focus(() => this.onInputFocus())
   }

   // ###############################################################
   //* call backs
   // ###############################################################
   static onGotAllTagNames(poJs) {
      cCommonStatus.set_status("got tag names")
      this.aTags = new Array()
      for (var sKey in poJs) {
         this.aTags.push(sKey)
      }
      $("#tagtext").autocomplete({ source: this.aTags })
   }

   //* **************************************************************
   static onGotHighlights(paJS) {
      var i, aItem, oBox, oNumber
      if (!paJS.d) {
         cDebug.write("no highlights")
         return
      }

      for (i = 0; i < paJS.d.length; i++) {
         aItem = paJS.d[i]
         cDebug.write("adding highlight: top=" + aItem.t + " left=" + aItem.l)
         oBox = cImgHilite.make_fixed_box(aItem.t, aItem.l)

         oNumber = $(oBox).find(cImgHilite.numberID)
         oNumber.html(i + 1)
      }
   }

   //* **************************************************************
   static onSetTag(paJS) {
      this.onGotTags(paJS)
      cTagging.getTagNames(() => this.alltagnames_callback())
   }

   //* **************************************************************
   static onGotTags(paJS) {
      var sHTML, i, sTag

      cCommonStatus.set_status("got tag")
      if (paJS.d.length == 0) {
         sHTML = "No Tags found, be the first to add one"
      } else {
         sHTML = ""
         for (i = 0; i < paJS.d.length; i++) {
            sTag = paJS.d[i]

            const sTarget = cCommon.SINGLE_WINDOW ? "" : "target='tags'"
            sHTML +=
               "<a " +
               sTarget +
               " href='tag.php?t=" +
               sTag +
               "'>#" +
               sTag +
               "</a> "
         }
      }
      $("#tags").html(sHTML)

      cCommonStatus.set_status("ok")
   }

   //* **************************************************************
   static onGotDetails(poHttp) {
      var sUrl, oData
      cCommonStatus.set_status("received data...")

      // rely upon what came back rather than the query string
      this.oItem = poHttp.response

      // check whether there was any data
      oData = this.oItem.d
      if (oData === null) {
         if (this.oItem.migrate !== null) {
            sUrl =
               "migrate.php?s=" +
               this.oItem.s +
               "&i=" +
               this.oItem.i +
               "&pfrom=" +
               this.oItem.p +
               "&pto=" +
               this.oItem.migrate
            cBrowser.openWindow(sUrl, "migrate")
         } else {
            cBrowser.openWindow(
               "error.php?m=product " + this.oItem.p + " was not found",
               "error",
            )
         }
         return
      }

      // update the title
      document.title =
         "detail: s:" +
         this.oItem.s +
         " i:" +
         this.oItem.i +
         " p:" +
         this.oItem.p +
         " (Curiosity Browser)"
      $("#toptitle").html(this.oItem.p)

      // update the address bar
      sUrl =
         cBrowser.pageUrl() +
         "?s=" +
         this.oItem.s +
         "&i=" +
         this.oItem.i +
         "&p=" +
         this.oItem.p
      cBrowser.pushState("Detail", sUrl)

      // tags
      if (!oData.tags) {
         $("#tags").html("no Tags - be the first to add one")
      } else {
         $("#tags").html(oData.tags)
      }

      // update image index details
      this.iNum = this.oItem.item
      $("#img_index").html(this.iNum)

      $("#max_images").html(this.oItem.max)
      $("#sol").html(this.oItem.s)
      $("#instrument").html(this.oItem.i)

      // populate the remaining fields
      $("#date_utc").html(this.oItem.d.du)
      // $("#date_lmst").html( this.oItem.d.dm);
      const sDump = cDebug.getvardump(oData.data, 1)
      $("#msldata").html($("<pre>").append(sDump))

      // add the image
      $("#image").empty()
      const oImg = $("<img>").attr({ src: oData.i, id: "baseimg" })
      oImg.on("load", (poEvent) => this.OnImageLoaded(poEvent))
      $("#image").append(oImg)
      $("meta[property='og:image']").attr(
         "content",
         cLocations.home + "/" + oData.i,
      ) // facebook tag for image

      // get the tags and comments
      cTagging.getTags(this.oItem.s, this.oItem.i, this.oItem.p, (oData) =>
         this.onGotTags(oData),
      )
      cComments.get(this.oItem.s, this.oItem.i, this.oItem.p, () =>
         this.onGotComments(),
      )

      // empty highligths
      cImgHilite.remove_boxes()

      // set status
      cCommonStatus.set_status("Image Loading")
   }

   //* **************************************************************
   static onGotComments(paJson) {
      var i, oText, sHTML

      if (!paJson) {
         sHTML = "No Comments - be the first !"
      } else {
         sHTML = ""
         for (i = 0; i < paJson.length; i++)
            sHTML += paJson[i].u + ":" + paJson[i].c + "<p>"
      }

      oText = $("#comments")
      oText.html(sHTML)
      cCommonStatus.set_status("ok")
   }

   //* **************************************************************
   static nexttime_callback(poHttp) {
      const oData = poHttp.response
      if (!oData) cCommonStatus.set_error_status("unable to find")
      else this.get_product_data(oData.s, oData.d.instrument, oData.d.itemName)
   }

   //* **************************************************************
   static next_callback(poHttp) {
      const oData = poHttp.response
      this.get_product_data(oData.s, this.oItem.i, oData.d.p)
   }

   //* **************************************************************
   static OnImageLoaded(poEvent) {
      var iWidth, iHeight, iImgW, iButW

      iHeight = $(poEvent.target).height()
      iImgW = $(poEvent.target).width()
      iButW = $("#prev_prod_top").innerWidth()
      iWidth = iImgW / 2 - iButW

      // make the buttons the right size
      cDebug.write("setting button sizes")
      cDebug.write("imageWidth: " + iImgW)
      cDebug.write("button width: " + iButW)
      cDebug.write("width: " + iWidth)
      cDebug.write("height: " + iHeight)

      $("#next_right").height(iHeight)
      $("#prev_left").height(iHeight)
      $("#next_prod_top").innerWidth(iWidth)
      $("#prev_prod_top").innerWidth(iWidth)
      $("#next_prod_bottom").innerWidth(iWidth)
      $("#prev_prod_bottom").innerWidth(iWidth)

      // make the image clickable
      $(poEvent.target).click((poImgEvent) => this.OnImageClick(poImgEvent))
      cImgHilite.imgTarget = poEvent.target

      // get the highlights if any
      cImgHilite.getHighlights(
         this.oItem.s,
         this.oItem.i,
         this.oItem.p,
         (oData) => this.onGotHighlights(oData),
      )

      cCommonStatus.set_status("OK")
   }

   //* **************************************************************
   static onSaveHighlight() {
      cImgHilite.remove_boxes()
      cImgHilite.getHighlights(
         this.oItem.s,
         this.oItem.i,
         this.oItem.p,
         (oData) => this.onGotHighlights(oData),
      )
   }

   //* **************************************************************
   static get_product_data(psSol, psInstr, psProd) {
      const sUrl = cBrowser.buildUrl(cLocations.rest + "/detail.php", {
         s: psSol,
         i: psInstr,
         p: psProd,
         m: cMission.ID,
      })
      cCommonStatus.set_status("fetching data for " + psProd)
      const oHttp = new cHttp2()
      bean.on(oHttp, "result", (oData) => this.onGotDetails(oData))
      oHttp.fetch_json(sUrl)
   }
}

bean.on(cFacebook, "gotUser", cDetail.onFacebookUser())
