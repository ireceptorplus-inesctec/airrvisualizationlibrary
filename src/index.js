/*
 AIRR VISUALIZATION LIBRARY JS __VERSION__ (2020-10-06)

 Author: Marco Amaro Oliveira, 2020.
         INESCTEC (https://www.inesctec.pt/). All rights reserved.

 License: AGPL
*/

// Import and export other modules from AIIR Visualization Library
import {Logger, ResultSeriesType, GeneType} from './common.js';
import {Properties} from './properties.js';
import {ResultSeriesDataItem, ResultSeries} from "./series.js";
import {Result} from "./result.js";
import {VGeneUsageStatsResult, DGeneUsageStatsResult, JGeneUsageStatsResult, CGeneUsageStatsResult, JunctionLengthStatsResult, CountStatsResult} from "./iReceptorStatsResult.js";
import {ImmuneDbCloneCountResult} from "./immuneDbResult.js";
import {HighchartsChart} from "./charts.js";

/*
 * Several dependencies may be required for testing if they are not imported.
 * iR+ partners required that Highcharts is not imported and bundled with AIRR Visualization Library.
 * 
 */
/**
 * @description A AIRR Data Visualization Library.
 * @author Marco Amaro Oliveira
 * @class VisualizationLibrary
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
    
    get product(){
        return this.#_product;
    }
    
    get version(){
        return this.#_version;
    }
    
    /**
     * @description Create a Chart provided a Properties Object. At the moment only Highcharts Library is supported to plot the Graphs.
     * @param {Properties} [properties=undefined]
     * @returns {Chart} 
     * @memberof VisualizationLibrary
     */
    createChart(properties=undefined){
        properties = Properties.validOrNew(properties);
        let _chart = this.get(properties.id);
        if (_chart == undefined) {
            _chart = new HighchartsChart(properties);
            this.#_charts[_chart.id] = _chart;
        }else{
            //FIXME: Properties should only be set through chart constructor. Changing properties otherwise may lead to unknown results.
            _chart.properties = properties;
        }
        return _chart;
    }

    /**
     * @description Creates a GeneUsage Stats Result. The gene parameter defines the specific type of Result that is returned.
     * @param {GeneType} gene
     * @returns {StatsResult} 
     * @memberof VisualizationLibrary
     */
    createGeneUsageStatsResult(gene){
        let statsResult = undefined;
        switch (gene) {
            case GeneType.V_GENE:
                statsResult = this.createVGeneUsageStatsResult();
                break;
            case GeneType.D_GENE:
                statsResult = this.createDGeneUsageStatsResult();
                break;
            case GeneType.J_GENE:
                statsResult = this.createJGeneUsageStatsResult();
                break;
            case GeneType.C_GENE:
                statsResult = this.createCGeneUsageStatsResult();
                break;
            default:
                break;
        }
        return statsResult;
    }
    
    /**
     * @description Creates a new V Gene Usage StatsResult
     * @returns {VGeneUsageStatsResult} 
     * @memberof VisualizationLibrary
     */
    createVGeneUsageStatsResult(){
        return new VGeneUsageStatsResult();
    }
    
    /**
     * @description Creates a new D Gene Usage StatsResult
     * @returns {DGeneUsageStatsResult} 
     * @memberof VisualizationLibrary
     */
    createDGeneUsageStatsResult(){
        return new DGeneUsageStatsResult();
    }
    
    /**
     * @description Creates a new J Gene Usage StatsResult
     * @returns {JGeneUsageStatsResult} 
     * @memberof VisualizationLibrary
     */
    createJGeneUsageStatsResult(){
        return new JGeneUsageStatsResult();
    }
    
    /**
     * @description Creates a new C Gene Usage StatsResult
     * @returns {CGeneUsageStatsResult} 
     * @memberof VisualizationLibrary
     */
    createCGeneUsageStatsResult(){
        return new CGeneUsageStatsResult();
    }
    
    /**
     * @description Creates a new ImmuneDb Clone Count Result
     * @returns {ImmuneDbCloneCountResult} 
     * @memberof VisualizationLibrary
     */
    createImmuneDbCloneCountResult(){
        return new ImmuneDbCloneCountResult();
    }
    
    /**
     * @description Creates a new Junction Length StatsResult
     * @returns {JunctionLengthStatsResult} 
     * @memberof VisualizationLibrary
     */
    createJunctionLengthStatsResult(){
        return new JunctionLengthStatsResult();
    }

    /**
     * @description Creates a new Count StatsResult
     * @returns {CountStatsResult} 
     * @memberof VisualizationLibrary
     */
    createCountStatsResult(){
        return new CountStatsResult();
    }

    /**
     * @description Creates a new Properties Object
     * @returns {Properties} 
     * @memberof VisualizationLibrary
     */
    createProperties(){
        return new Properties();
    }
    
    /**
     * @description Returns the chart whose identifier is passed as parameter, or null if not exists.
     * @param {string} identifier
     * @returns {Chart} 
     * @memberof VisualizationLibrary
     */
    get(identifier) {
        return this.#_charts[identifier];
    }
    
    /**
     * @description Sets the logging level globally for the library. See Logger.level for details and values.
     * @param {Number} level
     * @memberof VisualizationLibrary
     */
    setDebugLevel(level){
        //FIXME: Setting degub level at class level should be avoided. It will set debug level systemwise.
        Logger.setDebugLevel(level);
    }
}

/*
module.exports = { 
        VisualizationLibrary: VisualizationLibrary,
        HighchartsChart: HighchartsChart, 
        Result: Result, 
        VGeneUsageStatsResult: VGeneUsageStatsResult, 
        DGeneUsageStatsResult: DGeneUsageStatsResult, 
        JGeneUsageStatsResult: JGeneUsageStatsResult, 
        CGeneUsageStatsResult: CGeneUsageStatsResult,
        JunctionLengthStatsResult: JunctionLengthStatsResult,
        CountStatsResult: CountStatsResult,
        ResultSeries: ResultSeries, 
        ResultSeriesDataItem: ResultSeriesDataItem, 
        Properties: Properties, 
        GeneType: GeneType, 
        ResultSeriesType: ResultSeriesType, 
        Logger: Logger
    };
*/

export { VisualizationLibrary, HighchartsChart, Result, VGeneUsageStatsResult, DGeneUsageStatsResult, JGeneUsageStatsResult, CGeneUsageStatsResult, JunctionLengthStatsResult,
    CountStatsResult, ResultSeries, ResultSeriesDataItem, Properties, GeneType, 
    ResultSeriesType, Logger};



(function (windows) {
    // We need that our library is globally accesible, then we save in the window
    if(typeof(window.airrvisualization) === 'undefined'){
        window.airrvisualization = new VisualizationLibrary();
    }
    
}(window));
