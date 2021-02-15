// Import and export other modules from AIIR Visualization Library
import {Logger, ResultSeriesType} from './common.js';
import {Properties} from './properties.js';
import {Result} from './result.js';
import {ImmuneDbCloneCountParser, ImmuneDBGeneTopCountStatsParser} from "./immuneDbParser.js";



class ImmuneDbTopCountStatsResult extends Result {
    #_logger;

    // Array of ResultSeries
    #_drilldownSeries;


    //#_defaultProperties;

    //constructor(data = undefined) {
    //    super(data);
    constructor() {
        super();
        this.#_logger = new Logger('ImmuneDbCloneCountResult');
        this.#_logger.debug("Constructor.");
   
        this.#_drilldownSeries = {series: []};
        
        //this.#_defaultProperties = new Properties().setTitle("Fraction of Top n clones").setYLabel("Fraction (copies in subject/whole repertoire)").setStackingType("normal");
        this.properties.setTitle("Fraction of Top n clones").setGrouping(false);
        
        this.setParser(new ImmuneDBGeneTopCountStatsParser());
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
        if (!this.drilldown || this.isMultipleSeries()){
            let emptyDrilldownObject = {series: []};
            this.#_logger.trace(JSON.stringify(emptyDrilldownObject));
            return emptyDrilldownObject;
        }       
        this.#_logger.trace(JSON.stringify(this.#_drilldownSeries));
        return this.#_drilldownSeries;
    }
            
    isMultipleSeries(){
        return this.parser.isMultipleSeries();
    }

    update(properties){
        this.#_logger.debug("update");
        if (this.properties.dataDrilldown == properties.dataDrilldown)
            return this;
        this.properties.setDataDrilldown(properties.dataDrilldown);
        return this.setParser(new ImmuneDBGeneTopCountStatsParser());
     }
}

class ImmuneDbCloneCountResult extends Result {
    #_logger;

    // Array of ResultSeries
    #_drilldownSeries;
    
    #_multipleSeries;

    //#_defaultProperties;

    //constructor(data = undefined) {
    //    super(data);
    constructor() {
        super();
        this.#_logger = new Logger('ImmuneDbCloneCountResult');
        this.#_logger.debug("Constructor.");
   
        this.#_drilldownSeries = {series: []};
        this.#_multipleSeries = false;

        
        //this.#_defaultProperties = new Properties().setTitle("Fraction of Top n clones").setYLabel("Fraction (copies in subject/whole repertoire)").setStackingType("normal");
        this.properties.setTitle("Fraction of Top n clones").setYLabel("Fraction (copies in subject/whole repertoire)").setStackingType("normal");

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
            
    isMultipleSeries(){
        return this.#_multipleSeries;
    }

    update(properties){
        this.#_logger.debug("update");
        if (this.properties.dataDrilldown == properties.dataDrilldown)
            return this;
        this.properties.setDataDrilldown(properties.dataDrilldown);
        return this.setParser(new ImmuneDbCloneCountParser());
     }
}

/*
module.exports = {
    ImmuneDbCloneCountResult: ImmuneDbCloneCountResult
};
*/

export {ImmuneDbCloneCountResult, ImmuneDbTopCountStatsResult};