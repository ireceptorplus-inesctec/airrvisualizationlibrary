// Import and export other modules from AIIR Visualization Library
import {Logger, GeneType} from './common.js';
//import {Properties} from './properties.js';
import {Result} from './result.js';
import {JunctionLenghtStatsParser, GeneUsageStatsParser, GeneUsageDrilldownStatsParser, JGeneUsageDrilldownStatsParser, CountStatsParser} from "./iReceptorStatsParser.js";

/**
 * Abstract class that represents a StatsResult.  
 * A StatsResult stores the original data source, the specific {@link Parser} object and the logic for returning a representation of the data to be plotted.
 * @abstract
 */
class StatsResult extends Result{
    /**
     * @description Creates an instance of StatsResult.
     * @param {JSON} [sourceData=undefined] AN AIRR Data JSON file
     */
    //constructor(data = undefined){
        //super(data);
    constructor(){
        super();
    }
}

class CountStatsResult extends StatsResult {
    #_logger;
    // Array of ResultSeries
    //#_drilldownSeries;
    //#_multipleSeries;

    static get TITLE(){return "Count"};
    static get Y_LABEL(){return "Count"};

    //constructor(data = undefined) {
        //super(data);
    constructor() {
        super();
        this.#_logger = new Logger('CountStatsResult');
        this.#_logger.debug("Constructor.");
   
        //this.#_drilldownSeries = {series: []};
        //this.#_multipleSeries = false;

        //Set default properties for CountStatsResult   
        this.properties.setTitle(CountStatsResult.TITLE).setYLabel(CountStatsResult.Y_LABEL);

        this.setParser(new CountStatsParser());
    }

    get drilldownSeries(){
        this.#_logger.debug("getting drilldown series.");
        return this.parser.drilldownSeries;
    }
        
    isMultipleSeries(){
        //FIXME: Forcing for debug and tests.
        // return false;
        return this.parser.isMultipleSeries();
    }
    
    update(properties){
        this.#_logger.debug("update");
        if (this.properties.dataDrilldown == properties.dataDrilldown)
            return this;
        this.properties.setDataDrilldown(properties.dataDrilldown);
        return this.setParser(new CountStatsParser());
     }
}

class JunctionLengthStatsResult extends StatsResult {
    #_logger;
    // Array of ResultSeries
    //#_drilldownSeries;
    //#_multipleSeries;

    static get TITLE(){return "Junction Length"};
    static get Y_LABEL(){return "Percentage"};

    //constructor(data = undefined) {
        //super(data);
    constructor() {
        super();
        this.#_logger = new Logger('JunctionLengthStatsResult');
        this.#_logger.debug("Constructor.");
   
        //this.#_drilldownSeries = {series: []};
        //this.#_multipleSeries = false;

        
        //Set default properties for JunctionLengthStatsResult   
        this.properties.setTitle("Junction Length");

        this.setParser(new JunctionLenghtStatsParser());
    }

    get drilldownSeries(){
        this.#_logger.debug("getting drilldown series.");
        return this.parser.drilldownSeries;
    }
        
    isMultipleSeries(){
        //FIXME: Forcing for debug and tests.
        return false;
        //return this.parser.isMultipleSeries();
    }

    update(properties){
        this.#_logger.debug("update");
        if (this.properties.dataDrilldown == properties.dataDrilldown)
            return this;
        this.properties.setDataDrilldown(properties.dataDrilldown);
        return this.setParser(new JunctionLenghtStatsParser());
     }
}

/**
 * Abstract class for Gene Usage Stats Result
 * @abstract
 * @extends {StatsResult}
 */
class GeneUsageStatsResult extends StatsResult {
    #_logger;
    
    #_geneType;
    
    //constructor(type, data = undefined) {
        //super(data);
    constructor(type) {
        super();
        this.#_logger = new Logger('GeneUsageStatsResult');
        this.#_logger.debug("Constructor.");
        if (!GeneType.contains(type)){
            logger.fatal('type must exist in GeneType.genes');
            throw 'type must exist in GeneType.genes';
        }
        this.#_geneType = type;            
        
        this.properties.setTitle("IR+ Repertoire Stats").setSubtitle("Subgroups").setYLabel("Count");


        //Default parser depends on the value of this.drilldown (either GeneUsageStatsParser or GeneUsageDrilldownStatsParser).
        this.setParser(this.drilldown ? new GeneUsageDrilldownStatsParser(type) : new GeneUsageStatsParser(type));
    }

    get drilldownSeries(){
        this.#_logger.debug("getting drilldown series.");
        return this.parser.drilldownSeries;
    }
       
    get multipleSeries(){
        return this.parser.multipleSeries;
    }
        
    isMultipleSeries(){
        return this.parser.multipleSeries;
    }
}

class VGeneUsageStatsResult extends GeneUsageStatsResult {
    #_logger;
    
    //constructor(data = undefined) {
        //super(GeneType.V_GENE, data);
    constructor() {
        super(GeneType.V_GENE);
        this.#_logger = new Logger('VGeneUsageStatsResult');
        this.#_logger.debug("Constructor.");
    }

    /*
    setDrilldown(value){
        this.#_logger.debug("setting drilldown to " + value);
        if (this.drilldown == value)
            return this;
        super.setDrilldown(value);
        return this.setParser(this.drilldown ? new GeneUsageDrilldownStatsParser(GeneType.V_GENE) : new GeneUsageStatsParser(GeneType.V_GENE));
    }
    */
   update(properties){
       this.#_logger.debug("update");
       if (this.properties.dataDrilldown == properties.dataDrilldown)
       return this;
       //super.setDrilldown(value);
       this.properties.setDataDrilldown(properties.dataDrilldown);
       return this.setParser(this.drilldown ? new GeneUsageDrilldownStatsParser(GeneType.V_GENE) : new GeneUsageStatsParser(GeneType.V_GENE));
    }

}

class DGeneUsageStatsResult extends GeneUsageStatsResult {
    #_logger;
    
    //constructor(data = undefined) {
        //super(GeneType.D_GENE, data);
    constructor() {
        super(GeneType.D_GENE);
        this.#_logger = new Logger('DGeneUsageStatsResult');
        this.#_logger.debug("Constructor.");
    }
    
    /*
    setDrilldown(value){
        this.#_logger.debug("setting drilldown to " + value);
        if (this.drilldown == value)
            return this;
        super.setDrilldown(value);
        return this.setParser(this.drilldown ? new GeneUsageDrilldownStatsParser(GeneType.D_GENE) : new GeneUsageStatsParser(GeneType.D_GENE));
    }
    */
   update(properties){
       this.#_logger.debug("update");
       if (this.properties.dataDrilldown == properties.dataDrilldown)
       return this;
       //super.setDrilldown(value);
       this.properties.setDataDrilldown(properties.dataDrilldown);
       return this.setParser(this.drilldown ? new GeneUsageDrilldownStatsParser(GeneType.D_GENE) : new GeneUsageStatsParser(GeneType.D_GENE));
     }
}

class JGeneUsageStatsResult extends GeneUsageStatsResult {
    #_logger;
    
    //constructor(data = undefined) {
        //super(GeneType.J_GENE, data);
    constructor() {
        super(GeneType.J_GENE);
        this.#_logger = new Logger('JGeneUsageStatsResult');
        this.#_logger.debug("Constructor.");
        
        // GeneStatsResult constructor already set the default Parser.
        // Only force the change on the parser if this.drilldown is true because parser with drilldown capabilities is specific for J Gene.
        if (this.drilldown){
            //TODO: Factory for GeneStatsParser that receives the GeneType and drilldown value?
            this.setParser(new JGeneUsageDrilldownStatsParser(GeneType.J_GENE));
        }
    }

    /*
    setDrilldown(value){
        this.#_logger.debug("setting drilldown to " + value);
        if (this.drilldown == value)
            return this;
        super.setDrilldown(value);
        return this.setParser(this.drilldown ? new JGeneUsageDrilldownStatsParser(GeneType.J_GENE) : new GeneUsageStatsParser(GeneType.J_GENE));
    }
    */
   update(properties){
       this.#_logger.debug("update");
       if (this.properties.dataDrilldown == properties.dataDrilldown)
       return this;
       //super.setDrilldown(value);
       this.properties.setDataDrilldown(properties.dataDrilldown);
       return this.setParser(this.drilldown ? new JGeneUsageDrilldownStatsParser(GeneType.J_GENE) : new GeneUsageStatsParser(GeneType.J_GENE));
    }



}

class CGeneUsageStatsResult extends GeneUsageStatsResult {
    #_logger;
    
    //constructor(data = undefined) {
        //super(GeneType.C_GENE, data);
    constructor() {
        super(GeneType.C_GENE);
        this.#_logger = new Logger('CGeneUsageStatsResult');
        this.#_logger.debug("Constructor.");
    }
    
    /*
    setDrilldown(value){
        this.#_logger.debug("setting drilldown to " + value);
        if (this.drilldown == value)
            return this;
        super.setDrilldown(value);
        return this.setParser(this.drilldown ? new GeneUsageDrilldownStatsParser(GeneType.C_GENE) : new GeneUsageStatsParser(GeneType.C_GENE));
    }
    */
    update(properties){
        this.#_logger.debug("update");
        if (this.properties.dataDrilldown == properties.dataDrilldown)
            return this;
        //super.setDrilldown(value);
        this.properties.setDataDrilldown(properties.dataDrilldown);
        return this.setParser(this.drilldown ? new GeneUsageDrilldownStatsParser(GeneType.C_GENE) : new GeneUsageStatsParser(GeneType.C_GENE));
    }


}

export {JunctionLengthStatsResult, CountStatsResult, GeneUsageStatsResult, VGeneUsageStatsResult, DGeneUsageStatsResult, JGeneUsageStatsResult, CGeneUsageStatsResult};