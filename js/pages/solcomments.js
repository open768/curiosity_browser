/**************************************************************************
Copyright (C) Chicken Katsu 2013 - 2024

This code is protected by copyright under the terms of the
Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License
http://creativecommons.org/licenses/by-nc-nd/4.0/legalcode

For licenses that allow for commercial use please contact cluck@chickenkatsu.co.uk

// USE AT YOUR OWN RISK - NO GUARANTEES OR ANY FORM ARE EITHER EXPRESSED OR IMPLIED
**************************************************************************/
'use strict';
/*global cSolCommentPageConstants, cAppSolButtons*/

//eslint-disable-next-line no-unused-vars
class cSolComments {
    static current_sol = null;

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
        cAppSolButtons.render_buttons(cSolCommentPageConstants.ID_BUTTONS);
        this.load_sol_comments();
    }

    //###############################################################
    //# Utility functions
    //###############################################################
    static set_browser_url() {
        var oSolDiv = cJquery.element(cSolCommentPageConstants.ID_SOL);
        oSolDiv.html(this.current_sol);
        const oParams = {};

        oParams[cSpaceBrowser.SOL_QUERYSTRING] = this.current_sol;

        const sUrl = cBrowser.buildUrl(cBrowser.pageUrl(), oParams);
        cBrowser.update_state('solcomments', sUrl);
    }

    //###############################################################
    //# events
    //###############################################################

    //***************************************************************
    static load_sol_comments() {
        var sUrl, oHttp;

        //fetch sol data
        sUrl = cBrowser.buildUrl(cAppLocations.rest + '/comments.php', {
            o: 'sol',
            s: this.current_sol,
            m: cMission.ID,
        });
        oHttp = new cHttp2();
        {
            bean.on(oHttp, 'result', (e) => this.onLoadSolComments(e));
            bean.on(oHttp, 'error', (e) => this.onErrSolComments(e));
            oHttp.fetch_json(sUrl);
        }
    }
    //###############################################################
    //# events
    //###############################################################
    static onErrSolComments(poHttp) {
        var oContainer = cJquery.element(
            cSolCommentPageConstants.ID_COMMENTS_CONTAINER,
        );
        oContainer.html('error loading data');
    }
    //**************************************************************
    static onLoadSolComments(poHttp) {
        var oJson = poHttp.response;

        //--------prepare the container
        var oContainer = cJquery.element(
            cSolCommentPageConstants.ID_COMMENTS_CONTAINER,
        );
        oContainer.empty();

        //--------parse the data
        if (oJson == null) {
            oContainer.append(cAppRender.make_note('no data found!'));
            return;
        }
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
