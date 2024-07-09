"use strict"

//eslint-disable-next-line no-unused-vars
class cSolGridRenderer {
   mission = null
   onClickUrl = null
   element = null
   solDataUrl = null
   solsUrl = cLocations.rest + "/sols.php"
   solData = null

   //*********************************************************************
   constructor(psMissionID, poElement, psDataUrl, psOnClickUrl) {
      this.mission = psMissionID
      this.onClickUrl = psOnClickUrl
      this.element = poElement
      this.solDataUrl = psDataUrl
   }

   //*********************************************************************
   show_sol_grid() {
      var oElement = this.element

      // check that the element is a div
      const sElementName = oElement.get(0).tagName
      if (sElementName !== "DIV") {
         $.error("needs a DIV. this element is a: " + sElementName)
      }

      //update status
      oElement.empty()
      const oLoader = $("<DIV>")
      oLoader.gSpinner({ scale: 0.25 })
      oElement.append(oLoader).append("Loading sol tags:")

      //send request to get the data
      var oThis = this
      var sUrl = cBrowser.buildUrl(this.solDataUrl, {
         m: this.mission,
         o: 'topsolindex'           //dont know why this is needed
      })
      const oHttp = new cHttp2()
      bean.on(
            oHttp, "result", 
            function(poHttp) {
                oThis.onDataResponse(poHttp)
            })
      oHttp.fetch_json(sUrl)
   }

   //*********************************************************************
   onDataResponse(poHttp) {
      const oElement = this.element

      this.solData = poHttp.response

      if (this.solData == null) {
         oElement.empty()
         oElement.attr("class", ".ui-state-error")
         oElement.append("No data found")
      } else {
         //fetch a list of all the sols, so that the sols with Tags can be overlaid
         oElement.empty()
         oElement.append("loading Sols...")
         const sUrl = cBrowser.buildUrl(this.solsUrl, { m: this.mission })
         const oHttp = new cHttp2()
         bean.on(oHttp, "result", (poHttp) => this.onSolsResponse(poHttp))
         oHttp.fetch_json(sUrl)
      }
   }

   //*********************************************************************
   onSolsResponse(poHttp) {
      var aSols = poHttp.response

      var oElement = this.element
      oElement.empty()
      var sSol, i

      //iterate all sols
      for (i = 0; i < aSols.length; i++) {
         //iterate each sol
         sSol = aSols[i].sol.toString()
         const oDiv = $("<DIV>", { class: "solbuttonDiv" }) //container for each button

         if (this.solData[sSol]) {
            //does sol have data?
            const oButton = $("<button>", {
               class: "solbutton",
               sol: sSol,
            }).append(sSol)
            oButton.click((poEvent) => this.onButtonClick(poEvent))
            oDiv.append(oButton)
         } else {
            //no data for the sol, link back to the index page for the sol
            const sUrl = cBrowser.buildUrl("index.php", { s: sSol })
            const oA = $("<a>", { href: sUrl, class: "sollink" }).append(sSol)
            oDiv.append(oA)
         }

         oElement.append(oDiv)
      }
   }

   //*********************************************************************
   onButtonClick(poEvent) {
      const oButton = $(poEvent.target)
      const sSol = oButton.attr("sol")
      const sUrl = cBrowser.buildUrl(this.onClickUrl, { s: sSol })
      cBrowser.openWindow(sUrl, "clicked")
   }
}
