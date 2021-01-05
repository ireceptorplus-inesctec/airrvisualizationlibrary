/*
 AIRR VISUALIZATION LIBRARY JS __VERSION__ (2020-10-06)

 Author: Marco Amaro Oliveira, 2020.
         INESCTEC (https://www.inesctec.pt/). All rights reserved.
*/

// Import modules from AIIR Visualization Library
import {Logger, ResultSeriesType, GeneType, DataType} from './common.js';
import {Properties} from './properties.js';
import {ResultSeriesDataItem, ResultSeries} from "./series.js";
import {Result} from "./result.js";
import {VGeneUsageStatsResult, DGeneUsageStatsResult, JGeneUsageStatsResult, CGeneUsageStatsResult, JunctionLengthStatsResult, CountStatsResult} from "./iReceptorStatsResult.js";
import {ImmuneDbCloneCountResult} from "./immuneDbResult.js";
import {HighchartsChart} from "./charts.js";

/*
 * Several dependencies may be required for testing if they are not imported.
 * iR+ partners required that Highcharts is not imported and bundled with AIRR Visualization Library.
 */

/**
 * Class representing the AIRR Data Visualization Library.
 */
class VisualizationLibrary {

    constructor(){
        throw new Error("This class is not instantiable .");
    }
    
    static charts = {};
    
    /**
     * @description A dictionary with all open charts. Allows access to previously created charts.
     * @type {Dictionary}
     * @static
     * @readonly
     */
    static get charts(){
        return charts;
    }
    
    /**
     * @description Product name.
     * @type {string}
     * @static
     * @const
     */
    static get PRODUCT(){
        return "AIRR Visualization Library";
    }
    
    /**
     * @description Product version.
     * @type {string}
     * @static
     * @const
     */
    static get VERSION(){
        return "__VERSION__";
    }
    

    /**
     * @description Create a Chart provided a Properties Object. If a chart already exists with the same id, it will be destroyed and a new one constructed. At the moment only Highcharts Library is supported to plot the Graphs.
     * @static
     * @param {Properties} properties
     * @returns {Chart} 
     */
    static createChart(properties){
        if (properties === undefined) throw new TypeError("properties parameter is mandatory.");
        
        //TODO:Create and setup the Result based on the properties
        let result = ResultFactory.build(properties.dataType, properties.dataDrilldown, properties.data);

        //TODO: Once we support more graph libraries, decision on which library to use will depend com a properties value and will be done here.
        let _chart = new HighchartsChart(properties);
        _chart.setResult(result);
        VisualizationLibrary.charts[_chart.id] = _chart;
        return _chart;
    }

    /*
    createChart(properties=undefined){
        properties = Properties.create(properties);
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
    */

    /**
     * @description Creates a new Properties Object
     * @static
     * @param {(Properties|JSON|string|undefined)} [properties] a {@link Properties}, or a {@link JSON} or String representation of a Properties, or undefined.
     * @returns {Properties} 
     */
    static createProperties(properties){
        return Properties.create(properties);
    }
    
    
    /**
     * @description Returns the chart whose identifier is passed as parameter, or null if not exists.
     * @static
     * @param {string} identifier the identifier of the Chart
     * @returns {Chart} 
     */
    static get(identifier) {
        return VisualizationLibrary.charts[identifier];
    }
    
    /**
     * @description Sets the logging level globally for the library. See Logger.level for details and values.
     * @static
     * @param {Number} level the level for the debug (see levels in {@link Logger})
     */
    static setDebugLevel(level){
        //FIXME: It is setting debug level systemwise for all instances of Debug in current browser. Need to change the debug level to a instance level.
        Logger.setDebugLevel(level);
    }

}

/**
 * Factory Class for concrete {@link Result} classes
 */
class ResultFactory{

    /**
     * @description Builds and configures concrete instance of {@link Result} based on the data type 
     * @static
     * @param {string} dataType a code from {@link DataType}
     * @param {boolean} [dataDrilldown] is data drilldown capable
     * @param {JSON} [data] the source data
     * @returns {Result} a concrete instance of {@link Result} 
     */
    static build(dataType, dataDrilldown, data){
        if (!(DataType.contains(dataType))){
            throw new TypeError('Unknown datatype: '+ dataType);
        }
        var result = undefined;
        switch (dataType) {
            case DataType.V_GENE_USAGE:
                result = new VGeneUsageStatsResult();
                break;
            case DataType.D_GENE_USAGE:
                result = new DGeneUsageStatsResult();
                break;
            case DataType.J_GENE_USAGE:
                result = new JGeneUsageStatsResult();
                break;
            case DataType.C_GENE_USAGE:
                result = new CGeneUsageStatsResult();
                break;
            case DataType.JUNCTION_LENGTH:
                result = new JunctionLengthStatsResult();
                break;
                case DataType.CLONE_COUNT:
                result = new CountStatsResult();
                break;
            case DataType.CLONE_COUNT_IMMUNEDB:
                result = new ImmuneDbCloneCountResult();
                break;
        }
        if (result){
            if (dataDrilldown) result.setDrilldown(dataDrilldown);
            if (data) result.setData(data);
        }
        return result;
    }

}

export { VisualizationLibrary, ResultFactory, HighchartsChart, Result, VGeneUsageStatsResult, DGeneUsageStatsResult, JGeneUsageStatsResult, CGeneUsageStatsResult, JunctionLengthStatsResult,
    CountStatsResult, ResultSeries, ResultSeriesDataItem, Properties, GeneType, DataType,
    ResultSeriesType, Logger};



(function (windows) {
    // We need that our library is globally accesible. Add it to the window variable.
    if(typeof(window.airrvisualization) === 'undefined'){
        window.airrvisualization = VisualizationLibrary;
        //window.airrvisualization = new VisualizationLibrary();
    }
    
}(window));
