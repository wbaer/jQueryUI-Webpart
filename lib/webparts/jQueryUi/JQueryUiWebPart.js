"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var sp_core_library_1 = require("@microsoft/sp-core-library");
var sp_webpart_base_1 = require("@microsoft/sp-webpart-base");
var sp_lodash_subset_1 = require("@microsoft/sp-lodash-subset");
var sp_core_library_2 = require("@microsoft/sp-core-library");
var JQueryUi_module_scss_1 = require("./JQueryUi.module.scss");
var strings = require("jQueryUiStrings");
// App imports
var MockHttpClient_1 = require("./MockHttpClient");
// Import spHttpClient helper class to execute REST API requests against SharePoint
var sp_http_1 = require("@microsoft/sp-http");
var jQuery = require("jquery");
require("jqueryui");
var sp_loader_1 = require("@microsoft/sp-loader");
require('jqueryui');
var JQueryUiWebPart = (function (_super) {
    __extends(JQueryUiWebPart, _super);
    function JQueryUiWebPart() {
        var _this = _super.call(this) || this;
        // Setup the Web Part Property Pane Dropdown options
        _this._dropdownOptions = [];
        // Load remote stylesheet
        sp_loader_1.SPComponentLoader.loadCss('//code.jquery.com/ui/1.12.0/themes/base/jquery-ui.css');
        return _this;
    }
    // Define and retrieve mock list data
    JQueryUiWebPart.prototype._getMockListData = function () {
        return MockHttpClient_1.default.get(this.context.pageContext.web.absoluteUrl).then(function () {
            var listData = {
                value: [
                    { Title: 'Mock List Item 1', Description: 'Mock List Data 1' },
                    { Title: 'Mock List Item 2', Description: 'Mock List Data 2' },
                    { Title: 'Mock List Item 3', Description: 'Mock List Data 3' },
                    { Title: 'Mock List Item 4', Description: 'Mock List Data 4' }
                ]
            };
            return listData;
        });
    };
    // Retrieve list data from SharePoint
    JQueryUiWebPart.prototype._getListData = function () {
        return this.context.spHttpClient.get(this.context.pageContext.web.absoluteUrl + "/_api/web/lists/GetByTitle('" + this.properties.list + "')/items", sp_http_1.SPHttpClient.configurations.v1)
            .then(function (response) {
            return response.json();
        });
    };
    // Retrieve lists from SharePoint
    JQueryUiWebPart.prototype._getLists = function () {
        return this.context.spHttpClient.get(this.context.pageContext.web.absoluteUrl + "/_api/web/lists?$filter=Hidden eq false", sp_http_1.SPHttpClient.configurations.v1)
            .then(function (response) {
            return response.json();
        });
    };
    // Call methods for list data retrieval
    JQueryUiWebPart.prototype._renderListAsync = function () {
        var _this = this;
        // Mock List data
        if (sp_core_library_2.Environment.type === sp_core_library_2.EnvironmentType.Local) {
            this._getMockListData().then(function (response) {
                _this._renderList(response.value);
            });
        }
        else {
            var list = this.properties.list;
            // Check if a list is selected
            if (!list || list.toString == null) {
                this.domElement.innerHTML = "\n      <div class=\"" + JQueryUi_module_scss_1.default.container + "\">\n            <span>" + sp_lodash_subset_1.escape(this.properties.description) + "</span>\n            <p>No list has been selected.  Open the tool pane and select a list.</p>\n      </div>\n      ";
                return;
            }
            this._getListData()
                .then(function (response) {
                _this._renderList(response.value);
            });
        }
    };
    // Render the list data with the values fetched from the REST API
    JQueryUiWebPart.prototype._renderList = function (items) {
        // Clear the container for initial configuration
        this.domElement.innerHTML = "";
        // Reset the Accordion to handle property changes
        $('#accordion').remove();
        // Set up html for the jQuery UI Accordion Widget to display collapsible content panels
        // Learn more about the Accordion Widget at http://jqueryui.com/accordion/
        var html = '';
        html += "<div id='accordion'>";
        items.forEach(function (item) {
            html += "\n        <div class='group'>\n          <h3>" + item.Title + "</h3>\n            <div>\n                <p> " + item.Description + " </p>\n            </div>\n        </div>";
        });
        this.domElement.innerHTML += html;
        html += "</div>";
        // Set up base Accordion options
        var accordionOptions = {
            header: "> div > h3",
            animate: this.properties.speed,
            collapsible: true,
            icons: {
                header: 'ui-icon-circle-arrow-e',
                activeHeader: 'ui-icon-circle-arrow-s'
            }
        };
        // Set up configurable jQueryUI effects and interactions
        if (this.properties.resize == false) {
            jQuery(this.domElement).children('#accordion').accordion(accordionOptions);
        }
        else {
            jQuery(this.domElement).children('#accordion').accordion(accordionOptions).resizable({ ghost: true, animate: true, autoHide: true, helper: 'ui-resizable-helper' });
        }
        if (this.properties.sort == false) {
            jQuery(this.domElement).children('#accordion').accordion(accordionOptions);
        }
        else {
            jQuery(this.domElement).children('#accordion').accordion(accordionOptions).sortable();
        }
    };
    JQueryUiWebPart.prototype.render = function () {
        this._renderListAsync();
    };
    JQueryUiWebPart.prototype.onInit = function () {
        var _this = this;
        this._getLists()
            .then(function (response) {
            _this._dropdownOptions = response.value.map(function (list) {
                return {
                    key: list.Title,
                    text: list.Title
                };
            });
        });
        return Promise.resolve();
    };
    Object.defineProperty(JQueryUiWebPart.prototype, "dataVersion", {
        get: function () {
            return sp_core_library_1.Version.parse('1.0');
        },
        enumerable: true,
        configurable: true
    });
    // Set up core Property Pane options
    JQueryUiWebPart.prototype.getPropertyPaneConfiguration = function () {
        return {
            pages: [
                {
                    header: {
                        description: strings.PropertyPaneDescription
                    },
                    groups: [
                        {
                            groupName: strings.SharePointOptions,
                            groupFields: [
                                sp_webpart_base_1.PropertyPaneDropdown('list', {
                                    label: 'List',
                                    options: this._dropdownOptions
                                })
                            ]
                        },
                        {
                            groupName: strings.JQueryOptions,
                            groupFields: [
                                sp_webpart_base_1.PropertyPaneSlider('speed', {
                                    label: 'Animation Speed',
                                    min: 1,
                                    max: 500
                                }),
                                sp_webpart_base_1.PropertyPaneToggle('resize', {
                                    label: 'Resizable',
                                    onText: 'Enable',
                                    offText: 'Disable'
                                }),
                                sp_webpart_base_1.PropertyPaneToggle('sort', {
                                    label: 'Sortable',
                                    onText: 'Enable',
                                    offText: 'Disable'
                                })
                            ]
                        }
                    ]
                }
            ]
        };
    };
    Object.defineProperty(JQueryUiWebPart.prototype, "disableReactivePropertyChanges", {
        // Set Property Pane settings to non-reactive
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    return JQueryUiWebPart;
}(sp_webpart_base_1.BaseClientSideWebPart));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = JQueryUiWebPart;

//# sourceMappingURL=JQueryUiWebPart.js.map
