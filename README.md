## jQueryUI Web Part

A jQueryUI Accordion Widget Web Part that displays collapsible content panels for presenting SharePoint List information in a limited amount of space.

To get started building the jQuery Widget Webpart refer to the walkthrough at https://github.com/wbaer/jQueryUI-Webpart/wiki.

### Building the code

```bash
git clone the repo
npm i
npm i -g gulp
gulp
```

This package produces the following:

* lib/* commonjs components - this allows this package to be reused from other packages.
* dist/* - a single bundle containing the components used for uploading to a cdn pointing a registered Sharepoint webpart library to.
* example/* a test page that hosts all components in this package.

### Build options

gulp nuke - TODO
gulp test - TODO
gulp watch - TODO
gulp build - TODO
gulp deploy - TODO
