// Import and export other modules from AIIR Visualization Library
import {Logger, ResultSeriesType} from './common';
import {Properties} from './properties';
import {Result} from './result';
import {ImmuneDbCloneCountParser} from "./immuneDbParser";



class ImmuneDbCloneCountResult extends Result {
    #_logger;

    // Array of ResultSeries
    #_drilldownSeries;
    
    #_multipleSeries;

    #_defaultProperties;

    constructor(data = undefined) {
        super(data);
        this.#_logger = new Logger('ImmuneDbCloneCountResult');
        this.#_logger.debug("Constructor.");
   
        this.#_drilldownSeries = {series: []};
        this.#_multipleSeries = false;

        
        this.#_defaultProperties = new Properties().setTitle("Fraction of Top n clones").setYLabel("Fraction (copies in subject/whole repertoire)").setStackingType("normal");

        this.setParser(new ImmuneDbCloneCountParser());
    }

    get series(){
        this.#_logger.debug("getting series.");
        //TODO: I may need to get the properties to know how to build the series to return.
        //At the moment I'm returning two series directly from the parser. This may have to change according to properties content.
        return this.parser.series;
    }

    get drilldownSeries(){
        this.#_logger.debug("getting drilldown series.");
        // We need to know if we are applying an event function or a drilldown object.
        // If we need to drilldown within multiple series, then our only option is to use drilldown event. Then we need to return an empty drilldown object.
        // If we have only one series to drill on, we can (and its better to) use the drilldown object.
        // If we don't apply drilldown, return an empty drilldown object.
        if (!this.drilldown || this.#_multipleSeries){
            let emptyDrilldownObject = {series: []};
            this.#_logger.trace(JSON.stringify(emptyDrilldownObject));
            return emptyDrilldownObject;
        }       
        this.#_logger.trace(JSON.stringify(this.#_drilldownSeries));
        return this.#_drilldownSeries;
    }
    
    get properties(){
        return this.#_defaultProperties;
    }
        
    isMultipleSeries(){
        return this.#_multipleSeries;
    }

    preparse(sourceData){
        this.#_logger.debug("preparse.");
        this.parser.preparse(sourceData);
    }   
           
    onparse (sourceData){
        this.#_logger.debug("parse.");
        this.parser.onparse(sourceData);
    }

    postparse(sourceData){
        this.#_logger.debug("postparse.");  
        //TODO:Get Properties from parser and update this.#_defaultProperties
    }
}


module.exports = {
    ImmuneDbCloneCountResult: ImmuneDbCloneCountResult
  };

export {ImmuneDbCloneCountResult};