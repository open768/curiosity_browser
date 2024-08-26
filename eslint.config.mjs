// eslint.config.js
import globals from 'globals';
import js from '@eslint/js';

export default [
    js.configs.recommended,
    {
        languageOptions: {
            globals: {
                ...globals.jquery,
                ...globals.browser,
                cJquery: 'readonly',
                cDebug: 'readonly',
                cBrowser: 'readonly',
                bean: 'readonly',
                cAppLocations: 'readonly',
                cAppRender: 'readonly',
                cAuth: 'readonly',
                cCommon: 'readonly',
                cCommonStatus: 'readonly',
                cCuriosity: 'readonly',
                cDetailPageConstants: 'readonly',
                cFacebook: 'readonly',
                cHttp2: 'readonly',
                cImgHilite: 'readonly',
                cMission: 'readonly',
                cSpaceBrowser: 'readonly',
                cSpaceComments: 'readonly',
                cTagging: 'readonly',
            },
        },
        rules: {
            'no-unused-vars': 'warn',
        },
    },
];
