import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneToggle,
  PropertyPaneSlider,
  IPropertyPaneDropdownOption,
  PropertyPaneDropdown
} from '@microsoft/sp-webpart-base';

import { escape } from '@microsoft/sp-lodash-subset';

import {
  Environment,
  EnvironmentType
} from '@microsoft/sp-core-library';

import styles from './JQueryUi.module.scss';
import * as strings from 'jQueryUiStrings';
import { IJQueryUiWebPartProps } from './IJQueryUiWebPartProps';

// App imports
import MockHttpClient from './MockHttpClient';

// Import spHttpClient helper class to execute REST API requests against SharePoint
import {
  SPHttpClient
} from '@microsoft/sp-http';

import * as jQuery from 'jquery';
import 'jqueryui';

import { SPComponentLoader } from '@microsoft/sp-loader';

require('jqueryui');

// Define list models
export interface ISPLists {
  value: ISPList[];
}

export interface ISPList {
  Title: string;
  Description: string;
}

export default class JQueryUiWebPart extends BaseClientSideWebPart<IJQueryUiWebPartProps> {

  // Define and retrieve mock list data
  private _getMockListData(): Promise<ISPLists> {
    return MockHttpClient.get(this.context.pageContext.web.absoluteUrl).then(() => {
        const listData: ISPLists = {
            value:
            [
                { Title: 'Mock List Item 1', Description: 'Mock List Data 1' },
                { Title: 'Mock List Item 2', Description: 'Mock List Data 2' },
                { Title: 'Mock List Item 3', Description: 'Mock List Data 3' },
                { Title: 'Mock List Item 4', Description: 'Mock List Data 4' }
            ]
          };
        return listData;
    }) as Promise<ISPLists>;
  }

  // Retrieve list data from SharePoint
  private _getListData(): Promise<ISPLists> {
    return this.context.spHttpClient.get(this.context.pageContext.web.absoluteUrl + `/_api/web/lists/GetByTitle('` + this.properties.list + `')/items`, SPHttpClient.configurations.v1)
      .then((response: Response) => {
      return response.json();
      });
  }

  // Retrieve lists from SharePoint
    private _getLists(): Promise<ISPLists> {
    return this.context.spHttpClient.get(this.context.pageContext.web.absoluteUrl + `/_api/web/lists?$filter=Hidden eq false`, SPHttpClient.configurations.v1)
      .then((response: Response) => {
      return response.json();
      });
  }

  // Call methods for list data retrieval
  private _renderListAsync(): void {
  // Mock List data
  if (Environment.type === EnvironmentType.Local) {
    this._getMockListData().then((response) => {
      this._renderList(response.value);
    }); }
    else {
    const list: string = this.properties.list;
    // Check if a list is selected
    if (!list || list.toString == null) {
      this.domElement.innerHTML = `
      <div class="${styles.container}">
            <span>${escape(this.properties.description)}</span>
            <p>No list has been selected.  Open the tool pane and select a list.</p>
      </div>
      `;
      return;
    }

    this._getListData()
      .then((response) => {
        this._renderList(response.value);
      });
    }
  }

  // Render the list data with the values fetched from the REST API
  private _renderList(items: ISPList[]): void {
    // Clear the container for initial configuration
    this.domElement.innerHTML = ``;

    // Reset the Accordion to handle property changes
    $('#accordion').remove();

    // Set up html for the jQuery UI Accordion Widget to display collapsible content panels
    // Learn more about the Accordion Widget at http://jqueryui.com/accordion/
    let html: string = '';

    html += `<div id='accordion'>`;

    items.forEach((item: ISPList) => {
        html += `
        <div class='group'>
          <h3>${item.Title}</h3>
            <div>
                <p> ${item.Description} </p>
            </div>
        </div>`;
    });

    this.domElement.innerHTML += html;

    html += `</div>`;

    // Set up base Accordion options
    const accordionOptions: JQueryUI.AccordionOptions = {
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
    } else {
      jQuery(this.domElement).children('#accordion').accordion(accordionOptions).resizable({ghost: true, animate: true, autoHide: true, helper: 'ui-resizable-helper'});
    }

    if (this.properties.sort == false) {
      jQuery(this.domElement).children('#accordion').accordion(accordionOptions);
    } else {
      jQuery(this.domElement).children('#accordion').accordion(accordionOptions).sortable();
    }
  }

  public constructor() {
    super();

    // Load remote stylesheet
    SPComponentLoader.loadCss('//code.jquery.com/ui/1.12.0/themes/base/jquery-ui.css');
  }

  public render(): void {
    this._renderListAsync();
  }

  // Setup the Web Part Property Pane Dropdown options
  private _dropdownOptions: IPropertyPaneDropdownOption[] = [];
    public onInit<T>(): Promise<T> {
      this._getLists()
        .then((response) => {
          this._dropdownOptions = response.value.map((list: ISPList) => {
            return {
              key: list.Title,
              text: list.Title
          };
        });
      });
    return Promise.resolve();
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  // Set up core Property Pane options
  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {  
              groupName: strings.SharePointOptions,  
              groupFields: [  
                  PropertyPaneDropdown('list', {
                    label: 'List',
                    options: this._dropdownOptions
                  })
              ]  
            },  
            {
              groupName: strings.JQueryOptions,
              groupFields: [
                PropertyPaneSlider('speed', {
                  label: 'Animation Speed',
                  min: 1,
                  max: 500
                }),
                PropertyPaneToggle('resize', {
	                label: 'Resizable',
                  onText: 'Enable',
                  offText: 'Disable'
                }),
                PropertyPaneToggle('sort', {
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
  }
  // Set Property Pane settings to non-reactive
  protected get disableReactivePropertyChanges(): boolean {
    return true;
  }
}

