"use strict"
/****************************************************************************
Copyright (C) Chicken Katsu 2013 - 2024 www.chickenkatsu.co.uk

This code is protected by copyright under the terms of the
Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License
http://creativecommons.org/licenses/by-nc-nd/4.0/legalcode

For licenses that allow for commercial use please contact cluck@chickenkatsu.co.uk

// USE AT YOUR OWN RISK - NO GUARANTEES OR ANY FORM ARE EITHER EXPRESSED OR IMPLIED
**************************************************************************/

/*global cIndexPageConsts, cRenderGoogleFont*/
// cIndexPageConsts are defined in index.php - and written out line 57

cDebug.on()

var keep_start_image = true

const cOptions = {
   start_image: 1,
   sol: null,
   instrument: null,
}

// ###############################################################
class cBackgroundImage {
   static REST_URL = "random.php"
   static INTERVAL = 5 * 60 * 1000
   static stop = false

   //*****************************************************************
   static render() {
      this.fetch_image()
   }

   //*****************************************************************
   static fetch_image() {
      if (this.stop) return

      const oThis = this
      const sUrl = cBrowser.buildUrl(cAppLocations.rest + "/" + this.REST_URL, {
         o: "i", //images
         h: 1, //only want 1 image
      })
      const oHttp = new cHttp2()
      bean.on(oHttp, "result", (poHttp) => oThis.OnImageResponse(poHttp))
      oHttp.fetch_json(sUrl)
   }

   //*****************************************************************
   static OnImageResponse(poHttp) {
      if (this.stop) return
      const oData = poHttp.response
      if (!oData) cCommonStatus.set_status("couldnt get image")

      //------------show the image
      var oBodyDiv = $("#" + cIndexPageConsts.ID_INTRO_BODY)

      //stop if the intro section has gone
      if (oBodyDiv.length === 0) {
         this.stop = true
         return
      }

      var oImgData = oData.d[0]
      oBodyDiv.css("background-image", "url('" + oImgData.d + "')")
      oBodyDiv.css("background-size", "cover")
      oBodyDiv.css("background-repeat", "no-repeat")

      //------------show information about the image
      var oFootDiv = $("#" + cIndexPageConsts.ID_INTRO_FOOTER)
      oFootDiv.show()
      oFootDiv.empty()

      const sUrl = cBrowser.buildUrl(
         cAppLocations.home + "/php/pages/detail.php",
         {
            s: oImgData.s,
            i: oImgData.i,
            p: oImgData.p,
         },
      )
      var oA = $("<A>", { href: sUrl, target: "detail" })
      oA.append("Click here to see background image")
      oFootDiv.append(oA)

      var oThis = this
      setTimeout(() => oThis.fetch_image(), this.INTERVAL)
   }
}

// ###############################################################
class cSideBar {
   static ID_SIDEBAR = "SB"
   static ID_SIDEBAR_COLLAPSED = "SBc"
   static ID_SIDEBAR_EXPANDED = "SBe"

   //*****************************************************************
   static onClickExpand() {
      $("#" + this.ID_SIDEBAR_COLLAPSED).hide()
      $("#" + this.ID_SIDEBAR_EXPANDED).show()
   }

   //*****************************************************************
   static onClickCollapse() {
      $("#" + this.ID_SIDEBAR_COLLAPSED).show()
      $("#" + this.ID_SIDEBAR_EXPANDED).hide()
   }

   //*****************************************************************
   static render(poParent) {
      var oButton, oIcon, oThis
      oThis = this

      var oContainer = $("<DIV>", {
         id: this.ID_SIDEBAR,
         class: "sidebar",
      })
      {
         var oCollapsed = $("<DIV>", {
            id: this.ID_SIDEBAR_COLLAPSED,
         })
         {
            oButton = $("<button>", { class: "w3-button" })
            {
               oIcon = cRenderGoogleFont.create_icon("left_panel_open")
               oButton.append(oIcon)
               oButton.click(() => oThis.onClickExpand())
               oCollapsed.append(oButton)

               var oText = $("<DIV>", { class: "sidebar-text" })
               oText.append("Menu")
               oCollapsed.append(oText)
            }
            oContainer.append(oCollapsed)
         }

         var oExpanded = $("<DIV>", {
            id: this.ID_SIDEBAR_EXPANDED,
         })
         {
            oButton = $("<button>", { class: "w3-button" })
            {
               oIcon = cRenderGoogleFont.create_icon("left_panel_close")
               oButton.append(oIcon)
               oButton.click(() => oThis.onClickCollapse())
               oExpanded.append(oButton)
               oExpanded.hide()
            }
            oContainer.append(oExpanded)
         }
      }

      poParent.append(oContainer)
      return oContainer
   }
}

// ###############################################################
//* renders left column
// ###############################################################
class cLeftColumn {
   static ID_TAB_TAG_CONTENT = "idttc"
   static ID_TAB_SOL_CONTENT = "idtsc"
   static ID_WIDGET_SOLCHOOSER = "idWSC"
   static ID_WIDGET_SOLBUTTONS = "idWSB"

   //**********************************************************
   static pr__render_tab_content_sol(poParent) {
      var oSolTabContent = $("<DIV>", {
         class: "tab-content",
         id: this.ID_TAB_SOL_CONTENT,
      })
      {
         //--------SOL chooser
         var oSolChooser = $("<DIV>", {
            id: this.ID_WIDGET_SOLCHOOSER,
         })
         {
            oSolChooser.append("Loading ")
            oSolTabContent.append(oSolChooser)
            oSolChooser.solinstrumentChooser({
               onStatus: (poEvent, paHash) =>
                  cIndexPage.onStatusEvent(poEvent, paHash),
               onSelect: (poEvent, poData) =>
                  cIndexPage.onSelectSolInstrEvent(poEvent, poData),
               mission: cMission,
            })
         }
         //----------SOL buttons
         var oSolButtons = $("<DIV>", {
            id: this.ID_WIDGET_SOLBUTTONS,
         })
         {
            oSolButtons.append("Loading ")
            oSolTabContent.append(oSolButtons)
            oSolButtons.solButtons({
               onStatus: (poEvent, paHash) =>
                  cIndexPage.onStatusEvent(poEvent, paHash),
               mission: cMission,
               onClick: () => cIndexPage.stop_queue(),
               onAllSolThumbs: () => cIndexPage.onClickAllSolThumbs(),
            })
         }
         //---------admin
         cAdminBox.render(oSolTabContent)

         //complete the widget
         poParent.append(oSolTabContent)
      }
   }

   //**********************************************************
   static pr__render_tab_content_tags(poParent) {
      //Tab Content (tags)
      var oTagContent = $("<DIV>", {
         class: "tab-content leftcolumn",
         id: this.ID_TAB_TAG_CONTENT,
      })
      {
         oTagContent.append("loading TAGS")
         poParent.append(oTagContent)
         oTagContent.tagcloud({
            mission: cMission,
         })
      }
   }

   //**********************************************************
   static render(poParent) {
      poParent.empty()
      poParent.addClass("w3-theme-d1")

      var oSideBar
      oSideBar = cSideBar.render(poParent)
      poParent.append(oSideBar)

      //tab bar
      var oExpanded = $("#" + cSideBar.ID_SIDEBAR_EXPANDED)
      cPageTabs.render(oExpanded)

      // sol tab content
      oExpanded.addClass("leftcolumn")
      this.pr__render_tab_content_sol(oExpanded)

      //  tags tab content
      this.pr__render_tab_content_tags(oExpanded)

      //click the default tab
      cPageTabs.clickDefaultTab()
   }
}

// ###############################################################
//* handles admin box
// ###############################################################
class cAdminBox {
   //*************************************************************
   static render(poParent) {
      var oThis = this
      var oDiv = $("<DIV>", {
         class: "w3-card-4",
      })
      {
         var oHeader = $("<DIV>", {
            class: "w3-container w3-theme-dark",
         })
         {
            oHeader.append("Admin")
            oDiv.append(oHeader)
         }

         var oBody = $("<DIV>", { class: "w3-container" })
         {
            if (cIndexPageConsts.IS_ADMIN === "yes") {
               var oButton = $("<BUTTON>", {
                  title: "Admin Functions",
                  class: "w3-button w3-theme-button-up",
               })
               oButton.append("Admin")
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
      cBrowser.openWindow(
         cAppLocations.home + "/php/pages/admin/admin.php",
         "admin",
      )
   }
}

// ###############################################################
//* handles search box
// ###############################################################
class cSearchBox {
   static REST_URL = "search.php"

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
         $("#" + cLeftColumn.ID_WIDGET_SOLCHOOSER).solinstrumentChooser(
            "set_sol",
            sText,
         )
      } else {
         const sUrl = cBrowser.buildUrl(
            cAppLocations.rest + "/" + this.REST_URL,
            {
               s: sText,
               m: cMission.ID,
            },
         )
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
   static HIGHLIGHT_CLASS = "w3-theme-button-up"
   static LOWLIGHT_CLASS = "w3-theme-button-down"
   static SOL_CAPTION = "Sol"
   static TAGS_CAPTION = "Tags"
   static BUTTON_CLASS = "tagbut"
   static ID_TAB_BAR = null

   //*********************************************************************
   static render(poParent) {
      //-----------------------the TAB Bar
      var oTabBar = $("<DIV>")
      {
         oTabBar.uniqueId()
         this.ID_TAB_BAR = oTabBar.attr("id")
         oTabBar.append("Loading Tab bar")
         poParent.append(oTabBar)
      }

      this.pr__renderTabs()
   }

   //*********************************************************************
   static pr__renderTabs() {
      cDebug.write("instrumenting tabs")

      //clear out any content
      var oBar = $("#" + this.ID_TAB_BAR)
      oBar.empty()

      //add the buttons the the tab bar
      this.pr__add_tab(oBar, this.SOL_CAPTION, cLeftColumn.ID_TAB_SOL_CONTENT)
      this.pr__add_tab(oBar, this.TAGS_CAPTION, cLeftColumn.ID_TAB_TAG_CONTENT)
   }

   //*********************************************************************
   static onTabClick(poElement) {
      //close all content pages
      $(".tab-content").each(function () {
         $(this).hide()
      })

      //remove the highlight of all buttons within the TAB BAR
      var oThis = this
      var oParent = $("#" + this.ID_TAB_BAR)
      var oChildren = oParent.children("." + this.BUTTON_CLASS)

      oChildren.each(function () {
         var oButton = $(this)
         oButton.removeClass(oThis.HIGHLIGHT_CLASS)
         oButton.addClass(oThis.LOWLIGHT_CLASS)
      })

      //add highlight to clicked  tab button element
      poElement.addClass(this.HIGHLIGHT_CLASS)
      poElement.removeClass(this.LOWLIGHT_CLASS)

      //show the tab target for the button clicked
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
         class: "w3-bar-item w3-button " + oThis.BUTTON_CLASS,
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
   static clickDefaultTab() {
      var oBar = $("#" + this.ID_TAB_BAR)
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
         cBackgroundImage.render()
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
      $("#" + cLeftColumn.ID_WIDGET_SOLCHOOSER).solinstrumentChooser(
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
      setTimeout(() => cBrowser.openWindow(sUrl, "detail"), 0)
   }

   //* **************************************************************
   static onImagesLoadedEvent(poEvent, piStartImage) {
      // enable thumbnails
      $("#" + cIndexPageConsts.ID_CHKTHUMBS).removeAttr("disabled")
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
      var oDiv
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
      var oChkThumb
      const oThis = this
      this.update_url()

      cDebug.write("loading data: " + cOptions.sol + ":" + cOptions.instrument)

      //inform subscribers
      $("#" + cLeftColumn.ID_WIDGET_SOLBUTTONS).solButtons(
         "set_sol",
         cOptions.sol,
      )

      //inform subscribers
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
         oChkThumb.on("change", (poEvent) => oThis.onCheckThumbsEvent(poEvent))
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
