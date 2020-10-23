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
import {GeneStatsResult, VGeneStatsResult, DGeneStatsResult, JGeneStatsResult} from "./iReceptorStatsResult";
import {ImmuneDbCloneCountResult} from "./immuneDbResult";

// Import Hicharts into module
import Highcharts from 'highcharts';
import highcharts3d from 'highcharts/highcharts-3d';
highcharts3d(Highcharts);
import Exporting from 'highcharts/modules/exporting';
Exporting(Highcharts);
import Data from 'highcharts/modules/data';
Data(Highcharts);
import Drilldown from 'highcharts/modules/drilldown';
Drilldown(Highcharts);

class Chart {
    #_id;
    #_properties;
    #_result;
    #_chart;
    #_logger;
    
    constructor(properties){
        this.#_logger = new Logger('Chart');
        this.#_logger.debug("Constructor.");
        this.#_result = {};
        this.#_chart = undefined;
        this.#_properties = undefined;
        if (properties instanceof Properties){
            this.#_properties = properties;
        }else{
            this.#_properties = new Properties();
        }
        this.#_id = this.#_properties.id;
        this.#_logger.trace(JSON.stringify(this));
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

        console.log(p);
        if (this.#_properties.title) { p.title = { text: this.#_properties.title } };
        if (this.#_properties.subtitle) { p.subtitle = { text : this.#_properties.subtitle } };
        //not working (yet)
        /*p.plotOptions.series = (p.plotOptions.series || {});
        p.plotOptions.series.dataSorting = {
            enabled: true,
            sortKey: 'name'
        };*/
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
                alpha: 20,
                beta: 30,
                depth: 200,
                viewDistance: 5,
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
        this.#_chart  = Highcharts.chart(this.#_properties.id, p);
        //$('#'+this.#_properties.id).highcharts(p);
        this.#_logger.trace(JSON.stringify(p));
        this.#_logger.debug("Plotting into " + this.#_properties.id);
        this.#_logger.trace(JSON.stringify(this.#_result));
        Highcharts.addEvent(this.#_chart.container, "mousedown", this.#_result.getMousedownEvent(this.#_chart));
        console.log(this);
        timer.print();
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
    
    constructor(){
        this.#_logger = new Logger('VisualizationLibrary');
        this.#_logger.debug("Constructor.");
        this.#_version = "__VERSION__";
        this.#_charts = {};
    }
    
    get charts(){
        return this.#_charts;
    }
    
    createChart(properties=undefined){
        properties = Properties.validOrNew(properties);
        let _chart = this.get(properties.id);
        if (_chart == undefined) {
            _chart = new Chart(properties);
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
        return new GeneStatsResult(gene);
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

    createImmuneDbCloneCountResult(){
        return new ImmuneDbCloneCountResult();
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

module.exports = { VisualizationLibrary, Chart, Result, GeneStatsResult, VGeneStatsResult, DGeneStatsResult, JGeneStatsResult, 
    ResultSeries, ResultSeriesDataItem, Properties, GeneType, 
    ResultSeriesType, Logger};

export { VisualizationLibrary, Chart, Result, GeneStatsResult, VGeneStatsResult, DGeneStatsResult, JGeneStatsResult, 
    ResultSeries, ResultSeriesDataItem, Properties, GeneType, 
    ResultSeriesType, Logger};



(function (windows) {

    // We need that our library is globally accesible, then we save in the window
    if(typeof(window.airrvisualization) === 'undefined'){
        window.airrvisualization = new VisualizationLibrary();
    }
/*
    window.$ = $;
    window.jQuery = jQuery;
*/
}(window));