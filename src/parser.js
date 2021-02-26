// Import and export other modules from AIIR Visualization Library
import {Logger, ResultSeriesType, GeneType} from './common.js';
import { Properties } from './properties.js';

/**
 * Abstract Parser class
 * @abstract
 */
class Parser {
    #_logger;
    //#_series;
    //Parser should have a properties object that is updated acording to data parsing. This properties will be sync with Result's default properties to build the visualization.
    #_properties

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
        if (this.getSeries === Parser.prototype.getSeries) {
            // Child has not implemented this abstract method.
            throw new TypeError("Please implement abstract method getSeries.");
        }
        this.#_logger = new Logger('Parser');
        //this.#_series = undefined;
        this.#_properties = new Properties();
    }

    /**
     * @description the parser properties. Undefined if no parsed data.
     * @readonly
     * @type Properties
     */
    get properties(){
        return this.getProperties();
    }

    /**
     * 
     * @description returns a {@link Properties} with metadata retrieved from the parsed data. It is undefined if no data parsed.
     * @returns {Properties}
     */
    getProperties(){
        this.#_logger.debug("getting properties.");
        return this.#_properties;
    }

    /**
     * @description returns this.getSeries()
     * @readonly
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
        this.#_logger.fatal("this getSeries() method should never execute, specializations of Result need to overload it.");
        throw new TypeError('This method should not be called, implementations need to overload it.'); 
    }

    /**
     * @description preparse() method holds all the actions required to be executed before the parsing of the data starts. Parser subclasses need to overwrite this method.
     * @param {Properties} properties The properties file that contains an Airr Data Commons JSON file
     * @throws Error is called directly on Parser class.
     * @abstract
     */
    preparse(properties){
        this.#_logger.fatal("this preparse() method should never execute, specializations of Result need to overload it.");
        throw new TypeError('This method should not be called, implementations need to overload it.');        
    }    
    
    /**
     * @description onparse() method executes the data parsing from the Airr Data Commons file to the internal ResultSeries. Parser subclasses need to overwrite this method.
     * @param {Properties} properties The properties file that contains an Airr Data Commons JSON file
     * @throws Error is called directly on Parser class.
     * @abstract
     */
    onparse(properties){
        this.#_logger.fatal("this parse() method should never execute, specializations of Result need to overload it.");
        throw new TypeError('This method should not be called, implementations need to overload it.');
    }
    
    /**
     * @description postparse() method holds all the actions required to be executed after the parsing of the data ends. Parser subclasses need to overwrite this method.
     * @param {Properties} properties The properties file that contains an Airr Data Commons JSON file
     * @throws Error is called directly on Parser class.
     * @abstract
     */
    postparse(properties){
        this.#_logger.fatal("this preparse() method should never execute, specializations of Result need to overload it.");
        throw new TypeError('This method should not be called, implementations need to overload it.');        
    }

    guessTheNameOfTheFather(dataItem, seriesType){
        /*if (!(dataItem instanceof ResultSeriesDataItem)){
            throw new TypeError('dataItem parameter must be an instanceOf ResultSeriesDataItem');
        }
        */
        /*
         * TODO:
         * - At first level, title should be locus/chain (e.g. IGHV)
         * - At second level, title should be family (e.g. IGHV5), back to should say "Back to IGHV"
         * - At third level, title should be gene (IGHV5-51), back to should say "Back to IGHV5"
         */

        // console.log(seriesType);
        // console.log(dataItem); 
        
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
        return this.getDrilldownSeries();
    }

    /**
     * Array of {@link ResultSeries}
     * @description the series used for drilldown
     * @returns {ResultSeries[]}
     */
    getDrilldownSeries(){
        this.#_logger.debug("getting drilldownSeries.");
        return this.#_drilldownSeries;
    }
}

export {Parser, DrilldownParser};