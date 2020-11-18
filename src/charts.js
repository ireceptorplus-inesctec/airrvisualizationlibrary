// Import and export other modules from AIIR Visualization Library
import {Logger, DebugTimer} from './common';
import {Properties} from './properties';
import {Result} from "./result";

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
class Chart {
    #_logger;
    #_id;
    #_properties;
    #_result;

    constructor(properties){
        this.#_logger = new Logger('Chart');
        this.#_logger.debug("Constructor.");
        this.#_result = undefined;
        this.#_properties = undefined;
        if (properties instanceof Properties){
            this.#_properties = properties;
        }else{
            //this.#_properties = new Properties();
            throw 'Invalid Properties. properties parameter must be an instance of Properties class.';
        }
        this.#_id = this.#_properties.id;
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

    plot(){
        this.#_logger.fatal("this plot() method should never execute, specializations of Chart need to overload it.");
        throw 'This method should not be called, implementations need to overload it.';        
    }
}


class HichartsChart extends Chart{
    #_chart;
    #_logger;
    #_highcharts;
    
    constructor(properties){
        super(properties);
        this.#_logger = new Logger('HichartsChart');
        this.#_logger.debug("Constructor.");
        this.#_chart = undefined;
        this.checkHighcharts();
        this.#_highcharts = window.Highcharts;
        this.#_logger.trace(JSON.stringify(this));
    }

    get chart(){
        return this.#_chart;
    }

    checkHighcharts(){
        this.#_logger.debug("Checking if highcharts resources are available.");
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

    //plot
    plot(){
        let timer = new DebugTimer();
        this.#_logger.debug("Ploting chart");
        timer.start("build_Highcharts_structure");
        //Plotting must have into consideration the type of data and the visualization implementation required.
        // This is where we map  properties and data to specific Visualization library.
        let p = {
            chart: { 
                type: this.properties.chartType,
                // animation
                animation: this.properties.animation
            },
            credits: {
               enabled: false
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
        p.series = this.result.series.map(series => series.asHighchartSeries());
        timer.end(".asHighchartSeries");

        if (this.properties.title) { p.title = { text: this.properties.title } };
        if (this.properties.subtitle) { p.subtitle = { text : this.properties.subtitle } };
        if (this.properties.yLabel) {
            p.yAxis = (p.yAxis || {});
            p.yAxis.title = { text: this.properties.yLabel };
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
        if (this.result.drilldown){
            this.#_logger.debug("YAY... this is a drilldown chart");
            // In an Highcharts chart, the drilldown value is an object that allows for inspect increasingly high resolution data,
            // This object contains a series property that is an array of objects, each one representing a data series (as the series in the chart).
            // Each data series can have its own plot options, existence of the id property is mandatory to reference which series to plot.
            // Later I may need to change this.#_result.drilldownSeries; for a .map like in the series property.
            p.drilldown = this.result.drilldownSeries; 
            //We need to get the drilldown and drillup events to change at least the title and subtitle of the chart.
            p.chart.events = {
                drillup: this.result.drillupSeriesEvent,
                drilldown: this.result.drilldownSeriesEvent
            }
        }
        this.#_logger.trace("Is 3D (multiple series)? -" + this.result.isMultipleSeries());
        if (this.result.isMultipleSeries()){
            // Setup chart 3Doptions properties (in the future using #_properties and #_dataseries data).
            p.chart.options3d = {
                enabled: true,
                alpha: this.properties.alpha3D,
                beta: this.properties.beta3D,
                depth: this.properties.depth3D,
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
        if (this.properties.stackingType){
            p.plotOptions.series = (p.plotOptions.series || {});
            p.plotOptions.series.stacking = this.properties.stackingType;
        }
        
        timer.end("build_Highcharts_structure");
        console.log(p);
        // If Hicharts is imported as a module than we don't need jquery to plot the chart into the DOM.
        //this.#_chart  = Highcharts.chart(this.#_properties.id, p);
        this.#_chart  = this.#_highcharts.chart(this.properties.id, p);
        //$('#'+this.#_properties.id).highcharts(p);
        this.#_logger.trace(JSON.stringify(p));
        this.#_logger.debug("Plotting into " + this.properties.id);
        this.#_logger.trace(JSON.stringify(this.result));
        //Highcharts.addEvent(this.#_chart.container, "mousedown", this.getMousedownEvent(this.#_chart, this.#_result.isMultipleSeries()));
        this.#_highcharts.addEvent(this.#_chart.container, "mousedown", this.getMousedownEvent(this.#_chart, this.result.isMultipleSeries()));
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


module.exports = { 
    Chart: Chart,
    HichartsChart: HichartsChart
};

export { Chart, HichartsChart};