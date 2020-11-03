// Import and export other modules from AIIR Visualization Library
import {Logger, ResultSeriesType, GeneType} from './common';

/**
 * The Parser class
 * @description The Parser class
 * @author Marco Amaro Oliveira
 * @class Parser
 */
class Parser {
    //TODO: Parser should have a properties object that is updated acording to data parsing. This properties will be sync with Result's default properties to build the visualization.
    #_logger;

    /**
     * private array of ResultSeries
     * @type ResultSeries[]
     */
    #_series;

    /**
     * Creates an instance of Parser.
     * @memberof Parser
     */
    constructor(){
        this.#_logger = new Logger('Parser');
        this.#_series = [];
    }

    /**
     * Array of ResultSeries
     * @description the main series for the chart
     * @memberof Parser
     * @type ResultSeries[]
     */
    get series(){
        this.#_logger.debug("getting series.");
        return this.#_series;
    }

    /**
     * @description preparse() method holds all the actions required to be executed before the parsing of the data starts. Parser subclasses need to overwrite this method.
     * @param {JSON} sourceData An Airr Data Commons JSON file
     * @memberf Result
     */
    preparse(sourceData){
        this.#_logger.fatal("this preparse() method should never execute, specializations of Result need to overload it.");
        throw 'This method should not be called, implementations need to overload it.';        
    }    
    
    /**
     * @description onparse() method executes the data parsing from the Airr Data Commons file to the internal ResultSeries. Parser subclasses need to overwrite this method.
     * @param {JSON} sourceData An Airr Data Commons JSON file
     * @memberof Result
     */
    onparse(sourceData){
        this.#_logger.fatal("this parse() method should never execute, specializations of Result need to overload it.");
        throw 'This method should not be called, implementations need to overload it.';
    }

    /**
     * @description postparse() method holds all the actions required to be executed after the parsing of the data ends. Parser subclasses need to overwrite this method.
     * @param {JSON} sourceData An Airr Data Commons JSON file
     * @memberof Result
     */
    postparse(sourceData){
        this.#_logger.fatal("this preparse() method should never execute, specializations of Result need to overload it.");
        throw 'This method should not be called, implementations need to overload it.';        
    }
}

/**
 * The Parser class
 * @description The Parser class
 * @author Marco Amaro Oliveira
 * @class Parser
 */
class DrilldownParser extends Parser {
    #_logger;    

    /**
     * private array of ResultSeries, the series used for drilldown
     * @type ResultSeries[]
     */
    #_drilldownSeries;

    /**
     * Creates an instance of Parser.
     * @memberof Parser
     */
    constructor(){
        super();
        this.#_logger = new Logger('DrilldownParser');
        this.#_drilldownSeries = [];
    }
    
    /**
     * Array of ResultSeries, if unused returns an empty array.
     * @description the series used for drilldown
     * @author Marco Amaro Oliveira
     * @memberof Parser
     * @type ResultSeries[]
     */
    get drilldownSeries(){
        this.#_logger.debug("getting drilldownSeries.");
        return this.#_drilldownSeries;
    }

}



module.exports = {
    Parser: Parser,
    DrilldownParser: DrilldownParser
  };

export {Parser, DrilldownParser};