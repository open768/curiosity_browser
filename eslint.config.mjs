// eslint.config.js
import globals from 'globals'
import js from '@eslint/js'

export default [
	js.configs.recommended,
	{
		languageOptions: {
			globals: {
				...globals.jquery,
				...globals.browser,
				bean: 'readonly',
				cActionQueue: 'readonly',
				cAppLocations: 'readonly',
				cAppRender: 'readonly',
				cAuth: 'readonly',
				cBrowser: 'readonly',
				cCommon: 'readonly',
				cCommonStatus: 'readonly',
				cCuriosity: 'readonly',
				cDebug: 'readonly',
				cDetailPageConstants: 'readonly',
				cFacebook: 'readonly',
				cGoogleEarth: 'readonly',
				cHttp2: 'readonly',
				cHttpQueue: 'readonly',
				cHttpQueueItem: 'readonly',
				cImgHilite: 'readonly',
				cJquery: 'readonly',
				cMission: 'readonly',
				cRenderGoogleFont: 'readonly',
				cSpaceBrowser: 'readonly',
				cSpaceComments: 'readonly',
				cString: 'readonly',
				cTagging: 'readonly'
			}
		},
		rules: {
			'no-unused-vars': 'warn',
			semi: 'off'
		}
	}
]
