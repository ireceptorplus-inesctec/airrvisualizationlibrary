// Import and export other modules from AIIR Visualization Library
import {Logger, ResultSeriesType, GeneType} from './common.js';

/**
 * Abstract Parser class
 * @abstract
 */
class Parser {
    //TODO: Parser should have a properties object that is updated acording to data parsing. This properties will be sync with Result's default properties to build the visualization.
    #_logger;
    #_series;

    /**
     * @description Creates an instance of Parser.
     */
    constructor(){
        if (this.constructor === Parser) {
            // Abstract class can not be constructed.
            throw new TypeError("Can not construct abstract class.");
        }//else (called from child)
        // Check if all instance methods are implemented.
        if (this.preparse === Parser.prototype.preparse) {
            // Child has not implemented this abstract method.
            throw new TypeError("Please implement abstract method preparse.");
        }
        if (this.onparse === Parser.prototype.onparse) {
            // Child has not implemented this abstract method.
            throw new TypeError("Please implement abstract method onparse.");
        }
        if (this.postparse === Parser.prototype.postparse) {
            // Child has not implemented this abstract method.
            throw new TypeError("Please implement abstract method postparse.");
        }
        this.#_logger = new Logger('Parser');
        this.#_series = [];
    }

    /**
     * @description returns this.getSeries()
     * @type ResultSeries[]
     */
    get series(){
        return this.getSeries();
    }

    /**
     * Array of {@link ResultSeries}
     * @description the main series for the chart
     * @returns {ResultSeries[]}
     */
    getSeries(){
        this.#_logger.debug("getting series.");
        return this.#_series;
    }

    /**
     * @description preparse() method holds all the actions required to be executed before the parsing of the data starts. Parser subclasses need to overwrite this method.
     * @param {JSON} sourceData An Airr Data Commons JSON file
     * @throws Error is called directly on Parser class.
     * @abstract
     */
    preparse(sourceData){
        this.#_logger.fatal("this preparse() method should never execute, specializations of Result need to overload it.");
        throw 'This method should not be called, implementations need to overload it.';        
    }    
    
    /**
     * @description onparse() method executes the data parsing from the Airr Data Commons file to the internal ResultSeries. Parser subclasses need to overwrite this method.
     * @param {JSON} sourceData An Airr Data Commons JSON file
     * @throws Error is called directly on Parser class.
     * @abstract
     */
    onparse(sourceData){
        this.#_logger.fatal("this parse() method should never execute, specializations of Result need to overload it.");
        throw 'This method should not be called, implementations need to overload it.';
    }

    /**
     * @description postparse() method holds all the actions required to be executed after the parsing of the data ends. Parser subclasses need to overwrite this method.
     * @param {JSON} sourceData An Airr Data Commons JSON file
     * @throws Error is called directly on Parser class.
     * @abstract
     */
    postparse(sourceData){
        this.#_logger.fatal("this preparse() method should never execute, specializations of Result need to overload it.");
        throw 'This method should not be called, implementations need to overload it.';        
    }
}

/**
 * Abstract DrilldownParser class
 * @abstract
 * @extends Parser
 */
class DrilldownParser extends Parser {
    #_logger;    
    #_drilldownSeries;

    /**
     * @description Creates an instance of DrilldownParser.
     */
    constructor(){
        super();
        if (this.constructor === DrilldownParser) {
            // Abstract class can not be constructed.
            throw new TypeError("Can not construct abstract class.");
        }//else (called from child)
        this.#_logger = new Logger('DrilldownParser');
        this.#_drilldownSeries = [];
    }
    
    /**
     * Array of ResultSeries, if unused returns an empty array.
     * @description the series used for drilldown
     * @type ResultSeries[]
     */
    get drilldownSeries(){
        this.#_logger.debug("getting drilldownSeries.");
        return this.#_drilldownSeries;
    }

}

export {Parser, DrilldownParser};