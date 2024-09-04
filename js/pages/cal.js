/**************************************************************************
Copyright (C) Chicken Katsu 2013 - 2024

This code is protected by copyright under the terms of the
Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License
http://creativecommons.org/licenses/by-nc-nd/4.0/legalcode

For licenses that allow for commercial use please contact cluck@chickenkatsu.co.uk

// USE AT YOUR OWN RISK - NO GUARANTEES OR ANY FORM ARE EITHER EXPRESSED OR IMPLIED
**************************************************************************/
'use strict';
//eslint-disable-next-line no-unused-vars
class cAppCal {
    static current_sol = null;
    static current_date = null;
    static oColours = {};

    //###############################################################
    //# entry point
    //###############################################################
    static onLoadJQuery() {
        this.current_sol = cBrowser.data[cSpaceBrowser.SOL_QUERYSTRING];
        this.load_widget();
    }

    //###############################################################
    //# Event Handlers
    //###############################################################
    static onClickGotoSol() {
        const sUrl = cBrowser.buildUrl('index.php', { s: this.current_sol });
        cBrowser.openWindow(sUrl, 'index');
    }

    static onClickNext() {
        this.current_sol = parseInt(this.current_sol) + 1;
        this.load_widget();
    }

    static onClickPrevious() {
        this.current_sol = parseInt(this.current_sol) - 1;
        this.load_widget();
    }

    static onClickRefresh() {
        cCommonStatus.set_status('refreshing data');

        const sUrl = cBrowser.buildUrl(
            cAppLocations.rest + '/instruments.php',
            {
                s: this.current_sol,
                r: 'true',
                m: cMission.ID,
            },
        ); // force a refresh on the server
        const oHttp = new cHttp2();
        {
            bean.on(oHttp, 'result', () => this.onLoadedCal());
            oHttp.fetch_json(sUrl);
        }
    }

    static onLoadedCal(poEvent, psSol) {
        this.current_sol = psSol;
        $('#gotoSOL').html(psSol);
        $('#sol').html(psSol);
        const sURL = cBrowser.buildUrl(cBrowser.pageUrl(), {
            s: this.current_sol,
        });
        cBrowser.update_state('calendar', sURL);
    }

    static onClickCal(poEvent, poData) {
        const sUrl = cBrowser.buildUrl('detail.php', poData);
        cBrowser.openWindow(sUrl, 'detail');
    }

    static load_widget() {
        const oDiv = $('#calendar');
        var oWidget = oDiv.data('ckSolcalendar'); // capitalise the first letter of the widget
        if (oWidget) oWidget.destroy();
        $('#calendar').solcalendar({
            mission: cMission,
            sol: this.current_sol,
            onLoaded: () => this.onLoadedCal(),
            onClick: () => this.onClickCal(),
        });
    }
}
