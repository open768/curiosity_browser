module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    jquery: true
  },
  extends: 'eslint:recommended',
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
  },
  globals:{
    "bean": "readonly",
    "cActionQueue": "readonly", 
    "cAuth": "readonly",
    "cBrowser": "readonly",
    "cComments": "readonly",
    "cCommonStatus": "readonly",
    "cDebug": "readonly",
    "cFacebook": "readonly",
    "cGoogleEarth": "readonly",
    "cHttp2": "readonly",
    "cHttpQueue": "readonly",
    "cHttpQueueItem": "readonly",
    "cImgHilite": "readonly",
    "cLocations": "readonly",
    "cMission" : "readonly",
    "cSpaceBrowser" : "readonly",
    "cTagging": "readonly"
  }
}
