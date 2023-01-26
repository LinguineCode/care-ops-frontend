"use strict";
/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunkcare_ops_frontend"] = self["webpackChunkcare_ops_frontend"] || []).push([["formservice"],{

/***/ "./src/js/formservice.js":
/*!*******************************!*\
  !*** ./src/js/formservice.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"startFormServiceApp\": () => (/* binding */ startFormServiceApp)\n/* harmony export */ });\n/* harmony import */ var js_base_setup__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! js/base/setup */ \"./src/js/base/setup.js\");\n/* harmony import */ var backbone__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! backbone */ \"./node_modules/backbone/backbone.js\");\n/* harmony import */ var backbone__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(backbone__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var backbone_radio__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! backbone.radio */ \"./node_modules/backbone.radio/build/backbone.radio.js\");\n/* harmony import */ var backbone_radio__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(backbone_radio__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var js_base_app__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! js/base/app */ \"./src/js/base/app.js\");\n/* harmony import */ var js_entities_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! js/entities-service */ \"./src/js/entities-service/index.js\");\n\n\n\n\n\nconst Application = js_base_app__WEBPACK_IMPORTED_MODULE_3__[\"default\"].extend({\n  beforeStart(_ref) {\n    let {\n      formId,\n      patientId,\n      responseId\n    } = _ref;\n    return [backbone_radio__WEBPACK_IMPORTED_MODULE_2___default().request('entities', 'fetch:forms:model', formId), backbone_radio__WEBPACK_IMPORTED_MODULE_2___default().request('entities', 'fetch:forms:definition', formId), backbone_radio__WEBPACK_IMPORTED_MODULE_2___default().request('entities', 'fetch:forms:fields', null, patientId, formId), backbone_radio__WEBPACK_IMPORTED_MODULE_2___default().request('entities', 'fetch:formResponses:submission', responseId)];\n  },\n  onStart(opts, form, definition, fields, response) {\n    parent.postMessage({\n      message: 'form:pdf',\n      args: {\n        definition,\n        formData: fields.data.attributes || {},\n        formSubmission: response.data,\n        contextScripts: form.getContextScripts(),\n        reducers: form.getReducers()\n      }\n    }, window.origin);\n  }\n});\nconst Router = backbone__WEBPACK_IMPORTED_MODULE_1___default().Router.extend({\n  routes: {\n    'formservice/:formId/:patientId(/:responseId)': 'startFormService'\n  },\n  startFormService(formId, patientId, responseId) {\n    const app = new Application();\n    app.start({\n      formId,\n      patientId,\n      responseId\n    });\n  }\n});\nfunction startFormServiceApp() {\n  new Router();\n  backbone__WEBPACK_IMPORTED_MODULE_1___default().history.start({\n    pushState: true\n  });\n}\n\n\n//# sourceURL=webpack://care-ops-frontend/./src/js/formservice.js?");

/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/nil.js":
/*!***************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/nil.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ('00000000-0000-0000-0000-000000000000');\n\n//# sourceURL=webpack://care-ops-frontend/./node_modules/uuid/dist/esm-browser/nil.js?");

/***/ })

}]);