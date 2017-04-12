declare interface IJQueryUiStrings {
  PropertyPaneDescription: string;
  SharePointOptions: string;
  JQueryOptions: string;
}

declare module 'jQueryUiStrings' {
  const strings: IJQueryUiStrings;
  export = strings;
}
