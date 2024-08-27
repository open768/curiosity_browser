//uses sceditor https://www.sceditor.com/

class cCommentBox {
    COMMENTS_DISPLAY_ID = 'CDI';
    COMMENTS_TEXTAREA_ID = 'CTI';
    COMMENTS_BUTTON_ID = 'CBI';

    widget = null;
    element = null;
    options = {
        mission: null,
        sol: null,
        product: null,
        instrument: null,
        read_only: true,
    };

    //*************************************************************
    constructor(poWidget) {
        this.widget = poWidget;
        this.element = poWidget.element;
        this.options = poWidget.options;
    }

    //*************************************************************
    render() {
        var oElement = this.element;
        oElement.addClass('w3-card w3-theme-l3');

        //--- comments display
        var sDisplay_ID, oDisplayDiv;
        sDisplay_ID = cJquery.child_ID(oElement, this.COMMENTS_DISPLAY_ID);
        {
            oDisplayDiv = $('<DIV>', { id: sDisplay_ID, class: 'comments' });
            oDisplayDiv.append('loading comments');
            oElement.append(oDisplayDiv);
        }

        //-----------if readonly dont enable anything
        if (this.options.read_only) return;

        //--- textarea display
        var sTEXT_ID, oTextDiv;
        sTEXT_ID = cJquery.child_ID(oElement, this.COMMENTS_TEXTAREA_ID);
        {
            oTextDiv = $('<TEXTAREA>', {
                id: sTEXT_ID,
                rows: 5,
                cols: 120,
                placeholder: 'go on share your thoughts with everyone',
            });
            cJquery.disable_element(oTextDiv);
            oElement.append(oTextDiv);
        }

        var sBUT_ID, oButton;
        var oThis = this;
        sBUT_ID = cJquery.child_ID(oElement, this.COMMENTS_BUTTON_ID);
        {
            oButton = cAppRender.make_button(
                sBUT_ID,
                'comment',
                'submit comment',
                () => oThis.onClick(),
            );
            cJquery.disable_element(oButton);
            oElement.append(oButton);
        }
    }

    //*************************************************************
    init() {
        var oElement = this.element;
        oElement.empty();
        this.render();
        var oThis = this;
        cDebug.on(); //DEBUG

        //----------- hook onto facebook user - if readonly skip
        if (!this.options.read_only)
            bean.on(cFacebook, cFacebook.STATUS_EVENT, () =>
                oThis.onFacebookUser(),
            );

        //get the comments
        var sSOl = this.options.sol;
        var sProduct = this.options.product;
        var sInstr = this.options.instrument;
        cDebug.write(
            'getting comments for s:' +
                sSOl +
                ' p:' +
                sProduct +
                ' i:' +
                sInstr,
        );
        cSpaceComments.get(sSOl, sInstr, sProduct, (d) =>
            oThis.onGotComments(d),
        );
    }

    //*************************************************************
    //* Events
    //*************************************************************
    onFacebookUser() {
        var oElement = this.element;

        //-----------if readonly dont enable anything
        if (this.options.read_only) return;

        //-----------enable the button
        var sBUT_ID = cJquery.child_ID(oElement, this.COMMENTS_BUTTON_ID);
        cJquery.enable_element(sBUT_ID);

        //-----------enable the textbox
        var sTEXT_ID = cJquery.child_ID(oElement, this.COMMENTS_TEXTAREA_ID);
        var oTextBox = cJquery.element(sTEXT_ID);

        oTextBox.sceditor({
            plugins: 'bbcode',
            style:
                cAppLocations.jsextra +
                '/sceditor/minified/jquery.sceditor.default.min.css',
            toolbarExclude: 'print,code,email,source,maximize',
            height: 100,
            resizeEnabled: false,
            emoticonsRoot: cAppLocations.jsextra + '/sceditor/',
        });
        var oThis = this;
        oTextBox.sceditor('instance').blur(() => oThis.onInputDefocus());
        oTextBox.sceditor('instance').focus(() => oThis.onInputFocus());
    }

    //*************************************************************
    onClick() {
        var oElement = this.element;
        var sTEXT_ID = cJquery.child_ID(oElement, this.COMMENTS_TEXTAREA_ID);
        var oTextBox = cJquery.element(sTEXT_ID);
        var sText = oTextBox.html();

        oTextBox.sceditor('instance').val(); // gets the bbcode - MUST BE PARSED AT SERVER
        cSpaceComments.set(
            this.options.sol,
            this.options.instrument,
            this.options.product,
            sText,
            () => this.onGotComments(),
        );
    }

    //*************************************************************
    onGotComments(poHttp) {
        var sHTML = '';
        var oElement = this.element;
        var sCommentsID = cJquery.child_ID(oElement, this.COMMENTS_DISPLAY_ID);
        var oDiv = cJquery.element(sCommentsID);
        var paJson = poHttp.response;

        if (!paJson) {
            sHTML = 'No Comments - be the first !';
        } else {
            sHTML = '';
            for (var i = 0; i < paJson.length; i++)
                sHTML += paJson[i].u + ':' + paJson[i].c + '<p>';
        }

        oDiv.html(sHTML);
    }
}

//##################################################################
//##################################################################
$.widget('ck.commentbox', {
    instance: null,
    options: {
        mission: null,
        sol: null,
        product: null,
        instrument: null,
        read_only: true,
    },

    //*******************************************************************
    _create: function () {
        //-------checks
        if (typeof cSpaceComments === 'undefined')
            cDebug.error('cSpaceComments is not defined');

        //-------proceed
        var oBox = new cCommentBox(this);
        this.instance = oBox;
        oBox.init();
    },
});
