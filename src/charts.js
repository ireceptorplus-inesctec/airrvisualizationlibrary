// Import and export other modules from AIIR Visualization Library
import { Logger, DebugTimer } from './common.js';
import { ResultFactory } from './index.js';
import { Properties } from './properties.js';
import { Result } from "./result.js";

/**
 * Abstract Class for the Chart type.
 * @abstract
 */
class Chart {
    #_logger;
    #_id;
    #_properties;
    #_result;

    /**
     * @description Creates an instance of {@link Chart}.
     * @param {Properties} properties The properties of the chart.
     */
    constructor(properties) {
        if (this.constructor === Chart) {
            // Abstract class can not be constructed.
            throw new Error("Can not construct abstract class.");
        }//else (called from child)
        // Check if all instance methods are implemented.
        if (this.plot === Chart.prototype.plot) {
            // Child has not implemented this abstract method.
            throw new TypeError("Please implement abstract method plot.");
        }
        this.#_logger = new Logger('Chart');
        this.#_logger.debug("Constructor.");
        //this.#_result = undefined;
        //this.setProperties(properties);
        this.#_properties = properties;
        this.#_id = this.properties.id;
        this.#_result = ResultFactory.build(this.getProperties());
        this.#_result.parse(this.getProperties());
    }

    /**
     * @description the Chart ID
     * @readonly
     * @type {String}
     */
    get id() {
        return this.getId();
    }

    /**
     * @description Returns the ID of this Chart
     * @returns {String} The identification of the Chart instance.
     */
    getId() {
        return this.#_id;
    }

    /**
     * @description The {@link Result} to be plotted.
     * @type {Result}
     */
    get result() {
        return this.getResult();
    }

    /*
    set result(result) {
        this.setResult(result);
    }
    */

    /**
     * @description returns the Result of this Chart.
     * @returns {Result} the Result object.
     */
    getResult() {
        return this.#_result;
    }

    /* *
     * @description Chainable method to set the {@link Result} to be plotted.
     * @param {Result} result the {@link Result} to be plotted.
     * @returns {Chart} the same instance on which the method was called.
     * @throws {TypeError} if result is not an instance of {@link Result}
     * /
    setResult(result) {
        this.#_logger.debug("setResult");
        if (result instanceof Result) {
            this.#_result = result;
            //TODO: Add Observer on Result for when PARSED AND READY.
            //TODO: Plot needs to WAIT FOR READY STATE.
            //TODO: result.parse must be trigered by Chart instance.
            this.#_logger.trace(JSON.stringify(this.#_properties));
            this.#_logger.trace(JSON.stringify(this.#_result.properties));
            //Update chart properties with default result properties.
            this.#_properties.updateWith(this.#_result.properties);
            this.#_logger.trace(JSON.stringify(this.#_properties));
            //Ensure Result is set according to chart properties
            this.#_result.setDrilldown(this.#_properties.dataDrilldown);
            this.#_result.parse(this.#_properties);

        } else {
            this.#_logger.error("Received result is not compatible. Result must be an instance of Result.");
            throw new TypeError("Parameter result must be an instance of Result.");
        }
        this.#_logger.trace(JSON.stringify(this));
        return this;
    }
    */

    /**
     * @description The {@link Properties} of the chart
     * @type {Properties}
     */
    get properties() {
        return this.getProperties();
    }

    /*
    set properties(properties) {
        this.setProperties(properties);
    }

    /* *
     * @description Chainable method to set the {@link Properties} for the chart
     * @param {Properties} properties the {@link Properties} for the chart
     * @returns {Chart} the same instance on which the method was called.
     * /
    setProperties(properties) {
        if (properties instanceof Properties) {
            this.#_properties = properties;
        } else {
            throw new TypeError('Invalid Properties received. Parameter must be an instance of Properties class.');
        }
        return this;
    }
    */

    /**
     * @description Returns the {@link Properties} of this chart
     * @returns {Properties} the Properties object.
     */
    getProperties() {
        return this.#_properties;
    }

    /**
     * @description Abstract method. All subclasses must implement this method.
     * @abstract
     * @throws Throws Error if directly called.
     */
    plot() {
        this.#_logger.fatal("this plot() method should never execute, specializations of Chart need to overload it.");
        throw new TypeError('This method should not be called, implementations need to overload it.');
    }
}

/**
 * A {@link Chart} that uses the Highcharts Libary to plot graphs
 * @extends {Chart}
 */
class HighchartsChart extends Chart {
    #_chart;
    #_logger;
    #_highcharts;

    /**
     * Creates an instance of {@link HighchartsChart}.
     * @param {Properties} properties The properties of the chart.
     */
    constructor(properties) {
        super(properties);
        this.#_logger = new Logger('HichartsChart');
        this.#_logger.debug("Constructor.");
        this.#_chart = undefined;
        this.checkHighcharts();
        this.#_highcharts = window.Highcharts;
        this.#_logger.trace(JSON.stringify(this));
    }

    /**
     * @description After calling plot(), will hold the created {@link Highcharts.chart} instance.
     * @readonly
     */
    get chart() {
        return this.getChart();
    }

    /**
     * @description Returns a pointer to the Highcharts.chart created in this class.
     * @returns {Highcharts.chart} the created {@link Highcharts.chart} instance
     */
    getChart() {
        return this.#_chart;
    }

    /**
     * @description Verifies if Highcharts Library and all required Highcharts modules are loaded before creating instances of this module.
     * @private
     * @throws Error if Highcharts Library or any of the required modules are missing.
     */
    checkHighcharts() {
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

    /**
     * @description Creates an Highcharts.chart and displays it on the HTML container as defined in the {@link Properties} object.
     */
    plot() {
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

        // If not set on properties the Title should not be set. I.e. we need it to be undefined.
        //if (this.properties.title) { 
            p.title = { text: this.properties.title } 
        //};
        if (this.properties.subtitle) { p.subtitle = { text: (this.properties.subtitle[0] || undefined) } };
        if (this.properties.yLabel) {
            p.yAxis = (p.yAxis || {});
            p.yAxis.title = { text: this.properties.yLabel };
        }
        if (this.properties.xLabel) {
            p.xAxis = (p.xAxis || {});
            p.xAxis.title = { text: this.properties.xLabel };
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
        if (this.result.drilldown) {
            this.#_logger.debug("This is a drilldown chart");
            // In an Highcharts chart, the drilldown value is an object that allows for inspect increasingly high resolution data,
            // This object contains a series property that is an array of objects, each one representing a data series (as the series in the chart).
            // Each data series can have its own plot options, existence of the id property is mandatory to reference which series to plot.
            // Later I may need to change this.#_result.drilldownSeries; for a .map like in the series property.
            p.drilldown = this.result.drilldownSeries;
            //We need to get the drilldown and drillup events to change at least the title and subtitle of the chart.
            p.chart.events = {
                drillup: this.result.getDrillupSeriesEvent(this.properties),
                drilldown: this.result.getDrilldownSeriesEvent(this.properties)
            }
        }
        this.#_logger.trace("Is 3D (multiple series)? -" + this.result.isMultipleSeries());
        //TODO: We need to have a distinction between Multiple series and 3D (when plotting Junction length I ignore multiple series to have side-by-side chart)
        if (this.result.isMultipleSeries()) {
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
        }else{
            // Chart is single series
            p.legend = (p.legend || {});
            p.legend.enabled = false;

        }
        // If is a stacking chart
        if (this.properties.stackingType) {
            p.plotOptions.series = (p.plotOptions.series || {});
            p.plotOptions.series.stacking = this.properties.stackingType;
        }

        timer.end("build_Highcharts_structure");
        //console.log(p);
        // If Hicharts is imported as a module than we don't need jquery to plot the chart into the DOM.
        //this.#_chart  = Highcharts.chart(this.#_properties.id, p);
        this.#_chart = this.#_highcharts.chart(this.properties.id, p);
        //$('#'+this.#_properties.id).highcharts(p);
        this.#_logger.trace(JSON.stringify(p));
        this.#_logger.debug("Plotting into " + this.properties.id);
        this.#_logger.trace(JSON.stringify(this.result));
        //Highcharts.addEvent(this.#_chart.container, "mousedown", this.getMousedownEvent(this.#_chart, this.#_result.isMultipleSeries()));
        this.#_highcharts.addEvent(this.#_chart.container, "mousedown", this.getMousedownEvent(this.#_chart, this.result.isMultipleSeries()));
        timer.print();
    }

    /**
     * @description MouseDownEvent specific for Highcharts.chart
     * @private
     * @param {Highchart.chart} targetChart
     * @param {boolean} is3D
     * @returns {function} the MousedownEvent function 
     */
    getMousedownEvent(targetChart, is3D) {
        this.#_logger.debug("getMousedownEvent");
        let logger = this.#_logger;
        if (!is3D) {
            this.#_logger.debug("retrieving default mousedown event on charts.");
            return function (e) {
                logger.trace("Default mouse down event on chart.");
            };
        }
        let highcharts = this.#_highcharts;
        return function (eStart) {
            let chart = targetChart;
            //console.log("Mousedown in multiple series");
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
                //console.log("alpha:" + newAlpha + ", beta:" + newBeta);
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

export { Chart, HighchartsChart };