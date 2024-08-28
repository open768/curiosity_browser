'use strict';
// eslint-disable-next-line no-unused-vars
class cAppRender {
    //****************************************************************
    static make_button(psID, psCaption, psTitle, pbDisabled, pfnOnClick) {
        var oOptions = {
            title: psTitle,
            class: 'w3-button w3-theme-action w3-round w3-padding-small w3-theme-margin-1',
            style: 'display:inline-block',
        };
        if (pbDisabled) oOptions.disabled = 'disabled';
        if (psID) oOptions.id = psID;
        var sType = typeof pfnOnClick;
        if (sType !== 'function')
            cDebug.error('not passed in a function: ' + sType);

        var oButton = $('<button>', oOptions);
        {
            var oSpan = $('<span>', {
                style: 'display:flex;align-items:center',
            });
            {
                oSpan.append(psCaption);
                oButton.append(oSpan);
            }
            oButton.click(() => pfnOnClick());
        }
        if (!psID) oButton.uniqueId();
        return oButton;
    }

    //****************************************************************
    static create_widget(psTitle) {
        var oWidget, oHeader, oBody;
        oWidget = $('<DIV>', { class: 'w3-card w3-theme-widget' });
        {
            oHeader = $('<DIV>', {
                class: 'w3-container w3-theme-widget-header',
            });
            {
                oHeader.append(psTitle);
                oWidget.append(oHeader);
            }

            oBody = $('<DIV>', { class: 'w3-theme-widget-body' });
            oWidget.append(oBody);
            oWidget.body = oBody;
        }
        return oWidget;
    }

    //****************************************************************
    static update_title(psText) {
        var oDiv = cJquery.element('toptitle');
        oDiv.html(psText);
    }
}
