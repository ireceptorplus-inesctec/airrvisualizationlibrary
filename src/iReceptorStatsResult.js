// Import and export other modules from AIIR Visualization Library
import {Logger, GeneType} from './common.js';
import {Properties} from './properties.js';
import {Result} from './result.js';
import {JunctionLenghtStatsParser, GeneUsageStatsParser, GeneUsageDrilldownStatsParser, JGeneUsageDrilldownStatsParser, CountStatsParser} from "./iReceptorStatsParser.js";


class StatsResult extends Result{
    constructor(data = undefined){
        super(data);
    }
}

class CountStatsResult extends StatsResult {
    #_logger;

    // Array of ResultSeries
    #_drilldownSeries;
    
    #_multipleSeries;

    #_defaultProperties;

    constructor(data = undefined) {
        super(data);
        this.#_logger = new Logger('CountStatsResult');
        this.#_logger.debug("Constructor.");
   
        this.#_drilldownSeries = {series: []};
        this.#_multipleSeries = false;

        
        this.#_defaultProperties = new Properties().setTitle("Count").setYLabel("Count");

        this.setParser(new CountStatsParser());
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
        //FIXME: Forcing for debug and tests.
        // return false;
        return this.parser.isMultipleSeries();
    }
    /*
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
    */
}

class JunctionLengthStatsResult extends StatsResult {
    #_logger;

    // Array of ResultSeries
    #_drilldownSeries;
    
    #_multipleSeries;

    #_defaultProperties;

    constructor(data = undefined) {
        super(data);
        this.#_logger = new Logger('JunctionLengthStatsResult');
        this.#_logger.debug("Constructor.");
   
        this.#_drilldownSeries = {series: []};
        this.#_multipleSeries = false;

        
        this.#_defaultProperties = new Properties().setTitle("Junction Length").setYLabel("Percentage");

        this.setParser(new JunctionLenghtStatsParser());
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
        //FIXME: Forcing for debug and tests.
        return false;
        //return this.parser.isMultipleSeries();
    }
    /*
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
    */
}

class GeneUsageStatsResult extends StatsResult {
    #_logger;
    
    #_geneType;
    
    #_defaultProperties;
    
    constructor(type, data = undefined) {
        super(data);
        this.#_logger = new Logger('GeneUsageStatsResult');
        this.#_logger.debug("Constructor.");
        if (!GeneType.contains(type)){
            logger.fatal('type must exist in GeneType.genes');
            throw 'type must exist in GeneType.genes';
        }
        this.#_geneType = type;            
        
        this.#_defaultProperties = new Properties().setTitle("IR+ Repertoire Stats").setSubtitle("Subgroups").setYLabel("Count");


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
    /*
    preparse(sourceData){
        this.#_logger.debug("preparse.");
        this.parser.preparse(sourceData);
    }   
           
    onparse (data){
        this.#_logger.debug("parse.");
        this.parser.onparse(data);
    }

    postparse(sourceData){
        this.#_logger.debug("postparse.");  
        //TODO:Get Properties from parser and update this.#_defaultProperties
    }
    */
}

class VGeneUsageStatsResult extends GeneUsageStatsResult {
    #_logger;
    
    constructor(data = undefined) {
        super(GeneType.V_GENE, data);
        this.#_logger = new Logger('VGeneUsageStatsResult');
        this.#_logger.debug("Constructor.");
    }
    
    setDrilldown(value){
        this.#_logger.debug("setting drilldown to " + value);
        if (this.drilldown == value)
            return this;
        super.setDrilldown(value);
        return this.setParser(this.drilldown ? new GeneUsageDrilldownStatsParser(GeneType.V_GENE) : new GeneUsageStatsParser(GeneType.V_GENE));
    }
}

class DGeneUsageStatsResult extends GeneUsageStatsResult {
    #_logger;
    
    constructor(data = undefined) {
        super(GeneType.D_GENE, data);
        this.#_logger = new Logger('DGeneUsageStatsResult');
        this.#_logger.debug("Constructor.");
    }
    
    setDrilldown(value){
        this.#_logger.debug("setting drilldown to " + value);
        if (this.drilldown == value)
            return this;
        super.setDrilldown(value);
        return this.setParser(this.drilldown ? new GeneUsageDrilldownStatsParser(GeneType.D_GENE) : new GeneUsageStatsParser(GeneType.D_GENE));
    }
}

class JGeneUsageStatsResult extends GeneUsageStatsResult {
    #_logger;
    
    constructor(data = undefined) {
        super(GeneType.J_GENE, data);
        this.#_logger = new Logger('JGeneUsageStatsResult');
        this.#_logger.debug("Constructor.");
        
        // GeneStatsResult constructor already set the default Parser.
        // Only force the change on the parser if this.drilldown is true because parser with drilldown capabilities is specific for J Gene.
        if (this.drilldown){
            //TODO: Factory for GeneStatsParser that receives the GeneType and drilldown value?
            this.setParser(new JGeneUsageDrilldownStatsParser(GeneType.J_GENE));
        }
    }
    
    setDrilldown(value){
        this.#_logger.debug("setting drilldown to " + value);
        if (this.drilldown == value)
            return this;
        super.setDrilldown(value);
        return this.setParser(this.drilldown ? new JGeneUsageDrilldownStatsParser(GeneType.J_GENE) : new GeneUsageStatsParser(GeneType.J_GENE));
    }



}

class CGeneUsageStatsResult extends GeneUsageStatsResult {
    #_logger;
    
    constructor(data = undefined) {
        super(GeneType.C_GENE, data);
        this.#_logger = new Logger('CGeneUsageStatsResult');
        this.#_logger.debug("Constructor.");
    }
    
    setDrilldown(value){
        this.#_logger.debug("setting drilldown to " + value);
        if (this.drilldown == value)
            return this;
        super.setDrilldown(value);
        return this.setParser(this.drilldown ? new GeneUsageDrilldownStatsParser(GeneType.C_GENE) : new GeneUsageStatsParser(GeneType.C_GENE));
    }


}

export {JunctionLengthStatsResult, CountStatsResult, GeneUsageStatsResult, VGeneUsageStatsResult, DGeneUsageStatsResult, JGeneUsageStatsResult, CGeneUsageStatsResult};