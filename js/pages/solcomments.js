/**************************************************************************
Copyright (C) Chicken Katsu 2013 - 2024

This code is protected by copyright under the terms of the
Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License
http://creativecommons.org/licenses/by-nc-nd/4.0/legalcode

For licenses that allow for commercial use please contact cluck@chickenkatsu.co.uk

// USE AT YOUR OWN RISK - NO GUARANTEES OR ANY FORM ARE EITHER EXPRESSED OR IMPLIED
**************************************************************************/
'use strict';
/*global cSolCommentPageConstants*/

//eslint-disable-next-line no-unused-vars
class cSolComments {
    static current_sol = null;
    static ID_GOTO_SOL_BUTTON = 'igsb';

    //###############################################################
    //# Entry point
    //###############################################################
    static onLoadJQuery() {
        this.current_sol = cBrowser.data[cSpaceBrowser.SOL_QUERYSTRING];
        if (this.current_sol == null) {
            var oContainer = cJquery.element(
                cSolCommentPageConstants.ID_COMMENTS_CONTAINER,
            );
            oContainer.append('no SOL provided!!!!');
            return;
        }

        // change status of checkbox
        this.set_browser_url();
        this.render_buttons();
        this.load_sol_comments();
    }

    //###############################################################
    //# Utility functions
    //###############################################################
    static set_browser_url() {
        $('#sol').html(this.current_sol);
        $('#solbutton').html(this.current_sol);
        const oParams = {};

        oParams[cSpaceBrowser.SOL_QUERYSTRING] = this.current_sol;

        const sUrl = cBrowser.buildUrl(cBrowser.pageUrl(), oParams);
        cBrowser.pushState('solcomments', sUrl);
    }

    //###############################################################
    //# events
    //###############################################################
    static render_buttons() {
        var oDiv, oButton, oThis;
        oThis = this;
        oDiv = cJquery.element('buttons');
        {
            oDiv.empty();
            oButton = cAppRender.make_button(
                null,
                'previous sol',
                'previous sol',
                false,
                () => oThis.onClickPrevious_sol(),
            );
            oDiv.append(oButton);

            oButton = cAppRender.make_button(
                this.ID_GOTO_SOL_BUTTON,
                'Sol ???',
                'go to sol',
                false,
                () => oThis.onClickGoToSol(),
            );
            oDiv.append(oButton);

            oButton = cAppRender.make_button(
                null,
                'next sol',
                'next sol',
                false,
                () => oThis.onClickNext_sol(),
            );
            oDiv.append(oButton);

            oButton = cAppRender.make_button(
                null,
                'All',
                'go to All comments',
                false,
                () => oThis.onClickAll(),
            );
            oDiv.append(oButton);
        }
    }

    //***************************************************************
    static load_sol_comments() {
        var sUrl, oHttp;

        //update the displayed sol
        var oSolDiv = cJquery.element(this.ID_GOTO_SOL_BUTTON);
        oSolDiv.html('Sol: ' + this.current_sol);

        //fetch sol data
        sUrl = cBrowser.buildUrl(cAppLocations.rest + '/comments.php', {
            o: 'sol',
            s: this.current_sol,
            m: cMission.ID,
        });
        oHttp = new cHttp2();
        bean.on(oHttp, 'result', (e) => this.onLoadSolComments(e));
        oHttp.fetch_json(sUrl);
    }
    //###############################################################
    //# events
    //###############################################################
    static onClickPrevious_sol() {
        this.current_sol--;
        this.set_browser_url();
        this.load_sol_comments();
    }

    //***************************************************************
    static onClickNext_sol() {
        this.current_sol++;
        this.set_browser_url();
        this.load_sol_comments();
    }

    //***************************************************************
    static onClickGoToSol() {
        const oParams = {};
        oParams[cSpaceBrowser.SOL_QUERYSTRING] = this.current_sol;
        const sUrl = cBrowser.buildUrl('index.php', oParams);
        cBrowser.openWindow(sUrl, 'index');
    }

    //***************************************************************
    static onLoadSolComments(poHttp) {
        var oJson = poHttp.response;

        //--------prepare the container
        var oContainer = cJquery.element(
            cSolCommentPageConstants.ID_COMMENTS_CONTAINER,
        );
        oContainer.empty();

        //--------parse the data
        for (var sProduct in oJson) {
            var oInstr = oJson[sProduct];

            //EACH PRODUCT HAS ITS OWN cARD
            var oProductDiv = $('<div>', {
                class: 'w3-card w3-theme-l5 w3-margin',
            });
            {
                //- - - - -  PRODUCT HEADER - - - - - -
                var oProductHeader = $('<header>', {
                    class: 'w3-theme-d3 w3-container',
                });
                {
                    oProductHeader.append(sProduct);
                    oProductDiv.append(oProductHeader);
                }

                //- - - - -  ITERATE INSTRUMENTS - - - - - -
                var oProductBody = $('<div>', { class: 'w3-container' });
                {
                    for (var sInstr in oInstr) {
                        var oInstrDiv = $('<div>', {
                            class: 'w3-cell-row ',
                        });
                        {
                            var oGotoProductDiv = $('<div>', {
                                class: 'w3-cell w3-padding w3-cell-top',
                                style: 'width:70px',
                            });
                            {
                                var sUrl = cBrowser.buildUrl('detail.php', {
                                    s: this.current_sol,
                                    i: sInstr,
                                    p: sProduct,
                                });
                                var oLink = $('<A>', {
                                    href: sUrl,
                                    target: 'detail',
                                });
                                {
                                    var oIcon = cRenderGoogleFont.create_icon(
                                        'pageview',
                                        'font-size:100px',
                                    );
                                    oLink.append(oIcon);
                                    oGotoProductDiv.append(oLink);
                                }
                                oInstrDiv.append(oGotoProductDiv);
                            }

                            var oInstrCommentDiv = $('<div>', {
                                class: 'w3-cell w3-cell-top',
                            });
                            {
                                oInstrCommentDiv.commentbox({
                                    mission: cMission,
                                    sol: this.current_sol,
                                    product: sProduct,
                                    instrument: sInstr,
                                    read_only: true,
                                });
                                oInstrDiv.append(oInstrCommentDiv);
                            }

                            oProductBody.append(oInstrDiv);
                        }
                    }
                    oProductDiv.append(oProductBody);
                }

                oContainer.append(oProductDiv);
            }
        }
    }
}
