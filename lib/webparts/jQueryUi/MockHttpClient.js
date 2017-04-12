/// <reference path="JQueryUiWebPart.ts" />
"use strict";
var MockHttpClient = (function () {
    function MockHttpClient() {
    }
    MockHttpClient.get = function (restUrl, options) {
        return new Promise(function (resolve) {
            resolve(MockHttpClient._items);
        });
    };
    return MockHttpClient;
}());
MockHttpClient._items = [{ Title: 'Mock List', Description: '1' }];
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MockHttpClient;

//# sourceMappingURL=MockHttpClient.js.map
