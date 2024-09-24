'use strict'
/* global cTitleConstants*/
// eslint-disable-next-line no-unused-vars
class cAppTitle {
	static render_title(psID) {
		var oDiv = cJquery.element(psID)
		oDiv.empty()
		if (!cTitleConstants.IS_HOME) {
			var sUrl = cAppLocations.home + '/php/pages/index.php'
			var sImgUrl = cAppLocations.home + '/css/mb_images/greydude.png'
			var oImg = $('<img>', {
				class: 'homebutton',
				src: sImgUrl
			})
			var oButton = cAppRender.make_button(null, 'Home', 'Home', false, () => cBrowser.openWindow(sUrl, 'index'))
			{
				oButton.prepend(oImg)
				//oButton.addClass("homebutton")
				oDiv.append(oButton)
			}
		} else oDiv.append('Curiosity Browser')
		oDiv.append(' - ' + cTitleConstants.TITLE)

		if (cTitleConstants.IS_LOCALHOST) oDiv.append(" - <font class='dev'>DEVELOPMENT</font>")
	}
}
