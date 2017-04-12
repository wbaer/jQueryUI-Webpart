/// <reference path="JQueryUiWebPart.ts" />

// Setup mock Http client
import { ISPList } from './JQueryUiWebPart';

export default class MockHttpClient {

    private static _items: ISPList[] = [{ Title: 'Mock List', Description: '1' }];

    public static get(restUrl: string, options?: any): Promise<ISPList[]> {
      return new Promise<ISPList[]>((resolve) => {
            resolve(MockHttpClient._items);
        });
    }
}