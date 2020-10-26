// Import and export other modules from AIIR Visualization Library
import {Logger, GeneType} from './common';
import {Properties} from './properties';
import {Result} from './result';
import {JunctionLenghtParser, GeneUsageStatsParser, GeneUsageDrilldownStatsParser} from "./iReceptorStatsParser";


class StatsResult extends Result{
    constructor(data = undefined){
        super(data);
    }
}

class JunctionLenghtResult extends StatsResult {
    #_logger;

    // Array of ResultSeries
    #_drilldownSeries;
    
    #_multipleSeries;

    #_defaultProperties;

    constructor(data = undefined) {
        super(data);
        this.#_logger = new Logger('JunctionLenghtResult');
        this.#_logger.debug("Constructor.");
   
        this.#_drilldownSeries = {series: []};
        this.#_multipleSeries = false;

        
        this.#_defaultProperties = new Properties().setTitle("Junction Length").setYLabel("Count").setStackingType("normal");

        this.setParser(new JunctionLenghtParser());
    }

    get series(){
        this.#_logger.debug("getting series.");
        return this.parser.series;
    }

    get drilldownSeries(){
        this.#_logger.debug("getting drilldown series.");
        return this.parser.drilldownSeries;
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
           
    parse (sourceData){
        this.#_logger.debug("parse.");
        this.parser.parse(sourceData);
    }
}

class GeneStatsResult extends StatsResult {
    #_logger;
    
    #_geneType;
    
    #_defaultProperties;
    
    constructor(type, data = undefined) {
        super(data);
        this.#_logger = new Logger('GeneStatsResult');
        this.#_logger.debug("Constructor.");
        if (!GeneType.contains(type)){
            logger.fatal('type must exist in GeneType.genes');
            throw 'type must exist in GeneType.genes';
        }
        this.#_geneType = type;            
        
        this.#_defaultProperties = new Properties().setTitle("IR+ Repertoire Stats").setSubtitle("Families").setYLabel("Count");


        //Default parser depends on the value of this.drilldown (either GeneUsageStatsParser or GeneUsageDrilldownStatsParser).

        this.setParser(this.drilldown ? new GeneUsageDrilldownStatsParser(type) : new GeneUsageStatsParser(type));
    }

    get series(){
        this.#_logger.debug("getting series.");
        return this.parser.series;
    }

    get drilldownSeries(){
        this.#_logger.debug("getting drilldown series.");
        return this.parser.drilldownSeries;
    }

    /* 
     * Drillup and drilldown events are specific for Highcharts.
     * they may need to be set at Chart level.
     * Same for MouseDownEvents (that are specific for each visualization library)
     */
    get drillupSeriesEvent(){
        return this.parser.drillupSeriesEvent;
    }
    
    get drilldownSeriesEvent(){
        this.#_logger.debug("requested drilldown event");
        return this.parser.drilldownSeriesEvent;          
    }
    
    get properties(){
        return this.#_defaultProperties;
    }
       
    get multipleSeries(){
        return this.parser.multipleSeries;
    }
        
    isMultipleSeries(){
        return this.parser.multipleSeries;
    }
    
    setDrilldown(value){
        this.#_logger.debug("setting drilldown to " + value);
        if (this.drilldown == value)
            return this;
        super.setDrilldown(value);
        return this.setParser(this.drilldown ? new GeneUsageDrilldownStatsParser(this.#_geneType) : new GeneUsageStatsParser(this.#_geneType));
    }

    preparse(sourceData){
        this.#_logger.debug("preparse.");
        this.parser.preparse(sourceData);
    }   
           
    parse (data){
        this.#_logger.debug("parse.");
        this.parser.parse(data);
    }
}

class VGeneStatsResult extends GeneStatsResult {
    #_logger;
    
    constructor(data = undefined) {
        super(GeneType.V_GENE, data);
        this.#_logger = new Logger('VGeneStatsResult');
        this.#_logger.debug("Constructor.");
    }
}


class DGeneStatsResult extends GeneStatsResult {
    #_logger;
    
    constructor(data = undefined) {
        super(GeneType.D_GENE, data);
        this.#_logger = new Logger('VGeneStatsResult');
        this.#_logger.debug("Constructor.");
    }
}


class JGeneStatsResult extends GeneStatsResult {
    #_logger;
    
    constructor(data = undefined) {
        super(GeneType.J_GENE, data);
        this.#_logger = new Logger('VGeneStatsResult');
        this.#_logger.debug("Constructor.");
    }
}


module.exports = {
    JunctionLenghtResult: JunctionLenghtResult,
    GeneStatsResult: GeneStatsResult,
    VGeneStatsResult: VGeneStatsResult,
    DGeneStatsResult: DGeneStatsResult,
    JGeneStatsResult: JGeneStatsResult
  };

export {JunctionLenghtResult};