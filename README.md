# Airrvisualizationlibrary

Visualization Library for building standard graphical representations of AIRR semantically structured data. 

This visualization library parses AIRR DATA and enables a standard visual narrative for iReceptor Stats API.

## iR+ Stats API specification

The iReceptor Stats API definition can be found at the [Github repository](https://github.com/ireceptor-plus/specifications) or through the [Swagger Editor](https://editor.swagger.io/?url=https://raw.githubusercontent.com/ireceptor-plus/specifications/master/stats-api.yaml).

## Usage Examples

The library is meant to be used either through the global variable `window.airrvisualization` or by instanciating the individual Classes.

Working examples can be found in the files [iRplusVis_APP.html](https://github.com/ireceptorplus-inesctec/airrvisualizationlibrary/blob/master/iRplusVis_APP.html), [iRplusVis_APP-module.html](https://github.com/ireceptorplus-inesctec/airrvisualizationlibrary/blob/master/iRplusVis_APP-module.html) and [ImmuneDb_APP.html](https://github.com/ireceptorplus-inesctec/airrvisualizationlibrary/blob/master/ImmuneDb_APP.html).

## Build

Note you must have `npm`installed on your machine.

### Install dependencies

Start by installing dependencies, on the command line type:

```bash
npm install
```

### Build for production

To build the visualization library run (after installing dependencies):

```bash
npm run build
```

### Build for development

If sources are required intead of `build` use `build:dev`:

```bash
npm run build:dev
```


### Build documentation

To build the library documentation run:

```bash
npm run build:docs
```