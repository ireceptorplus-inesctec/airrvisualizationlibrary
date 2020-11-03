import {Logger} from './common';
import {Parser} from "./parser";

/**
 * @description Abstract class, should not be instanciated.
 * @class Result
 */
class Result {
    #_logger;
    #_rawResult;

    #_drilldown;

    #_parser;
    
    /**
     * 
     * @param {JSON} sourceData AN AIRR Data JSON file.
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
     * @description Returns a default value for multiple series in this Result. Subclasses should overload this.
     * @readonly
     * @memberof Result
     */
    get multipleSeries(){
        return false;
    }
    
    /**
     * @description set the AIRR Data JSON file.
     * @memberof Result
     */
    set data(sourceData){
        this.setData(sourceData);
    }
    
    /**
     * @description get the AIRR Data JSON file associated with this Result.
     * @memberof Result
     */
    get data(){
        return this.#_rawResult;
    }

    /**
     * @description Sets the AIRR Data JSON file and return this Result object.
     * @param {JSON} sourceData AN AIRR Data JSON file.
     * @returns {Result} returns this Result object 
     * @memberof Result
     */
    setData(sourceData) {
        this.#_rawResult = sourceData;  
        this.#_logger.debug("setData.");
        this.parse();
        //this.parseSingleRepertoireStatsData(sourceData);
        return this;
    }
    
    /**
     * @description set the parser fo AIRR Data JSON file.
     * @param {Parser} parser a Parser subclass
     * @memberof Result
     */
    set parser(parser){
        this.setParser(parser);
    }
        
    /**
     * @description gets the parser for this Result.
     * @memberof Result
     */
    get parser(){
        return this.#_parser;
    }

    /**
     * Setting the parser after setting the source data will result in a new parsing execution.
     * This method is called internally by Classes that extend Result
     * 
     * @description Sets the specific Parser subclass to be used to parse the source airr data in this Result and returns this Result object.
     * @param {Parser} parser a Parser subclass
     * @returns {Result} return this Result object 
     * @memberof Result
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
     * Sets the series to have drilldown or not.
     * It is better to set the drilldown value prior to setting the data. When setting the drilldown value, 
     * if the source data was already added to the series, will force changing the parser and thus 
     * parsing the source data again.
     * 
     * Classes that extend Resource must overload this method,
     * if required set the parser with setParser(parser), which will force parsing the data
     * and return super.setDrilldown(value) at the end
     * 
     * @param {boolean} value If true, set the series to have drilldown feature.
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
    
    /**
     * @description set the value for drilldown.
     * @param {boolean} value If true, set the series to have drilldown feature.
     * @memberof Result
     */
    set drilldown(value){
        this.setDrilldown(value);
    }
        
    /**
     * @description gets the drilldown value of this Result.
     * @memberof Result
     */
    get drilldown(){
        this.#_logger.debug("getting drilldown.");
        return this.#_drilldown;
    }

    /**
     * @description Execute required validations and starts the parsing of the data. Result subclasses may overload this method only if required.
     * @memberof Result
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
     * @param {JSON} sourceData An Airr Data Commons JSON file
     * @memberf Result
     */
    preparse(sourceData){
        this.#_logger.fatal("this preparse() method should never execute, specializations of Result need to overload it.");
        throw 'This method should not be called, implementations need to overload it.';        
    }    
    
    /**
     * @description onparse() method executes the data parsing from the Airr Data Commons file to the internal ResultSeries. Result subclasses need to overload this method.
     * @param {JSON} sourceData An Airr Data Commons JSON file
     * @memberof Result
     */
    onparse(sourceData){
        this.#_logger.fatal("this parse() method should never execute, specializations of Result need to overload it.");
        throw 'This method should not be called, implementations need to overload it.';
    }

    /**
     * @description postparse() method holds all the actions required to be executed after the parsing of the data ends. Result subclasses need to overload this method.
     * @param {JSON} sourceData An Airr Data Commons JSON file
     * @memberof Result
     */
    postparse(sourceData){
        this.#_logger.fatal("this preparse() method should never execute, specializations of Result need to overload it.");
        throw 'This method should not be called, implementations need to overload it.';        
    }

}


module.exports = {
    Result: Result
  };

export {Result};