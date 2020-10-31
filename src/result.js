import {Logger, ResultSeriesType, GeneType, Common} from './common';
import {Parser, DrilldownParser} from "./parser";

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
        if (this.#_parser){
            this.preparse(sourceData);
            this.parse(sourceData);
            this.postparse(sourceData);
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
        if (this.#_rawResult){     
            this.preparse(sourceData);
            this.parse(sourceData);
            this.postparse(sourceData);
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

    postparse(sourceData){
        this.#_logger.fatal("'this preparse() method should never execute, specializations of Result need to overload it.'");
        throw 'This method should not be called, implementations need to overload it.';        
    }

    get multipleSeries(){
        return false;
    }

}


module.exports = {
    Result: Result
  };

export {Result};