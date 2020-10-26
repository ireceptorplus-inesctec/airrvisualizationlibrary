import {Logger, ResultSeriesType, GeneType, Common} from './common';
import {Properties} from './properties';
import {Parser, DrilldownParser} from "./parser";
import {ResultSeriesDataItem, ResultSeries} from "./series";
import {GeneStatsDrilldownParser} from "./iReceptorStatsParser";

// HIGHCHARTS
import Highcharts from 'highcharts';

class Result {
    #_logger;
    #_rawResult;

    #_drilldown;

    #_parser;
            
    constructor(sourceData = undefined) {
        this.#_logger = new Logger('Result');
        this.#_logger.debug("Constructor.");
        this.#_rawResult = undefined;
        this.#_drilldown = false;
        this.#_parser = undefined;
        if (typeof sourceData !== "undefined" ){
            setRawResult(sourceData);            
        }
    }

    setRawResult(sourceData) {
        this.#_rawResult = sourceData;  
        this.#_logger.debug("setRawResult.");
        if (this.parser){
            this.preparse(sourceData);
            this.parse(sourceData);
        }
        //this.parseSingleRepertoireStatsData(sourceData);
        return this;
    }
    
    set rawResult(sourceData){
        this.setRawResult(sourceData);
    }
        
    get rawResult(){
        return this.#_rawResult;
    }

    /**
     * Sets the parser for the source data for this Result.
     * Setting the parser after setting the source data will result in a new 
     * parsing stage.
     * This method is called internally by the Classes that extend Result
     * when to set their correct Parser within Constructor and when setting drilldown value.
     * 
     * @param {Parser} parser 
     */
    setParser(parser) {
        this.#_logger.debug("setParser.");
        if (!(parser instanceof Parser)){
            this.#_logger.fatal("attribute parser must be an instance of Parser.");
            throw 'parser value must be an instance of Parser.';
        }
        this.#_parser = parser;
        if (this.sourceData){     
            this.preparse(sourceData);
            this.parse(sourceData);
        }
        return this;
    }
    
    set parser(parser){
        this.setParser(parser);
    }
        
    get parser(){
        return this.#_parser;
    }

    /**
     * Sets the series to have drilldown or not.
     * It is better to set the drilldown value prior to setting the data. Setting the drilldown value, 
     * if the source data was already added to the series, will force changing the parser and thus 
     * parsing the source data again.
     * 
     * Classes that extend Resource must implement this method,
     * if required set the parser with setParser(parser), which will force parsing the data
     * and return super.setDrilldown(value) at the end
     * 
     * @param  boolean value If true, set the series to have drilldown feature.
     * @return Result      Returns this object.
     */
    setDrilldown(value){
        this.#_logger.debug("setting drilldown to " + value);
        if (typeof value !== "boolean"){
            this.#_logger.fatal("attribute value must be a boolean.");
            throw 'drilldown value must be a boolean.';
        }
        this.#_drilldown = value;
        return this;
    }

    set drilldown(value){
        this.setDrilldown(value);
    }

    get drilldown(){
        this.#_logger.debug("getting drilldown.");
        return this.#_drilldown;
    }

    preparse(sourceData){
        this.#_logger.fatal("'this preparse() method should never execute, specializations of Result need to overload it.'");
        throw 'This method should not be called, implementations need to overload it.';        
    }    
        
    parse(sourceData){
        this.#_logger.fatal("'this parse() method should never execute, specializations of Result need to overload it.'");
        throw 'This method should not be called, implementations need to overload it.';
    }

    get multipleSeries(){
        return false;
    }

    /*
     * This MouseDownEvent is specific for Highcharts.
     */
    /**
     * 
     * @param {Highchart} targetChart 
     */
    getMousedownEvent(targetChart){
        this.#_logger.debug("getMousedownEvent");
        let logger = this.#_logger;
        if (!this.multipleSeries){
            this.#_logger.debug("retrieving default mousedown event on charts.");
            return function(e) {
                logger.trace("Default mouse down event on chart.");
            };    
        }
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
            handlers.push(Highcharts.addEvent(document, 'mousemove', drag));
            handlers.push(Highcharts.addEvent(document, 'touchmove', drag));
            handlers.push(Highcharts.addEvent(document, 'mouseup', unbindAll));
            handlers.push(Highcharts.addEvent(document, 'touchend', unbindAll));
            logger.trace(eStart.toString());
        };  
    }
}


module.exports = {
    Result: Result
  };

export {Result};