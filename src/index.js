/*
 AIRR VISUALIZATION LIBRARY JS __VERSION__ (2020-10-06)

 Author: Marco Amaro Oliveira, 2020.
         INESCTEC (https://www.inesctec.pt/). All rights reserved.

 License: AGPL
*/

// Import and export other modules from AIIR Visualization Library
import {Logger, ResultSeriesType, GeneType} from './common';
import {Properties} from './properties';
import {ResultSeriesDataItem, ResultSeries} from "./series";
import {Result} from "./result";
import {VGeneStatsResult, DGeneStatsResult, JGeneStatsResult, CGeneStatsResult, JunctionLenghtStatsResult, CountStatsResult} from "./iReceptorStatsResult";
import {ImmuneDbCloneCountResult} from "./immuneDbResult";
import {HichartsChart} from "./charts";

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
    
    get product(){
        return this.#_product;
    }
    
    get version(){
        return this.#_version;
    }
    
    createChart(properties=undefined){
        properties = Properties.validOrNew(properties);
        let _chart = this.get(properties.id);
        if (_chart == undefined) {
            _chart = new HichartsChart(properties);
            this.#_charts[_chart.id] = _chart;
        }else{
            //FIXME: Properties should only be set through chart constructor. Changing properties otherwise may lead to unknown results.
            _chart.properties = properties;
        }
        return _chart;
    }

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
    
    createVGeneUsageStatsResult(){
        return new VGeneStatsResult();
    }
    
    createDGeneUsageStatsResult(){
        return new DGeneStatsResult();
    }
    
    createJGeneUsageStatsResult(){
        return new JGeneStatsResult();
    }
    
    createCGeneUsageStatsResult(){
        return new CGeneStatsResult();
    }

    createImmuneDbCloneCountResult(){
        return new ImmuneDbCloneCountResult();
    }

    createJunctionLengthStatsResult(){
        return new JunctionLenghtStatsResult();
    }

    createCountStatsResult(){
        return new CountStatsResult();
    }

    createProperties(){
        return new Properties();
    }
    
    get(identifier) {
        return this.#_charts[identifier];
    }
    
    setDebugLevel(level){
        //FIXME: Setting degub level at class level should be avoided. It will set debug level systemwise.
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
        CountStatsResult: CountStatsResult,
        ResultSeries: ResultSeries, 
        ResultSeriesDataItem: ResultSeriesDataItem, 
        Properties: Properties, 
        GeneType: GeneType, 
        ResultSeriesType: ResultSeriesType, 
        Logger: Logger
    };

export { VisualizationLibrary, HichartsChart, Result, VGeneStatsResult, DGeneStatsResult, JGeneStatsResult, CGeneStatsResult, JunctionLenghtStatsResult,
    CountStatsResult, ResultSeries, ResultSeriesDataItem, Properties, GeneType, 
    ResultSeriesType, Logger};



(function (windows) {
    // We need that our library is globally accesible, then we save in the window
    if(typeof(window.airrvisualization) === 'undefined'){
        window.airrvisualization = new VisualizationLibrary();
    }
    
}(window));
