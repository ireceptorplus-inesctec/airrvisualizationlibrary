import { Logger, ResultSeriesType, Common, DebugTimer, GeneType } from './common.js';
import { Properties} from "./properties.js";
import { Parser, DrilldownParser } from "./parser.js";
import { ResultSeriesDataItem, ResultSeries } from "./series.js";

class StatsParserConstants{
    static VOCABULARY = {
        INFO : "Info",
        MESSAGE : "Result",
        STATISTICS : "statistics",
        STATISTICS_NAME : "statistic_name",
        REPERTOIRES : "repertoires",
        REPERTOIRE_ID : "repertoire_id",
        SAMPLE_PROCESSING_ID : "sample_processing_id",
        DATA_PROCESSING_ID : "data_processing_id",
        TOTAL : "total",
        DATA : "data",
        KEY : "key",
        VALUE : "value",
        POSTFIX_FAMILY : '_subgroup',
        POSTFIX_GENE : '_gene',
        POSTFIX_CALL : '_call',
        SPLITER_GENE : '-',
        SPLITER_CALL : '*'
    };

    static get INFO(){
        return StatsParserConstants.VOCABULARY.INFO;
    }

    static get MESSAGE(){
        return StatsParserConstants.VOCABULARY.MESSAGE;
    }

    static get STATISTICS(){
        return StatsParserConstants.VOCABULARY.STATISTICS;
    }

    static get STATISTICS_NAME(){
        return StatsParserConstants.VOCABULARY.STATISTICS_NAME;
    }

    static get REPERTOIRES(){
        return StatsParserConstants.VOCABULARY.REPERTOIRES;
    }

    static get REPERTOIRE_ID(){
        return StatsParserConstants.VOCABULARY.REPERTOIRE_ID;
    }

    static get SAMPLE_PROCESSING_ID(){
        return StatsParserConstants.VOCABULARY.SAMPLE_PROCESSING_ID;
    }

    static get DATA_PROCESSING_ID(){
        return StatsParserConstants.VOCABULARY.DATA_PROCESSING_ID;
    }

    static get TOTAL(){
        return StatsParserConstants.VOCABULARY.TOTAL;
    }

    static get DATA(){
        return StatsParserConstants.VOCABULARY.DATA;
    }

    static get KEY(){
        return StatsParserConstants.VOCABULARY.KEY;
    }

    static get VALUE(){
        return StatsParserConstants.VOCABULARY.VALUE;
    }

    static get POSTFIX_FAMILY(){
        return StatsParserConstants.VOCABULARY.POSTFIX_FAMILY;
    }

    static get POSTFIX_GENE(){
        return StatsParserConstants.VOCABULARY.POSTFIX_GENE;
    }

    static get POSTFIX_CALL(){
        return StatsParserConstants.VOCABULARY.POSTFIX_CALL;
    }

    static get SPLITER_GENE(){
        return StatsParserConstants.VOCABULARY.SPLITER_GENE;
    }

    static get SPLITER_CALL(){
        return StatsParserConstants.VOCABULARY.SPLITER_CALL;
    }
}
class CountStatsParser extends Parser {
    #_logger;

    // Array of ResultSeries
    #_series;
    #_seriesByRepertoire;

    #_multipleSeries;

    constructor() {
        super();
        this.#_logger = new Logger('CountStatsParser');
        this.#_logger.trace("Constructor.");

        this.#_multipleSeries = false;
        this.#_series = [];
        this.#_seriesByRepertoire = [];
    }

    get series() {
        this.#_logger.debug("getting series.");
        return this.#_series;
    }

    isMultipleSeries() {
        return this.#_multipleSeries;
    }

    _initializeRepertoire(repertoire_id) {
        this.#_logger.debug("Initializing repertoire " + repertoire_id);
        if (!this.#_seriesByRepertoire[repertoire_id]) {
             this.#_seriesByRepertoire[repertoire_id] = []; 
        }
    }

    preparse(data) {
        this.#_logger.trace("preparse.");

    }

    onparse(data) {
        this.#_logger.trace("parse");
        let timer = new DebugTimer();
        timer.start("parse");
        //TOOD: Will need to get this from properties.
        let seriesColors = ["rgb(0,66,157)", "rgb(43,87,167)", "rgb(66,108,176)", "rgb(86,129,185)", "rgb(105,151,194)", "rgb(125,174,202)", "rgb(147,196,210)", "rgb(171,218,217)", "rgb(202,239,223)", "rgb(255,226,202)", "rgb(255,196,180)", "rgb(255,165,158)", "rgb(249,134,137)", "rgb(237,105,118)", "rgb(221,76,101)", "rgb(202,47,85)", "rgb(177,19,70)", "rgb(147,0,58)"]
        let colorIndex = 0;
        let colorIndexJumper = 1;
        //let gene = this.#_geneType;
        let mainSeries = [];
        
        if (typeof data === "string") {
            data = JSON.parse(data);
        }
        //Will do a first attempt with a Properties in the parser.
        //The idea is that the parser add to this properties and then the Result will join the parser properties with the default Result properties.
        let properties = new Properties();
        
        let messageArray = data[StatsParserConstants.MESSAGE];
        let messageArrayLength = messageArray.length;
        this.#_logger.debug("Data Result length = " + messageArrayLength);
        if (messageArrayLength > 1) {
            //Why is this important? If we have a multiple repertoires, the name of the series will be the name of the repertoire,
            //otherwise the name of the series will be the name of the field.
            this.#_logger.debug("Representing " + messageArrayLength + " repertoires. Will need a 3D chart.");

            //TODO: Will require both is3D() and isMultipleSeries() because we may need to plot a side by side multiple series chart instead of a 3D one.
            this.#_multipleSeries = true;

            if (seriesColors.length < messageArrayLength) {
                this.#_logger.error('Not enough colors set for the amount of repertoires. Please increase the number of colors in seriesColor array.');
                throw 'Not enough colors set for the amount of repertoires. Please increase the number of colors in seriesColor array.';
            }
            colorIndexJumper = Math.floor((seriesColors.length - 1) / (messageArrayLength - 1));

        }

        for (let j = 0; j < messageArrayLength; j++) {
            let color = seriesColors[colorIndex];
            colorIndex += colorIndexJumper;
            let messageArrayObject = messageArray[j];
            let messageArrayObjectRepertoires = messageArrayObject[StatsParserConstants.REPERTOIRES];
            
            //fetch the StatsParserConstants.REPERTOIRE_ID
            let repID = messageArrayObjectRepertoires[StatsParserConstants.REPERTOIRE_ID];
 
            //TODO: Include support for multiple StatsParserConstants.STATISTIC. I.e for example plot a stacked bar if we "receive rearrangement_count" and "rearrangement_count_productive".
            //If we have at least one StatsParserConstants.STATISTIC for this repertoire
            //we will ignore if more than one statistics is received.
            if(messageArrayObject[StatsParserConstants.STATISTICS].length > 0) {
                //Initialize the repertoire
                this._initializeRepertoire(repID);
                //fetch the first object of StatsParserConstants.STATISTICS
                let firstObject = messageArrayObject[StatsParserConstants.STATISTICS][0];
                //fetch the StatsParserConstants.STATISTICS_NAME
                let statisticName = firstObject[StatsParserConstants.STATISTICS_NAME];
                //Build ResultSeriesId
                let resultSeriesId = 'rep'.concat(repID).concat(statisticName);
                //calculate the resutType by its name
                let type = ResultSeriesType.getByName(statisticName);
                //Use type to build the chart subtitle
                properties.subtitle = type.toString();
                //Build ResultSeriesName
                //let resultSeriesName = 'Repertoire '.concat(repID).concat(' ').concat(type.toString());
                // We use the type for subtitle, no need to use it in series name.
                let resultSeriesName = 'Repertoire '.concat(repID);
                //fetch the StatsParserConstants.TOTAL
                let totalUsageCount = firstObject[StatsParserConstants.TOTAL];
                //Junction length will be displayed as percentages, will need the total UsageCount
                //generate the series
                let series = new ResultSeries()
                    .setRepertoireId(repID)
                    .setSampleProcessingId(messageArrayObjectRepertoires[StatsParserConstants.SAMPLE_PROCESSING_ID])
                    .setDataProcessingId(messageArrayObjectRepertoires[StatsParserConstants.DATA_PROCESSING_ID])
                    .setId(resultSeriesId)
                    .setName(resultSeriesName)
                    .setFieldName(statisticName)
                    .setColor(color)
                    .setType(type);
                let seriesData = series.data;
                //fetch the data into ResultSeriesDataItem
                let totalUsageCountValidator = 0;
                for (let i = 0, count = 0; i < firstObject[StatsParserConstants.DATA].length; i++) {
                    let dataObject = firstObject[StatsParserConstants.DATA][i];
                    let value = dataObject[StatsParserConstants.VALUE];
                    totalUsageCountValidator += value;
                    let dataItem = new ResultSeriesDataItem().setName(dataObject[StatsParserConstants.KEY]).setY(value);                    
                    seriesData.push(dataItem);
                }
                if (totalUsageCountValidator != totalUsageCount){
                    this.#_logger.error("Inconsistency between the statistics value for total " + statisticName + " and the sun of the individual values (" + totalUsageCount + "/" + totalUsageCountValidator + ").");
                }
                //TODO: Before sorting I need to normalize data structures (for example ensure that all series have all named values, set to zero the missing ones.)
                //Sort elements by name 
                seriesData.sort((a, b) => a.name-b.name);
                mainSeries.push(series);
                //{name: (this.#_multipleSeries ? "Repertoire: " + repertoireName : familySeriesName),data: seriesData})
            } else {
                //Probably we have an error in the result. Should abort and return?
            }
        }
        this.#_series = mainSeries;
        timer.end("parse");
        timer.print();
    }
}

class JunctionLenghtStatsParser extends Parser {
    #_logger;

    // Array of ResultSeries
    #_series;
    #_seriesByRepertoire;

    #_multipleSeries;

    constructor() {
        super();
        this.#_logger = new Logger('JunctionLenghtParser');
        this.#_logger.trace("Constructor.");

        this.#_multipleSeries = false;
        this.#_series = [];
        this.#_seriesByRepertoire = [];
    }

    get series() {
        this.#_logger.debug("getting series.");
        return this.#_series;
    }

    isMultipleSeries() {
        return this.#_multipleSeries;
    }

    _initializeRepertoire(repertoire_id) {
        this.#_logger.debug("Initializing repertoire " + repertoire_id);
        if (!this.#_seriesByRepertoire[repertoire_id]) {
             this.#_seriesByRepertoire[repertoire_id] = []; 
        }
    }

    preparse(data) {
        this.#_logger.trace("preparse.");

    }

    onparse(data) {
        this.#_logger.trace("parse");
        let timer = new DebugTimer();
        timer.start("parse");
        //TOOD: Will need to get this from properties.
        let seriesColors = ["rgb(0,66,157)", "rgb(43,87,167)", "rgb(66,108,176)", "rgb(86,129,185)", "rgb(105,151,194)", "rgb(125,174,202)", "rgb(147,196,210)", "rgb(171,218,217)", "rgb(202,239,223)", "rgb(255,226,202)", "rgb(255,196,180)", "rgb(255,165,158)", "rgb(249,134,137)", "rgb(237,105,118)", "rgb(221,76,101)", "rgb(202,47,85)", "rgb(177,19,70)", "rgb(147,0,58)"]
        let colorIndex = 0;
        let colorIndexJumper = 1;
        //let gene = this.#_geneType;
        let mainSeries = [];
        
        if (typeof data === "string") {
            data = JSON.parse(data);
        }
        //Will do a first attempt with a Properties in the parser.
        //The idea is that the parser add to this properties and then the Result will join the parser properties with the default Result properties.
        let properties = new Properties();
        
        let messageArray = data[StatsParserConstants.MESSAGE];
        let messageArrayLength = messageArray.length;
        this.#_logger.debug("Data Result length = " + messageArrayLength);
        if (messageArrayLength > 1) {
            //Why is this important? If we have a multiple repertoires, the name of the series will be the name of the repertoire,
            //otherwise the name of the series will be the name of the field.
            this.#_logger.debug("Representing " + messageArrayLength + " repertoires. Will need a 3D chart.");

            //TODO: Will require both is3D() and isMultipleSeries() because we may need to plot a side by side multiple series chart instead of a 3D one.
            this.#_multipleSeries = true;

            if (seriesColors.length < messageArrayLength) {
                this.#_logger.error('Not enough colors set for the amount of repertoires. Please increase the number of colors in seriesColor array.');
                throw 'Not enough colors set for the amount of repertoires. Please increase the number of colors in seriesColor array.';
            }
            colorIndexJumper = Math.floor((seriesColors.length - 1) / (messageArrayLength - 1));

        }

        for (let j = 0; j < messageArrayLength; j++) {
            let color = seriesColors[colorIndex];
            colorIndex += colorIndexJumper;
            let messageArrayObject = messageArray[j];
            let messageArrayObjectRepertoires = messageArrayObject[StatsParserConstants.REPERTOIRES];
            
            //fetch the StatsParserConstants.REPERTOIRE_ID
            let repID = messageArrayObjectRepertoires[StatsParserConstants.REPERTOIRE_ID];
 
            //If we have at least one StatsParserConstants.STATISTIC for this repertoire
            //we will ignore if more than one statistics is received.
            if(messageArrayObject[StatsParserConstants.STATISTICS].length > 0) {
                //Initialize the repertoire
                this._initializeRepertoire(repID);
                //fetch the first object of StatsParserConstants.STATISTICS
                let firstObject = messageArrayObject[StatsParserConstants.STATISTICS][0];
                //fetch the StatsParserConstants.STATISTICS_NAME
                let statisticName = firstObject[StatsParserConstants.STATISTICS_NAME];
                //Build ResultSeriesId
                let resultSeriesId = 'rep'.concat(repID).concat(statisticName);
                //calculate the resutType by its name
                let type = ResultSeriesType.getByName(statisticName);
                //Use type to build the chart subtitle
                properties.subtitle = type.toString();
                //Build ResultSeriesName
                //let resultSeriesName = 'Repertoire '.concat(repID).concat(' ').concat(type.toString());
                // We use the type for subtitle, no need to use it in series name.
                let resultSeriesName = 'Repertoire '.concat(repID);
                //fetch the StatsParserConstants.TOTAL
                let totalUsageCount = firstObject[StatsParserConstants.TOTAL];
                //Junction length will be displayed as percentages, will need the total UsageCount
                //generate the series
                let series = new ResultSeries()
                    .setRepertoireId(repID)
                    .setSampleProcessingId(messageArrayObjectRepertoires[StatsParserConstants.SAMPLE_PROCESSING_ID])
                    .setDataProcessingId(messageArrayObjectRepertoires[StatsParserConstants.DATA_PROCESSING_ID])
                    .setId(resultSeriesId)
                    .setName(resultSeriesName)
                    .setFieldName(statisticName)
                    .setColor(color)
                    .setType(type);
                let seriesData = series.data;
                //fetch the data into ResultSeriesDataItem
                let totalUsageCountValidator = 0;
                for (let i = 0, count = 0; i < firstObject[StatsParserConstants.DATA].length; i++) {
                    let dataObject = firstObject[StatsParserConstants.DATA][i];
                    //Remenber that it is to be set as percentage, I expect this.totalUsageCount is correct, but will do a validation count
                    let value = dataObject[StatsParserConstants.VALUE];
                    totalUsageCountValidator += value;
                    let dataItem = new ResultSeriesDataItem().setName(dataObject[StatsParserConstants.KEY]).setY(value/totalUsageCount);                    
                    seriesData.push(dataItem);
                }
                if (totalUsageCountValidator != totalUsageCount){
                    this.#_logger.error("Inconsistency between the statistics value for total " + statisticName + " and the sun of the individual values (" + totalUsageCount + "/" + totalUsageCountValidator + ").");
                }
                //TODO: Before sorting I need to normalize data structures (for example ensure that all series have all named values, set to zero the missing ones.)
                //Sort elements by name 
                seriesData.sort((a, b) => a.name-b.name);
                mainSeries.push(series);
                //{name: (this.#_multipleSeries ? "Repertoire: " + repertoireName : familySeriesName),data: seriesData})
            } else {
                //Probably we have an error in the result. Should abort and return?
            }
        }
        this.#_series = mainSeries;
        timer.end("parse");
        timer.print();
    }
}


/**
 * GeneUsageDrilldownStatsParser assumes that when parsing a drilldown Gene Stats it will receive an 
 * subgroup (family) > gene > call (allele) structure.
 * If other structure is passed to the parser, then errors may arrise.
 * 
 * @description GeneUsageDrilldownStatsParser is a {Parser} for {GeneStatsResult} with drilldown capabilities
 * @author Marco Amaro Oliveira
 * @class GeneUsageDrilldownStatsParser
 * @extends {Parser}
 */
class GeneUsageDrilldownStatsParser extends DrilldownParser {
    #_logger;

    #_geneType;

    #_multipleSeries;

    // Array of ResultSeries
    #_series;

    // Array of ResultSeries
    #_drilldownSeries;

    // Dictionary (key=repetoire_id, value= Array of all ResultSeries children of repertoire_id independent of type)
    #_seriesByRepertoire;

    // Dictionary (key=familyName, value= Array of all ResultSeries children of familyName across all repertoires)
    // Each element of the value Array must be a ResultSeries grouping all (GENE) values of a repertoire that are contained in a family.
    #_geneSeriesByFamily;

    // Dictionary (key=geneName, value= Array of all ResultSeries children of geneName across all repertoires)
    // Each element of the value Array must be a ResultSeries grouping all (CELL) values of a repertoire that are contained in a gene.
    #_cellSeriesByGene;

    // Dictionary (key=repetoire_id, value= Array of all ResultSeries children of type FAMILY in repertoire_id)
    // Each element of the value Array must be a ResultSeries grouping all (FAMILY) values of a repertoire.
    #_familySeriesByRepertoire;

    // Dictionary (key=repetoire_id, value= Array of all ResultSeries children of type GENE in repertoire_id)
    // Each element of the value Array must be a ResultSeries grouping all (GENE) values of a repertoire.
    #_geneSeriesByRepertoire;

    // Dictionary (key=repetoire_id, value= Array of all ResultSeries children of type GENE in repertoire_id)
    // Each element of the value Array must be a ResultSeries grouping all (CELL) values of a repertoire.
    #_cellSeriesByRepertoire;

    /**
     * Creates an instance of GeneUsageDrilldownStatsParser.
     * @param {GeneType} type
     * @memberof GeneUsageDrilldownStatsParser
     */
    constructor(type) {
        super();
        this.#_logger = new Logger('GeneUsageDrilldownStatsParser');
        this.#_logger.debug("Constructor.");
        if (!GeneType.contains(type)) {
            logger.fatal('type must exist in GeneType.genes');
            throw 'type must exist in GeneType.genes';
        }
        this.#_geneType = type;
        this.#_multipleSeries = false;

        this.#_series = [];
        this.#_drilldownSeries = {series: []};

        // Dictionaries for processing ResultSeries structures by grouping type.
        this.#_seriesByRepertoire = {};
        this.#_geneSeriesByFamily = {};
        this.#_cellSeriesByGene = {};
        this.#_familySeriesByRepertoire = {};
        this.#_geneSeriesByRepertoire = {};
        this.#_cellSeriesByRepertoire = {};
    }

    get drilldown(){
        return true;
    }

    get geneType() {
        return this.#_geneType;
    }

    get series(){
        this.#_logger.debug("getting series.");
        return this.#_series;
    }
    
    get drilldownSeries(){
        this.#_logger.debug("getting drilldown series.");
        // We need to know if we are applying an event function or a drilldown object.
        // If we need to drilldown within multiple series, then our only option is to use drilldown event. Then we need to return an empty drilldown object.
        // If we have only one series to drill on, we can (and its better to) use the drilldown object.
        // If we don't apply drilldown, return an empty drilldown object.
        if (!this.drilldown || this.multipleSeries){
            let emptyDrilldownObject = {series: []};
            this.#_logger.trace(JSON.stringify(emptyDrilldownObject));
            return emptyDrilldownObject;
        }       
        this.#_logger.trace(JSON.stringify(this.#_drilldownSeries));
        return this.#_drilldownSeries;
    }

    get multipleSeries() {
        return this.#_multipleSeries;
    }

    isMultipleSeries() {
        return this.multipleSeries;
    }
                    
    get drillupSeriesEvent(){
        if (!this.drilldown){
            return undefined;
            //return function(e){};
        }
        let logger = this.#_logger;
        if (!this.#_multipleSeries){
            logger.debug("retrieving single series drillup event");
            return function(e) {
                let chart = this
                logger.trace(e.toString());
                //logger.trace(JSON.stringify(chart));
            };    
        }
        logger.debug("retrieving multiple series drillup event");
        return function(e) {
                let chart = this
                logger.trace(e.toString());
                //logger.trace(JSON.stringify(chart));
        };    
            
    }
    get drilldownSeriesEvent(){
        this.#_logger.debug("requested drilldown event");
        if (!this.drilldown){
            return undefined;
            //return function(e){};
        }
        let logger = this.#_logger;
        if (!this.#_multipleSeries){
            this.#_logger.debug("retrieving single series drilldown event");
            return function(e) {
                let chart = this;
                chart.setTitle(null, { text: e.point.name });
                logger.trace(e.toString());
            };    
        }
        // I may need a structure to hold the drilldown and drillup level and labels. That way we can have a subtitle of the type 'Families' > ' Genes' > '...' and a label for drillup button.
        let drilldownSeries = {...this.#_geneSeriesByFamily, ...this.#_cellSeriesByGene};
        return function(e) {
            let random = Common.makeid(12);
            let chart = this
            console.log(chart);
            logger.trace(random + ", " + e.toString());
            if (!e.seriesOptions) {
                console.log(chart.series);
                console.log(e.point);

                //chart.series[0].remove();
                //for (var i = 0; i < chart.series.length; i++) {
                //    chart.series[i].remove(true);
                //}
                chart.setTitle(null, { text: e.point.name });
                logger.debug(random + ", " + "Gathering drilldown series for " + e.point.drilldown);
                for (let i = 0; i < drilldownSeries[e.point.drilldown].length; i++){
                    let series = drilldownSeries[e.point.drilldown][i];
                    logger.debug(random + ", " + "Found series")
                    logger.trace(JSON.stringify(series));
                    chart.addSingleSeriesAsDrilldown(e.point, series.asHighchartSeries());
                }
                logger.trace(JSON.stringify(chart.drilldown));
                //chart.addSingleSeriesAsDrilldown(e.point, series[0]);
                //chart.addSingleSeriesAsDrilldown(e.point, series[1]);
                //logger.trace(JSON.stringify(chart));
                console.log(chart.series);
                console.log(e.point);
                chart.applyDrilldown();
                console.log(chart.series);
                console.log(e.point);
            }else{
                chart.setTitle(null, {text: e.seriesOptions.name});
            }
        }            
    }

    _initializeRepertoire(repertoire_id) {
        this.#_logger.debug("Initializing repertoire " + repertoire_id);
        if (!this.#_seriesByRepertoire[repertoire_id]) { this.#_seriesByRepertoire[repertoire_id] = []; }
        if (!this.#_familySeriesByRepertoire[repertoire_id]) { this.#_familySeriesByRepertoire[repertoire_id] = []; }
        if (!this.#_geneSeriesByRepertoire[repertoire_id]) { this.#_geneSeriesByRepertoire[repertoire_id] = []; }
        if (!this.#_cellSeriesByRepertoire[repertoire_id]) { this.#_cellSeriesByRepertoire[repertoire_id] = []; }
    }

    _initializeGeneGroup(repertoire_id, geneGroupName) {
        if (!this.#_geneSeriesByFamily[geneGroupName]) {
            this.#_logger.debug("Initializing #_geneSeriesByFamily[" + geneGroupName + "].");
            this.#_geneSeriesByFamily[geneGroupName] = [];
        }

    }

    _initializeCellGroup(repertoire_id, cellGroupName) {
        if (!this.#_cellSeriesByGene[cellGroupName]) {
            this.#_logger.debug("Initializing #_cellSeriesByGene[" + cellGroupName + "].");
            this.#_cellSeriesByGene[cellGroupName] = [];
        }

    }

    _addToStructures(series) {
        if (!(series instanceof ResultSeries)) {
            throw 'series type must be ResultSeries';
        }
        let repertoire_id = series.repertoireId;
        let type = series.type;
        let parentName = series.parentName;
        switch (type.typeCode) {
            case ResultSeriesType.FAMILY:
                this.#_familySeriesByRepertoire[repertoire_id].push(series);
                break;
            case ResultSeriesType.GENE:
                this.#_logger.debug("Received a new series of Genes. Repertoire:" + repertoire_id + " , parentName:" + parentName);
                if (parentName) {
                    // This is a partial Series of ResultSeriesDataItem grouped by a common parent.
                    this.#_logger.debug("Adding to #_geneSeriesByFamily[" + parentName + "] :")
                    this.#_geneSeriesByFamily[parentName].push(series);
                    this.#_logger.debug(this.#_geneSeriesByFamily[parentName]);
                } else {
                    this.#_geneSeriesByRepertoire[repertoire_id].push(series);
                }
                break;
            case ResultSeriesType.CALL:
                if (parentName) {
                    // This is a partial Series of ResultSeriesDataItem grouped by a common parent.
                    this.#_logger.debug("Adding to #_cellSeriesByGene[" + parentName + "] :")
                    this.#_cellSeriesByGene[parentName].push(series);
                    this.#_logger.debug(this.#_cellSeriesByGene[parentName]);
                } else {
                    this.#_cellSeriesByRepertoire[repertoire_id].push(series);
                }
                break;
            default:
                throw 'Trying to process an incompatible Result Series type in GeneUsageDrilldownStatsParser.';
        }
        this.#_seriesByRepertoire[repertoire_id].push(series);
    }

    preparse(sourceData) {
        this.#_logger.trace("preparse.");

    }

    onparse(data) {
        this.#_logger.trace("parse");
        let timer = new DebugTimer();
        timer.start("parse");
        //Highcharts default
        //let seriesColors = ["rgb(124,181,236)", "rgb(67,67,72)", "rgb(144,237,125)"];
        //Colorblind safe
        //let seriesColors = ["rgb(49,54,149)", "rgb(69,117,180)", "rgb(116,173,209)", "rgb(171,217,233)", "rgb(224,243,248)", "rgb(255,255,191)", "rgb(254,224,144)", "rgb(253,174,97)", "rgb(244,109,67)", "rgb(215,48,39)", "rgb(165,0,38)"];
        let seriesColors = ["rgb(0,66,157)", "rgb(43,87,167)", "rgb(66,108,176)", "rgb(86,129,185)", "rgb(105,151,194)", "rgb(125,174,202)", "rgb(147,196,210)", "rgb(171,218,217)", "rgb(202,239,223)", "rgb(255,226,202)", "rgb(255,196,180)", "rgb(255,165,158)", "rgb(249,134,137)", "rgb(237,105,118)", "rgb(221,76,101)", "rgb(202,47,85)", "rgb(177,19,70)", "rgb(147,0,58)"]
        let colorIndex = 0;
        let colorIndexJumper = 1;
        let gene = this.#_geneType;
        let mainSeries = [];
        let drilldownSeries = [];
        let familySeries;
        let familyNames = [];
        let geneSeries;
        let geneNames = [];
        let cellSeries;
        // let gene = 'd';
        let familyPostfix = StatsParserConstants.POSTFIX_FAMILY;
        let genePostfix = StatsParserConstants.POSTFIX_GENE;
        let geneSpliter = StatsParserConstants.SPLITER_GENE;
        let cellPostfix = StatsParserConstants.POSTFIX_CALL;
        let cellSpliter = StatsParserConstants.SPLITER_CALL;


        if (typeof data === "string") {
            data = JSON.parse(data);
        }

        let messageArray = data[StatsParserConstants.MESSAGE];
        let messageArrayLength = messageArray.length;
        this.#_logger.debug("Data Result length = " + messageArrayLength);
        if (messageArrayLength > 1) {
            //Why is this important? If we have a multiple repertoires, the name of the series will be the name of the repertoire,
            //otherwise the name of the series will be the name of the field.
            this.#_logger.debug("Representing " + messageArrayLength + " repertoires. Will need a 3D chart.");
            this.#_multipleSeries = true;

            if (seriesColors.length < messageArrayLength) {
                this.#_logger.error('Not enough colors set for the amount of repertoires. Please increase the number of colors in seriesColor array.');
                throw 'Not enough colors set for the amount of repertoires. Please increase the number of colors in seriesColor array.';
            }
            colorIndexJumper = Math.floor((seriesColors.length - 1) / (messageArrayLength - 1));

        }
        for (let j = 0; j < messageArrayLength; j++) {
            let color = seriesColors[colorIndex];
            colorIndex += colorIndexJumper;
            let messageArrayObject = messageArray[j];
            let messageArrayObjectRepertoires = messageArrayObject[StatsParserConstants.REPERTOIRES];

            //fetch the StatsParserConstants.REPERTOIRE_ID
            let repID = messageArrayObjectRepertoires[StatsParserConstants.REPERTOIRE_ID];
            this._initializeRepertoire(repID);

            for (let i = 0; i < messageArrayObject[StatsParserConstants.STATISTICS].length; i++) {
                let statisticsObject = messageArrayObject[StatsParserConstants.STATISTICS][i];
                let statisticName = statisticsObject[StatsParserConstants.STATISTICS_NAME];
                let resultTypeCode = ResultSeriesType.getByName(statisticName).typeCode;
                if (resultTypeCode == ResultSeriesType.FAMILY) {
                    familySeries = statisticsObject;
                } else if (resultTypeCode == ResultSeriesType.GENE) {
                    geneSeries = statisticsObject;
                } else if (resultTypeCode == ResultSeriesType.CALL) {
                    cellSeries = statisticsObject;
                }
            }
            if (!familySeries || !geneSeries || !cellSeries){
                throw 'Incomplete structure for Drilldown. A structure of subgroup > gene > cell is required.';
            }
            if (familySeries) {
                //fetch the StatsParserConstants.STATISTICS_NAME
                let statisticName = familySeries[StatsParserConstants.STATISTICS_NAME];
                //Build ResultSeriesId
                let resultSeriesId = 'rep'.concat(repID).concat(familyPostfix);
                //calculate the resutType by its name
                let type = ResultSeriesType.getByName(statisticName)
                //Build ResultSeriesName
                let resultSeriesName = 'Repertoire '.concat(repID).concat(' ').concat(type.toString());
                //fetch the StatsParserConstants.TOTAL
                let totalUsageCount = familySeries[StatsParserConstants.TOTAL];
                //this is the main series for a repertoire.
                let series = new ResultSeries()
                    .setRepertoireId(repID)
                    .setSampleProcessingId(messageArrayObjectRepertoires[StatsParserConstants.SAMPLE_PROCESSING_ID])
                    .setDataProcessingId(messageArrayObjectRepertoires[StatsParserConstants.DATA_PROCESSING_ID])
                    .setId(resultSeriesId)
                    .setName(resultSeriesName)
                    .setFieldName(statisticName)
                    .setColor(color)
                    .setType(type);
                let seriesData = series.data;
                for (let i = 0; i < familySeries[StatsParserConstants.DATA].length; i++) {
                    let dataObject  = familySeries[StatsParserConstants.DATA][i]; 
                    let familyName = (dataObject[StatsParserConstants.KEY] || '');
                    let geneGroupName = familyName.concat(genePostfix);
                    familyNames.push(familyName);
                    this._initializeGeneGroup(repID, geneGroupName);
                    let dataItem = new ResultSeriesDataItem().setName(familyName).setY(dataObject[StatsParserConstants.VALUE]).setDrilldown(geneGroupName);
                    seriesData.push(dataItem);
                }
                mainSeries.push(series);
                this._addToStructures(series);
            }

            if (geneSeries) {
                //fetch the StatsParserConstants.STATISTICS_NAME
                let statisticName = geneSeries[StatsParserConstants.STATISTICS_NAME];
                //Build ResultSeriesId
                let resultSeriesId = 'rep'.concat(repID).concat(genePostfix);
                //calculate the resutType by its name
                let type = ResultSeriesType.getByName(statisticName)
                //Build ResultSeriesName
                let resultSeriesName = 'Repertoire '.concat(repID).concat(' ').concat(type.toString());
                //this is a second series (for drilldown).
                //We will need several ResultSeries, one that will hold all the Gene values (dataItems) in the repertoire and, one for each family of Genes in a repertoire
                let series = new ResultSeries()
                    .setRepertoireId(repID)
                    .setSampleProcessingId(messageArrayObjectRepertoires[StatsParserConstants.SAMPLE_PROCESSING_ID])
                    .setDataProcessingId(messageArrayObjectRepertoires[StatsParserConstants.DATA_PROCESSING_ID])
                    .setId(resultSeriesId)
                    .setName(resultSeriesName)
                    .setFieldName(statisticName)
                    .setColor(color)
                    .setType(type);
                let seriesData = series.data;
                //Build a dictionary to group genes series by family
                let geneSeriesDict = new Object();
                for (let i = 0; i < familyNames.length; i++) {
                    let geneGroupName = familyNames[i].concat(genePostfix);
                    let geneSeriesName = familyNames[i].concat(' ').concat(type.toString());
                    geneSeriesDict[familyNames[i]] = new ResultSeries()
                        .setRepertoireId(repID)
                        .setSampleProcessingId(messageArrayObjectRepertoires[StatsParserConstants.SAMPLE_PROCESSING_ID])
                        .setDataProcessingId(messageArrayObjectRepertoires[StatsParserConstants.DATA_PROCESSING_ID])
                        .setId(geneGroupName)
                        .setName(geneSeriesName)
                        .setFieldName(statisticName)
                        .setType(type)
                        .setColor(color)
                        .setParentName(geneGroupName);
                }
                for (let i = 0; i < geneSeries[StatsParserConstants.DATA].length; i++) {
                    let dataObject  = geneSeries[StatsParserConstants.DATA][i]; 
                    let geneName = (dataObject[StatsParserConstants.KEY] || '');
                    let cellGroupName = geneName.concat(cellPostfix)
                    geneNames.push(geneName);
                    this._initializeCellGroup(repID, cellGroupName);
                    let geneSpliterIndex = geneName.indexOf(geneSpliter);
                    let familyName = geneName.substring(0, geneSpliterIndex);
                    let dataItem = new ResultSeriesDataItem().setName(geneName).setY(dataObject[StatsParserConstants.VALUE]).setDrilldown(cellGroupName);
                    seriesData.push(dataItem);
                    geneSeriesDict[familyName].data.push(dataItem);
                }
                this.#_logger.trace("All Gene data series for Repertoire " + repID + ": ");
                this.#_logger.trace(JSON.stringify(series));
                this._addToStructures(series);
                this.#_logger.trace("All series for gene data grouped by family : ");
                this.#_logger.trace(JSON.stringify(geneSeriesDict));
                for (let key in geneSeriesDict) {
                    let value = geneSeriesDict[key];
                    this._addToStructures(value);
                    //TODO: Need to changed this. drilldown series is to be of type ResultSeries (remove the .asHighchartSeries()).
                    drilldownSeries.push(value.asHighchartSeries());
                    //{name: key.concat(' Genes'),id: key.concat(genePostfix),data: value.asHighchartSeries()});
                }
            }

            if (cellSeries) {
                //fetch the StatsParserConstants.STATISTICS_NAME
                let statisticName = cellSeries[StatsParserConstants.STATISTICS_NAME];
                //Build ResultSeriesId
                let resultSeriesId = 'rep'.concat(repID).concat(cellPostfix);
                //calculate the resutType by its name
                let type = ResultSeriesType.getByName(statisticName)
                //Build ResultSeriesName
                let resultSeriesName = 'Repertoire '.concat(repID).concat(' ').concat(type.toString());
                //this a third series for drilldown.
                //We will need several ResultSeries, one that will hold all the Allele values (dataItems) in the repertoire and, one for each Genes group in a repertoire
                let series = new ResultSeries()
                    .setRepertoireId(repID)
                    .setSampleProcessingId(messageArrayObjectRepertoires[StatsParserConstants.SAMPLE_PROCESSING_ID])
                    .setDataProcessingId(messageArrayObjectRepertoires[StatsParserConstants.DATA_PROCESSING_ID])
                    .setId(resultSeriesId)
                    .setName(resultSeriesName)
                    .setFieldName(statisticName)
                    .setColor(color)
                    .setType(type);
                let seriesData = series.data;
                //Build a dictionary to greoup cells by gene
                let cellSeriesDict = new Object();
                for (let i = 0; i < geneNames.length; i++) {
                    //cellSeriesDict[geneNames[i]] = [];
                    let cellGroupName = geneNames[i].concat(cellPostfix);
                    let cellSeriesName = geneNames[i].concat(' ').concat(type.toString());
                    cellSeriesDict[geneNames[i]] = new ResultSeries()
                        .setRepertoireId(repID)
                        .setSampleProcessingId(messageArrayObjectRepertoires[StatsParserConstants.SAMPLE_PROCESSING_ID])
                        .setDataProcessingId(messageArrayObjectRepertoires[StatsParserConstants.DATA_PROCESSING_ID])
                        .setId(cellGroupName)
                        .setName(cellSeriesName)
                        .setFieldName(statisticName)
                        .setType(type)
                        .setColor(color)
                        .setParentName(cellGroupName);
                }
                for (let i = 0; i < cellSeries[StatsParserConstants.DATA].length; i++) {
                    let dataObject  = cellSeries[StatsParserConstants.DATA][i]; 
                    let cellName = (dataObject[StatsParserConstants.KEY] || '');
                    let cellSpliterIndex = cellName.indexOf(cellSpliter);
                    let geneName = cellName.substring(0, cellSpliterIndex);
                    let dataItem = new ResultSeriesDataItem().setName(cellName).setY(dataObject[StatsParserConstants.VALUE]);
                    seriesData.push(dataItem);
                    cellSeriesDict[geneName].data.push(dataItem);
                }
                //    this.#_logger.trace(JSON.stringify(cellSeriesDict));
                for (let key in cellSeriesDict) {
                    let value = cellSeriesDict[key];
                    this._addToStructures(value);
                    //TODO: Need to changed this. drilldown series is to be of type ResultSeries (remove the .asHighchartSeries()).
                    drilldownSeries.push(value.asHighchartSeries());
                }
            }
        }
        //  this.#_logger.debug('Series:');
        //  this.#_logger.debug(series);
        //  this.#_logger.debug('DrilldownSeries:');
        //  this.#_logger.debug(drilldownSeries);

        //return [series, {series:drilldownSeries}];
        this.#_series = mainSeries;
        this.#_drilldownSeries = { series: drilldownSeries };

        timer.end("parse");
        timer.print();
    }
}

/**
 *  
 * @description GeneUsageStatsParser is a {Parser} for {GeneStatsResult} without drilldown capabilities
 * @author Marco Amaro Oliveira
 * @class GeneUsageStatsParser
 * @extends {Parser}
 */
class GeneUsageStatsParser extends Parser {
    #_logger;
    //#_geneType;
    #_multipleSeries;
    // Array of ResultSeries
    #_series;
    #_seriesByRepertoire;

    /**
     * Creates an instance of GeneUsageStatsParser.
     * @memberof GeneUsageStatsParser
     */
    constructor() {
        super();
        this.#_logger = new Logger('GeneUsageStatsParser');
        this.#_logger.debug("Constructor.");
        /*
        if (!GeneType.contains(type)) {
            logger.fatal('type must exist in GeneType.genes');
            throw 'type must exist in GeneType.genes';
        }
        this.#_geneType = type;
        */
        this.#_multipleSeries = false;

        this.#_series = [];
        this.#_seriesByRepertoire = [];
    }

    get drilldown(){
        return false;
    }
    /*
    get geneType() {
        return this.#_geneType;
    }
    */

    get series(){
        this.#_logger.debug("getting series.");
        return this.#_series;
    }
    
    get drilldownSeries(){
        this.#_logger.debug("getting drilldown series.");
        let emptyDrilldownObject = {series: []};
        this.#_logger.trace(JSON.stringify(emptyDrilldownObject));
        return emptyDrilldownObject;
    }

    get multipleSeries() {
        return this.#_multipleSeries;
    }

    isMultipleSeries() {
        return this.multipleSeries;
    }
                    
    get drillupSeriesEvent(){
        return undefined;
    }

    get drilldownSeriesEvent(){
        this.#_logger.debug("requested drilldown event");
        return undefined;
    }

    _initializeRepertoire(repertoire_id) {
        this.#_logger.debug("Initializing repertoire " + repertoire_id);
        if (!this.#_seriesByRepertoire[repertoire_id]) {
             this.#_seriesByRepertoire[repertoire_id] = []; 
        }
    }

    preparse(sourceData) {
        this.#_logger.trace("preparse.");

    }

    onparse(data) {
        this.#_logger.trace("parse");
        let timer = new DebugTimer();
        timer.start("parse");
        //TOOD: Will need to get this from properties.
        let seriesColors = ["rgb(0,66,157)", "rgb(43,87,167)", "rgb(66,108,176)", "rgb(86,129,185)", "rgb(105,151,194)", "rgb(125,174,202)", "rgb(147,196,210)", "rgb(171,218,217)", "rgb(202,239,223)", "rgb(255,226,202)", "rgb(255,196,180)", "rgb(255,165,158)", "rgb(249,134,137)", "rgb(237,105,118)", "rgb(221,76,101)", "rgb(202,47,85)", "rgb(177,19,70)", "rgb(147,0,58)"]
        let colorIndex = 0;
        let colorIndexJumper = 1;
        //let gene = this.#_geneType;
        let mainSeries = [];

        if (typeof data === "string") {
            data = JSON.parse(data);
        }

        let messageArray = data[StatsParserConstants.MESSAGE];
        let messageArrayLength = messageArray.length;
        this.#_logger.debug("Data Result length = " + messageArrayLength);
        if (messageArrayLength > 1) {
            //Why is this important? If we have a multiple repertoires, the name of the series will be the name of the repertoire,
            //otherwise the name of the series will be the name of the field.
            this.#_logger.debug("Representing " + messageArrayLength + " repertoires. Will need a 3D chart.");
            this.#_multipleSeries = true;

            if (seriesColors.length < messageArrayLength) {
                this.#_logger.error('Not enough colors set for the amount of repertoires. Please increase the number of colors in seriesColor array.');
                throw 'Not enough colors set for the amount of repertoires. Please increase the number of colors in seriesColor array.';
            }
            colorIndexJumper = Math.floor((seriesColors.length - 1) / (messageArrayLength - 1));

        }

        for (let j = 0; j < messageArrayLength; j++) {
            let color = seriesColors[colorIndex];
            colorIndex += colorIndexJumper;
            let messageArrayObject = messageArray[j];
            let messageArrayObjectRepertoires = messageArrayObject[StatsParserConstants.REPERTOIRES];
            
            //fetch the StatsParserConstants.REPERTOIRE_ID
            let repID = messageArrayObjectRepertoires[StatsParserConstants.REPERTOIRE_ID];
 
            //If we have at least on StatsParserConstants.STATISTIC for this repertoire
            if(messageArrayObject[StatsParserConstants.STATISTICS].length > 0) {
                //Initialize the repertoire
                this._initializeRepertoire(repID);
                //fetch the first object of StatsParserConstants.STATISTICS
                let firstObject = messageArrayObject[StatsParserConstants.STATISTICS][0];
                //fetch the StatsParserConstants.STATISTICS_NAME
                let statisticName = firstObject[StatsParserConstants.STATISTICS_NAME];
                //Build ResultSeriesId
                let resultSeriesId = 'rep'.concat(repID).concat(statisticName);
                //calculate the resutType by its name
                let type = ResultSeriesType.getByName(statisticName)
                //Build ResultSeriesName
                let resultSeriesName = 'Repertoire '.concat(repID).concat(' ').concat(type.toString());
                //fetch the StatsParserConstants.TOTAL
                let totalUsageCount = firstObject[StatsParserConstants.TOTAL];
                //generate the series
                let series = new ResultSeries()
                    .setRepertoireId(repID)
                    .setSampleProcessingId(messageArrayObjectRepertoires[StatsParserConstants.SAMPLE_PROCESSING_ID])
                    .setDataProcessingId(messageArrayObjectRepertoires[StatsParserConstants.DATA_PROCESSING_ID])
                    .setId(resultSeriesId)
                    .setName(resultSeriesName)
                    .setFieldName(statisticName)
                    .setColor(color)
                    .setType(type);
                let seriesData = series.data;
                //fetch the data into ResultSeriesDataItem
                for (let i = 0; i < firstObject[StatsParserConstants.DATA].length; i++) {
                    let dataObject = firstObject[StatsParserConstants.DATA][i];
                    let dataItem = new ResultSeriesDataItem().setName(dataObject[StatsParserConstants.KEY]).setY(dataObject[StatsParserConstants.VALUE]);                    
                    seriesData.push(dataItem);
                }
                mainSeries.push(series);
                //{name: (this.#_multipleSeries ? "Repertoire: " + repertoireName : familySeriesName),data: seriesData})
            } else {
                //Probably we have an error in the result. Should abort and return?
            }
            
        }
        this.#_series = mainSeries;
        timer.end("parse");
        timer.print();
    }
}

/**
 * JGeneUsageDrilldownStatsParser assumes that when parsing a drilldown Gene Stats it will receive an 
 * gene > call (allele) structure. If a statics for subgroup (family) is received, it will be ignored.
 * If other structure is passed to the parser, then errors may arrise.
 * 
 * @description JGeneUsageDrilldownStatsParser is a {Parser} for a Type J {GeneStatsResult} with drilldown capabilities
 * @author Marco Amaro Oliveira
 * @class JGeneUsageDrilldownStatsParser
 * @extends {Parser}
 */
class JGeneUsageDrilldownStatsParser extends DrilldownParser {
    #_logger;

    #_geneType;

    #_multipleSeries;

    // Array of ResultSeries
    #_series;

    // Array of ResultSeries
    #_drilldownSeries;

    // Dictionary (key=repetoire_id, value= Array of all ResultSeries children of repertoire_id independent of type)
    #_seriesByRepertoire;

    // Dictionary (key=geneName, value= Array of all ResultSeries children of geneName across all repertoires)
    // Each element of the value Array must be a ResultSeries grouping all (CELL) values of a repertoire that are contained in a gene.
    #_cellSeriesByGene;

    // Dictionary (key=repetoire_id, value= Array of all ResultSeries children of type GENE in repertoire_id)
    // Each element of the value Array must be a ResultSeries grouping all (GENE) values of a repertoire.
    #_geneSeriesByRepertoire;

    // Dictionary (key=repetoire_id, value= Array of all ResultSeries children of type GENE in repertoire_id)
    // Each element of the value Array must be a ResultSeries grouping all (CELL) values of a repertoire.
    #_cellSeriesByRepertoire;

    /**
     * Creates an instance of GeneUsageDrilldownStatsParser.
     * @param {GeneType} type
     * @memberof GeneUsageDrilldownStatsParser
     */
    constructor(type) {
        //TODO: remove genetype parameter from the constructor.
        super();
        this.#_logger = new Logger('GeneUsageDrilldownStatsParser');
        this.#_logger.debug("Constructor.");
        if (type != GeneType.J_GENE ) {
            logger.fatal('type must be GeneType.J_TYPE');
            throw 'type must be GeneType.J_TYPE';
        }
        this.#_geneType = type;
        this.#_multipleSeries = false;

        this.#_series = [];
        this.#_drilldownSeries = {series: []};

        // Dictionaries for processing ResultSeries structures by grouping type.
        this.#_seriesByRepertoire = {};
        this.#_cellSeriesByGene = {};
        this.#_geneSeriesByRepertoire = {};
        this.#_cellSeriesByRepertoire = {};
    }

    get drilldown(){
        return true;
    }

    get geneType() {
        return this.#_geneType;
    }

    get series(){
        this.#_logger.debug("getting series.");
        return this.#_series;
    }
    
    get drilldownSeries(){
        this.#_logger.debug("getting drilldown series.");
        // We need to know if we are applying an event function or a drilldown object.
        // If we need to drilldown within multiple series, then our only option is to use drilldown event. Then we need to return an empty drilldown object.
        // If we have only one series to drill on, we can (and its better to) use the drilldown object.
        // If we don't apply drilldown, return an empty drilldown object.
        if (this.multipleSeries){
            let emptyDrilldownObject = {series: []};
            this.#_logger.trace(JSON.stringify(emptyDrilldownObject));
            return emptyDrilldownObject;
        }       
        this.#_logger.trace(JSON.stringify(this.#_drilldownSeries));
        return this.#_drilldownSeries;
    }

    get multipleSeries() {
        return this.#_multipleSeries;
    }

    isMultipleSeries() {
        return this.multipleSeries;
    }
                    
    get drillupSeriesEvent(){
        let logger = this.#_logger;
        if (!this.#_multipleSeries){
            logger.debug("retrieving single series drillup event");
            return function(e) {
                let chart = this
                logger.trace(e.toString());
                //logger.trace(JSON.stringify(chart));
            };    
        }
        logger.debug("retrieving multiple series drillup event");
        return function(e) {
                let chart = this
                logger.trace(e.toString());
                //logger.trace(JSON.stringify(chart));
        };    
            
    }
    get drilldownSeriesEvent(){
        this.#_logger.debug("requested drilldown event");
        let logger = this.#_logger;
        if (!this.#_multipleSeries){
            this.#_logger.debug("retrieving single series drilldown event");
            return function(e) {
                let chart = this;
                chart.setTitle(null, { text: e.point.name });
                logger.trace(e.toString());
            };    
        }
        // I may need a structure to hold the drilldown and drillup level and labels. That way we can have a subtitle of the type 'Families' > ' Genes' > '...' and a label for drillup button.
        let drilldownSeries = { ...this.#_cellSeriesByGene};
        return function(e) {
            let random = Common.makeid(12);
            let chart = this
            console.log(chart);
            logger.trace(random + ", " + e.toString());
            if (!e.seriesOptions) {
                console.log(chart.series);
                console.log(e.point);

                //chart.series[0].remove();
                //for (var i = 0; i < chart.series.length; i++) {
                //    chart.series[i].remove(true);
                //}
                chart.setTitle(null, { text: e.point.name });
                logger.debug(random + ", " + "Gathering drilldown series for " + e.point.drilldown);
                for (let i = 0; i < drilldownSeries[e.point.drilldown].length; i++){
                    let series = drilldownSeries[e.point.drilldown][i];
                    logger.debug(random + ", " + "Found series")
                    logger.trace(JSON.stringify(series));
                    chart.addSingleSeriesAsDrilldown(e.point, series.asHighchartSeries());
                }
                logger.trace(JSON.stringify(chart.drilldown));
                //chart.addSingleSeriesAsDrilldown(e.point, series[0]);
                //chart.addSingleSeriesAsDrilldown(e.point, series[1]);
                //logger.trace(JSON.stringify(chart));
                console.log(chart.series);
                console.log(e.point);
                chart.applyDrilldown();
                console.log(chart.series);
                console.log(e.point);
            }else{
                chart.setTitle(null, {text: e.seriesOptions.name});
            }
        }            
    }

    _initializeRepertoire(repertoire_id) {
        this.#_logger.debug("Initializing repertoire " + repertoire_id);
        if (!this.#_seriesByRepertoire[repertoire_id]) { this.#_seriesByRepertoire[repertoire_id] = []; }
        if (!this.#_geneSeriesByRepertoire[repertoire_id]) { this.#_geneSeriesByRepertoire[repertoire_id] = []; }
        if (!this.#_cellSeriesByRepertoire[repertoire_id]) { this.#_cellSeriesByRepertoire[repertoire_id] = []; }
    }

    _initializeCellGroup(repertoire_id, cellGroupName) {
        if (!this.#_cellSeriesByGene[cellGroupName]) {
            this.#_logger.debug("Initializing #_cellSeriesByGene[" + cellGroupName + "].");
            this.#_cellSeriesByGene[cellGroupName] = [];
        }

    }

    _addToStructures(series) {
        if (!(series instanceof ResultSeries)) {
            throw 'series type must be ResultSeries';
        }
        let repertoire_id = series.repertoireId;
        let type = series.type;
        let parentName = series.parentName;
        switch (type.typeCode) {
            case ResultSeriesType.GENE:
                this.#_geneSeriesByRepertoire[repertoire_id].push(series);
                break;
            case ResultSeriesType.CALL:
                if (parentName) {
                    // This is a partial Series of ResultSeriesDataItem grouped by a common parent.
                    this.#_logger.debug("Adding to #_cellSeriesByGene[" + parentName + "] :")
                    this.#_cellSeriesByGene[parentName].push(series);
                    this.#_logger.debug(this.#_cellSeriesByGene[parentName]);
                } else {
                    this.#_cellSeriesByRepertoire[repertoire_id].push(series);
                }
                break;
            default:
                throw 'Trying to process an incompatible Result Series type in GeneUsageDrilldownStatsParser.';
        }
        //TODO: Check if #_seriesByRepertoire is getting all the full and partial series?
        this.#_seriesByRepertoire[repertoire_id].push(series);
    }

    preparse(sourceData) {
        this.#_logger.trace("preparse.");

    }

    onparse(data) {
        this.#_logger.trace("parse");
        let timer = new DebugTimer();
        timer.start("parse");
        //TODO: We need this colors array being passed into the parser. Allow to set colors array in the properties object?
        let seriesColors = ["rgb(0,66,157)", "rgb(43,87,167)", "rgb(66,108,176)", "rgb(86,129,185)", "rgb(105,151,194)", "rgb(125,174,202)", "rgb(147,196,210)", "rgb(171,218,217)", "rgb(202,239,223)", "rgb(255,226,202)", "rgb(255,196,180)", "rgb(255,165,158)", "rgb(249,134,137)", "rgb(237,105,118)", "rgb(221,76,101)", "rgb(202,47,85)", "rgb(177,19,70)", "rgb(147,0,58)"]
        let colorIndex = 0;
        let colorIndexJumper = 1;
        let mainSeries = [];
        let drilldownSeries = [];
        let geneSeries;
        let geneNames = [];
        let cellSeries;
        let genePostfix = StatsParserConstants.POSTFIX_GENE;
        let geneSpliter = StatsParserConstants.SPLITER_GENE;
        let cellPostfix = StatsParserConstants.POSTFIX_CALL;
        let cellSpliter = StatsParserConstants.SPLITER_CALL;


        if (typeof data === "string") {
            data = JSON.parse(data);
        }

        let messageArray = data[StatsParserConstants.MESSAGE];
        let messageArrayLength = messageArray.length; //The number of repertoires in the message
        this.#_logger.debug("Data Result length = " + messageArrayLength);
        if (messageArrayLength > 1) {
            //Why is this important? If we have a multiple repertoires, the name of the series will be the name of the repertoire,
            //otherwise the name of the series will be the name of the field.
            this.#_logger.debug("Representing " + messageArrayLength + " repertoires. Will need a 3D chart.");
            this.#_multipleSeries = true;

            if (seriesColors.length < messageArrayLength) {
                this.#_logger.error('Not enough colors set for the amount of repertoires. Please increase the number of colors in seriesColor array.');
                throw 'Not enough colors set for the amount of repertoires. Please increase the number of colors in seriesColor array.';
            }
            colorIndexJumper = Math.floor((seriesColors.length - 1) / (messageArrayLength - 1));

        }
        for (let j = 0; j < messageArrayLength; j++) {
            let color = seriesColors[colorIndex];
            colorIndex += colorIndexJumper;
            let messageArrayObject = messageArray[j];
            let messageArrayObjectRepertoires = messageArrayObject[StatsParserConstants.REPERTOIRES];

            //fetch the StatsParserConstants.REPERTOIRE_ID
            let repID = messageArrayObjectRepertoires[StatsParserConstants.REPERTOIRE_ID];
            this._initializeRepertoire(repID);

            for (let i = 0; i < messageArrayObject[StatsParserConstants.STATISTICS].length; i++) {
                let statisticsObject = messageArrayObject[StatsParserConstants.STATISTICS][i];
                let statisticName = statisticsObject[StatsParserConstants.STATISTICS_NAME];
                let resultTypeCode = ResultSeriesType.getByName(statisticName).typeCode;
                if (resultTypeCode == ResultSeriesType.GENE) {
                    geneSeries = statisticsObject;
                } else if (resultTypeCode == ResultSeriesType.CALL) {
                    cellSeries = statisticsObject;
                } else if (resultTypeCode == ResultSeriesType.FAMILY) {
                    //ResultSeriesType.FAMILY statistics for J gene will be ignored if received.
                }
            }
            if (!geneSeries || !cellSeries){
                throw 'Incomplete structure for Drilldown. A structure of gene > call is required.';
            }
            if (geneSeries) {
                //fetch the StatsParserConstants.STATISTICS_NAME
                let statisticName = geneSeries[StatsParserConstants.STATISTICS_NAME];
                //Build ResultSeriesId
                let resultSeriesId = 'rep'.concat(repID).concat(genePostfix);
                //calculate the resutType by its name
                let type = ResultSeriesType.getByName(statisticName)
                //Build ResultSeriesName
                let resultSeriesName = 'Repertoire '.concat(repID).concat(' ').concat(type.toString());
                //fetch the StatsParserConstants.TOTAL
                let totalUsageCount = geneSeries[StatsParserConstants.TOTAL];
                //this is the main series for a repertoire.
                let series = new ResultSeries()
                    .setRepertoireId(repID)
                    .setSampleProcessingId(messageArrayObjectRepertoires[StatsParserConstants.SAMPLE_PROCESSING_ID])
                    .setDataProcessingId(messageArrayObjectRepertoires[StatsParserConstants.DATA_PROCESSING_ID])
                    .setId(resultSeriesId)
                    .setName(resultSeriesName)
                    .setFieldName(statisticName)
                    .setColor(color)
                    .setType(type);
                let seriesData = series.data;
                for (let i = 0; i < geneSeries[StatsParserConstants.DATA].length; i++) {
                    let dataObject  = geneSeries[StatsParserConstants.DATA][i]; 
                    let geneName = (dataObject[StatsParserConstants.KEY] || '');
                    let callGroupName = geneName.concat(cellPostfix);
                    geneNames.push(geneName);
                    this._initializeCellGroup(repID, callGroupName);
                    let dataItem = new ResultSeriesDataItem().setName(geneName).setY(dataObject[StatsParserConstants.VALUE]).setDrilldown(callGroupName);
                    seriesData.push(dataItem);
                }
                //TODO: Before sorting I need to normalize data structures (for example ensure that all series have all named values, set to zero the missing ones.)
                //Sort elements by name 
                seriesData.sort((a, b) => a.name.localeCompare(b.name));
                mainSeries.push(series);
                this._addToStructures(series);
            }

            if (cellSeries) {
                //fetch the StatsParserConstants.STATISTICS_NAME
                let statisticName = cellSeries[StatsParserConstants.STATISTICS_NAME];
                //Build ResultSeriesId
                let resultSeriesId = 'rep'.concat(repID).concat(cellPostfix);
                //calculate the resutType by its name
                let type = ResultSeriesType.getByName(statisticName)
                //Build ResultSeriesName
                let resultSeriesName = 'Repertoire '.concat(repID).concat(' ').concat(type.toString());
                //this a third series for drilldown.
                //We will need several ResultSeries, one that will hold all the Allele values (dataItems) in the repertoire and, one for each Genes group in a repertoire
                let series = new ResultSeries()
                    .setRepertoireId(repID)
                    .setSampleProcessingId(messageArrayObjectRepertoires[StatsParserConstants.SAMPLE_PROCESSING_ID])
                    .setDataProcessingId(messageArrayObjectRepertoires[StatsParserConstants.DATA_PROCESSING_ID])
                    .setId(resultSeriesId)
                    .setName(resultSeriesName)
                    .setFieldName(statisticName)
                    .setColor(color)
                    .setType(type);
                let seriesData = series.data;
                //Build a dictionary to greoup cells by gene
                let cellSeriesDict = new Object();
                for (let i = 0; i < geneNames.length; i++) {
                    //cellSeriesDict[geneNames[i]] = [];
                    let cellGroupName = geneNames[i].concat(cellPostfix);
                    let cellSeriesName = geneNames[i].concat(' ').concat(type.toString());
                    cellSeriesDict[geneNames[i]] = new ResultSeries()
                        .setRepertoireId(repID)
                        .setSampleProcessingId(messageArrayObjectRepertoires[StatsParserConstants.SAMPLE_PROCESSING_ID])
                        .setDataProcessingId(messageArrayObjectRepertoires[StatsParserConstants.DATA_PROCESSING_ID])
                        .setId(cellGroupName)
                        .setName(cellSeriesName)
                        .setFieldName(statisticName)
                        .setType(type)
                        .setColor(color)
                        .setParentName(cellGroupName);
                }
                for (let i = 0; i < cellSeries[StatsParserConstants.DATA].length; i++) {
                    let dataObject  = cellSeries[StatsParserConstants.DATA][i]; 
                    let cellName = (dataObject[StatsParserConstants.KEY] || '');
                    //Note that on J Gene we only have 2 levels Gene > Cell, but the splitter remains cellSpliter.
                    let cellSpliterIndex = cellName.indexOf(cellSpliter);
                    let geneName = cellName.substring(0, cellSpliterIndex);
                    let dataItem = new ResultSeriesDataItem().setName(cellName).setY(dataObject[StatsParserConstants.VALUE]);
                    seriesData.push(dataItem);
                    cellSeriesDict[geneName].data.push(dataItem);
                }
                //TODO: Before sorting I need to normalize data structures (for example ensure that all series have all named values, set to zero the missing ones.)
                //sort elements by name

                seriesData.sort((a, b) => a.name.localeCompare(b.name));
                //    this.#_logger.trace(JSON.stringify(cellSeriesDict));
                for (let key in cellSeriesDict) {
                    let value = cellSeriesDict[key];
                    //Sort elements by name
                    //TODO: This is ineficient, sorting must be applied only once when retrieving the structure for the chart.
                    //TODO: Sorting must be dependent of the values in Properties .sort() or better .sortOn([key|value],[asc,desc]);
                    value.data.sort((a, b) => a.name.localeCompare(b.name));
                    this._addToStructures(value);
                    //TODO: Need to changed this. drilldown series is to be of type ResultSeries (remove the .asHighchartSeries()).
                    drilldownSeries.push(value.asHighchartSeries());
                }
            }
        }
        //  this.#_logger.debug('Series:');
        //  this.#_logger.debug(series);
        //  this.#_logger.debug('DrilldownSeries:');
        //  this.#_logger.debug(drilldownSeries);

        //return [series, {series:drilldownSeries}];
        this.#_series = mainSeries;
        this.#_drilldownSeries = { series: drilldownSeries };

        timer.end("parse");
        timer.print();
    }
}

/*
module.exports = {
    JunctionLenghtStatsParser: JunctionLenghtStatsParser,
    CountStatsParser: CountStatsParser,
    GeneUsageStatsParser: GeneUsageStatsParser,
    GeneUsageDrilldownStatsParser: GeneUsageDrilldownStatsParser,
    JGeneUsageDrilldownStatsParser: JGeneUsageDrilldownStatsParser
};
*/

export { JunctionLenghtStatsParser, CountStatsParser, GeneUsageStatsParser, GeneUsageDrilldownStatsParser, JGeneUsageDrilldownStatsParser };