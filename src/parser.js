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