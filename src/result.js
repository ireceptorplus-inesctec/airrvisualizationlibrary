import {Logger, ResultSeriesType, GeneType, Common} from './common';
import {Properties} from './properties';
import {Parser, DrilldownParser, GeneStatsDrilldownParser} from "./parser";
import {ResultSeriesDataItem, ResultSeries} from "./series";

// HIGHCHARTS
import Highcharts from 'highcharts';

class Result {
    #_logger;
    #_rawResult;

    #_drilldown;

    #_parser;
            
    constructor(sourceData = undefined) {
        this.#_logger = new Logger('Result');
        this.#_logger.debug("Constructor.");
        this.#_rawResult = undefined;
        this.#_drilldown = false;
        this.#_parser = undefined;
        if (typeof sourceData !== "undefined" ){
            setRawResult(sourceData);            
        }
    }

    setRawResult(sourceData) {
        this.#_rawResult = sourceData;  
        this.#_logger.debug("setRawResult.");
        if (this.parser){
            this.preparse(sourceData);
            this.parse(sourceData);
        }
        //this.parseSingleRepertoireStatsData(sourceData);
        return this;
    }
    
    set rawResult(sourceData){
        this.setRawResult(sourceData);
    }
        
    get rawResult(){
        return this.#_rawResult;
    }

    setParser(parser) {
        this.#_logger.debug("setParser.");
        if (!(parser instanceof Parser)){
            this.#_logger.fatal("attribute parser must be an instance of Parser.");
            throw 'parser value must be an instance of Parser.';
        }
        this.#_parser = parser;
        if (this.sourceData){     
            this.preparse(sourceData);
            this.parse(sourceData);
        }
        return this;
    }
    
    set parser(parser){
        this.setRawResult(parser);
    }
        
    get parser(){
        return this.#_parser;
    }

    /**
     * Sets the series to have drilldown or not.
     * It is better to set the drilldown value prior to setting the data. Setting the drilldown value, 
     * if the source data was already added to the series, will force parsing the source data again.
     * 
     * @param  boolean value If true, set the series to have drilldown feature.
     * @return Result      Returns this object.
     */
    setDrilldown(value){
        this.#_logger.debug("setting drilldown to " + value);
        if (typeof value !== "boolean"){
            this.#_logger.fatal("attribute value must be a boolean.");
            throw 'drilldown value must be a boolean.';
        }
        if (this.#_drilldown == value){
            this.#_logger.trace("No further action requires drilldown value is not changed.");
            return;
        }
        this.#_drilldown = value;
        if (this.#_rawResult){
            this.preparse(this.#_rawResult);
            this.parse(this.#_rawResult);
        } 
        return this;
    }

    set drilldown(value){
        setDrilldown(value);
    }

    get drilldown(){
        this.#_logger.debug("getting drilldown.");
        return this.#_drilldown;
    }

    preparse(sourceData){
        this.#_logger.fatal("'this preparse() method should never execute, specializations of Result need to overload it.'");
        throw 'This method should not be called, implementations need to overload it.';        
    }    
        
    parse(sourceData){
        this.#_logger.fatal("'this parse() method should never execute, specializations of Result need to overload it.'");
        throw 'This method should not be called, implementations need to overload it.';
    }

    getMousedownEvent(targetChart){
        this.#_logger.debug("retrieving default mousedown event on charts.");
        let logger = this.#_logger;
        return function(e) {
            let chart = this;
            console.log(e);
            console.log(chart);
            logger.trace("Default mouse down event on ...");
        };    
    }
}

class GeneStatsResult extends Result {
    #_logger;
    
    #_geneType;
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
    
    #_multipleSeries;
    
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
        this.#_series = [];
        this.#_drilldownSeries = {series: []};
        this.#_multipleSeries = false;
        
        // Dictionaries for processing ResultSeries structures by grouping type.
        this.#_seriesByRepertoire = {};
        this.#_geneSeriesByFamily = {};
        this.#_cellSeriesByGene = {};
        this.#_familySeriesByRepertoire = {};
        this.#_geneSeriesByRepertoire = {};
        this.#_cellSeriesByRepertoire = {};
        
        this.#_defaultProperties = new Properties().setTitle("IR+ Repertoire Stats").setSubtitle("Families").setYLabel("Count");

        //Set the default parser (should change to GeneStatsParser).
        this.setParser(new GeneStatsDrilldownParser(type));
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
        if (!this.drilldown || this.#_multipleSeries){
            let emptyDrilldownObject = {series: []};
            this.#_logger.trace(JSON.stringify(emptyDrilldownObject));
            return emptyDrilldownObject;
        }       
        this.#_logger.trace(JSON.stringify(this.#_drilldownSeries));
        return this.#_drilldownSeries;
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

    getMousedownEvent(targetChart){
        let logger = this.#_logger;
        if (!this.#_multipleSeries){
            this.#_logger.debug("retrieving single series mousedown event - using defaults.");
            return super.getMousedownEvent(targetChart);    
        }
        return function(eStart) {
            let chart = targetChart;
            console.log("Mousedown in multiple series");
            eStart = chart.pointer.normalize(eStart);

            let posX = eStart.chartX,
                posY = eStart.chartY,
                alpha = chart.options.chart.options3d.alpha,
                beta = chart.options.chart.options3d.beta,
                sensitivity = 5,  // lower is more sensitive
                handlers = [];
    
            function drag(e) {
                // Get e.chartX and e.chartY
                e = chart.pointer.normalize(e);
    
                chart.update({
                    chart: {
                        options3d: {
                            alpha: alpha + (e.chartY - posY) / sensitivity,
                            beta: beta + (posX - e.chartX) / sensitivity
                        }
                    }
                }, undefined, undefined, false);
            }
    
            function unbindAll() {
                handlers.forEach(function (unbind) {
                    if (unbind) {
                        unbind();
                    }
                });
                handlers.length = 0;
            }
            // Here we can add the listeners to chart.container or to document.
            // IF added to chart.container thechart will change only when the event is within the chart area.
            handlers.push(Highcharts.addEvent(document, 'mousemove', drag));
            handlers.push(Highcharts.addEvent(document, 'touchmove', drag));
            handlers.push(Highcharts.addEvent(document, 'mouseup', unbindAll));
            handlers.push(Highcharts.addEvent(document, 'touchend', unbindAll));
    
            logger.trace(eStart.toString());
        };  
    }
    
    get properties(){
        return this.#_defaultProperties;
    }
        
    isMultipleSeries(){
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
           
    _addToStructures(series){
        if (!(series instanceof ResultSeries)){            
            throw 'series type must be ResultSeries';
        }
        let repertoire_id = series.repertoireId;
        let type = series.type;
        let parentName = series.parentName;
        switch (type) {
            case ResultSeriesType.FAMILY:
                this.#_familySeriesByRepertoire[repertoire_id].push(series);
                break;
            case ResultSeriesType.GENE:
                this.#_logger.debug("Received a new series of Genes. Repertoire:" + repertoire_id+" , parentName:" + parentName);
                if (parentName){
                    // This is a partial Series of ResultSeriesDataItem grouped by a common parent.
                    this.#_logger.debug("Adding to #_geneSeriesByFamily[" + parentName+ "] :")
                    this.#_geneSeriesByFamily[parentName].push(series);
                    this.#_logger.debug(this.#_geneSeriesByFamily[parentName]);
                }else{
                    this.#_geneSeriesByRepertoire[repertoire_id].push(series);
                }
                break;
            case ResultSeriesType.CELL:
                if (parentName){
                    // This is a partial Series of ResultSeriesDataItem grouped by a common parent.
                    this.#_logger.debug("Adding to #_cellSeriesByGene[" + parentName+ "] :")
                    this.#_cellSeriesByGene[parentName].push(series);
                    this.#_logger.debug(this.#_cellSeriesByGene[parentName]);
                }else{
                    this.#_cellSeriesByRepertoire[repertoire_id].push(series);
                }
                break;
            default:
                throw 'cannot process an incompatible type.';
        }
        this.#_seriesByRepertoire[repertoire_id].push(series);
    }

    preparse(sourceData){
        
    }   
           
    parse (data){
        this.#_logger.debug("GeneStatsResult parse.");
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
                let series = new ResultSeries()
                    .setRepertoireId(repertoire.repertoire_id)
                    .setSampleProcessingId(repertoire.sample_processing_id)
                    .setDataProcessingId(repertoire.data_processing_id)
                    .setId('rep'.concat(repertoire.repertoire_id).concat(familyPostfix))
                    .setName('Repertoire '.concat(repertoire.repertoire_id).concat(' Families'))
                    .setFieldName(familySeries.field)
                    .setColor(color)
                    .setType(ResultSeriesType.FAMILY);
                let seriesData = series.data;
                for (let i = 0; i< familySeries.data.length; i++){
                    let familyName = familySeries.data[i].key;
                    let geneGroupName = familyName.concat(genePostfix);
                    familyNames.push(familyName);
                    this._initializeGeneGroup(repertoire.repertoire_id, geneGroupName);
                    let dataItem = new ResultSeriesDataItem().setName(familyName).setY(familySeries.data[i].count);
                    if (this.drilldown) dataItem.setDrilldown(geneGroupName);
                    seriesData.push(dataItem);
                    // {name: familyName,y: familySeries.data[i].count,drilldown: familyName.concat(genePostfix)});
                }
                mainSeries.push(series);
                //{name: (this.#_multipleSeries ? "Repertoire: " + repertoireName : familySeriesName),data: seriesData})
                this._addToStructures(series);
            }else{
                //Probably we have an error in the result. Should abort and return?
            }
            if (geneSeries){
                //this is a second series (for drilldown).
                //We will need several ResultSeries, one that will hold all the Gene values (dataItems) in the repertoire and, one for each family of Genes in a repertoire
                let series = new ResultSeries()
                    .setRepertoireId(repertoire.repertoire_id)
                    .setSampleProcessingId(repertoire.sample_processing_id)
                    .setDataProcessingId(repertoire.data_processing_id)
                    .setId('rep'.concat(repertoire.repertoire_id).concat(genePostfix))
                    .setName('Repertoire '.concat(repertoire.repertoire_id).concat(' Genes'))
                    .setFieldName(geneSeries.field)
                    .setColor(color)
                    .setType(ResultSeriesType.GENE);
                let seriesData = series.data;
                //Build a dictionary to group genes series by family
                let geneSeriesDict = new Object();
                for (let i = 0; i < familyNames.length; i++){
                    let geneGroupName = familyNames[i].concat(genePostfix);
                    let geneSeriesName = familyNames[i].concat(' Family');
                    geneSeriesDict[familyNames[i]] = new ResultSeries()
                        .setRepertoireId(repertoire.repertoire_id)
                        .setSampleProcessingId(repertoire.sample_processing_id)
                        .setDataProcessingId(repertoire.data_processing_id)
                        .setId(geneGroupName)
                        .setName(geneSeriesName)
                        .setFieldName(geneSeries.field)
                        .setType(ResultSeriesType.GENE)
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
                    let dataItem = new ResultSeriesDataItem().setName(geneName).setY(geneSeries.data[i].count);
                    if (this.drilldown) dataItem.setDrilldown(cellGroupName);
                    seriesData.push(dataItem);
                    geneSeriesDict[familyName].data.push(dataItem);
                    //{name: geneName,y: geneSeries.data[i].count,drilldown: geneName.concat(cellPostfix)});
                }
                this.#_logger.trace("All Gene data series for Repertoire " +repertoire.repertoire_id + ": ");
                this.#_logger.trace(JSON.stringify(series));
                this._addToStructures(series);
                this.#_logger.trace("All series for gene data grouped by family : ");
                this.#_logger.trace(JSON.stringify(geneSeriesDict));
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
                //this a third series for drilldown.
                //We will need several ResultSeries, one that will hold all the Allele values (dataItems) in the repertoire and, one for each Genes group in a repertoire
                let series = new ResultSeries()
                    .setRepertoireId(repertoire.repertoire_id)
                    .setSampleProcessingId(repertoire.sample_processing_id)
                    .setDataProcessingId(repertoire.data_processing_id)
                    .setId('rep'.concat(repertoire.repertoire_id).concat(cellPostfix))
                    .setName('Repertoire '.concat(repertoire.repertoire_id).concat(' Alleles'))
                    .setFieldName(cellSeries.field)
                    .setColor(color)
                    .setType(ResultSeriesType.CELL);
                let seriesData = series.data;
                //Build a dictionary to greoup cells by gene
                let cellSeriesDict = new Object();
                for (let i = 0; i < geneNames.length; i++){
                    //cellSeriesDict[geneNames[i]] = [];
                    let cellGroupName = geneNames[i].concat(cellPostfix);
                    let cellSeriesName = geneNames[i].concat(' Gene');
                    cellSeriesDict[geneNames[i]] = new ResultSeries()
                        .setRepertoireId(repertoire.repertoire_id)
                        .setSampleProcessingId(repertoire.sample_processing_id)
                        .setDataProcessingId(repertoire.data_processing_id)
                        .setId(cellGroupName)
                        .setName(cellSeriesName)
                        .setFieldName(cellSeries.field)
                        .setType(ResultSeriesType.CELL)
                        .setColor(color)
                        .setParentName(cellGroupName);
                }
                for (let i = 0; i< cellSeries.data.length; i++){
                    let cellName = cellSeries.data[i].key;
                    let cellSpliterIndex = cellName.indexOf(cellSpliter);
                    let geneName = cellName.substring(0,cellSpliterIndex);
                    let dataItem = new ResultSeriesDataItem().setName(cellName).setY(cellSeries.data[i].count);
                    seriesData.push(dataItem);
                    cellSeriesDict[geneName].data.push(dataItem);
                    //{name: cellName,y: cellSeries.data[i].count});

                }
                //    this.#_logger.trace(JSON.stringify(cellSeriesDict));
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
        this.#_series = mainSeries;
        this.#_drilldownSeries = {series:drilldownSeries};
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
    Result: Result,
    GeneStatsResult: GeneStatsResult,
    VGeneStatsResult: VGeneStatsResult,
    DGeneStatsResult: DGeneStatsResult,
    JGeneStatsResult: JGeneStatsResult
  };

export {Result, GeneStatsResult, VGeneStatsResult, DGeneStatsResult, JGeneStatsResult};