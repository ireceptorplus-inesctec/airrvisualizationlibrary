import {Logger} from './common.js';
import {Parser} from "./parser.js";

/**
 * Abstract class that represents a Result.  
 * A Result stores the original data source, the specific {@link Parser} object and the logic for returning a representation of the data to be plotted.
 * @abstract
 */
class Result {
    #_logger;
    #_rawResult;
    #_drilldown;
    #_parser;
    
    /**
     * @description Creates an instance of Result.
     * @param {JSON} [sourceData=undefined] AN AIRR Data JSON file
     */
    constructor(sourceData = undefined) {
        this.#_logger = new Logger('Result');
        this.#_logger.debug("Constructor.");
        this.#_rawResult = undefined;
        this.#_drilldown = false;
        this.#_parser = undefined;
        if (typeof sourceData !== "undefined" ){
            setData(sourceData);            
        }
    }

    /**
     * @description read only property that returns the same as this.isMultipleSeries().
     * @readonly
     */
    get multipleSeries(){
        return this.isMultipleSeries();
    }

    /**
     * @description Abstract method that returns true if this result contains multiple data series. Subclasses should overload this.
     * @abstract
     */
    isMultipleSeries(){
        this.#_logger.fatal("isMultipleSeries() method should never execute, specializations of Result need to overload it.");
        throw 'Result.isMultipleSeries() method should not be called, implementations need to overload it.';        
    }
    
    /**
     * @description  the AIRR Data JSON file associated with this Result.
     * @type {JSON}
     */
    get data(){
        return this.getData();
    }
    
    set data(sourceData){
        this.setData(sourceData);
    }
    
    /**
     * @description Returns the AIRR Data JSON file associated with this Result.
     * @returns {JSON} 
     */
    getData(){
        return this.#_rawResult;
    }
    
    /**
     * @description Chainable method that sets the AIRR Data JSON file and return this Result object.
     * @param {JSON} sourceData AN AIRR Data JSON file.
     * @returns {Result} the same instance on which the method was called.
     */
    setData(sourceData) {
        this.#_rawResult = sourceData;  
        this.#_logger.debug("setData.");
        this.parse();
        //this.parseSingleRepertoireStatsData(sourceData);
        return this;
    }
    
    /**
     * @description the {@link Parser} used for the interpretation of the AIRR Data JSON file.
     * @type {Parser}
     */
    get parser(){
        return this.getParser();
    }

    set parser(parser){
        this.setParser(parser);
    }

    /**
     * Setting the parser after setting the source data will result in a new parsing execution.
     * This method is called internally by Classes that extend Result
     * 
     * @description Chainable method that sets the specific {@link Parser} to be used on the interpretation of the source airr data in this Result.
     * @param {Parser} parser a Parser subclass instance
     * @returns {Result} the same instance on which the method was called.
     */
    setParser(parser) {
        this.#_logger.debug("setParser.");
        if (!(parser instanceof Parser)){
            this.#_logger.fatal("attribute parser must be an instance of Parser.");
            throw 'parser value must be an instance of Parser.';
        }
        this.#_parser = parser;
        this.parse();
        return this;
    }
    
    /**
     * @description returns the Parser for the Result
     * @returns {Parser} 
     */
    getParser(){
        return this.#_parser;
    }
        
    /**
     * @description is to implement drilldown feature on the original data?
     * @type {boolean}
     */
    get drilldown(){
        this.#_logger.debug("getting drilldown.");
        return this.#_drilldown;
    }
    
    set drilldown(value){
        this.setDrilldown(value);
    }

    /**
     * @description Sets the series to have drilldown or not.
     * It is better to set the drilldown value prior to setting the data. When setting the drilldown value, 
     * if the source data was already added to the series, will force changing the parser and thus 
     * parsing the source data again.
     * 
     * Classes that extend Resource must overload this method,
     * if required set the parser with setParser(parser), which will force parsing the data
     * and return super.setDrilldown(value) at the end
     * 
     * @param {boolean} value If true, set the series to have drilldown feature.
     * @returns {Result} the same instance on which the method was called.
     * @throws Error if value is not a boolean.
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
    
    /**
     * @description returns the true if this Result has drilldown enabled.
     * @returns {boolean} 
     */
    getDrilldown(){
        this.#_logger.debug("getting drilldown.");
        return this.#_drilldown;
    }

    /**
     * @description Execute required validations and starts the parsing of the data. Result subclasses may overload this method only if required.
     */
    parse(){
        if (!this.#_rawResult){     
            this.#_logger.trace("Can't parse, please set the Airr Data Commons data first.")
            return;
        }
        if (!this.#_parser){
            this.#_logger.trace("Can't parse, please set the parser first. Parser should be set on a Result subclass.")
            return;
        }
        this.preparse(this.#_rawResult);
        this.onparse(this.#_rawResult);
        this.postparse(this.#_rawResult);
    }

    /**
     * @description preparse() method holds all the actions required to be executed before the parsing of the data starts. Result subclasses need to overload this method.
     * @abstract
     * @param {JSON} sourceData An Airr Data Commons JSON file
     * @throws Error if this method is called directly on the Result
     */
    preparse(sourceData){
        this.#_logger.fatal("this preparse() method should never execute, specializations of Result need to overload it.");
        throw 'This method should not be called, implementations need to overload it.';        
    }    
    
    /**
     * @description onparse() method executes the data parsing from the Airr Data Commons file to the internal ResultSeries. Result subclasses need to overload this method.
     * @abstract
     * @param {JSON} sourceData An Airr Data Commons JSON file
     * @throws Error if this method is called directly on the Result
     */
    onparse(sourceData){
        this.#_logger.fatal("this parse() method should never execute, specializations of Result need to overload it.");
        throw 'This method should not be called, implementations need to overload it.';
    }

    /**
     * @description postparse() method holds all the actions required to be executed after the parsing of the data ends. Result subclasses need to overload this method.
     * @abstract
     * @param {JSON} sourceData An Airr Data Commons JSON file
     * @throws Error if this method is called directly on the Result
     */
    postparse(sourceData){
        this.#_logger.fatal("this preparse() method should never execute, specializations of Result need to overload it.");
        throw 'This method should not be called, implementations need to overload it.';        
    }

}

export {Result};