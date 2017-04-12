/// <reference types="es6-promise" />
import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart, IPropertyPaneConfiguration } from '@microsoft/sp-webpart-base';
import { IJQueryUiWebPartProps } from './IJQueryUiWebPartProps';
import 'jqueryui';
export interface ISPLists {
    value: ISPList[];
}
export interface ISPList {
    Title: string;
    Description: string;
}
export default class JQueryUiWebPart extends BaseClientSideWebPart<IJQueryUiWebPartProps> {
    private _getMockListData();
    private _getListData();
    private _getLists();
    private _renderListAsync();
    private _renderList(items);
    constructor();
    render(): void;
    private _dropdownOptions;
    onInit<T>(): Promise<T>;
    protected readonly dataVersion: Version;
    protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration;
    protected readonly disableReactivePropertyChanges: boolean;
}
