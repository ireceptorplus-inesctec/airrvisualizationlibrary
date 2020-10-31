/*
 AIRR VISUALIZATION LIBRARY JS __VERSION__ (2020-10-06)

 (c) 2020 Marco Amaro Oliveira (INESCTEC)

 License: You are not allowed to use this code (yet)
*/

// Import and export other modules from AIIR Visualization Library
import {Logger, ResultSeriesType, GeneType, DebugTimer} from './common';
import {Properties} from './properties';
import {ResultSeriesDataItem, ResultSeries} from "./series";
import {Result} from "./result";
import {VGeneStatsResult, DGeneStatsResult, JGeneStatsResult, CGeneStatsResult, JunctionLenghtStatsResult} from "./iReceptorStatsResult";
import {ImmuneDbCloneCountResult} from "./immuneDbResult";

// Import Hicharts into module
/*
import Highcharts from 'highcharts/highcharts';
import highcharts3d from 'highcharts/highcharts/highcharts-3d';
highcharts3d(Highcharts);
import Exporting from 'highcharts/modules/exporting';
Exporting(Highcharts);
import Data from 'highcharts/modules/data';
Data(Highcharts);
import Drilldown from 'highcharts/modules/drilldown';
Drilldown(Highcharts);
*/

class HichartsChart {
    #_id;
    #_properties;
    #_result;
    #_chart;
    #_logger;
    #_highcharts;
    
    constructor(properties){
        this.#_logger = new Logger('Chart');
        this.#_logger.debug("Constructor.");
        this.checkHighcharts();
        this.#_result = {};
        this.#_chart = undefined;
        this.#_properties = undefined;
        if (properties instanceof Properties){
            this.#_properties = properties;
        }else{
            this.#_properties = new Properties();
        }
        this.#_id = this.#_properties.id;
        this.#_highcharts = window.Highcharts;
        this.#_logger.trace(JSON.stringify(this));
    }

    checkHighcharts(){
        let Highcharts = window.Highcharts;
        if (!Highcharts) {
            this.#_logger.error('Highcharts not available');
            throw 'Required Highcharts Library not available';
        }
        if (!Highcharts._modules.hasOwnProperty("Extensions/Drilldown.js")) {
            this.#_logger.error('Highcharts Drilldown module not available');
            throw 'Required Highcharts Drilldown module not available';
        }
        if (!Highcharts._modules.hasOwnProperty("Extensions/Exporting.js")) {
            this.#_logger.error('Highcharts Exporting module not available');
            throw 'Required Highcharts Exporting module not available';
        }
        if (!Highcharts._modules.hasOwnProperty("Extensions/Data.js")) {
            this.#_logger.error('Highcharts Data module not available');
            throw 'Required Highcharts Data module not available';
        }
        if (!(Highcharts._modules.hasOwnProperty("Extensions/Math3D.js"))) {
            this.#_logger.error('Highcharts 3D module not available');
            throw 'Required Highcharts 3D module not available';
        }
    }

    //setter
    setResult(result){
        this.#_logger.debug("setResult");
        if (result instanceof Result){
            this.#_result = result;
            this.#_logger.trace(JSON.stringify(this.#_properties));
            this.#_logger.trace(JSON.stringify(this.#_result.properties));
            this.#_properties.updateWith(this.#_result.properties);
            this.#_logger.trace(JSON.stringify(this.#_properties));
        }else{
            this.#_logger.error("Received result is not compatible. Result must be an instance of Result.");
        }
        this.#_logger.trace(JSON.stringify(this));
        return this;
    }
    
    set result(result){
        setResult(result);
    }
    
    setProperties(properties){
        if (properties instanceof Properties){
            this.#_properties = properties;
        }else{
            throw 'properies type must be Properties';
        }
        return this;
    }
    
    get properties(){
        return this.#_properties;
    }
    
    set properties(properties){
        this.setProperties(properties);
    }
    
    //getter
    get result(){
        return this.#_result;
    }

    get id(){
        return this.#_id;
    }

    get chart(){
        return this.#_chart;
    }

    //plot
    plot(){
        let timer = new DebugTimer();
        this.#_logger.debug("Ploting chart");
        timer.start("build_Highcharts_structure");
        //Plotting must have into consideration the type of data and the visualization implementation required.
        // This is where we map  properties and data to specific Visualization library.
        let p = {
            chart: { 
                type: this.#_properties.chartType,
                // animation
                animation: this.#_properties.animation
             },
            xAxis: {
                type: 'category'
            },
            // In an Highcharts chart, the series value is an array of objects each one representing a data series.
            // Each data series can have its own plot options.
            //series: this.#_result.series.map(series => series.asHighchartSeries()),
            //series: this.#_result.series,
            plotOptions: {}
        };
        timer.start(".asHighchartSeries");
        p.series = this.#_result.series.map(series => series.asHighchartSeries());
        timer.end(".asHighchartSeries");

        if (this.#_properties.title) { p.title = { text: this.#_properties.title } };
        if (this.#_properties.subtitle) { p.subtitle = { text : this.#_properties.subtitle } };
        if (this.#_properties.yLabel) {
            p.yAxis = (p.yAxis || {});
            p.yAxis.title = { text: this.#_properties.yLabel };
        }
        //Sort has a huge problem with drilldown.
        //We cannot rely on Highcharts Sort. To apply sort we need to sort DataItems within the Result.
        /*
        if (this.#_properties.sort){
            p.plotOptions.series = (p.plotOptions.series || {});
            p.plotOptions.series.dataSorting = {
                enabled: true,
                sortKey: 'name'
            };
        }
        */
        if (this.#_result.drilldown){
            this.#_logger.debug("YAY... this is a drilldown chart");
            // In an Highcharts chart, the drilldown value is an object that allows for inspect increasingly high resolution data,
            // This object contains a series property that is an array of objects, each one representing a data series (as the series in the chart).
            // Each data series can have its own plot options, existence of the id property is mandatory to reference which series to plot.
            // Later I may need to change this.#_result.drilldownSeries; for a .map like in the series property.
            p.drilldown = this.#_result.drilldownSeries; 
            //We need to get the drilldown and drillup events to change at least the title and subtitle of the chart.
            p.chart.events = {
                drillup: this.#_result.drillupSeriesEvent,
                drilldown: this.#_result.drilldownSeriesEvent
            }
        }
        this.#_logger.trace("Is 3D (multiple series)? -" + this.#_result.isMultipleSeries());
        if (this.#_result.isMultipleSeries()){
            // Setup chart 3Doptions properties (in the future using #_properties and #_dataseries data).
            p.chart.options3d = {
                enabled: true,
                alpha: this.#_properties.alpha3D,
                beta: this.#_properties.beta3D,
                depth: this.#_properties.depth3D,
                viewDistance: 5,
                fitToPlot: true,
                frame: {
                    bottom: {
                        size: 1,
                        color: 'rgba(0,0,0,0.05)'
                    }
                }
            };
            // Setup zAxis properties (in the future using #_properties and #_dataseries data).
            /* p.zAxis = {
                min: 0,
                categories: ["series 1","series 2","series 3","series 4"],
                type: 'category',
                labels: {
                    y: 5,
                    rotation: 18
                }
            };*/
            p.plotOptions.series = (p.plotOptions.series || {});
            p.plotOptions.series.groupZPadding = 20;
            p.plotOptions.series.depth = 0;
            p.plotOptions.series.groupPadding = 0;
            p.plotOptions.series.grouping = false;
            /*p.plotOptions = {
                series: {
                    groupZPadding: 20,
                    depth: 0,
                    groupPadding: 0,
                    grouping: false,
                }
            };*/
        }
        // If is a stacking chart
        if (this.#_properties.stackingType){
            p.plotOptions.series = (p.plotOptions.series || {});
            p.plotOptions.series.stacking = this.#_properties.stackingType;
        }
        
        timer.end("build_Highcharts_structure");
        console.log(p);
        // If Hicharts is imported as a module than we don't need jquery to plot the chart into the DOM.
        //this.#_chart  = Highcharts.chart(this.#_properties.id, p);
        this.#_chart  = this.#_highcharts.chart(this.#_properties.id, p);
        //$('#'+this.#_properties.id).highcharts(p);
        this.#_logger.trace(JSON.stringify(p));
        this.#_logger.debug("Plotting into " + this.#_properties.id);
        this.#_logger.trace(JSON.stringify(this.#_result));
        //Highcharts.addEvent(this.#_chart.container, "mousedown", this.getMousedownEvent(this.#_chart, this.#_result.isMultipleSeries()));
        this.#_highcharts.addEvent(this.#_chart.container, "mousedown", this.getMousedownEvent(this.#_chart, this.#_result.isMultipleSeries()));
        timer.print();
    }

    /**
     * This MouseDownEvent is specific for Highcharts.
     * 
     * @param {Highchart} targetChart 
     */
    getMousedownEvent(targetChart, is3D){
        this.#_logger.debug("getMousedownEvent");
        let logger = this.#_logger;
        if (!is3D){
            this.#_logger.debug("retrieving default mousedown event on charts.");
            return function(e) {
                logger.trace("Default mouse down event on chart.");
            };    
        }
        let highcharts = this.#_highcharts;
        return function(eStart) {
            let chart = targetChart;
            console.log("Mousedown in multiple series");
            eStart = chart.pointer.normalize(eStart);

            let posX = eStart.chartX,
                posY = eStart.chartY,
                alpha = chart.options.chart.options3d.alpha,
                beta = chart.options.chart.options3d.beta,
                sensitivity = 5,  // lower is more sensitive
                handlers = [];
    
            function drag(e) {
                // Get e.chartX and e.chartY
                e = chart.pointer.normalize(e);
                let newAlpha = alpha + (e.chartY - posY) / sensitivity,
                    newBeta = beta + (posX - e.chartX) / sensitivity;
                chart.update({
                    chart: {
                        options3d: {
                            alpha: newAlpha,
                            beta: newBeta
                        }
                    }
                }, undefined, undefined, false);
                console.log("alpha:" + newAlpha + ", beta:"+newBeta);
            }
    
            function unbindAll() {
                handlers.forEach(function (unbind) {
                    if (unbind) {
                        unbind();
                    }
                });
                handlers.length = 0;
            }
            // Here we can add the listeners to chart.container or to document.
            // IF added to chart.container thechart will change only when the event is within the chart area.
            //handlers.push(Highcharts.addEvent(document, 'mousemove', drag));
            //handlers.push(Highcharts.addEvent(document, 'touchmove', drag));
            //handlers.push(Highcharts.addEvent(document, 'mouseup', unbindAll));
            //handlers.push(Highcharts.addEvent(document, 'touchend', unbindAll));
            handlers.push(highcharts.addEvent(document, 'mousemove', drag));
            handlers.push(highcharts.addEvent(document, 'touchmove', drag));
            handlers.push(highcharts.addEvent(document, 'mouseup', unbindAll));
            handlers.push(highcharts.addEvent(document, 'touchend', unbindAll));
            logger.trace(eStart.toString());
        };  
    }
}

/**
 * Several dependencies may be required for testing if they are not imported.
 * iR+ partners required that Highcharts is not imported and bundled with AIRR Visualization Library.
 * 
 */
class VisualizationLibrary {
    #_charts;
    #_logger;
    #_version;
    #_product;
    
    constructor(){
        this.#_logger = new Logger('VisualizationLibrary');
        this.#_logger.debug("Constructor.");
        this.#_version = "__VERSION__";
        this.#_product = "AIRR Visualization Library";
        this.#_charts = {};
    }
    
    get charts(){
        return this.#_charts;
    }
    
    createChart(properties=undefined){
        properties = Properties.validOrNew(properties);
        let _chart = this.get(properties.id);
        if (_chart == undefined) {
            _chart = new HichartsChart(properties);
            this.#_charts[_chart.id] = _chart;
        }else{
            _chart.properties = properties;
        }
        return _chart;
    }

    get version(){
        return this.#_version;
    }

    createGeneStatsResult(gene){
        let statsResult = undefined;
        switch (gene) {
            case GeneType.V_GENE:
                statsResult = this.createVGeneStatsResult();
                break;
            case GeneType.D_GENE:
                statsResult = this.createDGeneStatsResult();
                break;
            case GeneType.J_GENE:
                statsResult = this.createJGeneStatsResult();
                break;
            case GeneType.C_GENE:
                statsResult = this.createCGeneStatsResult();
                break;
            default:
                break;
        }
        return statsResult;
    }
    
    createVGeneStatsResult(){
        return new VGeneStatsResult();
    }
    
    createDGeneStatsResult(){
        return new DGeneStatsResult();
    }
    
    createJGeneStatsResult(){
        return new JGeneStatsResult();
    }
    
    createCGeneStatsResult(){
        return new CGeneStatsResult();
    }

    createImmuneDbCloneCountResult(){
        return new ImmuneDbCloneCountResult();
    }

    createJunctionLengthStatsResult(){
        return new JunctionLenghtStatsResult();
    }

    createProperties(){
        return new Properties();
    }
    
    get(identifier) {
        return this.#_charts[identifier];
    }
    
    setDebugLevel(level){
        Logger.setDebugLevel(level);
    }
}

module.exports = { 
        VisualizationLibrary: VisualizationLibrary,
        HichartsChart: HichartsChart, 
        Result: Result, 
        VGeneStatsResult: VGeneStatsResult, 
        DGeneStatsResult: DGeneStatsResult, 
        JGeneStatsResult: JGeneStatsResult, 
        CGeneStatsResult: CGeneStatsResult,
        JunctionLenghtStatsResult: JunctionLenghtStatsResult,
        ResultSeries: ResultSeries, 
        ResultSeriesDataItem: ResultSeriesDataItem, 
        Properties: Properties, 
        GeneType: GeneType, 
        ResultSeriesType: ResultSeriesType, 
        Logger: Logger
    };

export { VisualizationLibrary, HichartsChart, Result, VGeneStatsResult, DGeneStatsResult, JGeneStatsResult, CGeneStatsResult, JunctionLenghtStatsResult,
    ResultSeries, ResultSeriesDataItem, Properties, GeneType, 
    ResultSeriesType, Logger};



(function (windows) {
    // We need that our library is globally accesible, then we save in the window
    if(typeof(window.airrvisualization) === 'undefined'){
        window.airrvisualization = new VisualizationLibrary();
    }
    
}(window));
