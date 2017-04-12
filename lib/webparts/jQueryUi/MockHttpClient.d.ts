// [ts-npm-lint] removed reference to 'JQueryUiWebPart.d.ts'
/// <reference types="es6-promise" />
import { ISPList } from './JQueryUiWebPart';
export default class MockHttpClient {
    private static _items;
    static get(restUrl: string, options?: any): Promise<ISPList[]>;
}
