/**
 * A logger class.
 */
class IRplusLogger{
    
    static level = {
        ALL: 0,
        TRACE: 20,
        DEBUG: 30,
        INFO: 40,
        WARN: 50,
        ERROR: 70,
        FATAL: 90,
        OFF: 100
    };

    static get LEVEL_OFF(){
        return IRplusLogger.level.OFF;
    }

    static get LEVEL_TRACE(){
        return IRplusLogger.level.TRACE;
    }

    static get LEVEL_DEBUG(){
        return IRplusLogger.level.DEBUG;
    }

    static get LEVEL_INFO(){
        return IRplusLogger.level.INFO;
    }

    static get LEVEL_WARN(){
        return IRplusLogger.level.WARN;
    }

    static get LEVEL_ERROR(){
        return IRplusLogger.level.ERROR;
    }

    static get LEVEL_FATAL(){
        return IRplusLogger.level.FATAL;
    }
    /**
     * Static variable to set the debug level of visible messages.
     */
    static DEBUG_LEVEL = IRplusLogger.LEVEL_OFF;
    
    /**
     * Sets the debug level.
     * 
     * @param {number} level use a value between 0-100 (0:all, 100:none) or one of the IRplusLogger static constants.
     */
    static setDebugLevel(level){
        IRplusLogger.DEBUG_LEVEL = level;
    }
        
    #_source;
    
    constructor(sourceName){
        
        this.#_source = sourceName;
        
    }
    
    _datetime(){
        let d = new Date();
        d = [
            '' + d.getFullYear(),
            '0' + (d.getMonth() + 1),
            '0' + d.getDate(),
            '0' + d.getHours(),
            '0' + d.getMinutes(),
            '0' + d.getSeconds()
        ].map(component => component.slice(-2)); // take last 2 digits of every component
        // join the components into date
        return d.slice(0, 3).join('') + 'T' + d.slice(3).join('');
    }
    
    _log(type, text){
        console.log(this._datetime().concat(' ').concat(this.#_source).concat(' ').concat(type).concat(': ').concat(text));
    }
    
    trace(text){
        if (IRplusLogger.DEBUG_LEVEL <= IRplusLogger.LEVEL_TRACE){
            this._log('TRACE', text);
        }
    }
                                           
    debug(text){
        if (IRplusLogger.DEBUG_LEVEL <= IRplusLogger.LEVEL_DEBUG){
            this._log('DEBUG', text);
        }
    }
    
    info(text){
        if (IRplusLogger.DEBUG_LEVEL <= IRplusLogger.LEVEL_INFO){
            this._log('INFO', text);
        }
    }
    
    warn(text){
        if (IRplusLogger.DEBUG_LEVEL <= IRplusLogger.LEVEL_WARN){
            this._log('WARN', text);
        }
    }
    
    error(text){
        if (IRplusLogger.DEBUG_LEVEL <= IRplusLogger.LEVEL_ERROR){
            this._log('ERROR', text);
        }
    }
    
    fatal(text){
        if (IRplusLogger.DEBUG_LEVEL <= IRplusLogger.LEVEL_FATAL){
            this._log('FATAL', text);
        }
    }
}

class IRplusResultSerieType {
    
    static types = {
        FAMILY: 'f',
        GENE: 'g',
        CELL: 'c'
    };

    static get FAMILY(){
        return IRplusResultSerieType.types.FAMILY;
    }

    static get GENE(){
        return IRplusResultSerieType.types.GENE;
    }

    static get CELL(){
        return IRplusResultSerieType.types.CELL;
    }
    
    static contains(value){
        return Object.values(IRplusResultSerieType.types).includes(value);
    }
}

class IRplusGeneType{
    
    static genes = {
        V_GENE: 'v',
        D_GENE: 'd',
        J_GENE: 'j'
    };

    static get V_GENE(){
        return genes.V_GENE;
    }

    static get D_GENE(){
        return genes.D_GENE;
    }

    static get J_GENE(){
        return genes.J_GENE;
    }
    
    static contains(value){
        return Object.values(IRplusGeneType.genes).includes(value);
    }
}

class IRplusCommon {

    static get objectConstructor(){
        return ({}).constructor;
    }
    
    static makeid(length) {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
    
}

class IRplusProperties {
    #_logger;
    #_title;
    #_subtitle;
    #_xLabel;
    #_yLabel;
    #_id;
    #_sort;
                    
    constructor(){
        this.#_logger = new IRplusLogger('IRplusProperties');
        this.#_logger.debug("Constructor.");
        this.#_title = undefined;
        this.#_subtitle = undefined;
        this.#_xLabel = undefined;
        this.#_yLabel = undefined;
        this.#_id = IRplusCommon.makeid(12);
        this.#_sort = false;
        this.#_logger.trace(this);
    }

    get title() {
        return this.#_title;
    }


    get subtitle() {
        return this.#_subtitle;
    }


    get xLabel() {
        return this.#_xLabel;
    }

    get yLabel() {
        return this.#_yLabel;
    }

    get id() {
        return this.#_id;
    }

    get sort() {
        return this.#_sort;
    }

    set title(value){
        this.setTitle(value);
    }

    set subtitle(value){
        this.setSubtitle(value);
    }

    set id(elementId){
        this.setId(elementId);
    }

    set sort(value){
        this.setSort(value);
    }

    setTitle (value) {
        this.#_title = value;
        this.#_logger.debug("setTitle.");
        this.#_logger.trace(this);
        return this;
    }

    setSubtitle(value) {
        this.#_subtitle = value;
        this.#_logger.debug("setSubtitle");
        this.#_logger.trace(this);
        return this;
    }
    
    setXLabel( label) {
        this.#_xLabel = label;
        this.#_logger.debug("setXLabel.");
        this.#_logger.trace(this);
        return this;
    }

    setYLabel (label) {
        this.#_yLabel = label;
        this.#_logger.debug("setYLabel.");
        this.#_logger.trace(this);
        return this;
    }

    setId (elementId) {
        this.#_id = elementId;
        this.#_logger.debug("setId.");
        this.#_logger.trace(this);
        return this;
    }

    setSort (value) {
        this.#_sort = value;
        this.#_logger.debug("setSort.");
        this.#_logger.trace(this);
        return this;
    }
        
    updateWith (anotherProperties){
        if (! this.id) this.setId(anotherProperties.id);
        if (! this.title) this.setTitle(anotherProperties.title);
        if (! this.subtitle) this.setSubtitle(anotherProperties.subtitle);
        if (! this.xLabel) this.setXLabel(anotherProperties.xLabel);
        if (! this.yLabel) this.setYLabel(anotherProperties.yLabel);
        if (! this.sort) this.setSort(anotherProperties.sort);
    }
        
    static validOrNew(properties){
        console.log(properties);
        if (properties == null){
            console.log("properties is null");
            return new IRplusProperties();
        }
        if (properties instanceof IRplusProperties){
            console.log("properties is instance of IRplusProperties");
            return properties;
        }
        if (properties.constructor == IRplusCommon.objectConstructor ){
            let p = new IRplusProperties();
            try {
                Object.seal(p);
                return Object.assign(p, properties);
            } catch(e){
                console.log(e);
                console.log("IRplusProperties: tried to build a Object with the wrong structure. Returning an empty IRplusProperties instance.");
                return p;
                
            }
        }
    }
}

class IRplusResultSerieDataItem{
    #_logger;
    #_name;
    #_x;
    #_y;
    #_z;
    #_drilldown;
    
    constructor(){
        this.#_logger = new IRplusLogger('IRplusResultSerieDataItem');
        this.#_logger.debug("Constructor.");
        this.#_name = undefined;
        this.#_x = undefined;
        this.#_y = undefined;
        this.#_z = undefined;
        this.#_drilldown = undefined;
    }
    
    get name(){
        return this.#_name;
    }
    
    get x(){
        return this.#_x;
    }
    
    get y(){
        return this.#_y;
    }
    
    get z(){
        return this.#_z;
    }
    
    get drilldown(){
        return this.#_drilldown;
    }

    set name(name){
        this.setName(name);
    }
    
    set x(x){
        this.setX(x);
    }
    
    set y(y){
        this.setY(y);
    }
    
    set z(z){
        this.setZ(z);
    }
    
    set drilldown(drilldown){
        this.setDrilldown(drilldown);
    }

    setName(name){
        this.#_name = name;
        return this;
    }
    
    setX(x){
        this.#_x = x;
        return this;
    }
    
    setY(y){
        this.#_y = y;
        return this;
    }
    
    setZ(z){
        this.#_z = z;
        return this;
    }
    
    setDrilldown(drilldown){
        this.#_drilldown = drilldown;
        return this;
    }
    
    toJSON(){
        let {name, x, y, z, drilldown} = this;
        return {name, x, y, z, drilldown};
    }
}

class IRplusResultSerie{
    #_logger;
    #_repertoireId;
    #_sampleProcessingId;
    #_dataProcessingId;
    #_id;
    #_name;
    #_fieldName;
    #_data;
    #_type;
    #_parentName;
    #_color;
    
    constructor(){
        this.#_logger = new IRplusLogger('IRplusResultSerie');
        this.#_logger.debug("Constructor.");
        this.#_repertoireId = undefined;
        this.#_sampleProcessingId = undefined;
        this.#_dataProcessingId = undefined;
        this.#_id = undefined;
        this.#_name = undefined;
        this.#_fieldName = undefined;
        this.#_data = undefined;
        this.#_type = undefined;
        this.#_parentName = undefined;
        this.#_color = undefined;
    }

    get repertoireId(){
        return this.#_repertoireId;
    }

    get sampleProcessingId(){
        return this.#_sampleProcessingId;
    }

    get dataProcessingId(){
        return this.#_dataProcessingId;
    }

    get id(){
        return this.#_id;
    }

    get name(){
        return this.#_name;
    }

    get fieldName(){
        return this.#_fieldName;
    }

    get data(){
        if (!this.#_data){
            this.#_data = [];
        }
        return this.#_data;
    }

    get type(){
        return this.#_type;
    }

    get parentName(){
        return this.#_parentName;
    }

    get color(){
        return this.#_color;
    }

    set repertoireId(repertoireId){
        setRepertoireId(repertoireId);
    }

    set sampleProcessingId(sampleProcessingId){
        setSampleProcessingId(sampleProcessingId);
    }

    set dataProcessingId(dataProcessingId){
        setDataProcessingId(dataProcessingId);
    }

    set id(id){
        setId(id);
    }

    set name(name){
        setName(name);
    }

    set fieldName(fieldName){
        setFieldName(fieldName);
    }

    set data(data){
        setData(data);
    }

    set type(type){
        setType(type);
    }

    set parentName(name){
        setParentName(name);
    }

    set color(color){
        setColor(color);
    }

    setRepertoireId(repertoireId){
        this.#_repertoireId = repertoireId;
        return this;
    }

    setSampleProcessingId(sampleProcessingId){
        this.#_sampleProcessingId = sampleProcessingId;
        return this;
    }

    setDataProcessingId(dataProcessingId){
        this.#_dataProcessingId = dataProcessingId;
        return this;
    }

    setId(id){
        this.#_id = id;
        return this;
    }

    setName(name){
        this.#_name = name;
        return this;
    }

    setFieldName(fieldName){
        this.#_fieldName = fieldName;
        return this;
    }

    setData(data){
        this.#_data = data;
        return this;
    }

    setType(type){
        if (!IRplusResultSerieType.contains(type)){
            throw 'type must exist in IRplusResultSeriesType.types';
        }
        this.#_type = type;
        return this;
    }
        
    setParentName(name){
        this.#_parentName = name;
        return this;
    }
    
    setColor(color){
        this.#_color = color;
        return this;
    }
    
    toJSON(){
        let {repertoireId, sampleProcessingId, dataProcessingId, name, fieldName, parentName, type, color, data} = this;
        return {repertoireId, sampleProcessingId, dataProcessingId, name, fieldName, parentName, type, color, data};
    }
        
    asHighchartSeries(){
        let json = {
            name: this.#_name,
            color: this.#_color
        };
        
        if (this.#_id) { json.id = this.#_id; }
            
        if (this.#_data) { json.data = this.#_data.map(d => d.toJSON()); }
        
        return json;
    }
}

class IRplusResult {
    #_logger;
    #_rawResult;
            
    constructor(originalDataResult = undefined) {
        this.#_logger = new IRplusLogger('IRplusResult');
        this.#_logger.debug("Constructor.");
        this.#_rawResult = {};
        if (typeof originalDataResult !== "undefined" ){
            setRawResult(originalDataResult);            
        }
    }

    setRawResult(originalDataResult) {
        this.#_rawResult = originalDataResult;  
        this.#_logger.debug("setRawResult.");
        this.preparse(originalDataResult);
        this.parse(originalDataResult);
        //this.parseSingleRepertoireStatsData(originalDataResult);
        return this;
    }
    
    set rawResult(originalDataResult){
        this.setRawResult(originalDataResult);
    }
        
    get rawResult(){
        return this.#_rawResult;
    }
        
    preparse(originalDataResult){
        
    }    
        
    parse(originalDataResult){
        this.#_logger.fatal("'this parse() method should never execute, specializations of IRplusResult need to overload it.'");
        throw 'This method should not be called, implementations need to overload it.';
    }
    
}

class IRplusStatsResult extends IRplusResult {
    #_logger;
    
    #_geneType;
    // Array of IRplusResultSerie
    #_series;
    
    // Array of IRplusResultSerie
    #_drilldownSeries;
    
    // Dictionary (key=repetoire_id, value= Array of all IRplusResultSeries children of repertoire_id independent of type)
    #_seriesByRepertoire;
    
    // Dictionary (key=familyName, value= Array of all IRplusResultSeries children of familyName across all repertoires)
    // Each element of the value Array must be a ResultSerie grouping all (GENE) values of a repertoire that are contained in a family.
    #_geneSeriesByFamily;
    
    // Dictionary (key=geneName, value= Array of all IRplusResultSeries children of geneName across all repertoires)
    // Each element of the value Array must be a ResultSerie grouping all (CELL) values of a repertoire that are contained in a gene.
    #_cellSeriesByGene;
    
    // Dictionary (key=repetoire_id, value= Array of all IRplusResultSeries children of type FAMILY in repertoire_id)
    // Each element of the value Array must be a ResultSerie grouping all (FAMILY) values of a repertoire.
    #_familySeriesByRepertoire;
    
    // Dictionary (key=repetoire_id, value= Array of all IRplusResultSeries children of type GENE in repertoire_id)
    // Each element of the value Array must be a ResultSerie grouping all (GENE) values of a repertoire.
    #_geneSeriesByRepertoire;
    
    // Dictionary (key=repetoire_id, value= Array of all IRplusResultSeries children of type GENE in repertoire_id)
    // Each element of the value Array must be a ResultSerie grouping all (CELL) values of a repertoire.
    #_cellSeriesByRepertoire;
    
    #_multipleSeries;
    
    #_defaultProperties;
    
    constructor(type, data = undefined) {
        super(data);
        this.#_logger = new IRplusLogger('IRplusStatsResult');
        this.#_logger.debug("Constructor.");
        if (!IRplusGeneType.contains(type)){
            logger.fatal('type must exist in IRplusGeneType.genes');
            throw 'type must exist in IRplusGeneType.genes';
        }
        this.#_geneType = type;            
        this.#_series = [];
        this.#_drilldownSeries = [];
        this.#_multipleSeries = false;
        
        // Dictionaries for processing IRplusResultSerie structures by grouping type.
        this.#_seriesByRepertoire = {};
        this.#_geneSeriesByFamily = {};
        this.#_cellSeriesByGene = {};
        this.#_familySeriesByRepertoire = {};
        this.#_geneSeriesByRepertoire = {};
        this.#_cellSeriesByRepertoire = {};
        
        this.#_defaultProperties = new IRplusProperties().setTitle("IR+ Repertoire Stats").setSubtitle("Families").setYLabel("Count");
    }

    get series(){
        this.#_logger.debug("getting series.");
        return this.#_series;
    }

    get drilldownSeries(){
        this.#_logger.debug("getting drilldown series.");
        //We need to understand if we are returning an event function or a drilldown object.
        //If we need to drilldown and show multiple series, then our only option is to use events.
        //If we have only one serie to drill to, we can use the drilldown object.
        if (this.#_multipleSeries){
            let emptyDrilldownObject = {series: []};
            this.#_logger.trace(emptyDrilldownObject);
            return emptyDrilldownObject;
        }           
        this.#_logger.trace(this.#_drilldownSeries);
        return this.#_drilldownSeries;
    }
                    
    get drillupSeriesEvent(){
        let logger = this.#_logger;
        if (!this.#_multipleSeries){
            logger.debug("retrieving single serie drillup event");
            return function(e) {
                let chart = this
                logger.trace(e);
                logger.trace(chart);
            };    
        }
        logger.debug("retrieving multiple series drillup event");
        return function(e) {
                let chart = this
                logger.trace(e);
                logger.trace(chart);
        };    
            
    }
                    
    get drilldownSeriesEvent(){
        let logger = this.#_logger;
        if (!this.#_multipleSeries){
            this.#_logger.debug("retrieving single serie drilldown event");
            return function(e) {
                let chart = this;
                chart.setTitle(null, { text: e.point.name });
                logger.trace(e);
            };    
        }
        // I may need a structure to hold the drilldown and drillup level and labels. That way we can have a subtitle of the type 'Families' > ' Genes' > '...' and a label for drillup button.
        let drilldownSeries = {...this.#_geneSeriesByFamily, ...this.#_cellSeriesByGene};
        return function(e) {
            let chart = this
            logger.trace(e);
            if (!e.seriesOptions) {
                //this.#_logger.debug(drilldownSeries);
                chart.setTitle(null, { text: e.point.name });
                logger.debug("Gathering drilldown series for " + e.point.drilldown);
                for (let i = 0; i < drilldownSeries[e.point.drilldown].length; i++){
                    let serie = drilldownSeries[e.point.drilldown][i];
                    logger.debug("Found serie")
                    logger.trace(serie);
                    chart.addSingleSeriesAsDrilldown(e.point, serie.asHighchartSeries());
                }
                logger.trace(chart.drilldown);
                //chart.addSingleSeriesAsDrilldown(e.point, series[0]);
                //chart.addSingleSeriesAsDrilldown(e.point, series[1]);
                logger.trace(chart);
                chart.applyDrilldown();
            }else{
                chart.setTitle(null, {text: e.seriesOptions.name});
            }
        }            
    }
    
    get properties(){
        return this.#_defaultProperties;
    }
        
    is3D(){
        return this.#_multipleSeries;
    }
    
    _initializeRepertoire(repertoire_id){
        this.#_logger.debug("Initializing repertoire " + repertoire_id);
        if(!this.#_seriesByRepertoire[repertoire_id]){this.#_seriesByRepertoire[repertoire_id] = [];}
        if(!this.#_familySeriesByRepertoire[repertoire_id]){this.#_familySeriesByRepertoire[repertoire_id] = [];} 
        if(!this.#_geneSeriesByRepertoire[repertoire_id]){this.#_geneSeriesByRepertoire[repertoire_id] = [];} 
        if(!this.#_cellSeriesByRepertoire[repertoire_id]){this.#_cellSeriesByRepertoire[repertoire_id] = [];} 
    }

    _initializeGeneGroup(repertoire_id, geneGroupName){
        if( !this.#_geneSeriesByFamily[geneGroupName] ){
           this.#_logger.debug("Initializing #_geneSeriesByFamily[" + geneGroupName+ "].");
           this.#_geneSeriesByFamily[geneGroupName] = [];
        } 

    }
           
    _initializeCellGroup(repertoire_id, cellGroupName){
        if(!this.#_cellSeriesByGene[cellGroupName]){
           this.#_logger.debug("Initializing #_cellSeriesByGene[" + cellGroupName+ "].");
           this.#_cellSeriesByGene[cellGroupName] = [];
        } 

    }
           
    _addToStructures(serie){
        if (!(serie instanceof IRplusResultSerie)){            
            throw 'serie type must be IRplusResultSerie';
        }
        let repertoire_id = serie.repertoireId;
        let type = serie.type;
        let parentName = serie.parentName;
        switch (type) {
            case IRplusResultSerieType.FAMILY:
                this.#_familySeriesByRepertoire[repertoire_id].push(serie);
                break;
            case IRplusResultSerieType.GENE:
                this.#_logger.debug("Received a new serie of Genes. Repertoire:" + repertoire_id+" , parentName:" + parentName);
                if (parentName){
                    // This is a partial Serie of IRplusResultSerieDataItem grouped by a common parent.
                    this.#_logger.debug("Adding to #_geneSeriesByFamily[" + parentName+ "] :")
                    this.#_geneSeriesByFamily[parentName].push(serie);
                    this.#_logger.debug(this.#_geneSeriesByFamily[parentName]);
                }else{
                    this.#_geneSeriesByRepertoire[repertoire_id].push(serie);
                }
                break;
            case IRplusResultSerieType.CELL:
                if (parentName){
                    // This is a partial Serie of IRplusResultSerieDataItem grouped by a common parent.
                    this.#_logger.debug("Adding to #_cellSeriesByGene[" + parentName+ "] :")
                    this.#_cellSeriesByGene[parentName].push(serie);
                    this.#_logger.debug(this.#_cellSeriesByGene[parentName]);
                }else{
                    this.#_cellSeriesByRepertoire[repertoire_id].push(serie);
                }
                break;
            default:
                throw 'cannot process an incompatible type.';
        }
        this.#_seriesByRepertoire[repertoire_id].push(serie);
    }
           
    parseSingleRepertoireStatsData(data){
        this.#_logger.debug("IRplusStatsResult parseSingleRepertoireStatsData.");
        let gene = this.#_geneType;
        let series = [];
        let drilldownSeries = [];
        let familySeries;
        let familyNames = [];
        let geneSeries;
        let geneNames = [];
        let cellSeries;
        // let gene = 'd';
        let familyPostfix = '_family';
        let genePostfix = '_gene';
        let geneSpliter = '-'
        let cellPostfix = '_call';
        let cellSpliter = '*'

        let familySeriesName = gene.concat(familyPostfix);
        let geneSeriesName = gene.concat(genePostfix);
        let cellSeriesName = gene.concat(cellPostfix);

        if (typeof data === "string"){
            data = JSON.parse(data);
        }
        
        this.#_logger.debug("Data Result length = " + data.Result.length);
        if (data.Result.length > 1){
            this.#_logger.debug("Representing " + data.Result.length + " repertoires. Will need a 3D chart.");
            this.#_multipleSeries = true;
        }
        
        for (let i = 0; i< data.Result[0].fields.length; i++){
            //  	this.#_logger.debug(data.Result[0].fields[i].field);
            //    this.#_logger.debug(familySeriesName, geneSeriesName, callSeriesName);
            if (data.Result[0].fields[i].field.localeCompare(familySeriesName)==0){
                //    	this.#_logger.debug('Setting families');
                familySeries = data.Result[0].fields[i];
            }else if (data.Result[0].fields[i].field.localeCompare(geneSeriesName)==0){
                //    	this.#_logger.debug('Setting genes');
                geneSeries = data.Result[0].fields[i];
            }else if (data.Result[0].fields[i].field.localeCompare(cellSeriesName)==0){
                //    	this.#_logger.debug('Setting calls');
                cellSeries = data.Result[0].fields[i];
            }
        }
        //  this.#_logger.debug('Family :');
        //  this.#_logger.debug(familySeries);
        //  this.#_logger.debug('Gene :');
        //  this.#_logger.debug(geneSeries);
        //  this.#_logger.debug('Cell :');
        //  this.#_logger.debug(cellSeries);
        if (familySeries){
            //this is the main series.
            let seriesData = [];
            for (let i = 0; i< familySeries.data.length; i++){
                let familyName = familySeries.data[i].key;
                familyNames.push(familyName)
                seriesData.push({
                    name: familyName,
                    y: familySeries.data[i].count,
                    drilldown: familyName.concat(genePostfix) 
                });
            }
            series.push({
                name: familySeriesName,
                data: seriesData
            })
        }else{
            //abort and return  
        }
        if (geneSeries){
            //this is the second serie.
            let seriesData = [];
            //Build a dictionary to group genes by family
            let seriesDataDict = new Object();
            for (let i = 0; i < familyNames.length; i++){
                seriesDataDict[familyNames[i]] = [];
            }
            for (let i = 0; i< geneSeries.data.length; i++){
                let geneName = geneSeries.data[i].key;
                geneNames.push(geneName);
                let geneSpliterIndex = geneName.indexOf(geneSpliter);
                let familyName = geneName.substring(0,geneSpliterIndex);
                seriesDataDict[familyName].push({
                    name: geneName,
                    y: geneSeries.data[i].count,
                    drilldown: geneName.concat(cellPostfix) 
                });
            }
            //   this.#_logger.debug(seriesDataDict);
            for (let key in seriesDataDict){
                let value = seriesDataDict[key];
                drilldownSeries.push({
                    name: key.concat(' Genes'),
                    id: key.concat(genePostfix),
                    data: value
                });
            }
        }else{
            //abort and return  
        }

        if (cellSeries){
            //this is the second serie.
            let seriesData = [];
            //Build a dictionary to group genes by family
            let seriesDataDict = new Object();
            for (let i = 0; i < geneNames.length; i++){
                seriesDataDict[geneNames[i]] = [];
            }
            for (let i = 0; i< cellSeries.data.length; i++){
                let cellName = cellSeries.data[i].key;
                let cellSpliterIndex = cellName.indexOf(cellSpliter);
                let geneName = cellName.substring(0,cellSpliterIndex);
                seriesDataDict[geneName].push({
                    name: cellName,
                    y: cellSeries.data[i].count
                });
            }
            //    this.#_logger.debug(seriesDataDict);
            for (let key in seriesDataDict){
                let value = seriesDataDict[key];
                drilldownSeries.push({
                    name: key.concat(' Cells'),
                    id: key.concat(cellPostfix),
                    data: value
                });
            }
        }else{
            //abort and return  
        }

        //  this.#_logger.debug('Series:');
        //  this.#_logger.debug(series);
        //  this.#_logger.debug('DrilldownSeries:');
        //  this.#_logger.debug(drilldownSeries);

        //return [series, {series:drilldownSeries}];
        this.#_series = series;
        this.#_drilldownSeries = {series:drilldownSeries};
    }
    
    parse (data){
        this.#_logger.debug("IRplusStatsResult parse.");
        //Highcharts default
        //let seriesColors = ["rgb(124,181,236)", "rgb(67,67,72)", "rgb(144,237,125)"];
        //Colorblind safe
        //let seriesColors = ["rgb(49,54,149)", "rgb(69,117,180)", "rgb(116,173,209)", "rgb(171,217,233)", "rgb(224,243,248)", "rgb(255,255,191)", "rgb(254,224,144)", "rgb(253,174,97)", "rgb(244,109,67)", "rgb(215,48,39)", "rgb(165,0,38)"];
        let seriesColors = ["rgb(0,66,157)", "rgb(43,87,167)", "rgb(66,108,176)", "rgb(86,129,185)", "rgb(105,151,194)", "rgb(125,174,202)", "rgb(147,196,210)", "rgb(171,218,217)", "rgb(202,239,223)", "rgb(255,226,202)", "rgb(255,196,180)", "rgb(255,165,158)", "rgb(249,134,137)", "rgb(237,105,118)", "rgb(221,76,101)", "rgb(202,47,85)", "rgb(177,19,70)", "rgb(147,0,58)"]
        let colorIndex = 0;
        let colorIndexJumper = 1;
        let gene = this.#_geneType;
        let series = [];
        let drilldownSeries = [];
        let familySeries;
        let familyNames = [];
        let geneSeries;
        let geneNames = [];
        let cellSeries;
        // let gene = 'd';
        let familyPostfix = '_family';
        let genePostfix = '_gene';
        let geneSpliter = '-'
        let cellPostfix = '_call';
        let cellSpliter = '*'

        let familySeriesName = gene.concat(familyPostfix);
        let geneSeriesName = gene.concat(genePostfix);
        let cellSeriesName = gene.concat(cellPostfix);
    
        
        if (typeof data === "string"){
            data = JSON.parse(data);
        }
        
        this.#_logger.debug("Data Result length = " + data.Result.length);
        if (data.Result.length > 1){
            //Why is this important? If we have a multiple repertoires, the name of the series will be the name of the repertoire,
            //otherwise the name of the series will be the name of the field.
            this.#_logger.debug("Representing " + data.Result.length + " repertoires. Will need a 3D chart.");
            this.#_multipleSeries = true;
            
            if (seriesColors.length < data.Result.length){
                this.#_logger.error('Not enough colors set for the amount of repertoires. Please increase the number of colors in seriesColor array.');
                throw 'Not enough colors set for the amount of repertoires. Please increase the number of colors in seriesColor array.';
            }
            colorIndexJumper = Math.floor((seriesColors.length-1)/(data.Result.length-1));
            
        }
        for (let j = 0; j < data.Result.length; j++){
            let color = seriesColors[colorIndex];
            colorIndex+=colorIndexJumper;
            let result = data.Result[j];
            let repertoire = result.repertoire;
            this._initializeRepertoire(repertoire.repertoire_id);
            for (let i = 0; i< result.fields.length; i++){
                let fields = result.fields[i];
                if (fields.field.localeCompare(familySeriesName)==0){
                    familySeries = fields;
                }else if (fields.field.localeCompare(geneSeriesName)==0){
                    geneSeries = fields;
                }else if (fields.field.localeCompare(cellSeriesName)==0){
                    cellSeries = fields;
                }
            }
            if (familySeries){
                //this is the main series for a repertoire.
                let serie = new IRplusResultSerie()
                    .setRepertoireId(repertoire.repertoire_id)
                    .setSampleProcessingId(repertoire.sample_processing_id)
                    .setDataProcessingId(repertoire.data_processing_id)
                    .setId('rep'.concat(repertoire.repertoire_id).concat(familyPostfix))
                    .setName('Repertoire '.concat(repertoire.repertoire_id).concat(' Families'))
                    .setFieldName(familySeries.field)
                    .setColor(color)
                    .setType(IRplusResultSerieType.FAMILY);
                let seriesData = serie.data;
                for (let i = 0; i< familySeries.data.length; i++){
                    let familyName = familySeries.data[i].key;
                    let geneGroupName = familyName.concat(genePostfix);
                    familyNames.push(familyName);
                    this._initializeGeneGroup(repertoire.repertoire_id, geneGroupName);
                    seriesData.push(new IRplusResultSerieDataItem().setName(familyName).setY(familySeries.data[i].count).setDrilldown(geneGroupName));
                    // {name: familyName,y: familySeries.data[i].count,drilldown: familyName.concat(genePostfix)});
                }
                series.push(serie);
                //{name: (this.#_multipleSeries ? "Repertoire: " + repertoireName : familySeriesName),data: seriesData})
                this._addToStructures(serie);
            }else{
                //Probably we have an error in the result. Should abort and return?
            }
            if (geneSeries){
                //this is a second serie (for drilldown).
                //We will need several ResultSeries, one that will hold all the Gene values (dataItems) in the repertoire and, one for each family of Genes in a repertoire
                let serie = new IRplusResultSerie()
                    .setRepertoireId(repertoire.repertoire_id)
                    .setSampleProcessingId(repertoire.sample_processing_id)
                    .setDataProcessingId(repertoire.data_processing_id)
                    .setId('rep'.concat(repertoire.repertoire_id).concat(genePostfix))
                    .setName('Repertoire '.concat(repertoire.repertoire_id).concat(' Genes'))
                    .setFieldName(geneSeries.field)
                    .setColor(color)
                    .setType(IRplusResultSerieType.GENE);
                let seriesData = serie.data;
                //Build a dictionary to group genes series by family
                let geneSeriesDict = new Object();
                for (let i = 0; i < familyNames.length; i++){
                    let geneGroupName = familyNames[i].concat(genePostfix);
                    let geneSeriesName = familyNames[i].concat(' Family');
                    geneSeriesDict[familyNames[i]] = new IRplusResultSerie()
                        .setRepertoireId(repertoire.repertoire_id)
                        .setSampleProcessingId(repertoire.sample_processing_id)
                        .setDataProcessingId(repertoire.data_processing_id)
                        .setId(geneGroupName)
                        .setName(geneSeriesName)
                        .setFieldName(geneSeries.field)
                        .setType(IRplusResultSerieType.GENE)
                        .setColor(color)
                        .setParentName(geneGroupName);
                }
                for (let i = 0; i< geneSeries.data.length; i++){
                    let geneName = geneSeries.data[i].key;
                    let cellGroupName = geneName.concat(cellPostfix)
                    geneNames.push(geneName);
                    this._initializeCellGroup(repertoire.repertoire_id, cellGroupName);
                    let geneSpliterIndex = geneName.indexOf(geneSpliter);
                    let familyName = geneName.substring(0,geneSpliterIndex);
                    let dataItem = new IRplusResultSerieDataItem().setName(geneName).setY(geneSeries.data[i].count).setDrilldown(cellGroupName);
                    seriesData.push(dataItem);
                    geneSeriesDict[familyName].data.push(dataItem);
                    //{name: geneName,y: geneSeries.data[i].count,drilldown: geneName.concat(cellPostfix)});
                }
                this.#_logger.trace("All Gene data serie for Repertoire " +repertoire.repertoire_id + ": ");
                this.#_logger.trace(serie);
                this._addToStructures(serie);
                this.#_logger.trace("All series for gene data grouped by family : ");
                this.#_logger.trace(geneSeriesDict);
                for (let key in geneSeriesDict){
                    let value = geneSeriesDict[key];
                    this._addToStructures(value);
                    drilldownSeries.push(value.asHighchartSeries());
                    //{name: key.concat(' Genes'),id: key.concat(genePostfix),data: value.asHighchartSeries()});
                }
            }else{
                //Probably we have an error in the result. Should abort and return?
            }

            if (cellSeries){
                //this a third serie for drilldown.
                //We will need several ResultSeries, one that will hold all the Allele values (dataItems) in the repertoire and, one for each Genes group in a repertoire
                let serie = new IRplusResultSerie()
                    .setRepertoireId(repertoire.repertoire_id)
                    .setSampleProcessingId(repertoire.sample_processing_id)
                    .setDataProcessingId(repertoire.data_processing_id)
                    .setId('rep'.concat(repertoire.repertoire_id).concat(cellPostfix))
                    .setName('Repertoire '.concat(repertoire.repertoire_id).concat(' Alleles'))
                    .setFieldName(cellSeries.field)
                    .setColor(color)
                    .setType(IRplusResultSerieType.CELL);
                let seriesData = serie.data;
                //Build a dictionary to greoup cells by gene
                let cellSeriesDict = new Object();
                for (let i = 0; i < geneNames.length; i++){
                    //cellSeriesDict[geneNames[i]] = [];
                    let cellGroupName = geneNames[i].concat(cellPostfix);
                    let cellSeriesName = geneNames[i].concat(' Gene');
                    cellSeriesDict[geneNames[i]] = new IRplusResultSerie()
                        .setRepertoireId(repertoire.repertoire_id)
                        .setSampleProcessingId(repertoire.sample_processing_id)
                        .setDataProcessingId(repertoire.data_processing_id)
                        .setId(cellGroupName)
                        .setName(cellSeriesName)
                        .setFieldName(cellSeries.field)
                        .setType(IRplusResultSerieType.CELL)
                        .setColor(color)
                        .setParentName(cellGroupName);
                }
                for (let i = 0; i< cellSeries.data.length; i++){
                    let cellName = cellSeries.data[i].key;
                    let cellSpliterIndex = cellName.indexOf(cellSpliter);
                    let geneName = cellName.substring(0,cellSpliterIndex);
                    let dataItem = new IRplusResultSerieDataItem().setName(cellName).setY(cellSeries.data[i].count);
                    seriesData.push(dataItem);
                    cellSeriesDict[geneName].data.push(dataItem);
                    //{name: cellName,y: cellSeries.data[i].count});

                }
                //    this.#_logger.trace(cellSeriesDict);
                for (let key in cellSeriesDict){
                    let value = cellSeriesDict[key];
                    this._addToStructures(value);
                    drilldownSeries.push(value.asHighchartSeries());
                    //{name: key.concat(' Cells'),id: key.concat(cellPostfix),data: value}
                }
            }else{
                //Probably we have an error in the result. Should abort and return?
            }
        }
        //  this.#_logger.debug('Series:');
        //  this.#_logger.debug(series);
        //  this.#_logger.debug('DrilldownSeries:');
        //  this.#_logger.debug(drilldownSeries);

        //return [series, {series:drilldownSeries}];
        this.#_series = series;
        this.#_drilldownSeries = {series:drilldownSeries};
    }
}
        
class IRplusChart {
    #_id;
    #_properties;
    #_result;
    #_logger;
    
    constructor(properties){
        this.#_logger = new IRplusLogger('IRplusChart');
        this.#_logger.debug("Constructor.");
        this.#_result = {};
        this.#_properties = undefined;
        if (properties instanceof IRplusProperties){
            this.#_properties = properties;
        }else{
            this.#_properties = new IRplusProperties();
        }
        this.#_id = this.#_properties.id;
        this.#_logger.trace(this);
    }

    //setter
    setResult(result){
        this.#_logger.debug("setResult");
        if (result instanceof IRplusResult){
            this.#_result = result;
            this.#_logger.trace(this.#_properties);
            this.#_logger.trace(this.#_result.properties);
            this.#_properties.updateWith(this.#_result.properties);
            this.#_logger.trace(this.#_properties);
        }else{
            this.#_logger.error("Received result is not compatible. Result must be an instance of IRplusResult.");
        }
        this.#_logger.trace(this);
        return this;
    }
    
    set result(result){
        setResult(result);
    }
    
    setProperties(properties){
        if (properties instanceof IRplusProperties){
            this.#_properties = properties;
        }else{
            throw 'properies type must be IRplusProperties';
        }
        return this;
    }
    
    get properties(){
        return this.#_properties;
    }
    
    set properties(properties){
        this.setProperties(properties);
    }
    
    //getter
    get result(){
        return this.#_result;
    }

    get id(){
        return this.#_id;
    }

    //plot
    plot(){
        this.#_logger.debug("Ploting chart");
        //Plotting must have into consideration the type of data and the visualization implementation required.
        // This is where we map IRplus properties and data to specific Visualization library.
        let drilldown = this.#_result.drilldownSeries; 
        let p = {
            chart: { type: 'column'},
            xAxis: { type: 'category'},
            // In an Highcharts chart, the series value is an array of objects each one representing a data serie.
            // Each data serie can have its own plot options.
            series: this.#_result.series.map(serie => serie.asHighchartSeries()),
            //series: this.#_result.series,
            // In an Highcharts chart, the drilldown value is an object that allows for inspect increasingly high resolution data,
            // This object contains a series property that is an array of objects, each one representing a data serie (as the series in the chart).
            // Each data serie can have its own plot options, existence of the id property is mandatory to reference which serie to plot.
            drilldown: drilldown
        };
        if (this.#_properties.title) { p.title = { text: this.#_properties.title } };
        if (this.#_properties.subtitle) { p.subtitle = { text : this.#_properties.subtitle } };
        //not working
        p.series.dataSorting = {
            enabled: true,
            sortKey: 'name'
        };
        //We need to get the drilldown and drillup events to change at least the title and subtitle of the chart.
        p.chart.events = {
            drillup: this.#_result.drillupSeriesEvent,
            drilldown: this.#_result.drilldownSeriesEvent
        }
        this.#_logger.trace("Is 3D? -" + this.#_result.is3D());
        if (this.#_result.is3D()){
            // Setup chart 3Doptions properties (in the future using #_properties and #_dataseries data).
            p.chart.options3d = {
                enabled: true,
                alpha: 20,
                beta: 30,
                depth: 200,
                viewDistance: 5,
                frame: {
                    bottom: {
                        size: 1,
                        color: 'rgba(0,0,0,0.05)'
                    }
                }
            };
            // Setup zAxis properties (in the future using #_properties and #_dataseries data).
            /* p.zAxis = {
                min: 0,
                categories: ["series 1","series 2","series 3","series 4"],
                type: 'category',
                labels: {
                    y: 5,
                    rotation: 18
                }
            };*/
            p.plotOptions = {
                series: {
                    groupZPadding: 20,
                    depth: 0,
                    groupPadding: 0,
                    grouping: false,
                }
            };
        }
        $('#'+this.#_properties.id).highcharts(p);
        this.#_logger.trace(p);
        this.#_logger.debug("Plotting into " + this.#_properties.id);
        this.#_logger.trace(this.#_result);
    }
}

class IRplusChartLibrary {
    #_charts;
    #_logger;
    
    constructor(){
        this.#_logger = new IRplusLogger('IRplusChartLibrary');
        this.#_logger.debug("Constructor.");
        this.#_charts = {};
    }
    
    get charts(){
        return this.#_charts;
    }
    
    createProperties() {
        let _property = new IRplusProperties();
        return _property;
    }
    
    createChart(properties=undefined){
        properties = IRplusProperties.validOrNew(properties);
        let _chart = this.get(properties.id);
        if (_chart == undefined) {
            _chart = new IRplusChart(properties);
            this.#_charts[_chart.id] = _chart;
        }else{
            _chart.properties = properties;
        }
        return _chart;
    }
    
    createProperties(){
        return new IRplusProperties();
    }
    
    get(identifier) {
        return this.#_charts[identifier];
    }
    
    setDebugLevel(level){
        IRplusLogger.setDebugLevel(level);
    }
}

(function (windows) {

  // We need that our library is globally accesible, then we save in the window
  if(typeof(window.irpluscharts) === 'undefined'){
    window.irpluscharts = new IRplusChartLibrary();
  }
}(window));
