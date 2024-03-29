import {Logger, ResultSeriesType, Common, DebugTimer, GeneType} from './common.js';
import {Properties} from './properties.js';
import {Parser, DrilldownParser} from './parser.js';
import {ResultSeriesDataItem, ResultSeries} from './series.js';
import {JSONPath} from 'jsonpath-plus';

/*
Allele will always have a *
Gene might not have a - it means gene and subgroup are the same. An 'n'nmight be used instead of '-'

IMGT has the germeline genes (nomenclature for human genes)

Solve erroneous element sorting on the chart.
*/

/**
 * Static class with constants required by the Stats Parser.
 */
class StatsParserConstants {
  static VOCABULARY = {
    INFO: 'Info',
    MESSAGE: 'Result',
    STATISTICS: 'statistics',
    STATISTICS_NAME: 'statistic_name',
    REPERTOIRES: 'repertoires',
    REPERTOIRE: 'repertoire',
    REPERTOIRE_ID: 'repertoire_id',
    SAMPLE_PROCESSING_ID: 'sample_processing_id',
    DATA_PROCESSING_ID: 'data_processing_id',
    TOTAL: 'total',
    DATA: 'data',
    KEY: 'key',
    VALUE: 'count',
    POSTFIX_FAMILY: '_subgroup',
    POSTFIX_GENE: '_gene',
    POSTFIX_CALL: '_call',
    SPLITER_GENE_ORPHAN: '/OR',
    SPLITER_GENE: '-',
    SPLITER_CALL: '*',
  };

  /**
   * @description INFO constant
   * @type {string}
   * @static
   * @const
   * @default "Info"
   */
  static get INFO() {
    return StatsParserConstants.VOCABULARY.INFO;
  }

  /**
   * @description MESSAGE constant
   * @type {string}
   * @static
   * @const
   * @default "Result"
   */
  static get MESSAGE() {
    return StatsParserConstants.VOCABULARY.MESSAGE;
  }

  /**
   * @description STATISTICS constant
   * @type {string}
   * @static
   * @const
   * @default "statistics"
   */
  static get STATISTICS() {
    return StatsParserConstants.VOCABULARY.STATISTICS;
  }

  /**
   * @description STATISTICS_NAME constant
   * @type {string}
   * @static
   * @const
   * @default "statistic_name"
   */
  static get STATISTICS_NAME() {
    return StatsParserConstants.VOCABULARY.STATISTICS_NAME;
  }

  /**
   * @description REPERTOIRES constant.
   * @type {string}
   * @static
   * @const
   * @default "repertoires"
   */
  static get REPERTOIRES() {
    return StatsParserConstants.VOCABULARY.REPERTOIRES;
  }

  /**
   * @description REPERTOIRE constant
   * @type {string}
   * @static
   * @const
   * @default "repertoire"
   */
  static get REPERTOIRE() {
    return StatsParserConstants.VOCABULARY.REPERTOIRE;
  }

  /**
   * @description REPERTOIRES_ID constant
   * @type {string}
   * @static
   * @const
   * @default "repertoires_id"
   */
  static get REPERTOIRE_ID() {
    return StatsParserConstants.VOCABULARY.REPERTOIRE_ID;
  }

  /**
   * @description SAMPLE_PROCESSING_ID constant
   * @type {string}
   * @static
   * @const
   * @default "sample_processing_id"
   */
  static get SAMPLE_PROCESSING_ID() {
    return StatsParserConstants.VOCABULARY.SAMPLE_PROCESSING_ID;
  }

  /**
   * @description DATA_PROCESSING_ID constant
   * @type {string}
   * @static
   * @const
   * @default "data_processing_id"
   */
  static get DATA_PROCESSING_ID() {
    return StatsParserConstants.VOCABULARY.DATA_PROCESSING_ID;
  }

  /**
   * @description TOTAL constant
   * @type {string}
   * @static
   * @const
   * @default "total"
   */
  static get TOTAL() {
    return StatsParserConstants.VOCABULARY.TOTAL;
  }

  /**
   * @description DATA constant
   * @type {string}
   * @static
   * @const
   * @default "data"
   */
  static get DATA() {
    return StatsParserConstants.VOCABULARY.DATA;
  }

  /**
   * @description KEY constant
   * @type {string}
   * @static
   * @const
   * @default "key"
   */
  static get KEY() {
    return StatsParserConstants.VOCABULARY.KEY;
  }

  /**
   * @description VALUE constant
   * @type {string}
   * @static
   * @const
   * @default "value"
   */
  static get VALUE() {
    return StatsParserConstants.VOCABULARY.VALUE;
  }

  /**
   * @description POSTFIX_FAMILY constant
   * @type {string}
   * @static
   * @const
   * @default "_subgroup"
   */
  static get POSTFIX_FAMILY() {
    return StatsParserConstants.VOCABULARY.POSTFIX_FAMILY;
  }

  /**
   * @description POSTFIX_GENE constant
   * @type {string}
   * @static
   * @const
   * @default "_gene"
   */
  static get POSTFIX_GENE() {
    return StatsParserConstants.VOCABULARY.POSTFIX_GENE;
  }

  /**
   * @description POSTFIX_CALL constant
   * @type {string}
   * @static
   * @const
   * @default "_call"
   */
  static get POSTFIX_CALL() {
    return StatsParserConstants.VOCABULARY.POSTFIX_CALL;
  }

  /**
   * @description SPLITER_GENE_ORPHAN constant
   * @type {string}
   * @static
   * @const
   * @default "/OR"
   */
  static get SPLITER_GENE_ORPHAN() {
    return StatsParserConstants.VOCABULARY.SPLITER_GENE_ORPHAN;
  }

  /**
   * @description SPLITER_GENE constant
   * @type {string}
   * @static
   * @const
   * @default "-"
   */
  static get SPLITER_GENE() {
    return StatsParserConstants.VOCABULARY.SPLITER_GENE;
  }

  /**
   * @description SPLITER_CALL constant
   * @type {string}
   * @static
   * @const
   * @default "*"
   */
  static get SPLITER_CALL() {
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
    this.#_logger.trace('Constructor.');

    this.#_multipleSeries = false;
    this.#_series = [];
    this.#_seriesByRepertoire = [];
  }

  getSeries() {
    this.#_logger.debug('getting series.');
    return this.#_series;
  }

  isMultipleSeries() {
    return this.#_multipleSeries;
  }

  _initializeRepertoire(repertoire_id) {
    this.#_logger.debug('Initializing repertoire ' + repertoire_id);
    if (!this.#_seriesByRepertoire[repertoire_id]) {
      this.#_seriesByRepertoire[repertoire_id] = [];
    }
  }

  preparse(properties) {
    this.#_logger.trace('preparse.');
  }

  postparse(properties) {
    this.#_logger.trace('postparse.');
  }

  onparse(properties) {
    this.#_logger.trace('parse');
    let timer = new DebugTimer();
    timer.start('parse');
    // parsedProperties is the instance variable properties in Parser Object
    let parsedProperties = this.properties;

    // Get important values from properties
    let data = properties.getData();
    let seriesColors = properties.seriesColors;
    let seriesName = properties.seriesName;
    let sort = properties.sort;
    let percentage = properties.percentage;

    let colorIndex = 0;
    let colorIndexJumper = 1;
    let mainSeries = [];

    if (typeof data === 'string') {
      data = JSON.parse(data);
    }

    let messageArray = data[StatsParserConstants.MESSAGE];
    let messageArrayLength = messageArray.length;
    this.#_logger.debug('Data Result length = ' + messageArrayLength);

    if (messageArrayLength > 1) {
      // We have a multiple repertoires (Series), Specifics for multiple series need to be applied.
      this.#_logger.debug('Representing ' + messageArrayLength + ' repertoires.');
      this.#_multipleSeries = true;

      if (seriesColors.length < messageArrayLength) {
        this.#_logger.error('Not enough colors set for the amount of repertoires. Please increase the number of colors in seriesColor array.');
        throw 'Not enough colors set for the amount of repertoires. Please increase the number of colors in seriesColor array.';
      }
      colorIndexJumper = Math.floor((seriesColors.length - 1) / (messageArrayLength - 1));
    }

    if (percentage) {
      parsedProperties.setYLabel('Percentage');
      parsedProperties.setDraw3D(false);
    } else if (this.#_multipleSeries) {
      parsedProperties.setDraw3D(true);
    }

    // Specifics for this Parser
    for (let j = 0; j < messageArrayLength; j++) {
      let color = seriesColors[colorIndex];
      colorIndex += colorIndexJumper;
      let messageArrayObject = messageArray[j];
      let messageArrayObjectRepertoires = messageArrayObject[StatsParserConstants.REPERTOIRE] || messageArrayObject[StatsParserConstants.REPERTOIRES];


      //fetch the StatsParserConstants.REPERTOIRE_ID
      let repID = messageArrayObjectRepertoires[StatsParserConstants.REPERTOIRE_ID];

      //TODO: Include support for multiple StatsParserConstants.STATISTIC. I.e for example plot a stacked bar if we "receive rearrangement_count" and "rearrangement_count_productive".
      //If we have at least one StatsParserConstants.STATISTIC for this repertoire
      //we will ignore if more than one statistics is received.
      if (messageArrayObject[StatsParserConstants.STATISTICS].length > 0) {
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

        /*TODO:
         * FIX subtitle naming:
         * - At first level, title should be locus/chain (e.g. IGHV)
         * - At second level, title should be family (e.g. IGHV5), back to should say "Back to IGHV"
         * - At third level, title should be gene (IGHV5-51), back to should say "Back to IGHV5"
         */
        //Build ResultSeriesName
        //let resultSeriesName = 'Repertoire '.concat(repID).concat(' ').concat(type.toString());
        // We use the type for subtitle, no need to use it in series name.
        //DONE: change for the Repertoire {Rep_Id} or the value from properties.
        let _resultSeriesName = 'Repertoire '.concat(repID);
        let resultSeriesName = properties.seriesName ? properties.seriesName[j] || _resultSeriesName : _resultSeriesName;

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
          if (i == 0) {
            series.setTitle(this.guessTheNameOfTheFather(dataItem, type));
          }
          seriesData.push(dataItem);
        }
        if (totalUsageCountValidator != totalUsageCount) {
          this.#_logger.error('Inconsistency between the statistics value for total ' + statisticName + ' and the sun of the individual values (' + totalUsageCount + '/' + totalUsageCountValidator + ').');
        }
        //TODO: Before sorting I need to normalize data structures (for example ensure that all series have all named values, set to zero the missing ones.)
        //Sort elements by name
        if (properties.sort) {
          seriesData.sort((a, b) => a.name - b.name);
        }
        mainSeries.push(series);
        //{name: (this.#_multipleSeries ? "Repertoire: " + repertoireName : familySeriesName),data: seriesData})
      } else {
        //Probably we have an error in the result. Should abort and return?
      }
    }
    this.#_series = mainSeries;
    timer.end('parse');
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
    this.#_logger.trace('Constructor.');

    this.#_multipleSeries = false;
    this.#_series = [];
    this.#_seriesByRepertoire = [];
  }

  getSeries() {
    this.#_logger.debug('getting series.');
    return this.#_series;
  }

  isMultipleSeries() {
    return this.#_multipleSeries;
  }

  _initializeRepertoire(repertoire_id) {
    this.#_logger.debug('Initializing repertoire ' + repertoire_id);
    if (!this.#_seriesByRepertoire[repertoire_id]) {
      this.#_seriesByRepertoire[repertoire_id] = [];
    }
  }

  preparse(properties) {
    this.#_logger.trace('preparse.');
  }

  postparse(properties) {
    this.#_logger.trace('postparse.');
  }

  onparse(properties) {
    this.#_logger.trace('parse');
    let timer = new DebugTimer();
    timer.start('parse');
    // parsedProperties is the instance variable properties in Parser Object
    let parsedProperties = this.properties;

    // Get important values from properties
    let data = properties.getData();
    let seriesColors = properties.seriesColors;
    let seriesName = properties.seriesName;
    let sort = properties.sort;
    let percentage = properties.percentage;

    let colorIndex = 0;
    let colorIndexJumper = 1;
    let mainSeries = [];

    if (typeof data === 'string') {
      data = JSON.parse(data);
    }

    let messageArray = data[StatsParserConstants.MESSAGE];
    let messageArrayLength = messageArray.length;
    this.#_logger.debug('Data Result length = ' + messageArrayLength);

    if (messageArrayLength > 1) {
      // We have a multiple repertoires (Series), Specifics for multiple series need to be applied.
      this.#_logger.debug('Representing ' + messageArrayLength + ' repertoires.');
      this.#_multipleSeries = true;

      if (seriesColors.length < messageArrayLength) {
        this.#_logger.error('Not enough colors set for the amount of repertoires. Please increase the number of colors in seriesColor array.');
        throw 'Not enough colors set for the amount of repertoires. Please increase the number of colors in seriesColor array.';
      }
      colorIndexJumper = Math.floor((seriesColors.length - 1) / (messageArrayLength - 1));
    }

    if (percentage) {
      parsedProperties.setYLabel('Percentage');
      parsedProperties.setDraw3D(false);
    } else if (this.#_multipleSeries) {
      parsedProperties.setDraw3D(true);
    }

    // Specifics for this Parser
    for (let j = 0; j < messageArrayLength; j++) {
      let color = seriesColors[colorIndex];
      colorIndex += colorIndexJumper;
      let messageArrayObject = messageArray[j];
      let messageArrayObjectRepertoires = messageArrayObject[StatsParserConstants.REPERTOIRE] || messageArrayObject[StatsParserConstants.REPERTOIRES];

      //fetch the StatsParserConstants.REPERTOIRE_ID
      let repID = messageArrayObjectRepertoires[StatsParserConstants.REPERTOIRE_ID];

      // If we have at least one StatsParserConstants.STATISTIC for this repertoire
      // we will ignore if more than one statistics is received.
      if (messageArrayObject[StatsParserConstants.STATISTICS].length > 0) {
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

        //Build ResultSeriesName
        //let resultSeriesName = 'Repertoire '.concat(repID).concat(' ').concat(type.toString());
        // We use the type for subtitle, no need to use it in series name.
        //DONE: change for the Repertoire {Rep_Id} or the value from properties.
        let _resultSeriesName = 'Repertoire '.concat(repID);
        let resultSeriesName = seriesName ? seriesName[j] || _resultSeriesName : _resultSeriesName;

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
          //Remenber that data item may be set as percentage. Expect this.totalUsageCount is correct, but will do a validation count.
          let value = dataObject[StatsParserConstants.VALUE];
          totalUsageCountValidator += value;
          let dataItem = new ResultSeriesDataItem().setName(dataObject[StatsParserConstants.KEY]).setY(percentage ? (value / totalUsageCount) * 100 : value);
          if (i == 0) {
            series.setTitle(this.guessTheNameOfTheFather(dataItem, type));
          }
          seriesData.push(dataItem);
        }
        if (totalUsageCountValidator != totalUsageCount) {
          this.#_logger.error('Inconsistency between the statistics value for total ' + statisticName + ' and the sun of the individual values (' + totalUsageCount + '/' + totalUsageCountValidator + ').');
          throw new TypeError('Inconsistency between the statistics value for total ' + statisticName + ' and the sun of the individual values (' + totalUsageCount + '/' + totalUsageCountValidator + ').');
        }
        //TODO: Before sorting I need to normalize and coalesce data structures (for example ensure that all series have all named values, set to zero the missing ones.)
        //Sort elements by name
        if (sort) {
          //seriesData.sort((a, b) => a.name.localeCompare(b.name));
          seriesData.sort((a, b) => a.name - b.name);
        }
        mainSeries.push(series);
        //{name: (this.#_multipleSeries ? "Repertoire: " + repertoireName : familySeriesName),data: seriesData})
      } else {
        //Probably we have an error in the result. Should abort and return?
      }
    }
    this.#_series = mainSeries;
    timer.end('parse');
    timer.print();
  }
}

/**
 * GeneUsageSunburstStatsParser is a default {@link Parser} for Sunburst Charts with {@link GeneStatsResult}
 *
 * GeneUsageSunburstStatsParser assumes that it will receive an only a call (allele) structure.
 * If other structure is passed to the parser, then errors may arrise.
 *
 * @extends {Parser}
 */
class GeneUsageSunburstStatsParser extends Parser {
  #_logger;

  #_data;
  #_seriesColors;
  #_seriesName;
  #_sort;
  #_percentage;
  #_colorIndex;
  #_colorIndexJumper;
  #_geneType;

  // should be always false
  #_multipleSeries;

  // Array of ResultSeries
  #_series;

  // Dictionary (key=familyName, value= Array of all ResultSeries children of familyName across all repertoires)
  // Each element of the value Array must be a ResultSeries grouping all (GENE) values of a repertoire that are contained in a family.
  #_geneSeriesByFamily;

  // Dictionary (key=geneName, value= Array of all ResultSeries children of geneName across all repertoires)
  // Each element of the value Array must be a ResultSeries grouping all (CELL) values of a repertoire that are contained in a gene.
  #_cellSeriesByGene;

  // Dictionary (key=repetoire_id, value= Array of all ResultSeries children of type FAMILY in repertoire_id)
  // Each element of the value Array must be a ResultSeries grouping all (FAMILY) values of a repertoire.
  #_familySeriesByRepertoire;

  /**
   * @description Creates an instance of GeneUsageDrilldownStatsParser.
   * @param {GeneType} type
   */
  constructor(type) {
    super();
    this.#_logger = new Logger('GeneUsageDrilldownStatsParser');
    this.#_logger.debug('Constructor.');
    if (!GeneType.contains(type)) {
      this.#_logger.fatal('type must exist in GeneType.genes');
      throw 'type must exist in GeneType.genes';
    }
    this.#_geneType = type;
    this.#_multipleSeries = false;

    this.#_series = [];

    //To be obtained by properties.
    this.#_data = undefined;
    this.#_seriesColors = undefined;
    this.#_seriesName = undefined;
    this.#_sort = undefined;
    this.#_percentage = undefined;
    this.#_colorIndex = 0;
    this.#_colorIndexJumper = 1;
    // Dictionaries for processing ResultSeries structures by grouping type.
    this.#_geneSeriesByFamily = {};
    this.#_cellSeriesByGene = {};
    this.#_familySeriesByRepertoire = {};
  }

  get drilldown() {
    return false;
  }

  get geneType() {
    return this.#_geneType;
  }

  getSeries() {
    this.#_logger.debug('getting series.');
    return this.#_series;
  }
/*
  get drilldownSeries() {
    this.#_logger.debug('getting drilldown series.');
    // let emptyDrilldownObject = {series: []};
    let emptyDrilldownObject = [];
    this.#_logger.trace(JSON.stringify(emptyDrilldownObject));
    return emptyDrilldownObject;
  }
*/
  get multipleSeries() {
    return this.#_multipleSeries;
  }

  isMultipleSeries() {
    return this.multipleSeries;
  }

  // getDrillupSeriesEvent(properties) {
  //   return undefined;
  // }

  // getDrilldownSeriesEvent(properties) {
  //   return undefined;
  // }

  preparse(properties) {
    this.#_logger.trace('preparse.');
    // Build  the structures that will hold the series for each size of key
    // parsedProperties is the instance variable properties in Parser Object
    let parsedProperties = this.properties;

    // Get important values from properties
    this.#_data = properties.getData();
    this.#_seriesColors = properties.seriesColors;
    this.#_seriesName = properties.seriesName;
    this.#_sort = properties.sort;
    this.#_percentage = properties.percentage;

    if (typeof this.#_data === 'string') {
      this.#_data = JSON.parse(this.#_data);
    }
    parsedProperties.setYLabel('');
    if (this.#_percentage) {
      parsedProperties.setYLabel('');
      parsedProperties.setDraw3D(false);
    } else if (this.#_multipleSeries) {
      parsedProperties.setDraw3D(false);
    }

    //Ensure only one series exists (or at least use only the first)
    let messageArray = this.#_data[StatsParserConstants.MESSAGE];
    let messageArrayLength = messageArray.length;
    if (messageArrayLength > 1) {
      throw new Error('Cannot parse multiple series for a Sunburst Chart');
    }
    this.#_multipleSeries = false;
  }

  postparse(properties) {
    this.#_logger.trace('postparse.');
  }

  onparse(properties) {
    //TODO: Create a "central" element - The repertoire_id(?) - with id '0'
    //TODO: Build the structure subgroup > gene > allele from the keys on the data
    //TODO: Every element on the struture must have a unique id, parent id and a name.
    //TODO: Only the "central" element has an empty parent.
    //TODO: Only allele elements have value property.
    this.#_logger.trace('parse');
    let timer = new DebugTimer();
    timer.start('parse');
    // parsedProperties is the instance variable properties in Parser Object
    let parsedProperties = this.properties;

    let colorIndex = this.#_colorIndex;
    let colorIndexJumper = this.#_colorIndexJumper;
    let seriesColors = this.#_seriesColors;
    let percentage = this.#_percentage;
    let sort = this.#_sort;

    let mainSeries = [];
    let data = this.#_data;

    let messageArray = data[StatsParserConstants.MESSAGE];
    //TODO: Set colors when we know the number of subgroups/families.

    //I need ONE ResultSeries to hold all the data.
    // for best results we need it to be well organized (at least the first two levels - inner rings )
    let messageArrayObject = messageArray[0];
    let messageArrayObjectRepertoires = messageArrayObject[StatsParserConstants.REPERTOIRE] || messageArrayObject[StatsParserConstants.REPERTOIRES];

    //fetch the StatsParserConstants.REPERTOIRE_ID
    let repID = messageArrayObjectRepertoires[StatsParserConstants.REPERTOIRE_ID];
    //Only one (the first) statistics object is to be used, if more are received, then they are ignored
    let statisticsObject = messageArrayObject[StatsParserConstants.STATISTICS][0];
    let statisticName = statisticsObject[StatsParserConstants.STATISTICS_NAME];
    //calculate the resutType by its name
    let type = ResultSeriesType.getByName(statisticName);
    //Ensure we have allele data
    if (type.typeCode != ResultSeriesType.CALL) {
      throw new Error('This parser expect Allele data to build a Sunburst Chart');
    }
    let _resultSeriesName = 'Repertoire '.concat(repID);
    let resultSeriesName = properties.seriesName ? properties.seriesName[j] || _resultSeriesName : _resultSeriesName;
    let series = new ResultSeries()
      .setRepertoireId(repID)
      .setSampleProcessingId(messageArrayObjectRepertoires[StatsParserConstants.SAMPLE_PROCESSING_ID])
      .setDataProcessingId(messageArrayObjectRepertoires[StatsParserConstants.DATA_PROCESSING_ID])
      .setId(repID)
      .setName(resultSeriesName)
      .setFieldName(statisticName)
      //.setColor(color)
      .setType(type);
    let seriesData = [];

    let familyPostfix = StatsParserConstants.POSTFIX_FAMILY;
    let genePostfix = StatsParserConstants.POSTFIX_GENE;
    let geneOrphanSplitter = StatsParserConstants.SPLITER_GENE_ORPHAN;
    let geneSpliter = StatsParserConstants.SPLITER_GENE;
    let callSpliter = StatsParserConstants.SPLITER_CALL;

    let statisticsObjectData = statisticsObject[StatsParserConstants.DATA];
    let totalUsageCount = statisticsObject[StatsParserConstants.TOTAL];
    let alleleDataItems = new Array();
    let geneDataItems = new Array();
    let familyDataItems = new Array();
    let geneNames = new Set();
    let familyNames = new Set();

    //For each data key generate a ResultSeriesDataItem (leaves)
    for (let i = 0; i < statisticsObjectData.length; i++) {
      let dataObject = statisticsObjectData[i];
      let alleleName = dataObject[StatsParserConstants.KEY] || '';

      let callSpliterIndex = alleleName.indexOf(callSpliter);
      //Answering situation where cellname is equal to genename.
      if (callSpliterIndex == -1) callSpliterIndex = alleleName.length;

      let geneName = alleleName.substring(0, callSpliterIndex);
      geneNames.add(geneName);

      let value = dataObject[StatsParserConstants.VALUE];
      let dataItem = new ResultSeriesDataItem()
        .setId(alleleName)
        .setName(alleleName)
        .setValue(percentage ? (value / totalUsageCount) * 100 : value)
        .setParent(geneName + genePostfix);

      alleleDataItems.push(dataItem);
    }
    geneNames.forEach(geneName => {
      let geneSpliterIndex = undefined;
      let geneOrphanSpliterIndex = geneName.indexOf(geneOrphanSplitter);
      //Ansering to orphan genes
      if (geneOrphanSpliterIndex != -1) {
        geneSpliterIndex = geneOrphanSpliterIndex;
      } else {
        geneSpliterIndex = geneName.indexOf(geneSpliter);
      }
      //Answering situation where cellname is equal to genename.
      if (geneSpliterIndex == -1) geneSpliterIndex = geneName.length;
      let familyName = geneName.substring(0, geneSpliterIndex);
      familyNames.add(familyName);
      let dataItem = new ResultSeriesDataItem()
        .setId(geneName + genePostfix)
        .setName(geneName)
        .setParent(familyName + familyPostfix);
      geneDataItems.push(dataItem);
    });
    let familyNamesLength = familyNames.size;
    if (seriesColors.length < familyNamesLength) {
      throw new Error('Not enough colors set for the amount of families. Please increase the number of colors in seriesColor array to ' + familyNamesLength + '.');
    }
    colorIndexJumper = Math.floor((seriesColors.length - 1) / (familyNamesLength - 1));
    // console.log(seriesColors);
    // console.log(colorIndex);
    // console.log(colorIndexJumper);
    // console.log(familyNamesLength);
    familyNames.forEach(familyName => {
      let color = seriesColors[colorIndex];
      colorIndex += colorIndexJumper;
      let dataItem = new ResultSeriesDataItem()
        .setId(familyName + familyPostfix)
        .setName(familyName)
        .setParent('0')
        .setColor(color);
      familyDataItems.push(dataItem);
    });
    let dataItem = new ResultSeriesDataItem().setId('0').setName(repID).setParent('');

    if (sort) {
      alleleDataItems.sort((a, b) => a.name.localeCompare(b.name));
      geneDataItems.sort((a, b) => a.name.localeCompare(b.name));
      familyDataItems.sort((a, b) => a.name.localeCompare(b.name));
    }
    seriesData = [dataItem].concat(familyDataItems).concat(geneDataItems).concat(alleleDataItems);
    series.data = seriesData;
    this.#_series = [series];

    timer.end('parse');
    timer.print();
  }
}

/**
 * GeneUsageDrilldownStatsParser is a default {@link DrilldownParser} for {@link GeneStatsResult}
 *
 * GeneUsageDrilldownStatsParser assumes that when parsing a drilldown Gene Stats it will receive an
 * subgroup (family) > gene > call (allele) structure.
 * If other structure is passed to the parser, then errors may arrise.
 *
 * @extends {DrilldownParser}
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
   * @description Creates an instance of GeneUsageDrilldownStatsParser.
   * @param {GeneType} type
   */
  constructor(type) {
    super();
    this.#_logger = new Logger('GeneUsageDrilldownStatsParser');
    this.#_logger.debug('Constructor.');
    if (!GeneType.contains(type)) {
      logger.fatal('type must exist in GeneType.genes');
      throw 'type must exist in GeneType.genes';
    }
    this.#_geneType = type;
    this.#_multipleSeries = false;

    this.#_series = [];
    // this.#_drilldownSeries = {series: []};
    this.#_drilldownSeries = [];

    // Dictionaries for processing ResultSeries structures by grouping type.
    this.#_seriesByRepertoire = {};
    this.#_geneSeriesByFamily = {};
    this.#_cellSeriesByGene = {};
    this.#_familySeriesByRepertoire = {};
    this.#_geneSeriesByRepertoire = {};
    this.#_cellSeriesByRepertoire = {};
  }

  get drilldown() {
    return true;
  }

  get geneType() {
    return this.#_geneType;
  }

  getSeries() {
    this.#_logger.debug('getting series.');
    return this.#_series;
  }

  getDrilldownSeries() {
    this.#_logger.debug('getting drilldown series.');
    // We need to know if we are applying an event function or a drilldown object.
    // If we need to drilldown within multiple series, then our only option is to use drilldown event. Then we need to return an empty drilldown object.
    // If we have only one series to drill on, we can (and its better to) use the drilldown object.
    // If we don't apply drilldown, return an empty drilldown object.
    // if (!this.drilldown || this.multipleSeries) {
    if (!this.drilldown) {
      // let emptyDrilldownObject = {series: []};
      let emptyDrilldownObject = [];
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

  _initializeRepertoire(repertoire_id) {
    this.#_logger.debug('Initializing repertoire ' + repertoire_id);
    if (!this.#_seriesByRepertoire[repertoire_id]) {
      this.#_seriesByRepertoire[repertoire_id] = [];
    }
    if (!this.#_familySeriesByRepertoire[repertoire_id]) {
      this.#_familySeriesByRepertoire[repertoire_id] = [];
    }
    if (!this.#_geneSeriesByRepertoire[repertoire_id]) {
      this.#_geneSeriesByRepertoire[repertoire_id] = [];
    }
    if (!this.#_cellSeriesByRepertoire[repertoire_id]) {
      this.#_cellSeriesByRepertoire[repertoire_id] = [];
    }
  }

  _initializeGeneGroup(repertoire_id, geneGroupName) {
    if (!this.#_geneSeriesByFamily[geneGroupName]) {
      this.#_logger.debug('Initializing #_geneSeriesByFamily[' + geneGroupName + '].');
      this.#_geneSeriesByFamily[geneGroupName] = [];
    }
  }

  _initializeCellGroup(repertoire_id, cellGroupName) {
    if (!this.#_cellSeriesByGene[cellGroupName]) {
      this.#_logger.debug('Initializing #_cellSeriesByGene[' + cellGroupName + '].');
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
        this.#_logger.debug('Received a new series of Genes. Repertoire:' + repertoire_id + ' , parentName:' + parentName);
        if (parentName) {
          // This is a partial Series of ResultSeriesDataItem grouped by a common parent.
          this.#_logger.debug('Adding to #_geneSeriesByFamily[' + parentName + '] :');
          this.#_geneSeriesByFamily[parentName].push(series);
          this.#_logger.debug(this.#_geneSeriesByFamily[parentName]);
        } else {
          this.#_geneSeriesByRepertoire[repertoire_id].push(series);
        }
        break;
      case ResultSeriesType.CALL:
        if (parentName) {
          // This is a partial Series of ResultSeriesDataItem grouped by a common parent.
          this.#_logger.debug('Adding to #_cellSeriesByGene[' + parentName + '] :');
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

  preparse(properties) {
    this.#_logger.trace('preparse.');
  }

  postparse(properties) {
    this.#_logger.trace('postparse.');
  }

  onparse(properties) {
    this.#_logger.trace('parse');
    let timer = new DebugTimer();
    timer.start('parse');
    // parsedProperties is the instance variable properties in Parser Object
    let parsedProperties = this.properties;
    parsedProperties.subtitle = [];

    // Get important values from properties
    let data = properties.getData();
    let seriesColors = properties.seriesColors;
    let seriesName = properties.seriesName;
    let sort = properties.sort;
    let percentage = properties.percentage;

    let colorIndex = 0;
    let colorIndexJumper = 1;
    let mainSeries = [];

    if (typeof data === 'string') {
      data = JSON.parse(data);
    }

    let messageArray = data[StatsParserConstants.MESSAGE];
    let messageArrayLength = messageArray.length;
    this.#_logger.debug('Data Result length = ' + messageArrayLength);

    if (messageArrayLength > 1) {
      // We have a multiple repertoires (Series), Specifics for multiple series need to be applied.
      this.#_logger.debug('Representing ' + messageArrayLength + ' repertoires.');
      this.#_multipleSeries = true;

      if (seriesColors.length < messageArrayLength) {
        this.#_logger.error('Not enough colors set for the amount of repertoires. Please increase the number of colors in seriesColor array.');
        throw 'Not enough colors set for the amount of repertoires. Please increase the number of colors in seriesColor array.';
      }
      colorIndexJumper = Math.floor((seriesColors.length - 1) / (messageArrayLength - 1));
    }

    if (percentage) {
      parsedProperties.setYLabel('Percentage');
      parsedProperties.setDraw3D(false);
    } else if (this.#_multipleSeries) {
      parsedProperties.setDraw3D(true);
    }

    // Specifics for this Parser
    let gene = this.#_geneType;

    let drilldownSeries = [];
    let familySeries;
    let familyNames = [];
    let geneSeries;
    let geneNames = [];
    let cellSeries;

    let familyPostfix = StatsParserConstants.POSTFIX_FAMILY;
    let genePostfix = StatsParserConstants.POSTFIX_GENE;
    let geneSpliter = StatsParserConstants.SPLITER_GENE;
    let cellPostfix = StatsParserConstants.POSTFIX_CALL;
    let cellSpliter = StatsParserConstants.SPLITER_CALL;

    for (let j = 0; j < messageArrayLength; j++) {
      let color = seriesColors[colorIndex];
      colorIndex += colorIndexJumper;
      let messageArrayObject = messageArray[j];
      let messageArrayObjectRepertoires = messageArrayObject[StatsParserConstants.REPERTOIRE] || messageArrayObject[StatsParserConstants.REPERTOIRES];

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
      if (!familySeries || !geneSeries || !cellSeries) {
        throw new TypeError('Incomplete structure for Drilldown. A structure of subgroup > gene > cell is required.');
      }
      if (familySeries) {
        //fetch the StatsParserConstants.STATISTICS_NAME
        let statisticName = familySeries[StatsParserConstants.STATISTICS_NAME];
        //Build ResultSeriesId
        let resultSeriesId = 'rep'.concat(repID).concat(familyPostfix);
        //calculate the resutType by its name
        let type = ResultSeriesType.getByName(statisticName);
        //Build ResultSeriesName
        //let _resultSeriesName = 'Repertoire '.concat(repID).concat(' ').concat(type.toString());
        //DONE: change for the Repertoire {Rep_Id} or the value from properties.
        let _resultSeriesName = 'Repertoire '.concat(repID);
        let resultSeriesName = properties.seriesName ? properties.seriesName[j] || _resultSeriesName : _resultSeriesName;
        //FIXME: To test with SFU:
        resultSeriesName = 'Subgroup/Family';

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
          let dataObject = familySeries[StatsParserConstants.DATA][i];
          let familyName = dataObject[StatsParserConstants.KEY] || '';
          let geneGroupName = familyName.concat(genePostfix);
          familyNames.push(familyName);
          this._initializeGeneGroup(repID, geneGroupName);
          let value = dataObject[StatsParserConstants.VALUE];
          let dataItem = new ResultSeriesDataItem()
            .setName(familyName)
            .setY(percentage ? (value / totalUsageCount) * 100 : value)
            .setDrilldown(geneGroupName);
          if (i == 0) {
            series.setTitle(this.guessTheNameOfTheFather(dataItem, type));
          }
          seriesData.push(dataItem);
        }
        if (properties.sort) {
          seriesData.sort((a, b) => a.name.localeCompare(b.name));
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
        let type = ResultSeriesType.getByName(statisticName);
        //Build ResultSeriesName
        //let _resultSeriesName = 'Repertoire '.concat(repID).concat(' ').concat(type.toString());
        //DONE: change for the Repertoire {Rep_Id} or the value from properties.
        let _resultSeriesName = 'Repertoire '.concat(repID);
        let resultSeriesName = properties.seriesName ? properties.seriesName[j] || _resultSeriesName : _resultSeriesName;
        //FIXME: To test with SFU:
        resultSeriesName = 'Gene';

        //fetch the StatsParserConstants.TOTAL
        let totalUsageCount = geneSeries[StatsParserConstants.TOTAL];
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
          // console.log(geneGroupName);
          // console.log(familyNames[i]);

          //DONE: change for the Repertoire {Rep_Id} or the value from properties if user set it.
          //let _geneSeriesName = familyNames[i].concat(' ').concat(type.toString());
          //let geneSeriesName = (properties.seriesName?(properties.seriesName[j]||_geneSeriesName):_geneSeriesName);
          let geneSeriesName = resultSeriesName;
          geneSeriesDict[familyNames[i]] = new ResultSeries()
            .setRepertoireId(repID)
            .setSampleProcessingId(messageArrayObjectRepertoires[StatsParserConstants.SAMPLE_PROCESSING_ID])
            .setDataProcessingId(messageArrayObjectRepertoires[StatsParserConstants.DATA_PROCESSING_ID])
            .setId(geneGroupName)
            .setName(geneSeriesName)
            .setFieldName(statisticName)
            .setType(type)
            .setColor(color)
            .setParentName(geneGroupName)
            .setTitle(familyNames[i]);
        }
        for (let i = 0; i < geneSeries[StatsParserConstants.DATA].length; i++) {
          let dataObject = geneSeries[StatsParserConstants.DATA][i];
          let geneName = dataObject[StatsParserConstants.KEY] || '';
          let cellGroupName = geneName.concat(cellPostfix);
          geneNames.push(geneName);
          this._initializeCellGroup(repID, cellGroupName);
          let geneSpliterIndex = geneName.indexOf(geneSpliter);
          //Required for when geneName is equal to familyName. See http://www.imgt.org/IMGTScientificChart/Nomenclature/IMGTnomenclature.html and TRBV on http://www.imgt.org/IMGTrepertoire/index.php?section=LocusGenes&repertoire=genetable&species=human&group.
          if (geneSpliterIndex == -1) geneSpliterIndex = geneName.length;
          let familyName = geneName.substring(0, geneSpliterIndex);
          /*
                    if (true){
                        console.log(dataObject);
                        console.log(geneName);
                        console.log(cellGroupName);
                        console.log(geneSpliterIndex);
                        console.log(familyName);
                        console.log(dataItem);
                        console.log(geneSeriesDict[familyName]);
                        console.log(geneSeriesDict);
                    }
                    */
          /*
                    if (!geneSeriesDict[familyName]) {
                        console.log("No geneSeriesDict for family " + familyName);
                    }
                    */
          if (geneSpliterIndex == -1 && geneName) {
            let errorMessage = 'Error in parsed document structure. Received an element of type ' + type.typeName + ' with incompatible name ' + Common.quote(geneName);
            this.#_logger.fatal(errorMessage);
            throw new TypeError(errorMessage);
          }
          let value = dataObject[StatsParserConstants.VALUE];
          let dataItem = new ResultSeriesDataItem()
            .setName(geneName)
            .setY(percentage ? (value / totalUsageCount) * 100 : value)
            .setDrilldown(cellGroupName);
          if (i == 0) {
            series.setTitle(this.guessTheNameOfTheFather(dataItem, type));
          }
          seriesData.push(dataItem);

          if (!geneSeriesDict[familyName]) {
            //throw new TypeError('Invalid structure on AIRR data file. Can\'t nest gene ' + dataItem.name + ', please check if subgroup ' + familyName + ' exists');
            if ((geneSpliterIndex = geneName.indexOf('/OR')) != -1) {
              //This is an Orphan Gene lets rectify the familyName
              familyName = geneName.substring(0, geneSpliterIndex);
            } else throw new TypeError("Invalid structure on AIRR data file. Can't nest gene " + dataItem.name + ', please check if subgroup ' + familyName + ' exists');
          }
          geneSeriesDict[familyName].data.push(dataItem);
        }
        if (properties.sort) {
          seriesData.sort((a, b) => a.name.localeCompare(b.name));
        }
        this.#_logger.trace('All Gene data series for Repertoire ' + repID + ': ');
        this.#_logger.trace(JSON.stringify(series));
        this._addToStructures(series);
        this.#_logger.trace('All series for gene data grouped by family : ');
        this.#_logger.trace(JSON.stringify(geneSeriesDict));
        for (let key in geneSeriesDict) {
          let value = geneSeriesDict[key];
          if (properties.sort) {
            value.data.sort((a, b) => a.name.localeCompare(b.name));
          }
          this._addToStructures(value);
          //TODO: Need to changed this. drilldown series is to be of type ResultSeries (remove the .asHighchartSeries()).
        //   drilldownSeries.push(value.asHighchartSeries());
          drilldownSeries.push(value);
          //{name: key.concat(' Genes'),id: key.concat(genePostfix),data: value.asHighchartSeries()});
        }
      }

      if (cellSeries) {
        //fetch the StatsParserConstants.STATISTICS_NAME
        let statisticName = cellSeries[StatsParserConstants.STATISTICS_NAME];
        //Build ResultSeriesId
        let resultSeriesId = 'rep'.concat(repID).concat(cellPostfix);
        //calculate the resutType by its name
        let type = ResultSeriesType.getByName(statisticName);
        //Build ResultSeriesName
        //let _resultSeriesName = 'Repertoire '.concat(repID).concat(' ').concat(type.toString());
        //DONE: change for the Repertoire {Rep_Id} or the value from properties.
        let _resultSeriesName = 'Repertoire '.concat(repID);
        let resultSeriesName = properties.seriesName ? properties.seriesName[j] || _resultSeriesName : _resultSeriesName;
        //FIXME: To test with SFU:
        resultSeriesName = 'Allele';

        //fetch the StatsParserConstants.TOTAL
        let totalUsageCount = cellSeries[StatsParserConstants.TOTAL];
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
          //DONE: change for the Repertoire {Rep_Id} or the value from properties if user set it.
          //let _cellSeriesName = geneNames[i].concat(' ').concat(type.toString());
          //let cellSeriesName = (properties.seriesName?(properties.seriesName[j]||_cellSeriesName):_cellSeriesName);
          let cellSeriesName = resultSeriesName;
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
          let dataObject = cellSeries[StatsParserConstants.DATA][i];
          let cellName = dataObject[StatsParserConstants.KEY] || '';
          let cellSpliterIndex = cellName.indexOf(cellSpliter);
          //Answering situation where cellname is equal to genename.
          if (cellSpliterIndex == -1) cellSpliterIndex = cellName.length;
          let geneName = cellName.substring(0, cellSpliterIndex);
          let value = dataObject[StatsParserConstants.VALUE];
          let dataItem = new ResultSeriesDataItem().setName(cellName).setY(percentage ? (value / totalUsageCount) * 100 : value);
          seriesData.push(dataItem);
          try {
            cellSeriesDict[geneName].data.push(dataItem);
          } catch (error) {
            let errorMessage = "Cannot find Gene '" + geneName + "' in existing gene list [" + Object.keys(cellSeriesDict) + "] for Cell '" + cellName + "'";
            //console.error(errorMessage);
            throw new TypeError(errorMessage);
          }
        }
        //    this.#_logger.trace(JSON.stringify(cellSeriesDict));
        for (let key in cellSeriesDict) {
          let value = cellSeriesDict[key];
          this._addToStructures(value);
          //TODO: Need to changed this. drilldown series is to be of type ResultSeries (remove the .asHighchartSeries()).
        //   drilldownSeries.push(value.asHighchartSeries());
          drilldownSeries.push(value);
        }
      }
    }
    //  this.#_logger.debug('Series:');
    //  this.#_logger.debug(series);
    //  this.#_logger.debug('DrilldownSeries:');
    //  this.#_logger.debug(drilldownSeries);

    //return [series, {series:drilldownSeries}];
    this.#_series = mainSeries;
    // this.#_drilldownSeries = {series: drilldownSeries};
    this.#_drilldownSeries = drilldownSeries;


    // console.log(drilldownSeries)
    if (this.isMultipleSeries())
      this.#_drilldownSeries = {...this.#_geneSeriesByFamily, ...this.#_cellSeriesByGene};
    // console.log({...this.#_geneSeriesByFamily, ...this.#_cellSeriesByGene});
    // console.log(this.#_geneSeriesByFamily);
    // console.log(this.#_cellSeriesByGene);
    console.log(this.#_drilldownSeries)
    timer.end('parse');
    timer.print();
  }
}

/**
 *
 * GeneUsageStatsParser is a {@Link Parser} for {@Link GeneStatsResult} without drilldown capabilities
 *
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
   * @description Creates an instance of GeneUsageStatsParser.
   */
  constructor() {
    super();
    this.#_logger = new Logger('GeneUsageStatsParser');
    this.#_logger.debug('Constructor.');
    this.#_multipleSeries = false;

    this.#_series = [];
    this.#_seriesByRepertoire = [];
  }

  get drilldown() {
    return false;
  }
  /*
    get geneType() {
        return this.#_geneType;
    }
    */

  getSeries() {
    this.#_logger.debug('getting series.');
    return this.#_series;
  }

/*
  get drilldownSeries() {
    this.#_logger.debug('getting drilldown series.');
    // let emptyDrilldownObject = {series: []};
    let emptyDrilldownObject = [];
    this.#_logger.trace(JSON.stringify(emptyDrilldownObject));
    return emptyDrilldownObject;
  }
*/
  get multipleSeries() {
    return this.#_multipleSeries;
  }

  isMultipleSeries() {
    return this.multipleSeries;
  }

  _initializeRepertoire(repertoire_id) {
    this.#_logger.debug('Initializing repertoire ' + repertoire_id);
    if (!this.#_seriesByRepertoire[repertoire_id]) {
      this.#_seriesByRepertoire[repertoire_id] = [];
    }
  }

  preparse(properties) {
    this.#_logger.trace('preparse.');
  }

  postparse(properties) {
    this.#_logger.trace('postparse.');
  }

  onparse(properties) {
    this.#_logger.trace('parse');
    let timer = new DebugTimer();
    timer.start('parse');
    // parsedProperties is the instance variable properties in Parser Object
    let parsedProperties = this.properties;

    // Get important values from properties
    let data = properties.getData();
    let seriesColors = properties.seriesColors;
    let seriesName = properties.seriesName;
    let sort = properties.sort;
    let percentage = properties.percentage;

    let colorIndex = 0;
    let colorIndexJumper = 1;
    let mainSeries = [];

    if (typeof data === 'string') {
      data = JSON.parse(data);
    }

    let messageArray = data[StatsParserConstants.MESSAGE];
    let messageArrayLength = messageArray.length;
    this.#_logger.debug('Data Result length = ' + messageArrayLength);

    if (messageArrayLength > 1) {
      // We have a multiple repertoires (Series), Specifics for multiple series need to be applied.
      this.#_logger.debug('Representing ' + messageArrayLength + ' repertoires.');
      this.#_multipleSeries = true;

      if (seriesColors.length < messageArrayLength) {
        this.#_logger.error('Not enough colors set for the amount of repertoires. Please increase the number of colors in seriesColor array.');
        throw 'Not enough colors set for the amount of repertoires. Please increase the number of colors in seriesColor array.';
      }
      colorIndexJumper = Math.floor((seriesColors.length - 1) / (messageArrayLength - 1));
    }

    if (percentage) {
      parsedProperties.setYLabel('Percentage');
      parsedProperties.setDraw3D(false);
    } else if (this.#_multipleSeries) {
      parsedProperties.setDraw3D(true);
    }

    // Specifics for this Parser
    for (let j = 0; j < messageArrayLength; j++) {
      let color = seriesColors[colorIndex];
      colorIndex += colorIndexJumper;
      let messageArrayObject = messageArray[j];
      let messageArrayObjectRepertoires = messageArrayObject[StatsParserConstants.REPERTOIRE] || messageArrayObject[StatsParserConstants.REPERTOIRES];

      //fetch the StatsParserConstants.REPERTOIRE_ID
      let repID = messageArrayObjectRepertoires[StatsParserConstants.REPERTOIRE_ID];

      //If we have at least on StatsParserConstants.STATISTIC for this repertoire
      if (messageArrayObject[StatsParserConstants.STATISTICS].length > 0) {
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
        //Build ResultSeriesName
        //let _resultSeriesName = 'Repertoire '.concat(repID).concat(' ').concat(type.toString());
        //DONE: change for the Repertoire {Rep_Id} or the value from properties.
        let _resultSeriesName = 'Repertoire '.concat(repID);
        let resultSeriesName = properties.seriesName ? properties.seriesName[j] || _resultSeriesName : _resultSeriesName;
        //FIXME: To test with SFU:
        resultSeriesName = 'Subgroup/Family';

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
          let value = dataObject[StatsParserConstants.VALUE];
          let dataItem = new ResultSeriesDataItem().setName(dataObject[StatsParserConstants.KEY]).setY(percentage ? (value / totalUsageCount) * 100 : value);
          seriesData.push(dataItem);
        }
        if (properties.sort) {
          seriesData.sort((a, b) => a.name.localeCompare(b.name));
        }
        mainSeries.push(series);
        //{name: (this.#_multipleSeries ? "Repertoire: " + repertoireName : familySeriesName),data: seriesData})
      } else {
        //Probably we have an error in the result. Should abort and return?
      }
    }
    this.#_series = mainSeries;
    timer.end('parse');
    timer.print();
  }
}

/**
 * JGeneUsageDrilldownStatsParser is a {@link DrilldownParser} for a Type J {@link GeneStatsResult} with drilldown capabilities
 *
 * JGeneUsageDrilldownStatsParser assumes that when parsing a drilldown Gene Stats it will receive an
 * gene > call (allele) structure. If a statics for subgroup (family) is received, it will be ignored.
 * If other structure is passed to the parser, then errors may arrise.
 *
 * @extends {DrilldownParser}
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
   * @description Creates an instance of GeneUsageDrilldownStatsParser.
   * @param {GeneType} type
   */
  constructor(type) {
    //TODO: remove genetype parameter from the constructor.
    super();
    this.#_logger = new Logger('GeneUsageDrilldownStatsParser');
    this.#_logger.debug('Constructor.');
    if (type != GeneType.J_GENE) {
      logger.fatal('type must be GeneType.J_TYPE');
      throw 'type must be GeneType.J_TYPE';
    }
    this.#_geneType = type;
    this.#_multipleSeries = false;

    this.#_series = [];
    // this.#_drilldownSeries = {series: []};
    this.#_drilldownSeries = [];

    // Dictionaries for processing ResultSeries structures by grouping type.
    this.#_seriesByRepertoire = {};
    this.#_cellSeriesByGene = {};
    this.#_geneSeriesByRepertoire = {};
    this.#_cellSeriesByRepertoire = {};
  }

  get drilldown() {
    return true;
  }

  get geneType() {
    return this.#_geneType;
  }

  getSeries() {
    this.#_logger.debug('getting series.');
    return this.#_series;
  }

  getDrilldownSeries() {
    this.#_logger.debug('getting drilldown series.');
    // We need to know if we are applying an event function or a drilldown object.
    // If we need to drilldown within multiple series, then our only option is to use drilldown event. Then we need to return an empty drilldown object.
    // If we have only one series to drill on, we can (and its better to) use the drilldown object.
    // If we don't apply drilldown, return an empty drilldown object.
    // if (this.multipleSeries) {
    if (!this.drilldown) {
      // let emptyDrilldownObject = {series: []};
      let emptyDrilldownObject = [];
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

  _initializeRepertoire(repertoire_id) {
    this.#_logger.debug('Initializing repertoire ' + repertoire_id);
    if (!this.#_seriesByRepertoire[repertoire_id]) {
      this.#_seriesByRepertoire[repertoire_id] = [];
    }
    if (!this.#_geneSeriesByRepertoire[repertoire_id]) {
      this.#_geneSeriesByRepertoire[repertoire_id] = [];
    }
    if (!this.#_cellSeriesByRepertoire[repertoire_id]) {
      this.#_cellSeriesByRepertoire[repertoire_id] = [];
    }
  }

  _initializeCellGroup(repertoire_id, cellGroupName) {
    if (!this.#_cellSeriesByGene[cellGroupName]) {
      this.#_logger.debug('Initializing #_cellSeriesByGene[' + cellGroupName + '].');
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
          this.#_logger.debug('Adding to #_cellSeriesByGene[' + parentName + '] :');
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

  preparse(properties) {
    this.#_logger.trace('preparse.');
  }

  postparse(properties) {
    this.#_logger.trace('postparse.');
  }

  onparse(properties) {
    this.#_logger.trace('parse');
    let timer = new DebugTimer();
    timer.start('parse');
    // parsedProperties is the instance variable properties in Parser Object
    let parsedProperties = this.properties;

    // Get important values from properties
    let data = properties.getData();
    let seriesColors = properties.seriesColors;
    let seriesName = properties.seriesName;
    let sort = properties.sort;
    let percentage = properties.percentage;

    let colorIndex = 0;
    let colorIndexJumper = 1;
    let mainSeries = [];

    if (typeof data === 'string') {
      data = JSON.parse(data);
    }

    let messageArray = data[StatsParserConstants.MESSAGE];
    let messageArrayLength = messageArray.length;
    this.#_logger.debug('Data Result length = ' + messageArrayLength);

    if (messageArrayLength > 1) {
      // We have a multiple repertoires (Series), Specifics for multiple series need to be applied.
      this.#_logger.debug('Representing ' + messageArrayLength + ' repertoires.');
      this.#_multipleSeries = true;

      if (seriesColors.length < messageArrayLength) {
        this.#_logger.error('Not enough colors set for the amount of repertoires. Please increase the number of colors in seriesColor array.');
        throw 'Not enough colors set for the amount of repertoires. Please increase the number of colors in seriesColor array.';
      }
      colorIndexJumper = Math.floor((seriesColors.length - 1) / (messageArrayLength - 1));
    }

    if (percentage) {
      parsedProperties.setYLabel('Percentage');
      parsedProperties.setDraw3D(false);
    } else if (this.#_multipleSeries) {
      parsedProperties.setDraw3D(true);
    }

    // Specifics for this Parser
    let drilldownSeries = [];
    let geneSeries;
    let geneNames = [];
    let cellSeries;
    let genePostfix = StatsParserConstants.POSTFIX_GENE;
    let geneSpliter = StatsParserConstants.SPLITER_GENE;
    let cellPostfix = StatsParserConstants.POSTFIX_CALL;
    let cellSpliter = StatsParserConstants.SPLITER_CALL;

    for (let j = 0; j < messageArrayLength; j++) {
      let color = seriesColors[colorIndex];
      colorIndex += colorIndexJumper;
      let messageArrayObject = messageArray[j];
      let messageArrayObjectRepertoires = messageArrayObject[StatsParserConstants.REPERTOIRE] || messageArrayObject[StatsParserConstants.REPERTOIRES];

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
      if (!geneSeries || !cellSeries) {
        throw 'Incomplete structure for Drilldown. A structure of gene > call is required.';
      }
      if (geneSeries) {
        //fetch the StatsParserConstants.STATISTICS_NAME
        let statisticName = geneSeries[StatsParserConstants.STATISTICS_NAME];
        //Build ResultSeriesId
        let resultSeriesId = 'rep'.concat(repID).concat(genePostfix);
        //calculate the resutType by its name
        let type = ResultSeriesType.getByName(statisticName);
        //Build ResultSeriesName
        //let _resultSeriesName = 'Repertoire '.concat(repID).concat(' ').concat(type.toString());
        //DONE: change for the Repertoire {Rep_Id} or the value from properties.
        let _resultSeriesName = 'Repertoire '.concat(repID);
        let resultSeriesName = properties.seriesName ? properties.seriesName[j] || _resultSeriesName : _resultSeriesName;
        //FIXME: To test with SFU:
        resultSeriesName = 'Gene';

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
          let dataObject = geneSeries[StatsParserConstants.DATA][i];
          let geneName = dataObject[StatsParserConstants.KEY] || '';
          let callGroupName = geneName.concat(cellPostfix);
          geneNames.push(geneName);
          this._initializeCellGroup(repID, callGroupName);
          let value = dataObject[StatsParserConstants.VALUE];
          let dataItem = new ResultSeriesDataItem()
            .setName(geneName)
            .setY(percentage ? (value / totalUsageCount) * 100 : value)
            .setDrilldown(callGroupName);
          seriesData.push(dataItem);
        }
        //TODO: Before sorting I need to normalize data structures (for example ensure that all series have all named values, set to zero the missing ones.)
        //Sort elements by name
        if (properties.sort) {
          seriesData.sort((a, b) => a.name.localeCompare(b.name));
        }
        mainSeries.push(series);
        this._addToStructures(series);
      }

      if (cellSeries) {
        //fetch the StatsParserConstants.STATISTICS_NAME
        let statisticName = cellSeries[StatsParserConstants.STATISTICS_NAME];
        //Build ResultSeriesId
        let resultSeriesId = 'rep'.concat(repID).concat(cellPostfix);
        //calculate the resutType by its name
        let type = ResultSeriesType.getByName(statisticName);
        //Build ResultSeriesName
        //let _resultSeriesName = 'Repertoire '.concat(repID).concat(' ').concat(type.toString());
        //DONE: change for the Repertoire {Rep_Id} or the value from properties.
        let _resultSeriesName = 'Repertoire '.concat(repID);
        let resultSeriesName = properties.seriesName ? properties.seriesName[j] || _resultSeriesName : _resultSeriesName;
        //FIXME: To test with SFU:
        resultSeriesName = 'Allele';

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
          //DONE: change for the Repertoire {Rep_Id} or the value from properties if user set it.
          //let _cellSeriesName = geneNames[i].concat(' ').concat(type.toString());
          //let cellSeriesName = (properties.seriesName?(properties.seriesName[j]||_cellSeriesName):_cellSeriesName);
          let cellSeriesName = resultSeriesName;
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
          let dataObject = cellSeries[StatsParserConstants.DATA][i];
          let cellName = dataObject[StatsParserConstants.KEY] || '';
          //Note that on J Gene we only have 2 levels Gene > Cell, but the splitter remains cellSpliter.
          let cellSpliterIndex = cellName.indexOf(cellSpliter);
          //Answering situation where cellname is equal to genename.
          if (cellSpliterIndex == -1) cellSpliterIndex = cellName.length;
          let geneName = cellName.substring(0, cellSpliterIndex);
          let value = dataObject[StatsParserConstants.VALUE];
          let dataItem = new ResultSeriesDataItem().setName(cellName).setY(percentage ? (value / totalUsageCount) * 100 : value);
          seriesData.push(dataItem);
          cellSeriesDict[geneName].data.push(dataItem);
        }
        //TODO: Before sorting I need to normalize data structures (for example ensure that all series have all named values, set to zero the missing ones.)
        //sort elements by name
        if (properties.sort) {
          seriesData.sort((a, b) => a.name.localeCompare(b.name));
        }
        //    this.#_logger.trace(JSON.stringify(cellSeriesDict));
        for (let key in cellSeriesDict) {
          let value = cellSeriesDict[key];
          //Sort elements by name
          //TODO: This is ineficient, sorting must be applied only once when retrieving the structure for the chart.
          //TODO: Sorting must be dependent of the values in Properties .sort() or better .sortOn([key|value],[asc,desc]);
          if (properties.sort) {
            value.data.sort((a, b) => a.name.localeCompare(b.name));
          }
          this._addToStructures(value);
          //TODO: Need to changed this. drilldown series is to be of type ResultSeries (remove the .asHighchartSeries()).
        //   drilldownSeries.push(value.asHighchartSeries());
          drilldownSeries.push(value);
        }
      }
    }
    //  this.#_logger.debug('Series:');
    //  this.#_logger.debug(series);
    //  this.#_logger.debug('DrilldownSeries:');
    //  this.#_logger.debug(drilldownSeries);

    //return [series, {series:drilldownSeries}];
    this.#_series = mainSeries;
    // this.#_drilldownSeries = {series: drilldownSeries};
    this.#_drilldownSeries = drilldownSeries;
    console.log(this.#_cellSeriesByGene);
    if (this.isMultipleSeries())
      this.#_drilldownSeries = this.#_cellSeriesByGene;
    timer.end('parse');
    timer.print();
  }
}

export {StatsParserConstants, JunctionLenghtStatsParser, CountStatsParser, GeneUsageStatsParser, GeneUsageDrilldownStatsParser, JGeneUsageDrilldownStatsParser, GeneUsageSunburstStatsParser};
