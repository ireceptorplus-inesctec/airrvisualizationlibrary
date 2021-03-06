import {Logger, Common, DataType} from './common.js';

/**
 * Properties class for setting visualization properties and costumizations.
 */
class Properties {
  /**
   * @description default value for data drilldown
   * @static
   * @constant
   * @default false
   * @type {boolean}
   */
  static get DEFAULT_DATA_DRILLDOWN() {
    return false;
  }
  /**
   * @description default value for chart type
   * @static
   * @constant
   * @default 'column'
   * @type {string}
   */
  static get DEFAULT_CHART_TYPE() {
    return 'column';
  }
  /**
   * @description default value for sort
   * @static
   * @constant
   * @default false
   * @type {boolean}
   */
  static get DEFAULT_SORT() {
    return false;
  }
  /**
   * @description default value for animation
   * @static
   * @constant
   * @default false
   * @type {boolean}
   */
  static get DEFAULT_ANIMATION() {
    return false;
  }
  /**
   * @description default value for legend
   * @static
   * @constant
   * @default false
   * @type {boolean}
   */
  static get DEFAULT_LEGEND() {
    return false;
  }
  /**
   * @description default value for percentage (chart plots as percentages or as values)
   * @type {boolean}
   * @static
   * @default false
   * @constant
   */
  static get DEFAULT_PERCENTAGE() {
    return false;
  }
  /**
   * @description default value for alpha distance on 3D charts
   * @constant
   * @static
   * @default 20
   * @type {number}
   */
  static get DEFAULT_ALPHA_3D() {
    return 20;
  }
  /**
   * @description default value for beta distance on 3D charts
   * @type {number}
   * @constant
   * @static
   * @default 0
   */
  static get DEFAULT_BETA_3D() {
    return 0;
  }
  /**
   * @description default value for depth distance on 3D charts
   * @type {number}
   * @constant
   * @static
   * @default 100
   */
  static get DEFAULT_DEPTH_3D() {
    return 100;
  }
  /**
   * @description default value for depth distance on 3D charts
   * @type {boolean}
   * @constant
   * @static
   * @default false
   */
  static get DEFAULT_DRAW_3D() {
    return false;
  }
  /**
   * @description default color scheme used by series
   * @type {String[]}
   * @constant
   * @static
   * @default ["rgb(0,66,157)", "rgb(43,87,167)", "rgb(66,108,176)", "rgb(86,129,185)", "rgb(105,151,194)", "rgb(125,174,202)", "rgb(147,196,210)", "rgb(171,218,217)", "rgb(202,239,223)", "rgb(255,226,202)", "rgb(255,196,180)", "rgb(255,165,158)", "rgb(249,134,137)", "rgb(237,105,118)", "rgb(221,76,101)", "rgb(202,47,85)", "rgb(177,19,70)", "rgb(147,0,58)"]
   */
  //Highcharts default = ["rgb(124,181,236)", "rgb(67,67,72)", "rgb(144,237,125)"];
  //Colorblind safe = ["rgb(49,54,149)", "rgb(69,117,180)", "rgb(116,173,209)", "rgb(171,217,233)", "rgb(224,243,248)", "rgb(255,255,191)", "rgb(254,224,144)", "rgb(253,174,97)", "rgb(244,109,67)", "rgb(215,48,39)", "rgb(165,0,38)"];
  //static get DEFAULT_SERIES_COLORS(){return ["rgb(0,66,157)", "rgb(43,87,167)", "rgb(66,108,176)", "rgb(86,129,185)", "rgb(105,151,194)", "rgb(125,174,202)", "rgb(147,196,210)", "rgb(171,218,217)", "rgb(202,239,223)", "rgb(255,226,202)", "rgb(255,196,180)", "rgb(255,165,158)", "rgb(249,134,137)", "rgb(237,105,118)", "rgb(221,76,101)", "rgb(202,47,85)", "rgb(177,19,70)", "rgb(147,0,58)"]};
  //static get DEFAULT_SERIES_COLORS(){return ["rgb(0,0,153)","rgb(0,0,204)","rgb(0,0,255)","rgb(0,51,153)","rgb(0,51,204)","rgb(0,51,255)","rgb(0,102,0)","rgb(0,102,51)","rgb(0,102,102)","rgb(0,102,153)","rgb(0,102,204)","rgb(0,102,255)","rgb(0,153,0)","rgb(0,153,51)","rgb(0,153,102)","rgb(0,153,153)","rgb(0,153,204)","rgb(0,153,255)","rgb(0,204,0)","rgb(0,204,51)","rgb(0,204,102)","rgb(0,204,153)","rgb(0,204,204)","rgb(0,204,255)","rgb(0,255,0)","rgb(0,255,51)","rgb(0,255,102)","rgb(0,255,153)","rgb(0,255,204)","rgb(0,255,255)","rgb(51,0,204)","rgb(51,0,255)","rgb(51,51,204)","rgb(51,51,255)","rgb(51,102,0)","rgb(51,102,51)","rgb(51,102,102)","rgb(51,102,153)","rgb(51,102,204)","rgb(51,102,255)","rgb(51,153,0)","rgb(51,153,51)","rgb(51,153,102)","rgb(51,153,153)","rgb(51,153,204)","rgb(51,153,255)","rgb(51,204,0)","rgb(51,204,51)","rgb(51,204,102)","rgb(51,204,153)","rgb(51,204,204)","rgb(51,204,255)","rgb(51,255,0)","rgb(51,255,51)","rgb(51,255,102)","rgb(51,255,153)","rgb(51,255,204)","rgb(51,255,255)","rgb(102,0,0)","rgb(102,0,51)","rgb(102,0,102)","rgb(102,0,153)","rgb(102,0,204)","rgb(102,0,255)","rgb(102,51,0)","rgb(102,51,51)","rgb(102,51,102)","rgb(102,51,153)","rgb(102,51,204)","rgb(102,51,255)","rgb(102,102,0)","rgb(102,102,51)","rgb(102,102,102)","rgb(102,102,153)","rgb(102,102,204)","rgb(102,102,255)","rgb(102,153,0)","rgb(102,153,51)","rgb(102,153,102)","rgb(102,153,153)","rgb(102,153,204)","rgb(102,153,255)","rgb(102,204,0)","rgb(102,204,51)","rgb(102,204,102)","rgb(102,204,153)","rgb(102,204,204)","rgb(102,204,255)","rgb(102,255,0)","rgb(102,255,51)","rgb(102,255,102)","rgb(102,255,153)","rgb(102,255,204)","rgb(102,255,255)","rgb(153,0,0)","rgb(153,0,51)","rgb(153,0,102)","rgb(153,0,153)","rgb(153,0,204)","rgb(153,0,255)","rgb(153,51,0)","rgb(153,51,51)","rgb(153,51,102)","rgb(153,51,153)","rgb(153,51,204)","rgb(153,51,255)","rgb(153,102,0)","rgb(153,102,51)","rgb(153,102,102)","rgb(153,102,153)","rgb(153,102,204)","rgb(153,102,255)","rgb(153,153,0)","rgb(153,153,51)","rgb(153,153,102)","rgb(153,153,153)","rgb(153,153,204)","rgb(153,153,255)","rgb(153,204,0)","rgb(153,204,51)","rgb(153,204,102)","rgb(153,204,153)","rgb(153,204,204)","rgb(153,204,255)","rgb(153,255,0)","rgb(153,255,51)","rgb(153,255,102)","rgb(153,255,153)","rgb(153,255,204)","rgb(153,255,255)","rgb(204,0,0)","rgb(204,0,51)","rgb(204,0,102)","rgb(204,0,153)","rgb(204,0,204)","rgb(204,0,255)","rgb(204,51,0)","rgb(204,51,51)","rgb(204,51,102)","rgb(204,51,153)","rgb(204,51,204)","rgb(204,51,255)","rgb(204,102,0)","rgb(204,102,51)","rgb(204,102,102)","rgb(204,102,153)","rgb(204,102,204)","rgb(204,102,255)","rgb(204,153,0)","rgb(204,153,51)","rgb(204,153,102)","rgb(204,153,153)","rgb(204,153,204)","rgb(204,153,255)","rgb(204,204,0)","rgb(204,204,51)","rgb(204,204,102)","rgb(204,204,153)","rgb(204,204,204)","rgb(204,204,255)","rgb(204,255,0)","rgb(204,255,51)","rgb(204,255,102)","rgb(204,255,153)","rgb(204,255,204)","rgb(204,255,255)","rgb(255,0,0)","rgb(255,0,51)","rgb(255,0,102)","rgb(255,0,153)","rgb(255,0,204)","rgb(255,0,255)","rgb(255,51,0)","rgb(255,51,51)","rgb(255,51,102)","rgb(255,51,153)","rgb(255,51,204)","rgb(255,51,255)","rgb(255,102,0)","rgb(255,102,51)","rgb(255,102,102)","rgb(255,102,153)","rgb(255,102,204)","rgb(255,102,255)","rgb(255,153,0)","rgb(255,153,51)","rgb(255,153,102)","rgb(255,153,153)","rgb(255,153,204)","rgb(255,153,255)","rgb(255,204,0)","rgb(255,204,51)","rgb(255,204,102)","rgb(255,204,153)","rgb(255,204,204)","rgb(255,204,255)","rgb(255,255,0)","rgb(255,255,51)","rgb(255,255,102)","rgb(255,255,153)","rgb(255,255,204)"]};
  //Colorbrewer12 = ['rgb(31,120,180)','rgb(166,206,227)','rgb(178,223,138)','rgb(51,160,44)','rgb(251,154,153)','rgb(227,26,28)','rgb(253,191,111)','rgb(255,127,0)','rgb(202,178,214)','rgb(106,61,154)','rgb(255,255,153)','rgb(177,89,40)'];
  static get DEFAULT_SERIES_COLORS() {
    return [
      '#2c3996',
      '#40008B',
      '#3843D2',
      '#006eb9',
      '#eacd85',
      '#cf9a41',
      '#048D79',
      '#ff9a98',
      '#f4b504',
      '#ee4423',
      '#f46C02',
      '#6c3c26',
      '#016748',
      '#e65415',
      '#a31e28',
      '#c7A338',
      '#d67b80',
      '#ea2112',
      '#7e412e',
      '#9e6f98',
      '#8e3463',
      '#553265',
      '#700100',
      '#044660',
      '#0896a0',
      '#02554c',
      '#366fc0',
      '#cd9854',
      '#08b3ab',
      '#ff6602',
      '#cd342e',
      '#844257',
      '#bb5769',
      '#00496a',
      '#79963c',
      '#667fb5',
      '#776cb2',
      '#b16774',
      '#f0b99a',
      '#d01013',
      '#edb200',
      '#853b92',
      '#f85f68',
      '#0d6628',
      '#5a4692',
      '#1975ca',
      '#a33a47',
      '#d4173f',
      '#495b53',
      '#142e54',
      '#6db432',
      '#ff9a00',
      '#f60100',
      '#689eb8',
      '#a79b94',
      '#ff5a60',
    ];
  }

  #_logger;
  #_title;
  #_subtitle;
  #_xLabel;
  #_yLabel;
  #_yMaxValue;
  #_stackingType;
  #_grouping;
  #_seriesName;
  #_data;
  #_metadata;
  #_dataType;
  #_dataDrilldown;
  #_id;
  #_sort;
  #_chartType;
  #_animation;
  #_legend;
  #_percentage;
  #_alpha3D;
  #_beta3D;
  #_depth3D;
  #_draw3D;
  #_seriesColors;
  #_dataDrilldown_userDefined;
  #_sort_userDefined;
  #_percentage_userDefined;
  #_chartType_userDefined;
  #_animation_userDefined;
  #_legend_userDefined;
  #_alpha3D_userDefined;
  #_beta3D_userDefined;
  #_depth3D_userDefined;
  #_draw3D_userDefined;
  #_seriesColors_userDefined;

  /**
   * @description Creates an instance of Properties.
   */
  constructor() {
    this.#_logger = new Logger('Properties');
    this.#_logger.debug('Constructor.');
    this.#_title = undefined;
    this.#_subtitle = undefined;
    this.#_xLabel = undefined;
    this.#_yLabel = undefined;
    this.#_yMaxValue = undefined;
    this.#_stackingType = undefined;
    this.#_grouping = undefined;
    this.#_seriesName = undefined;
    this.#_data = undefined;
    this.#_metadata = undefined;
    this.#_dataType = undefined;
    this.#_dataDrilldown = Properties.DEFAULT_DATA_DRILLDOWN; //defaults to false
    this.#_id = Common.makeid(12);
    this.#_sort = Properties.DEFAULT_SORT;
    this.#_percentage = Properties.DEFAULT_PERCENTAGE;
    this.#_chartType = Properties.DEFAULT_CHART_TYPE; //defaults to column chart.
    this.#_animation = Properties.DEFAULT_ANIMATION; //defaults to false.
    this.#_legend = Properties.DEFAULT_LEGEND; //defaults to false.
    this.#_alpha3D = Properties.DEFAULT_ALPHA_3D; //defaults to 20;
    this.#_beta3D = Properties.DEFAULT_BETA_3D; //defaults to 0;
    this.#_depth3D = Properties.DEFAULT_DEPTH_3D; //defaults to 100;
    this.#_draw3D = Properties.DEFAULT_DRAW_3D; //defaults to false;
    this.#_seriesColors = Properties.DEFAULT_SERIES_COLORS; //defaults to 100;
    this.#_sort_userDefined = false;
    this.#_percentage_userDefined = false;
    this.#_chartType_userDefined = false;
    this.#_animation_userDefined = false;
    this.#_legend_userDefined = false;
    this.#_alpha3D_userDefined = false;
    this.#_beta3D_userDefined = false;
    this.#_depth3D_userDefined = false;
    this.#_dataDrilldown_userDefined = false;
    this.#_seriesColors_userDefined = false;

    this.#_logger.trace(JSON.stringify(this));
  }

  /**
   * @description the Chart title
   * @type {String}
   */
  get title() {
    return this.getTitle();
  }

  set title(value) {
    this.setTitle(value);
  }

  /**
   * @description returns the title of the Chart.
   * @returns {String} the title of the Chart.
   */
  getTitle() {
    return this.#_title;
  }

  /**
   * @description Sets the title of the Chart.
   * @param {String} value the title of the Chart.
   * @returns {Properties} the same instance on which the method was called.
   */
  setTitle(value) {
    this.#_title = value;
    this.#_logger.debug('setTitle.');
    this.#_logger.trace(JSON.stringify(this));
    return this;
  }

  /**
   * @description the Chart subtitle
   * @type {String}
   */
  get subtitle() {
    return this.getSubtitle();
  }

  set subtitle(value) {
    this.setSubtitle(value);
  }

  /**
   * @description returns the subtitle of this Chart.
   * @returns {String} the subtitle of the Chart.
   */
  getSubtitle() {
    return this.#_subtitle;
  }

  /**
   * @description Sets the subtitle of the Chart.
   * @param {String} value the subtitle of the Chart.
   * @returns {Properties} the same instance on which the method was called.
   */
  setSubtitle(value) {
    /*if (!(value instanceof Array)){
            throw new TypeError('subtitle should be set as an Array to support Drilldown and Drillup features.');
        }*/
    this.#_subtitle = value;
    this.#_logger.debug('setSubtitle');
    this.#_logger.trace(JSON.stringify(this));
    return this;
  }

  /**
   * @description the Chart label for the Xx axis
   * @type {String}
   */
  get xLabel() {
    return this.getXLabel();
  }

  set xLabel(value) {
    this.setXLabel(value);
  }

  /**
   * @description returns the Chart label for the Xx axis
   * @returns {String} the Chart label for the Xx axis
   */
  getXLabel() {
    return this.#_xLabel;
  }

  /**
   * @description Sets the Chart label for the Xx axis
   * @param {String} value the Chart label for the Xx axis
   * @returns {Properties} the same instance on which the method was called.
   */
  setXLabel(label) {
    this.#_xLabel = label;
    this.#_logger.debug('setXLabel.');
    this.#_logger.trace(JSON.stringify(this));
    return this;
  }

  /**
   * @description the Chart label for the Yy axis
   * @type {String}
   */
  get yLabel() {
    return this.getYLabel();
  }

  set yLabel(value) {
    this.setYLabel(value);
  }

  /**
   * @description returns the Chart label for the Yy axis
   * @returns {String} the Chart label for the Yy axis
   */
  getYLabel() {
    return this.#_yLabel;
  }

  /**
   * @description Sets the Chart label for the Yy axis
   * @param {String} value the Chart label for the Yy axis
   * @returns {Properties} the same instance on which the method was called.
   */
  setYLabel(label) {
    this.#_yLabel = label;
    this.#_logger.debug('setYLabel.');
    this.#_logger.trace(JSON.stringify(this));
    return this;
  }

  /**
   * @description the top value for the Yy axis
   * @type {String}
   */
  get yMaxValue() {
    return this.getYMaxValue();
  }

  set yMaxValue(value) {
    this.setYMaxValue(value);
  }

  /**
   * @description returns the top value for the Yy axis
   * @returns {String} the top value for the Yy axis
   */
  getYMaxValue() {
    return this.#_yMaxValue;
  }

  /**
   * @description Sets the top value for the Yy axis
   * @param {String} value the top value for the Yy axis
   * @returns {Properties} the same instance on which the method was called.
   */
  setYMaxValue(value) {
    this.#_yMaxValue = value;
    this.#_logger.debug('setYMaxValue.');
    this.#_logger.trace(JSON.stringify(this));
    return this;
  }

  /**
   * @description the id of the HTML element where the chart is to be plotted. Will be used as {@link Chart}.id.
   * @type {String}
   */
  get id() {
    return this.getId();
  }

  set id(value) {
    this.setId(value);
  }

  /**
   * @description returns the id of the HTML element where the chart is to be plotted.
   * @returns {String} the id of the HTML element where the chart is to be plotted.
   */
  getId() {
    return this.#_id;
  }

  /**
   * @description Sets the id of the HTML element where the chart is to be plotted.
   * @param {String} value the id of the HTML element where the chart is to be plotted.
   * @returns {Properties} the same instance on which the method was called.
   */
  setId(value) {
    if (!(value === undefined)) {
      this.#_id = value;
      this.#_logger.debug('setId.');
    }
    this.#_logger.trace(JSON.stringify(this));
    //console.log(JSON.stringify(this));
    return this;
  }

  /**
   * @description the stacking type value of the chart.
   * @type {String}
   */
  get stackingType() {
    return this.getStackingType();
  }

  set stackingType(value) {
    this.setStackingType(value);
  }

  /**
   * @description returns the stacking type value of the chart.
   * @returns {String} the stacking type value of the chart.
   */
  getStackingType() {
    return this.#_stackingType;
  }

  /**
   * @description Sets the stacking type value of the chart.
   * @param {String} value the stacking type value of the chart.
   * @returns {Properties} the same instance on which the method was called.
   */
  setStackingType(value) {
    this.#_stackingType = value;
    this.#_logger.debug('setStackingType.');
    this.#_logger.trace(JSON.stringify(this));
    return this;
  }
  /**
   * @description defines if grouping is to be used or not in the chart.
   * @type {boolean}
   */
  get grouping() {
    return this.getGrouping();
  }

  set grouping(value) {
    this.setGrouping(value);
  }

  /**
   * @description returns true if grouping is to be used in the chart.
   * @returns {boolean} true if grouping is to be used in the chart.
   */
  getGrouping() {
    return this.#_grouping;
  }

  /**
   * @description Sets if grouping is to be used or not in the chart.
   * @param {boolean} value true if grouping is to be used in the chart.
   * @returns {Properties} the same instance on which the method was called.
   */
  setGrouping(value) {
    this.#_grouping = value;
    this.#_logger.debug('setGrouping.');
    this.#_logger.trace(JSON.stringify(this));
    return this;
  }

  /**
   * @description the Series Name value of the data.
   * @type {string[]}
   */
  get seriesName() {
    return this.getSeriesName();
  }

  set seriesName(value) {
    this.setSeriesName(value);
  }

  /**
   * @description returns the stacking type value of the chart.
   * @returns {string[]} value the array with the series name values for the data.
   */
  getSeriesName() {
    return this.#_seriesName;
  }

  /**
   * @description Sets the Series names value of the data.
   * @param {string[]} value the array with the series name values for the data.
   * @returns {Properties} the same instance on which the method was called.
   */
  setSeriesName(value) {
    this.#_seriesName = value;
    this.#_logger.debug('setSeriesName.');
    this.#_logger.trace(JSON.stringify(this));
    return this;
  }

  /**
   * @description the source data.
   * @type {JSON}
   */
  get data() {
    return this.getData();
  }

  set data(value) {
    this.setData(value);
  }

  /**
   * @description returns the source data.
   * @returns {JSON} the source data.
   */
  getData() {
    return this.#_data;
  }

  /*
   * @description Sets the data data.
   * @param {JSON} value the source data.
   * @returns {Properties} the same instance on which the method was called.
   */
  /*setData(value) {
        this.#_data = value;
        this.#_logger.debug("setData.");
        this.#_logger.trace(JSON.stringify(this));
        return this;
    }*/

  /**
   * @description Sets the source data.
   * @param {JSON} data the source data.
   * @param {string} [dataType] the source data.
   * @param {boolean} [dataDrilldown] the source data.
   * @returns {Properties} the same instance on which the method was called.
   */
  setData(data, dataType, dataDrilldown) {
    this.#_data = data;
    if (dataType != undefined) this.setDataType(dataType);
    if (dataDrilldown != undefined) this.setDataDrilldown(dataDrilldown);
    this.#_logger.debug('setData.');
    this.#_logger.trace(JSON.stringify(this));
    return this;
  }

  /**
   * @description the metadata.
   * @type {JSON}
   */
  get metadata() {
    return this.getMetadata();
  }

  set metadata(value) {
    this.setMetadata(value);
  }

  /**
   * @description returns the metadata.
   * @returns {JSON} the metadata.
   */
  getMetadata() {
    return this.#_metadata;
  }

    /*
   * @description Sets the metadata.
   * @param {JSON} value the metadata.
   * @returns {Properties} the same instance on which the method was called.
   */
  setMetadata(value) {
        this.#_metadata = value;
        return this;
    }

  /**
   * @description the data type of the source data.
   * @type {String}
   */
  get dataType() {
    return this.getDataType();
  }

  set dataType(value) {
    this.setDataType(value);
  }

  /**
   * @description returns the data type of the source data.
   * @returns {String} the data type of the source data.
   */
  getDataType() {
    return this.#_dataType;
  }

  /**
   * @description Sets the data type of the source data.
   * @param {String} value the data type of the source data.
   * @returns {Properties} the same instance on which the method was called.
   */
  setDataType(value) {
    if (DataType.contains(value)) this.#_dataType = value;
    else throw new TypeError('An unknown Data Type was set in the properties file: ' + value);
    this.#_logger.debug('setDataType.');
    this.#_logger.trace(JSON.stringify(this));
    return this;
  }

  /**
   * @description the data drilldown of the source data.
   * @type {String}
   */
  get dataDrilldown() {
    return this.getDataDrilldown();
  }

  set dataDrilldown(value) {
    this.setDataDrilldown(value);
  }

  /**
   * @description returns true if the source data has drilldown structure.
   * @returns {String} the data drilldown value of the source data.
   */
  getDataDrilldown() {
    return this.#_dataDrilldown;
  }

  /**
   * @description Sets the data Drilldown of the source data. If true it is expected that the source data has a specific structure according to the data type.
   * @param {String} value the data drilldown value of the source data.
   * @returns {Properties} the same instance on which the method was called.
   */
  setDataDrilldown(value) {
    if (!(value === undefined) && typeof value == 'boolean') {
      this.#_dataDrilldown = value;
      this.#_dataDrilldown_userDefined = true;
    }
    this.#_logger.debug('setDataDrilldown.');
    this.#_logger.trace(JSON.stringify(this));
    return this;
  }

  /**
   * @description the value of the sorting property to be used by the {@link resultseries}.
   * @type {Boolean}
   */
  get sort() {
    return this.getSort();
  }

  set sort(value) {
    this.setSort(value);
  }

  /**
   * @description Returns the value of the sorting property to be used by the {@link resultseries}.
   * @returns {Boolean} the value of the sorting property to be used by the {@link resultseries}.
   */
  getSort() {
    return this.#_sort;
  }

  /**
   * @description Sets the value of the sorting property to be used by the {@link resultseries}.
   * @param {String} value the value of the sorting property to be used by the {@link resultseries}.
   * @returns {Properties} the same instance on which the method was called.
   */
  setSort(value) {
    if (!(value === undefined)) {
      this.#_sort = value;
      this.#_sort_userDefined = true;
    }
    this.#_logger.debug('setSort.');
    this.#_logger.trace(JSON.stringify(this));
    return this;
  }

  /**
   * @description the type of chart to be plotted. Default to {@link Properties.DEFAULT_CHART_TYPE}.
   * @type {String}
   */
  get chartType() {
    return this.getChartType();
  }

  set chartType(value) {
    this.setChartType(value);
  }

  /**
   * @description Returns the type of chart to be plotted.
   * @returns {String} the type of chart to be plotted.
   */
  getChartType() {
    return this.#_chartType;
  }

  /**
   * @description Sets the type of chart to be plotted.
   * @param {String} value the type of chart to be plotted.
   * @returns {Properties} the same instance on which the method was called.
   */
  setChartType(value) {
    if (!(value === undefined)) {
      this.#_chartType = value;
      this.#_chartType_userDefined = true;
    }
    this.#_logger.debug('setChartType.');
    this.#_logger.trace(JSON.stringify(this));
    return this;
  }

  /**
   * @description the value of the animation property to be used by the Chart.
   * @type {Boolean}
   */
  get animation() {
    return this.getAnimation();
  }

  set animation(value) {
    this.setAnimation(value);
  }

  /**
   * @description Returns the value of the animation property to be used by the Chart.
   * @returns {Boolean} the value of the animation property to be used by the Chart.
   */
  getAnimation() {
    return this.#_animation;
  }

  /**
   * @description Sets the value of the animation property to be used by the Chart.
   * @param {String} value the value of the animation property to be used by the Chart.
   * @returns {Properties} the same instance on which the method was called.
   */
  setAnimation(value) {
    if (!(value === undefined)) {
      this.#_animation = value;
      this.#_animation_userDefined = true;
    }
    this.#_logger.debug('setAnimation.');
    this.#_logger.trace(JSON.stringify(this));
    return this;
  }

  /**
   * @description the value of the legend property to be used by the Chart.
   * @type {Boolean}
   */
  get legend() {
    return this.getLegend();
  }

  set legend(value) {
    this.setLegend(value);
  }

  /**
   * @description Returns the value of the legend property to be used by the Chart.
   * @returns {Boolean} the value of the legend property to be used by the Chart.
   */
  getLegend() {
    return this.#_legend;
  }

  /**
   * @description Sets the value of the legend property to be used by the Chart.
   * @param {String} value the value of the legend property to be used by the Chart.
   * @returns {Properties} the same instance on which the method was called.
   */
  setLegend(value) {
    if (!(value === undefined)) {
      this.#_legend = value;
      this.#_legend_userDefined = true;
    }
    this.#_logger.debug('setLegend.');
    this.#_logger.trace(JSON.stringify(this));
    return this;
  }

  /**
   * @description the value of the alpha distance to be used on 3D charts.
   * @type {Number}
   */
  get alpha3D() {
    return this.getAlpha3D();
  }

  set alpha3D(value) {
    this.setAlpha3D(value);
  }

  /**
   * @description Returns the value of the alpha distance to be used on 3D charts.
   * @returns {Number} the value of the alpha distance to be used on 3D charts.
   */
  getAlpha3D() {
    return this.#_alpha3D;
  }

  /**
   * @description Sets the value of the alpha distance to be used on 3D charts.
   * @param {Number} value the value of the alpha distance to be used on 3D charts.
   * @returns {Properties} the same instance on which the method was called.
   */
  setAlpha3D(value) {
    if (!(value === undefined)) {
      this.#_alpha3D = value;
      this.#_alpha3D_userDefined = true;
    }
    this.#_logger.debug('setAlpha3D.');
    this.#_logger.trace(JSON.stringify(this));
    return this;
  }

  /**
   * @description the value of the beta distance to be used on 3D charts.
   * @type {Number}
   */
  get beta3D() {
    return this.getBeta3D();
  }

  set beta3D(value) {
    this.setBeta3D(value);
  }

  /**
   * @description Returns the value of the beta distance to be used on 3D charts.
   * @returns {Number} the value of the beta distance to be used on 3D charts.
   */
  getBeta3D() {
    return this.#_beta3D;
  }

  /**
   * @description Sets the value of the beta distance to be used on 3D charts.
   * @param {Number} value the value of the beta distance to be used on 3D charts.
   * @returns {Properties} the same instance on which the method was called.
   */
  setBeta3D(value) {
    if (!(value === undefined)) {
      this.#_beta3D = value;
      this.#_beta3D_userDefined = true;
    }
    this.#_logger.debug('setBeta3D.');
    this.#_logger.trace(JSON.stringify(this));
    return this;
  }

  /**
   * @description the value of the depth distance to be used on 3D charts.
   * @type {Number}
   */
  get depth3D() {
    return this.getDepth3D();
  }

  set depth3D(value) {
    this.setDepth3D(value);
  }

  /**
   * @description Returns the value of the depth distance to be used on 3D charts.
   * @returns {Number} the value of the depth distance to be used on 3D charts.
   */
  getDepth3D() {
    return this.#_depth3D;
  }

  /**
   * @description Sets the value of the depth distance to be used on 3D charts.
   * @param {Number} value the value of the depth distance to be used on 3D charts.
   * @returns {Properties} the same instance on which the method was called.
   */
  setDepth3D(value) {
    if (!(value === undefined)) {
      this.#_depth3D = value;
      this.#_depth3D_userDefined = true;
    }
    this.#_logger.debug('setDepth3D.');
    this.#_logger.trace(JSON.stringify(this));
    return this;
  }

  /**
   * @description the value of the depth distance to be used on 3D charts.
   * @type {Number}
   */
  get draw3D() {
    return this.getDraw3D();
  }

  set draw3D(value) {
    this.setDraw3D(value);
  }

  /**
   * @description Returns the value of the depth distance to be used on 3D charts.
   * @returns {Number} the value of the depth distance to be used on 3D charts.
   */
  getDraw3D() {
    return this.#_draw3D;
  }

  /**
   * @description Sets the value of the depth distance to be used on 3D charts.
   * @param {Number} value the value of the depth distance to be used on 3D charts.
   * @returns {Properties} the same instance on which the method was called.
   */
  setDraw3D(value) {
    if (!(value === undefined)) {
      this.#_draw3D = value;
      this.#_draw3D_userDefined = true;
    }
    this.#_logger.debug('setDraw3D.');
    this.#_logger.trace(JSON.stringify(this));
    return this;
  }

  /**
   * @description array of strings representing the series colors to be used.
   * @type {string[]}
   */
  get seriesColors() {
    return this.getSeriesColors();
  }

  set seriesColors(value) {
    this.setSeriesColors(value);
  }

  /**
   * @description Returns the value of the colors used in the chart.
   * @returns {string[]} the value of the color used in the chart.
   */
  getSeriesColors() {
    return this.#_seriesColors;
  }

  /**
   * @description Sets  the value of the colors used in the chart.
   * @param {string[]} value the  the value of the colors used in the chart.
   * @returns {Properties} the same instance on which the method was called.
   */
  setSeriesColors(value) {
    if (!(value === undefined)) {
      this.#_seriesColors = value;
      this.#_seriesColors_userDefined = true;
    }
    this.#_logger.debug('setSeriesColors.');
    this.#_logger.trace(JSON.stringify(this));
    return this;
  }

  /**
   * @description indicates if the chart is to be plotted as percentages or as values.
   * @type {Boolean}
   */
  get percentage() {
    return this.getPercentage();
  }

  set percentage(value) {
    this.setPercentage(value);
  }

  /**
   * @description Returns true if the chart is to be plotted as percentages or as values.
   * @returns {Boolean}
   */
  getPercentage() {
    return this.#_percentage;
  }

  /**
   * @description Sets the value if the data is to be plotted as percentage or as values.
   * @param {Boolean} value
   * @returns {Properties} the same instance on which the method was called.
   */
  setPercentage(value) {
    if (!(value === undefined)) {
      this.#_percentage = value;
      this.#_percentage_userDefined = true;
    }
    this.#_logger.debug('setPercentage.');
    this.#_logger.trace(JSON.stringify(this));
    return this;
  }

  /**
   * @description Updates a Properties with another properties contents. Own contents will only be updated if not yet set.
   * @param {Properties} anotherProperties
   * @returns {Properties} the same instance on which the method was called.
   */
  updateWith(anotherProperties) {
    if (!anotherProperties || !(anotherProperties instanceof Properties)) {
      return this;
    }
    if (!this.#_chartType_userDefined && anotherProperties.chartType) this.setChartType(anotherProperties.chartType);
    if (this.title == undefined && anotherProperties.title) this.setTitle(anotherProperties.title);
    if (this.subtitle == undefined && anotherProperties.subtitle) this.setSubtitle(anotherProperties.subtitle);
    if (!this.xLabel && anotherProperties.xLabel) this.setXLabel(anotherProperties.xLabel);
    if (!this.yLabel && anotherProperties.yLabel) this.setYLabel(anotherProperties.yLabel);
    if (!this.#_yMaxValue && anotherProperties.yMaxValue) this.setYMaxValue(anotherProperties.yMaxValue);
    if (!this.stackingType && anotherProperties.stackingType) this.setStackingType(anotherProperties.stackingType);
    if (this.grouping == undefined && anotherProperties.grouping != undefined) this.setGrouping(anotherProperties.grouping);
    if (!this.data && anotherProperties.data) this.setData(anotherProperties.data);
    if (!this.dataType && anotherProperties.dataType) this.setDataType(anotherProperties.dataType);
    if (!this.#_dataDrilldown_userDefined && anotherProperties.dataDrilldown) this.setDataDrilldown(anotherProperties.dataDrilldown);
    if (!this.#_sort_userDefined && anotherProperties.sort) this.setSort(anotherProperties.sort);
    if (!this.#_animation_userDefined && anotherProperties.animation) this.setAnimation(anotherProperties.animation);
    if (!this.#_legend_userDefined && anotherProperties.legend) this.setLegend(anotherProperties.legend);
    if (!this.#_percentage_userDefined && anotherProperties.percentage) this.setPercentage(anotherProperties.percentage);
    if (!this.#_alpha3D_userDefined && anotherProperties.alpha3D) this.setAlpha3D(anotherProperties.alpha3D);
    if (!this.#_beta3D_userDefined && anotherProperties.beta3D) this.setBeta3D(anotherProperties.beta3D);
    if (!this.#_depth3D_userDefined && anotherProperties.depth3D) this.setDepth3D(anotherProperties.depth3D);
    if (!this.#_draw3D_userDefined && anotherProperties.draw3D) this.setDraw3D(anotherProperties.draw3D);
    if (!this.#_seriesColors_userDefined && anotherProperties.seriesColors) this.setSeriesColors(anotherProperties.seriesColors);
    if (!this.id && anotherProperties.id) this.setId(anotherProperties.id);
    return this;
  }

  /**
   * @description Always returns a valid Properties instance. Will create a new Properties, with default values, if the parameter is not valid (for example wrong JSON structure or inexistant properties), or will return the Properties instance otherwise.
   * @static
   * @param {(Properties|JSON|string|undefined)} properties a {@link Properties}, or a {@link JSON} or String representation of a Properties, or undefined.
   * @returns {Properties}
   */
  static create(properties) {
    let p = undefined;
    if (properties == null) {
      p = new Properties();
    } else if (properties instanceof Properties) {
      p = new Properties().updateWith(properties).setId(properties.id);
    } else if (typeof properties === 'string') {
      properties = JSON.parse(properties);
    }

    if (p == undefined && properties.constructor == Common.objectConstructor) {
      p = new Properties();
      try {
        Object.seal(p);
        Object.assign(p, properties);
      } catch (e) {
        //console.log(e);
        Logger.error('Properties', 'Properties: tried to build an Object with the wrong structure. Returning a default Properties instance.');
        p = new Properties();
      }
    }
    return p || new Properties();
  }
}

export {Properties};
