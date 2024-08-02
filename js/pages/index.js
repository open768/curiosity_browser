"use strict"
/****************************************************************************
Copyright (C) Chicken Katsu 2013 - 2024 www.chickenkatsu.co.uk

This code is protected by copyright under the terms of the
Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License
http://creativecommons.org/licenses/by-nc-nd/4.0/legalcode

For licenses that allow for commercial use please contact cluck@chickenkatsu.co.uk

// USE AT YOUR OWN RISK - NO GUARANTEES OR ANY FORM ARE EITHER EXPRESSED OR IMPLIED
**************************************************************************/

/*global cIndexPageConsts*/
// cIndexPageConsts are defined in index.php - and written out line 57

cDebug.on()

let keep_start_image = true

const cOptions = {
   start_image: 1,
   sol: null,
   instrument: null,
}

// ###############################################################
//* renders left column
// ###############################################################
class cLeftColumn {
   static render_tab_bar(poParent) {
      //-----------------------the TAB Bar
      var oTabBar = $("<DIV>", { id: cIndexPageConsts.ID_TAB_BAR })
      {
         oTabBar.append("Loading Tab bar")
         poParent.append(oTabBar)
      }
   }

   //**********************************************************
   static render_tab_content_sol(poParent) {
      var oSolTabContent = $("<DIV>", {
         id: cIndexPageConsts.ID_TAB_SOL_CONTENT,
         class: "tab-content",
      })
      {
         //--------SOL chooser
         var oSolChooser = $("<DIV>", {
            id: cIndexPageConsts.ID_WIDGET_SOLCHOOSER,
         })
         oSolChooser.append("Loading chooser widget")
         oSolTabContent.append(oSolChooser)

         //----------SOL buttons
         var oSolButtons = $("<DIV>", {
            id: cIndexPageConsts.ID_WIDGET_SOLBUTTONS,
         })
         oSolButtons.append("Loading buttons widget")
         oSolTabContent.append(oSolButtons)

         //---------admin
         this.pr__render_admin(oSolTabContent)

         //complete the widget
         poParent.append(oSolTabContent)
      }
   }

   //**********************************************************
   static render_tab_content_tags(poParent) {
      //Tab Content (tags)
      var oTagContent = $("<DIV>", {
         id: cIndexPageConsts.ID_TAB_TAG_CONTENT,
         class: "tab-content",
      })
      {
         oTagContent.append("loading TAGS")
         poParent.append(oTagContent)
      }
   }

   //**********************************************************
   static render(poParent) {
      poParent.empty()

      //tab bar
      this.render_tab_bar(poParent)
      cPageTabs.renderTabs()

      // sol tab content
      this.render_tab_content_sol(poParent)

      // render the sol instrument chooser widget
      // this widget will kick off the image display thru onSelectSolInstrEvent
      $("#" + cIndexPageConsts.ID_WIDGET_SOLCHOOSER).solinstrumentChooser({
         onStatus: (poEvent, paHash) =>
            cIndexPage.onStatusEvent(poEvent, paHash),
         onSelect: (poEvent, poData) =>
            cIndexPage.onSelectSolInstrEvent(poEvent, poData),
         mission: cMission,
      })

      // render the solbuttons
      $("#" + cIndexPageConsts.ID_WIDGET_SOLBUTTONS).solButtons({
         onStatus: (poEvent, paHash) =>
            cIndexPage.onStatusEvent(poEvent, paHash),
         mission: cMission,
         onClick: () => cIndexPage.stop_queue(),
         onAllSolThumbs: () => cIndexPage.onClickAllSolThumbs(),
      })

      //  tags tab content
      this.render_tab_content_tags(poParent)
      $("#" + cIndexPageConsts.ID_TAB_TAG_CONTENT).tagcloud({
         mission: cMission,
      })

      //click the default tab
      cPageTabs.clickDefaultTab()
   }

   //*************************************************************
   static pr__render_admin(poParent) {
      var oThis = this
      var oDiv = $("<DIV>", {
         id: cIndexPageConsts.ID_WIDGET_ADMIN,
         class: "ui-widget",
      })
      {
         var oHeader = $("<DIV>", {
            class: "ui-widget-header",
         })
         {
            oHeader.append("Admin")
            oDiv.append(oHeader)
         }

         var oBody = $("<DIV>", { class: "ui-widget-body" })
         {
            if (cIndexPageConsts.IS_ADMIN === "yes") {
               var oButton = $("<BUTTON>", { title: "Admin Functions" })
               oButton.click(() => oThis.onAdminClick())
               oBody.append(oButton)
            } else {
               oBody.append("Not an Admin")
            }
            oDiv.append(oBody)
         }
      }
      poParent.append(oDiv)
   }

   //*************************************************************
   static onAdminClick() {
      cBrowser.openWindow("admin/", "admin")
   }
}

// ###############################################################
//* handles page tabs
// ###############################################################
class cSearchBox {
   static instrument_box() {
      var oThis = this
      $("#" + cIndexPageConsts.ID_SEARCH).keypress(function (e) {
         oThis.onSearchKeypress(e)
      })
   }
   //* **************************************************************
   static onSearchKeypress(poEvent) {
      cIndexPage.stop_queue()
      if (poEvent.which == 13) this.onClickSearch()
   }

   //* **************************************************************
   static onClickSearch() {
      cIndexPage.stop_queue()
      const sText = $("#" + cIndexPageConsts.ID_SEARCH).val()
      if (sText == "") return
      cOptions.instrument = null
      var oThis = this

      if (!isNaN(sText)) {
         $("#" + cIndexPageConsts.ID_WIDGET_SOLCHOOSER).solinstrumentChooser(
            "set_sol",
            sText,
         )
      } else {
         const sUrl = cBrowser.buildUrl(cLocations.rest + "/search.php", {
            s: sText,
            m: cMission.ID,
         })
         const oHttp = new cHttp2()
         bean.on(oHttp, "result", (poHttp) => oThis.OnSearchResponse(poHttp))
         oHttp.fetch_json(sUrl)
      }
   }

   //* **************************************************************
   static OnSearchResponse(poHttp) {
      var sUrl

      const oData = poHttp.response
      if (!oData) {
         cCommonStatus.set_status("not a valid search")
      } else {
         cCommonStatus.set_status("got search callback")
         sUrl = cBrowser.buildUrl("detail.php", {
            s: oData.s,
            i: oData.d.instrument,
            p: oData.d.itemName,
         })
         document.location.href = sUrl
      }
   }
}
// ###############################################################
//* handles page tabs
// ###############################################################
class cPageTabs {
   //see w3.css tabs https://www.w3schools.com/w3css/w3css_tabulators.asp
   static current_button = null
   static HIGHLIGHT_CLASS = "w3-blue"
   static SOL_CAPTION = "Sol"
   static TAGS_CAPTION = "Tags"

   //*********************************************************************
   static onTabClick(poElement) {
      //close all content pages
      $(".tab-content").each(function () {
         $(this).hide()
      })

      //remove the highlight of the previously clicked tab button
      if (this.current_button)
         $(this.current_button).removeClass(this.HIGHLIGHT_CLASS)

      //add highlight to clicked  tab button element
      poElement.addClass(this.HIGHLIGHT_CLASS)

      //show the tab target for the button clicked
      this.current_button = "#" + poElement.attr("id")
      var sTarget = poElement.attr("target")
      var oSelected = $("#" + sTarget)
      oSelected.show()
   }

   //*********************************************************************
   static pr__add_tab(poParent, psCaption, psTarget) {
      var sChildID, oButton, oThis

      oThis = this

      //create button
      sChildID = cJquery.child_ID(poParent, psCaption) //should really remove spaces from caption
      oButton = $("<button>", {
         id: sChildID,
         class: "w3-bar-item w3-button",
         target: psTarget,
      })

      //set button properties
      oButton.width("50%")
      oButton.append(psCaption)
      oButton.on("click", function () {
         oThis.onTabClick($(this))
      })

      //add button to parent
      poParent.append(oButton)
      return oButton
   }

   //*********************************************************************
   static renderTabs() {
      cDebug.write("instrumenting tabs")

      //clear out any content
      var oBar = $("#" + cIndexPageConsts.ID_TAB_BAR)
      oBar.empty()

      //add the buttons the the tab bar
      this.pr__add_tab(
         oBar,
         this.SOL_CAPTION,
         cIndexPageConsts.ID_TAB_SOL_CONTENT,
      )
      this.pr__add_tab(
         oBar,
         this.TAGS_CAPTION,
         cIndexPageConsts.ID_TAB_TAG_CONTENT,
      )
   }

   //*********************************************************************
   static clickDefaultTab() {
      var oBar = $("#" + cIndexPageConsts.ID_TAB_BAR)
      var sButtonID = cJquery.child_ID(oBar, this.SOL_CAPTION)
      var oButton = $("#" + sButtonID)
      oButton.click()
   }
}

// ###############################################################
//* not quite a JQUERY widget - JQuery Events
// ###############################################################
//eslint-disable-next-line no-unused-vars
class cIndexPage {
   /**
    *called  when jQuery is loaded
    *
    * @static
    * @memberof cIndexPage
    * @returns void
    */
   static onLoadJQuery() {
      // show the intro blurb if nothing on the querystring
      if (document.location.search.length == 0) {
         $("#" + cIndexPageConsts.ID_INTRO).show()
      }

      // load the tabs and show the first one
      var oLeftColumn = $("#" + cIndexPageConsts.ID_LEFT_COL)
      cLeftColumn.render(oLeftColumn)

      // remember the start_image if its there
      if (cBrowser.data[cSpaceBrowser.BEGIN_QUERYSTRING]) {
         cOptions.start_image = parseInt(
            cBrowser.data[cSpaceBrowser.BEGIN_QUERYSTRING],
         )
      }

      // disable thumbs checkbox until something happens
      $("#" + cIndexPageConsts.ID_CHKTHUMBS).attr("disabled", "disabled")

      // set up keypress monitor
      cSearchBox.instrument_box()
   }

   // ###############################################################
   // # Event Handlers
   // ###############################################################
   static onClickAllSolThumbs() {
      this.stop_queue()
      cOptions.instrument = null
      cOptions.start_image = -1
      $("#" + cIndexPageConsts.ID_CHKTHUMBS)
         .prop("checked", true)
         .attr("disabled", "disabled")
      $("#" + cIndexPageConsts.ID_WIDGET_SOLCHOOSER).solinstrumentChooser(
         "deselectInstrument",
      )
      this.load_data()
   }

   //* **************************************************************
   static onCheckThumbsEvent() {
      this.stop_queue()
      this.load_data()
   }

   //* **************************************************************
   static onImageClick(poEvent, poOptions) {
      this.stop_queue()
      const sUrl = cBrowser.buildUrl("detail.php", {
         s: poOptions.sol,
         i: poOptions.instrument,
         p: poOptions.product,
      })
      cBrowser.openWindow(sUrl, "detail")
   }

   //* **************************************************************
   static onSelectSolInstrEvent(poEvent, poData) {
      this.stop_queue()
      // load the data
      cDebug.write("selected sol " + poData.sol)
      cOptions.sol = poData.sol
      cDebug.write("selected instr " + poData.instrument)
      cOptions.instrument = poData.instrument
      if (!keep_start_image) cOptions.start_image = 1
      keep_start_image = false
      this.load_data()
   }

   //* **************************************************************
   static onStatusEvent(poEvent, paHash) {
      cCommonStatus.set_status(paHash.data)
   }

   //* **************************************************************
   static onThumbClickEvent(poEvent, poData) {
      this.stop_queue()
      const sUrl = cBrowser.buildUrl("detail.php", {
         s: poData.sol,
         i: poData.instr,
         p: poData.product,
      })
      cDebug.write("loading page " + sUrl)
      $("#" + cIndexPageConsts.ID_IMAGE_CONTAINER)
         .empty()
         .html("redirecting to: " + sUrl)
      setTimeout(function () {
         cBrowser.openWindow(sUrl, "detail")
      }, 0)
   }

   //* **************************************************************
   static onImagesLoadedEvent(poEvent, piStartImage) {
      // enable thumbnails
      $("#" + cIndexPageConsts.ID_SOLTHUMBS).removeAttr("disabled")
      cOptions.start_image = piStartImage
      this.update_url()
   }

   // ###############################################################
   // # Utility functions
   // ###############################################################
   static update_url() {
      const oParams = {}
      oParams[cSpaceBrowser.SOL_QUERYSTRING] = cOptions.sol
      if (cOptions.instrument)
         oParams[cSpaceBrowser.INSTR_QUERYSTRING] = cOptions.instrument
      if (this.is_thumbs_checked())
         oParams[cSpaceBrowser.THUMB_QUERYSTRING] = "1"
      if (cOptions.start_image)
         oParams[cSpaceBrowser.BEGIN_QUERYSTRING] = cOptions.start_image
      const sUrl = cBrowser.buildUrl(cBrowser.pageUrl(), oParams)
      cBrowser.pushState("Index", sUrl)
   }

   //* **************************************************************
   static stop_queue() {
      let oDiv
      try {
         oDiv = $("#" + cIndexPageConsts.ID_IMAGE_CONTAINER)
         oDiv.thumbnailview("stop_queue")
      } catch (e) {
         /* do nothing*/
      }
   }

   //* **************************************************************
   static is_thumbs_checked() {
      return $("#" + cIndexPageConsts.ID_CHKTHUMBS).is(":checked")
   }

   //* **************************************************************
   static load_data() {
      let oChkThumb
      const oThis = this
      this.update_url()

      cDebug.write("loading data: " + cOptions.sol + ":" + cOptions.instrument)

      $("#" + cIndexPageConsts.ID_WIDGET_BUTTONS).solButtons(
         "set_sol",
         cOptions.sol,
      )
      oChkThumb = $("#" + cIndexPageConsts.ID_CHKTHUMBS)

      if (cOptions.instrument) {
         oChkThumb.removeAttr("disabled")
         oChkThumb.off("change")
         if (cBrowser.data[cSpaceBrowser.THUMB_QUERYSTRING]) {
            oChkThumb.prop("checked", true)
            this.show_thumbs(cOptions.sol, cOptions.instrument)
         } else {
            this.show_images(
               cOptions.sol,
               cOptions.instrument,
               cOptions.start_image,
            )
         }
         oChkThumb.on("change", function (poEvent) {
            oThis.onCheckThumbsEvent(poEvent)
         })
      } else {
         oChkThumb.attr("disabled", "disabled")
         this.show_thumbs(cOptions.sol, cSpaceBrowser.ALL_INSTRUMENTS)
      }
   }

   // ###############################################################
   //* GETTERS
   // ###############################################################
   static show_thumbs(psSol, psInstrument) {
      var oDiv
      cDebug.write("showing  thumbs for " + psSol + " : " + psInstrument)
      const oThis = this

      oDiv = $("#" + cIndexPageConsts.ID_IMAGE_CONTAINER)
      if (oDiv.length == 0) $.error("image DIV not found ")

      if (oDiv.thumbnailview("instance") != undefined) {
         oDiv.thumbnailview("destroy")
      }

      cDebug.write("creating widget")
      oDiv.thumbnailview({
         // apply widget
         sol: psSol,
         instrument: psInstrument,
         onStatus(poEvent, paHash) {
            oThis.onStatusEvent(poEvent, paHash)
         }, // TODO replace with events
         onClick(poEvent, poData) {
            oThis.onThumbClickEvent(poEvent, poData)
         },
         mission: cMission,
      })
   }

   //* **************************************************************
   static show_images(piSol, psInstr, piStartImage) {
      const oThis = this
      cDebug.write("showing  images for " + piSol + " : " + psInstr)

      var oWidget, oDiv

      oDiv = $("#" + cIndexPageConsts.ID_IMAGE_CONTAINER)
      if (oDiv.length == 0) $.error("image DIV not found")

      oWidget = oDiv.data("ckImageview")
      if (oWidget) {
         oWidget.destroy()
      }

      cDebug.write("creating widget")
      oWidget = oDiv.imageview({
         // apply widget
         sol: piSol,
         instrument: psInstr,
         start_image: piStartImage,
         onStatus(poEvent, paHash) {
            oThis.onStatusEvent(poEvent, paHash)
         },
         onLoaded(poEvent, piStartImage) {
            oThis.onImagesLoadedEvent(poEvent, piStartImage)
         },
         onClick(poEvent, poOptions) {
            oThis.onImageClick(poEvent, poOptions)
         },
         mission: cMission,
      })
   }
}
