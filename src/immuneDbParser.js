import {Logger, ResultSeriesType, Common, DebugTimer} from './common.js';
import {Parser, DrilldownParser} from "./parser.js";
import {ResultSeriesDataItem, ResultSeries} from "./series.js";
import {StatsParserConstants} from "./iReceptorStatsParser.js";
import {JSONPath} from 'jsonpath-plus';

/**
 * Static class with constants required by the Stats Parser.
 */
class ImmuneDBStatsParserConstants extends StatsParserConstants{
    static VOCABULARY = {
        STUDY_ID : 'study',
        SUBJECT_ID : "subject_id"
    };

    /**
     * @description STUDY_ID constant
     * @type {string}
     * @static
     * @const
     * @default "study"
     */
    static get STUDY_ID(){
        return ImmuneDBStatsParserConstants.VOCABULARY.STUDY_ID;
    }
    
    /**
     * @description SUBJECT_ID constant
     * @type {string}
     * @static
     * @const
     * @default "subject_id"
     */
    static get SUBJECT_ID(){
        return ImmuneDBStatsParserConstants.VOCABULARY.SUBJECT_ID;
    }
}

/**
 *  
 * ImmuneDBGeneTopCountStatsParser is a {@Link Parser} for {@Link GeneTopCountStatsResult}
 * 
 * @extends {Parser}
 */
class ImmuneDBGeneTopCountStatsParser extends Parser {
    #_logger;
    #_multipleSeries;
    // Array of ResultSeries
    #_series;
    #_seriesByRepertoire;
    #_seriesByStudy;
    #_seriesBySubject;
    #_seriesByKey;
    #_data;
    #_seriesColors;
    #_seriesName;
    #_sort;
    #_percentage;
    #_colorIndex;
    #_colorIndexJumper;

    /**
     * @description Creates an instance of GeneTopCountStatsParser.
     */
    constructor() {
        super();
        this.#_logger = new Logger('ImmuneDBGeneTopCountStatsParser');
        this.#_logger.debug("Constructor.");
        this.#_multipleSeries = false;

        this.#_series = [];
        this.#_seriesByRepertoire = [];
        this.#_seriesByStudy = [];
        this.#_seriesBySubject = [];
        this.#_seriesByKey = [];

        //To be obtained by properties.
        this.#_data = undefined;
        this.#_seriesColors = undefined;
        this.#_seriesName = undefined;
        this.#_sort = undefined;
        this.#_percentage = undefined;
        this.#_colorIndex = 0;
        this.#_colorIndexJumper = 1;
    }

    getSeries(){
        this.#_logger.debug("getting series.");
        let series = [];
        Object.keys(this.#_seriesByKey).forEach(key => {
            series.push(this.#_seriesByKey[key]);
        });
        return series;
    }

    get multipleSeries() {
        return this.isMultipleSeries();
    }

    isMultipleSeries() {
        return this.#_multipleSeries;
    }

    // We don't have repertoire_id
    _initializeRepertoire(repertoire_id) {
        if (!this.#_seriesByRepertoire[repertoire_id]) {
            this.#_logger.debug("Initializing repertoire " + repertoire_id);
            this.#_seriesByRepertoire[repertoire_id] = []; 
        }
        return this.#_seriesByRepertoire[repertoire_id];
    }
    
    _initializeStudy(study_id) {
        if (!this.#_seriesByStudy[repertoire_id]) {
            this.#_logger.debug("Initializing study " + study_id);
            this.#_seriesByStudy[study_id] = []; 
        }
        return this.#_seriesByStudy[study_id];
    }
    
    _initializeSubject(subject_id) {
        if (!this.#_seriesBySubject[subject_id]) {
            this.#_logger.debug("Initializing subject " + subject_id);
            this.#_seriesBySubject[subject_id] = []; 
        }
        return this.#_seriesBySubject[subject_id];
    }
    
    preparse(properties) {
        this.#_logger.trace("preparse.");
        //Build  the structures that will hold the series for each size of key
        // parsedProperties is the instance variable properties in Parser Object
        let parsedProperties = this.properties;

        // Get important values from properties
        this.#_data            = properties.getData();
        this.#_seriesColors    = properties.seriesColors;
        this.#_seriesName      = properties.seriesName;
        this.#_sort            = properties.sort;
        this.#_percentage      = properties.percentage;
        
        let colorIndex = this.#_colorIndex;
        let colorIndexJumper = this.#_colorIndexJumper
        
        if (typeof this.#_data === "string") {
            this.#_data = JSON.parse(this.#_data);
        }
        parsedProperties.setYLabel("Value")
        if (this.#_percentage){
            parsedProperties.setYLabel("Fraction (copies in repertoire)");
            parsedProperties.setDraw3D(false);
        }else if (this.#_multipleSeries){
            parsedProperties.setDraw3D(false);
        }        

        let jsonpathQueryString = '$..'+ImmuneDBStatsParserConstants.KEY;
        let distinctDataKey = [...new Set(JSONPath(jsonpathQueryString, this.#_data))];
        // Need this array to be sorted for later when pltting series on the chart.
        distinctDataKey.sort((a, b) => b.localeCompare(a));
        
        if (distinctDataKey.length > 1) {
            // We have a multiple keys to plot
            this.#_multipleSeries = true;
            //Check color array for sufficient colors for the number of keys.
            if (this.#_seriesColors.length < distinctDataKey.length) {
                this.#_logger.error('Not enough colors set for the amount of repertoires. Please increase the number of colors in seriesColor array.');
                throw 'Not enough colors set for the amount of repertoires. Please increase the number of colors in seriesColor array.';
            }
            colorIndexJumper = Math.floor((this.#_seriesColors.length - 1) / (distinctDataKey.length - 1));
        }
        
        //Prepare a ResultSeries for each of the existing keys
        for (let index = 0; index < distinctDataKey.length; index++) {
            const keyName = distinctDataKey[index];
            const seriesName = keyName.substr(0, 3) + ' ' + keyName.substr(3);
            let color = this.#_seriesColors[colorIndex];
            colorIndex += colorIndexJumper;

            let series = new ResultSeries()
                        .setRepertoireId(undefined) //irrelevant for this structure
                        .setSampleProcessingId(undefined) //irrelevant for this structure
                        .setDataProcessingId(undefined) //irrelevant for this structure
                        .setId(keyName) //irrelevant for this structure
                        .setName(seriesName)
                        .setFieldName(undefined) //irrelevant for this structure
                        .setColor(color);
            this.#_seriesByKey[keyName] = series;
        }
        let subtitle = "";
        Object.keys(this.#_seriesByKey).forEach(key => {
            if (subtitle.length > 0)
                subtitle = subtitle + ", ";
            subtitle = subtitle + key;
        });
        // console.log(subtitle);
        parsedProperties.setSubtitle([subtitle]);
    }

    postparse(properties) {
        this.#_logger.trace("postparse.");
    }

    onparse(properties) {
        this.#_logger.trace("parse");
        let timer = new DebugTimer();
        timer.start("parse");

        let messageArray = this.#_data[StatsParserConstants.MESSAGE];
        let messageArrayLength = messageArray.length;
        this.#_logger.debug("Data Result length = " + messageArrayLength);
        // Specifics for this Parser
        // Iterate over the array of resultObjects
        for (let j = 0; j < messageArrayLength; j++) {
            let messageObject = messageArray[j];
            let messageObjectRepertoires = messageObject[ImmuneDBStatsParserConstants.REPERTOIRES];
            //fetch the ImmuneDBStatsParserConstants.REPERTOIRE_ID
            let studyId = messageObjectRepertoires[ImmuneDBStatsParserConstants.STUDY_ID];
            let subjectId = messageObjectRepertoires[ImmuneDBStatsParserConstants.SUBJECT_ID];
            //ImmuneDB has no repertoire_id
            // let repID = messageObjectRepertoires[ImmuneDBStatsParserConstants.REPERTOIRE_ID];
            let repId = studyId + '-' + subjectId;
 
            let messageObjectStatisticsArray = messageObject[ImmuneDBStatsParserConstants.STATISTICS];
            
            /*
             * Preciso de 3 séries:
             * - top10 
             * - top100
             * - top1000
             * 
             * Dentro de cada série as variáveis são study_id+'-'+'subject_id.
             * 
             * Em top100 o valor é top100-top10
             * Em top1000 o valor é top1000 - top100
             * 
             * Não apresentar num staked chart
             * Apresentar num overlapped chart
             * 
             * Possibilitar o uso de percentagens.
             */



            //If we have at least one StatsParserConstants.STATISTIC for this repertoire
            if(messageObjectStatisticsArray.length > 0) {
                // Although only one is expected iterate over the statistics elements.
                for (let index = 0; index < messageObjectStatisticsArray.length; index++) {
                    //fetch the first object of StatsParserConstants.STATISTICS
                    const statisticsObject = messageObjectStatisticsArray[index];
                    let statisticName = statisticsObject[ImmuneDBStatsParserConstants.STATISTICS_NAME];
                    let statisticTotal = statisticsObject[ImmuneDBStatsParserConstants.TOTAL];
                    let statisticDataArray = statisticsObject[ImmuneDBStatsParserConstants.DATA];
                    //Set the resutType by statistics name
                    let statisticsType = ResultSeriesType.getByName(statisticName)

                    for (let i = 0; i < statisticDataArray.length; i++) {
                        const dataObject = statisticDataArray[i];
                        let keyName = dataObject[StatsParserConstants.KEY];
                        let value = dataObject[StatsParserConstants.VALUE];
                        let dataItem = new ResultSeriesDataItem().setName(repId).setY(this.#_percentage?Common.roundTo(value/statisticTotal*100, 4):value); 

                        this.#_seriesByKey[keyName].data.push(dataItem);
                        
                    }
                    
                }
            } else {
                //Probably we have an error in the result no statistics received. Should abort and return?
            }
            
        }
        timer.end("parse");
        timer.print();
    }
}
/**
 *  
 * ImmuneDBFunctionalityCountStatsParser is a {@Link Parser} for {@Link GeneTopCountStatsResult}
 * 
 * @extends {Parser}
 */
class ImmuneDBFunctionalityCountStatsParser extends Parser {
    #_logger;
    #_multipleSeries;
    // Array of ResultSeries
    #_series;
    #_seriesByRepertoire;
    #_seriesByStudy;
    #_seriesBySubject;
    #_seriesByKey;
    #_data;
    #_seriesColors;
    #_seriesName;
    #_sort;
    #_percentage;
    #_colorIndex;
    #_colorIndexJumper;

    /**
     * @description Creates an instance of GeneTopCountStatsParser.
     */
    constructor() {
        super();
        this.#_logger = new Logger('ImmuneDBFunctionalityCountStatsParser');
        this.#_logger.debug("Constructor.");
        this.#_multipleSeries = false;

        this.#_series = [];
        this.#_seriesByRepertoire = [];
        this.#_seriesByStudy = [];
        this.#_seriesBySubject = [];
        this.#_seriesByKey = [];

        //To be obtained by properties.
        this.#_data = undefined;
        this.#_seriesColors = undefined;
        this.#_seriesName = undefined;
        this.#_sort = undefined;
        this.#_percentage = undefined;
        this.#_colorIndex = 0;
        this.#_colorIndexJumper = 1;
    }

    getSeries(){
        this.#_logger.debug("getting series.");
        let series = [];
        Object.keys(this.#_seriesByKey).forEach(key => {
            series.push(this.#_seriesByKey[key]);
        });
        return series;
    }

    get multipleSeries() {
        return this.isMultipleSeries();
    }

    isMultipleSeries() {
        return this.#_multipleSeries;
    }

    // We don't have repertoire_id
    _initializeRepertoire(repertoire_id) {
        if (!this.#_seriesByRepertoire[repertoire_id]) {
            this.#_logger.debug("Initializing repertoire " + repertoire_id);
            this.#_seriesByRepertoire[repertoire_id] = []; 
        }
        return this.#_seriesByRepertoire[repertoire_id];
    }
    
    _initializeStudy(study_id) {
        if (!this.#_seriesByStudy[repertoire_id]) {
            this.#_logger.debug("Initializing study " + study_id);
            this.#_seriesByStudy[study_id] = []; 
        }
        return this.#_seriesByStudy[study_id];
    }
    
    _initializeSubject(subject_id) {
        if (!this.#_seriesBySubject[subject_id]) {
            this.#_logger.debug("Initializing subject " + subject_id);
            this.#_seriesBySubject[subject_id] = []; 
        }
        return this.#_seriesBySubject[subject_id];
    }
    
    preparse(properties) {
        this.#_logger.trace("preparse.");
        //Build  the structures that will hold the series for each size of key
        // parsedProperties is the instance variable properties in Parser Object
        let parsedProperties = this.properties;

        // Get important values from properties
        this.#_data            = properties.getData();
        this.#_seriesColors    = properties.seriesColors;
        this.#_seriesName      = properties.seriesName;
        this.#_sort            = properties.sort;
        this.#_percentage      = properties.percentage;
        
        let colorIndex = this.#_colorIndex;
        let colorIndexJumper = this.#_colorIndexJumper
        
        if (typeof this.#_data === "string") {
            this.#_data = JSON.parse(this.#_data);
        }
        parsedProperties.setYLabel("Value")
        if (this.#_percentage){
            parsedProperties.setYLabel("Fraction");
            parsedProperties.setYMaxValue(100);
            parsedProperties.setDraw3D(false);
        }else if (this.#_multipleSeries){
            parsedProperties.setDraw3D(false);
        }        

        let jsonpathQueryString = '$..'+ImmuneDBStatsParserConstants.KEY;
        let distinctDataKey = [...new Set(JSONPath(jsonpathQueryString, this.#_data))];
        // Need this array to be sorted for later when pltting series on the chart.
        distinctDataKey.sort((a, b) => b.localeCompare(a));
        
        if (distinctDataKey.length > 1) {
            // We have a multiple keys to plot
            this.#_multipleSeries = true;
            //Check color array for sufficient colors for the number of keys.
            if (this.#_seriesColors.length < distinctDataKey.length) {
                this.#_logger.error('Not enough colors set for the amount of repertoires. Please increase the number of colors in seriesColor array.');
                throw 'Not enough colors set for the amount of repertoires. Please increase the number of colors in seriesColor array.';
            }
            colorIndexJumper = Math.floor((this.#_seriesColors.length - 1) / (distinctDataKey.length - 1));
        }
        
        //Prepare a ResultSeries for each of the existing keys
        for (let index = 0; index < distinctDataKey.length; index++) {
            const keyName = distinctDataKey[index];
            const seriesName = keyName;
            let color = this.#_seriesColors[colorIndex];
            colorIndex += colorIndexJumper;

            let series = new ResultSeries()
                        .setRepertoireId(undefined) //irrelevant for this structure
                        .setSampleProcessingId(undefined) //irrelevant for this structure
                        .setDataProcessingId(undefined) //irrelevant for this structure
                        .setId(keyName) //irrelevant for this structure
                        .setName(seriesName)
                        .setFieldName(undefined) //irrelevant for this structure
                        .setColor(color);
            this.#_seriesByKey[keyName] = series;
        }
        let subtitle = "";
        Object.keys(this.#_seriesByKey).forEach(key => {
            if (subtitle.length > 0)
                subtitle = subtitle + ", ";
            subtitle = subtitle + key;
        });
        subtitle = subtitle + " Count";
        // console.log(subtitle);
        parsedProperties.setSubtitle([subtitle]);
    }

    postparse(properties) {
        this.#_logger.trace("postparse.");
    }

    onparse(properties) {
        this.#_logger.trace("parse");
        let timer = new DebugTimer();
        timer.start("parse");

        let messageArray = this.#_data[StatsParserConstants.MESSAGE];
        let messageArrayLength = messageArray.length;
        this.#_logger.debug("Data Result length = " + messageArrayLength);
        // Specifics for this Parser
        // Iterate over the array of resultObjects
        for (let j = 0; j < messageArrayLength; j++) {
            let messageObject = messageArray[j];
            let messageObjectRepertoires = messageObject[ImmuneDBStatsParserConstants.REPERTOIRES];
            //fetch the ImmuneDBStatsParserConstants.REPERTOIRE_ID
            let studyId = messageObjectRepertoires[ImmuneDBStatsParserConstants.STUDY_ID];
            let subjectId = messageObjectRepertoires[ImmuneDBStatsParserConstants.REPERTOIRE_ID];
            //ImmuneDB has no repertoire_id
            // let repID = messageObjectRepertoires[ImmuneDBStatsParserConstants.REPERTOIRE_ID];
            let repId = studyId + '-' + subjectId;
 
            let messageObjectStatisticsArray = messageObject[ImmuneDBStatsParserConstants.STATISTICS];
            
            /*
             * Preciso de 3 séries:
             * - top10 
             * - top100
             * - top1000
             * 
             * Dentro de cada série as variáveis são study_id+'-'+'subject_id.
             * 
             * Em top100 o valor é top100-top10
             * Em top1000 o valor é top1000 - top100
             * 
             * Não apresentar num staked chart
             * Apresentar num overlapped chart
             * 
             * Possibilitar o uso de percentagens.
             */



            //If we have at least one StatsParserConstants.STATISTIC for this repertoire
            if(messageObjectStatisticsArray.length > 0) {
                // Although only one is expected iterate over the statistics elements.
                for (let index = 0; index < messageObjectStatisticsArray.length; index++) {
                    //fetch the first object of StatsParserConstants.STATISTICS
                    const statisticsObject = messageObjectStatisticsArray[index];
                    let statisticName = statisticsObject[ImmuneDBStatsParserConstants.STATISTICS_NAME];
                    let statisticTotal = statisticsObject[ImmuneDBStatsParserConstants.TOTAL];
                    let statisticDataArray = statisticsObject[ImmuneDBStatsParserConstants.DATA];
                    //Set the resutType by statistics name
                    let statisticsType = ResultSeriesType.getByName(statisticName)

                    for (let i = 0; i < statisticDataArray.length; i++) {
                        const dataObject = statisticDataArray[i];
                        let keyName = dataObject[StatsParserConstants.KEY];
                        let value = dataObject[StatsParserConstants.VALUE];
                        let dataItem = new ResultSeriesDataItem().setName(repId).setY(this.#_percentage?Common.roundTo(value/statisticTotal*100, 4):value); 

                        this.#_seriesByKey[keyName].data.push(dataItem);
                        
                    }
                    
                }
            } else {
                //Probably we have an error in the result no statistics received. Should abort and return?
            }
            
        }
        timer.end("parse");
        timer.print();
    }
}


class ImmuneDbCloneCountParser extends Parser {
    #_logger;
    
    // Array of ResultSeries
    #_series;

    #_multipleSeries;

    constructor() {
        super();
        this.#_logger = new Logger('ImmuneDbCloneCountParser');
        this.#_logger.trace("Constructor.");

        this.#_multipleSeries = false;
        this.#_series = [];
    }

    getSeries(){
        this.#_logger.debug("getting series.");
        return this.#_series;
    }
    
    isMultipleSeries(){
        return this.#_multipleSeries;
    }

    preparse(properties){
        this.#_logger.trace("preparse.");
        
    }   

    postparse(properties){
        this.#_logger.trace("postparse.");
        
    }   
           
    onparse (properties){
        this.#_logger.trace("parse");
        let timer = new DebugTimer();
        timer.start("parse");
        // parsedProperties is the instance variable properties in Parser Object
        let parsedProperties = this.properties;

        // Get important values from properties
        let data            = properties.getData();
        let seriesColors    = properties.seriesColors;
        let seriesName      = properties.seriesName;
        let sort            = properties.sort;
        let percentage      = properties.percentage;
        
        let colorIndex = 0;
        let colorIndexJumper = 1;
        let mainSeries = [];
        
        if (typeof data === "string") {
            data = JSON.parse(data);
        }  
        
        // Specifics for this Parser
        let studies = Object.keys(data);
        
        //console.log(studies);
        if (studies.length > 1){
            //Why is this important? If we have a multiple studies we need a color per study.
            this.#_logger.debug("Representing " + studies + " studies.");
            this.#_multipleSeries = true;
            
            if (seriesColors.length < studies.length){
                this.#_logger.error('Not enough colors set for the amount of repertoires. Please increase the number of colors in seriesColor array.');
                throw 'Not enough colors set for the amount of repertoires. Please increase the number of colors in seriesColor array.';
            }
            colorIndexJumper = Math.floor((seriesColors.length-1)/(studies.length-1));
        }
        
        if (percentage){
            parsedProperties.setYLabel("Percentage");
            parsedProperties.setDraw3D(false);
        }else if (this.#_multipleSeries){
            parsedProperties.setDraw3D(false);
        }      

        //dictionary of studies
        let studiesDict = {};
        let stats = 0;
        //prepare data
        timer.start("prepare");
        for (let i = 0; i < studies.length; i++){
            let study = studies[i];
            // lets have a key for each study in the dictionary.
            studiesDict[study] = {}
            let studyData = data[study];
            //console.log(studyData);
            //iterate over all the elements in the study. 
            //each element is a pair of {subject:value} with the top n clones.
            for (let j = 0; j < studyData.length; j++) {
                const element = studyData[j];
                //console.log(element);
                let subjects = Object.keys(element);
                if (subjects.length != 1){
                    throw 'Received more than one subject for a study. Only one was expected.';
                }
                let subjectName = subjects[0];
                //console.log(subjectName);
                let value = element[subjectName];
                //the array of values for this subjectName
                let values = (studiesDict[study][subjectName] || (studiesDict[study][subjectName]=[]));
                stats++;
                values.push(value);
            }
    
        }
        timer.end("prepare");
        //console.log(studiesDict);
        //console.log("Read " + studies.length + " studies, in a total of " + stats + " statistic values.")
        const colorTopByStudy = [];
        for (let i = 0; i < studies.length; i++) {
            const element = studies[i];
            colorTopByStudy[element] = seriesColors[colorIndex];
            colorIndex+=colorIndexJumper;
        }
        
        const colorRest = "rgb(192,192,192)";

        let seriesTop = new ResultSeries()
        .setRepertoireId('')
        .setSampleProcessingId('')
        .setDataProcessingId('')
        .setId('SeriesTop')
        .setName('Fraction of top n clones')
        .setFieldName('Fraction of top n clones')
        .setType(ResultSeriesType.getByName('top_clones'));
        let seriesTopData = seriesTop.data;

        let seriesRest = new ResultSeries()
        .setRepertoireId('')
        .setSampleProcessingId('')
        .setDataProcessingId('')
        .setId('SeriesRest')
        .setName('Fraction of top 1-n clones')
        .setFieldName('Fraction of top 1-n clones')
        .setType(ResultSeriesType.getByName('top_clones'));
        let seriesRestData = seriesRest.data;
        
        timer.start("calculate");
        for (let i = 0; i < studies.length; i++) {
            const study = studies[i];
            for (const key in studiesDict[study]) {
                if (studiesDict[study].hasOwnProperty(key)) {
                    const value = Common.roundTo(studiesDict[study][key].reduce((a, b) => a + b, 0), 4);
                    let dataItemTop = new ResultSeriesDataItem().setName(study+'-'+key).setY(value).setColor(colorTopByStudy[study]);
                    seriesTopData.push(dataItemTop);
                    let dataItemRest = new ResultSeriesDataItem().setName(study+'-'+key).setY(1-value).setColor(colorRest);
                    seriesRestData.push(dataItemRest);
                }
            }
            
        }
        timer.end("calculate");

        //let dataItem = new ResultSeriesDataItem().setName(familyName).setY(familySeries.data[i].count);
        //seriesData.push(dataItem);
        this.#_series.push(seriesTop, seriesRest);
        //this.#_series.push(seriesTop);
        timer.end("parse");
        timer.print();
    }  
}



export {ImmuneDBStatsParserConstants, ImmuneDBFunctionalityCountStatsParser, ImmuneDbCloneCountParser, ImmuneDBGeneTopCountStatsParser};