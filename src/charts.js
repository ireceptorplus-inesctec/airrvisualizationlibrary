// Import and export other modules from AIIR Visualization Library
import {Logger, DebugTimer, ChartType, Common} from './common.js';
import {ResultFactory} from './index.js';
import {Properties} from './properties.js';
import {Result} from './result.js';
import {ResultSeriesDataItem, ResultSeries} from './series.js';

/**
 * Abstract Class for the Chart type.
 * @abstract
 */
class Chart {
  #_logger;
  #_id;
  #_properties;
  #_result;

  /**
   * @description Creates an instance of {@link Chart}.
   * @param {Properties} properties The properties of the chart.
   */
  constructor(properties) {
    if (this.constructor === Chart) {
      // Abstract class can not be constructed.
      throw new Error('Can not construct abstract class.');
    } //else (called from child)
    // Check if all instance methods are implemented.
    if (this.plot === Chart.prototype.plot) {
      // Child has not implemented this abstract method.
      throw new TypeError('Please implement abstract method plot.');
    }
    this.#_logger = new Logger('Chart');
    this.#_logger.debug('Constructor.');
    //this.#_result = undefined;
    //this.setProperties(properties);
    this.#_properties = properties;
    this.#_id = this.properties.id;
    this.#_result = ResultFactory.build(this.getProperties());
    this.#_result.parse(this.getProperties());
  }

  /**
   * @description the Chart ID
   * @readonly
   * @type {String}
   */
  get id() {
    return this.getId();
  }

  /**
   * @description Returns the ID of this Chart
   * @returns {String} The identification of the Chart instance.
   */
  getId() {
    return this.#_id;
  }

  /**
   * @description The {@link Result} to be plotted.
   * @type {Result}
   */
  get result() {
    return this.getResult();
  }

  /**
   * @description returns the Result of this Chart.
   * @returns {Result} the Result object.
   */
  getResult() {
    return this.#_result;
  }

  /**
   * @description The {@link Properties} of the chart
   * @type {Properties}
   */
  get properties() {
    return this.getProperties();
  }

  /**
   * @description Returns the {@link Properties} of this chart
   * @returns {Properties} the Properties object.
   */
  getProperties() {
    return this.#_properties;
  }

  /**
   * @description Abstract method. All subclasses must implement this method.
   * @abstract
   * @throws Throws Error if directly called.
   */
  plot() {
    this.#_logger.fatal('this plot() method should never execute, specializations of Chart need to overload it.');
    throw new TypeError('This method should not be called, implementations need to overload it.');
  }
}

/**
 * A {@link Chart} that uses the Highcharts Libary to plot graphs
 * @extends {Chart}
 */
class HighchartsChart extends Chart {
  #_chart;
  #_logger;
  #_highcharts;
  #_xAxisCategories;
  #_yAxisCategories;

  /**
   * Creates an instance of {@link HighchartsChart}.
   * @param {Properties} properties The properties of the chart.
   */
  constructor(properties) {
    super(properties);
    this.#_logger = new Logger('HichartsChart');
    this.#_logger.debug('Constructor.');
    this.#_chart = undefined;
    this.checkHighcharts();
    this.#_highcharts = window.Highcharts;
    this.#_logger.trace(JSON.stringify(this));
    this.#_xAxisCategories = undefined;
    this.#_yAxisCategories = undefined;
  }

  /**
   * @description After calling plot(), will hold the created {@link Highcharts.chart} instance.
   * @readonly
   */
  get chart() {
    return this.getChart();
  }

  /**
   * @description Returns a pointer to the Highcharts.chart created in this class.
   * @returns {Highcharts.chart} the created {@link Highcharts.chart} instance
   */
  getChart() {
    return this.#_chart;
  }

  /**
   * @description Verifies if Highcharts Library and all required Highcharts modules are loaded before creating instances of this module.
   * @private
   * @throws Error if Highcharts Library or any of the required modules are missing.
   */
  checkHighcharts() {
    //TODO: check for existence of modules based on properties file.
    this.#_logger.debug('Checking if highcharts resources are available.');
    let Highcharts = window.Highcharts;
    if (!Highcharts) {
      this.#_logger.error('Highcharts not available');
      throw 'Required Highcharts Library not available';
    }
    if (!Highcharts._modules.hasOwnProperty('Extensions/Drilldown.js')) {
      this.#_logger.error('Highcharts Drilldown module not available');
      throw 'Required Highcharts Drilldown module not available';
    }
    if (!Highcharts._modules.hasOwnProperty('Extensions/Exporting.js')) {
      this.#_logger.error('Highcharts Exporting module not available');
      throw 'Required Highcharts Exporting module not available';
    }
    if (!Highcharts._modules.hasOwnProperty('Extensions/Data.js')) {
      this.#_logger.error('Highcharts Data module not available');
      throw 'Required Highcharts Data module not available';
    }
    if (!Highcharts._modules.hasOwnProperty('Extensions/Math3D.js')) {
      this.#_logger.error('Highcharts 3D module not available');
      throw 'Required Highcharts 3D module not available';
    }
  }

  /**
   * @description Returns the drillup series event for this Hicharts
   * @returns event function
   */
  getDrillupSeriesEvent() {
    let properties = this.properties;
    let multipleSeries = this.result.multipleSeries;
    if (!properties.drilldown) {
      return undefined;
    }
    let logger = this.#_logger;
    let subtitle = properties.subtitle;
    if (!multipleSeries) {
      logger.debug('retrieving single series drillup event');
      return function (e) {
        let chart = this;
        let currentDrillLevelNumber = chart.series[0].options._levelNumber || 0;
        if (subtitle) {
          let subIndex = currentDrillLevelNumber - 1;
          if (subtitle[subIndex]) {
            chart.setTitle(null, {text: subtitle[subIndex]});
          } else {
            chart.setTitle(null, {text: undefined});
          }
        }
      };
    }
    logger.debug('retrieving multiple series drillup event');
    return function (e) {
      let chart = this;
      let currentDrillLevelNumber = chart.series[0].options._levelNumber || 0;
      logger.trace(e.toString());
      if (subtitle) {
        let subIndex = currentDrillLevelNumber + 1;
        if (subtitle[subIndex]) {
          chart.setTitle(null, {text: subtitle[subIndex]});
        } else {
          chart.setTitle(null, {text: undefined});
        }
      }
    };
  }

  /**
   * @description Returns the drilldown series event for this Hicharts
   * @returns event function
   */
  getDrilldownSeriesEvent() {
    let logger = this.#_logger;
    logger.debug('requested drilldown event');
    let properties = this.properties;
    if (!properties.dataDrilldown) {
      return undefined;
    }
    let multipleSeries = this.result.multipleSeries;
    let subtitle = properties.subtitle;
    if (!multipleSeries) {
      logger.debug('retrieving single series drilldown event');
      return function (e) {
        if (!e.points || e.points[0] == e.point) {
          console.log(e);
          let chart = this;
          let currentDrillLevelNumber = chart.series[0].options._levelNumber || 0;
          //chart.setTitle(null, { text: e.point.name });
          if (subtitle) {
            let subIndex = currentDrillLevelNumber + 1;
            if (subtitle[subIndex]) {
              chart.setTitle(null, {text: subtitle[subIndex]});
            } else {
              chart.setTitle(null, {text: undefined});
            }
          }
          logger.trace(e.toString());
        }
      };
    }
    // I may need a structure to hold the drilldown and drillup level and labels. That way we can have a subtitle of the type 'Families' > ' Genes' > '...' and a label for drillup button.
    // let drilldownSeries = this.asHighchartsSeries(this.result.drilldownSeries);
    let drilldownSeries = this.result.drilldownSeries;
    let animation = properties.animation;
    let asHighchartsSeries = this.asHighchartsSeries;
    return function (e) {
      let random = Common.makeid(12);
      let chart = this;
      chart.properties = properties;
      let currentDrillLevelNumber = chart.series[0].options._levelNumber || 0;
      logger.trace(random + ', ' + e.toString());
      if (!e.seriesOptions) {
        logger.debug(random + ', ' + 'Gathering drilldown series for ' + e.point.drilldown);
        // for (let i = 0; i < drilldownSeries[e.point.drilldown].length; i++) {
        // let series = drilldownSeries[e.point.drilldown][i];
        let series = drilldownSeries[e.point.drilldown];
        logger.debug(random + ', ' + 'Found series');
        logger.trace(JSON.stringify(series));
        // let highchartSeries = series.asHighchartSeries();
        let highchartSeries = asHighchartsSeries(series, properties);

        for (let i = 0; i < highchartSeries.length; i++) {
          let series = highchartSeries[i];
          series.animation = animation;
          series.column = series.column || {};
          series.column.animation = animation;
          series.pie = series.pie || {};
          series.pie.animation = animation;
          series.line = series.line || {};
          series.line.animation = animation;
          series.bar = series.bar || {};
          series.bar.animation = animation;
          series.area = series.area || {};
          series.area.animation = animation;
          series.gauge = series.gauge || {};
          series.gauge.animation = animation;
          series.item = series.item || {};
          series.item.animation = animation;
          series.venn = series.venn || {};
          series.venn.animation = animation;
          chart.addSingleSeriesAsDrilldown(e.point, series);
        }
        // }
        logger.trace(JSON.stringify(chart.drilldown));
        chart.applyDrilldown();
      } else {
        chart.setTitle(null, {text: e.seriesOptions.name});
      }
      if (subtitle) {
        let subIndex = currentDrillLevelNumber + 1;
        if (subtitle[subIndex]) {
          chart.setTitle(null, {text: subtitle[subIndex]});
        } else {
          chart.setTitle(null, {text: undefined});
        }
      }
    };
  }

  /**
   */
  /**
   * @description Returns this ResultSeries formatted as an HighCharts.series
   * @param {ResultSeries[]} series
   * @returns {HighCharts.series}
   * @throws {TypeError}
   */
  asHighchartsSeries(series, properties) {
    if (!series) return undefined;
    if (!(series instanceof Array)) {
      throw new TypeError('series argument must be an Array');
    }
    if (series.length == 0) {
      return series;
    }
    let p = properties || this.properties || undefined;
    if (!p) {
      throw TypeError('properties is undefined, please ensure you are passing a properties.');
    }
    let highchartSeries = undefined;
    switch (p.chartType) {
      case ChartType.HEATMAP + 1:
        this.#_xAxisCategories = new HighchartsCategories();
        this.#_yAxisCategories = new HighchartsCategories();
        highchartSeries = series.map(s => {
          if (!(s instanceof ResultSeries)) {
            throw new TypeError('series elements must be instances of ResultSeries');
          }
          let {id, name, title} = s;
          let j = {id, name, title};
          for (const key in j) {
            if (j.hasOwnProperty(key)) {
              let value = j[key];
              if (value == undefined) delete j[key];
            }
          }
          /*
          j.dataLabels = j.dataLabels ||{};
          j.dataLabels.enabled = true;
          j.dataLabels.color =  '#000000';
          */
          j.boostThreshold = 10000;
          j.borderWidth = 0;
          j.nullColor = '#FFFFFF';
          let yAxysIndex = this.#_yAxisCategories.getIndex(j.name);
          if (s.data) {
            j.data = s.data.map(d => {
              let dataItem = d.toJSON();
              let xAxysIndex = this.#_xAxisCategories.getIndex(dataItem.name);
              delete dataItem.name;
              if (dataItem.y) dataItem.value = dataItem.y;
              dataItem.y = yAxysIndex;
              dataItem.x = xAxysIndex;
              return dataItem;
            });
          }
          return j;
        });
        break;
      case ChartType.HEATMAP:
        // console.log('heatmap');
        this.#_xAxisCategories = new HighchartsCategories();
        this.#_yAxisCategories = new HighchartsCategories();
        let json = {};
        json.data = [];
        json.boostThreshold = 10000;
        json.borderWidth = 0;
        json.nullColor = '#FFFFFF';
        // highchartSeries = series.map(s => {
        series.map(s => {
          if (!(s instanceof ResultSeries)) {
            throw new TypeError('series elements must be instances of ResultSeries');
          }
          let {id, name, title} = s;
          let j = {id, name, title};
          /*
          for (const key in json) {
            if (json.hasOwnProperty(key)) {
              let value = json[key];
              if (value == undefined) delete json[key];
            }
          }
          */
          /*
          json.dataLabels = json.dataLabels ||{};
          json.dataLabels.enabled = true;
          json.dataLabels.color =  '#000000';
          */
          /*
          json.boostThreshold = 100;
          json.borderWidth = 0;
          json.nullColor = '#FFFFFF';
          */
          let yAxysIndex = this.#_yAxisCategories.getIndex(j.name);
          if (s.data) {
            /*json.data = s.data.map(d => {*/
            s.data.map(d => {
              let dataItem = d.toJSON();
              let xAxysIndex = this.#_xAxisCategories.getIndex(dataItem.name);
              delete dataItem.name;
              if (dataItem.y) dataItem.value = dataItem.y;
              dataItem.y = yAxysIndex;
              dataItem.x = xAxysIndex;
              if (dataItem.value) json.data.push(dataItem);
            });
          }
        });
        highchartSeries = [json];
        break;

      default:
        highchartSeries = series.map(s => {
          if (!(s instanceof ResultSeries)) {
            throw new TypeError('series elements must be instances of ResultSeries');
          }
          let {id, name, color, title} = s;
          let json = {id, name, color, title};
          for (const key in json) {
            if (json.hasOwnProperty(key)) {
              let value = json[key];
              if (value == undefined) delete json[key];
            }
          }
          if (s.data) {
            json.data = s.data.map(d => d.toJSON());
          }
          return json;
        });
        break;
    }
    return highchartSeries;
  }

  /**
   * @description Creates an Highcharts.chart and displays it on the HTML container as defined in the {@link Properties} object.
   */
  plot() {
    let timer = new DebugTimer();
    this.#_logger.debug('Ploting chart');
    timer.start('build_Highcharts_structure');
    // Plotting must have into consideration the type of data and the visualization implementation required.
    // This is where we map  properties and data to specific Visualization library.
    let p = {
      chart: {
        type: this.properties.chartType,
        // animation
        animation: this.properties.animation,
      },
      credits: {
        enabled: false,
      },
      xAxis: {
        type: 'category',
      },
      /*
       * boost throws an error with big datasets
       */
      /*
      boost: {
        useGPUTranslations: true,
      },
      */
      // In an Highcharts chart, the series value is an array of objects each one representing a data series.
      // Each data series can have its own plot options.
      //series: this.#_result.series.map(series => series.asHighchartSeries()),
      //series: this.#_result.series,
      plotOptions: {},
    };
    timer.start('.asHighchartSeries');
    p.series = this.asHighchartsSeries(this.result.series);
    timer.end('.asHighchartSeries');
    if (this.properties.chartType == ChartType.HEATMAP) {
      //ensure that we categories set at xAxis and yAxis.
      p.xAxis = p.xAxis || {};
      p.xAxis.categories = this.#_xAxisCategories.categories;
      p.yAxis = p.yAxis || {};
      p.yAxis.categories = this.#_yAxisCategories.categories;
      p.yAxis.title = null;
      p.yAxis.reversed = true;

      p.colorAxis = p.colorAxis || {};
      p.colorAxis.stops = [
        [0, '#3060cf'],
        [0.05, '#fffbbc'],
        [0.5, '#c4463a'],
        [1, '#c4463a'],
      ];
      p.colorAxis.min = 0;
      p.colorAxis.startOnTick = false;
      p.colorAxis.endOnTick = false;
      // p.colorAxis.minColor = '#CCCCCC';
      // p.colorAxis.maxColor = Highcharts.getOptions().colors[0];

      p.legend = p.legend || {};
      p.legend.align = 'right';
      p.legend.layout = 'vertical';
      p.legend.margin = 0;
      p.legend.verticalAlign = 'top';
      p.legend.y = 25;
      p.legend.symbolHeight = 280;

      p.tooltip = p.tooltip || {};
      p.tooltip.formatter = function () {
        return '<b>' + this.point.series['yAxis'].categories[this.point['y']] + '</b>:<b>' + this.point.series['xAxis'].categories[this.point['x']] + '</b> <br />' + this.point.value;
      };
      //Had zoomable feature if not 3D mode.
      p.chart.zoomType= 'xy';
      p.chart.panning= true;
      p.chart.panKey= 'shift';
    }else if (this.properties.chartType == ChartType.SUNBURST) {
      if (this.properties.dataDrilldown) {
        p.series[0].allowDrillToNode = true;
      }
      p.series[0].cursor = 'pointer';
      p.series[0].dataLabels = {
        format: '{point.name}',
        filter: {
          property: 'innerArcLength',
          operator: '>',
          value: 10,
        },
      };
      p.series[0].levels = [
        {
          level: 1,
          levelIsConstant: false,
        },
        {
          level: 2,
          levelSize: {
            unit: 'percentage',
            value: 20,
          },
          colorByPoint: true,
        },
        {
          level: 3,
          levelSize: {
            unit: 'percentage',
            value: 30,
          },
          colorVariation: {
            key: 'brightness',
            to: -0.5,
          },
        },
        {
          level: 4,
          levelSize: {
            unit: 'percentage',
            value: 30,
          },
          colorVariation: {
            key: 'brightness',
            to: 0.5,
          },
        },
      ];
    }else{
      //Had zoomable feature if not 3D mode.
      if (!this.properties.is3D){
        p.chart.zoomType= 'x';
        p.chart.panning= true;
        p.chart.panKey= 'shift';
      }
    }
    // If not set on properties the Title should not be set. I.e. we need it to be undefined.
    p.title = {text: this.properties.title};
    if (this.properties.subtitle) {
      p.subtitle = {text: this.properties.subtitle[0] || undefined};
    }
    if (this.properties.yLabel) {
      p.yAxis = p.yAxis || {};
      p.yAxis.title = {text: this.properties.yLabel};
    }
    if (this.properties.yMaxValue) {
      p.yAxis = p.yAxis || {};
      p.yAxis.max = this.properties.yMaxValue;
    }
    if (this.properties.xLabel) {
      p.xAxis = p.xAxis || {};
      p.xAxis.title = {text: this.properties.xLabel};
    }
    /*
     * Sort has a huge problem with drilldown.
     * We cannot rely on Highcharts Sort. To apply sort we need to sort DataItems within the Result.
     * if (this.#_properties.sort){p.plotOptions.series = (p.plotOptions.series || {});p.plotOptions.series.dataSorting = {enabled: true,sortKey: 'name'};}
     */
    if (this.result.drilldown) {
      this.#_logger.debug('This is a drilldown chart');
      // In an Highcharts chart, the drilldown value is an object that allows for inspect increasingly high resolution data,
      // This object contains a series property that is an array of objects, each one representing a data series (as the series in the chart).
      // Each data series can have its own plot options, existence of the id property is mandatory to reference which series to plot.
      // Later I may need to change this.#_result.drilldownSeries; for a .map like in the series property.
      p.drilldown = p.drilldown || {};
      if (!this.result.isMultipleSeries()) {
        p.drilldown = {series: this.asHighchartsSeries(this.result.drilldownSeries)};
      }
      if (!this.properties.animation) {
        p.drilldown.animation = this.properties.animation;
      }
      //We need to get the drilldown and drillup events to change at least the title and subtitle of the chart.
      p.chart.events = {
        // drillup: this.result.getDrillupSeriesEvent(this.properties),
        drillup: this.getDrillupSeriesEvent(),
        // drilldown: this.result.getDrilldownSeriesEvent(this.properties),
        drilldown: this.getDrilldownSeriesEvent(),
      };
    }
    this.#_logger.trace('Is 3D (multiple series)? -' + this.result.isMultipleSeries());
    //DONE: We need to have a distinction between Multiple series and 3D (when plotting Junction length I ignore multiple series to have side-by-side chart)
    // if (this.result.isMultipleSeries()) {
    if (this.properties.draw3D) {
      // Setup chart 3Doptions properties (in the future using #_properties and #_dataseries data).
      p.chart.options3d = {
        enabled: true,
        alpha: this.properties.alpha3D,
        beta: this.properties.beta3D,
        depth: this.properties.depth3D,
        viewDistance: 5,
        fitToPlot: true,
        frame: {
          bottom: {
            size: 1,
            color: 'rgba(0,0,0,0.05)',
          },
        },
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
      p.plotOptions.series = p.plotOptions.series || {};
      p.plotOptions.series.groupZPadding = 20;
      p.plotOptions.series.depth = 0;
      p.plotOptions.series.groupPadding = 0;
      p.plotOptions.series.grouping = false;
      /*p.plotOptions = {
                series: {
                    groupZPadding: 20,
                    depth: 0,
                    groupPadding: 0,
                    grouping: false,
                }
            };*/
    }
    if (!this.result.isMultipleSeries()) {
      // Chart is single series
      p.legend = p.legend || {};
      p.legend.enabled = this.properties.legend;
    }
    if (this.properties.animation == false) {
      p.plotOptions.pie = p.plotOptions.pie || {};
      p.plotOptions.pie.animation = this.properties.animation;
      p.plotOptions.line = p.plotOptions.line || {};
      p.plotOptions.line.animation = this.properties.animation;
      p.plotOptions.column = p.plotOptions.column || {};
      p.plotOptions.column.animation = this.properties.animation;
      p.plotOptions.series = p.plotOptions.series || {};
      p.plotOptions.series.animation = this.properties.animation;
      p.series.forEach(serie => {
        serie.animation = this.properties.animation;
      });
    }
    // If is a stacking chart
    if (this.properties.stackingType) {
      p.plotOptions.series = p.plotOptions.series || {};
      p.plotOptions.series.stacking = this.properties.stackingType;
    }
    if (this.properties.grouping != undefined) {
      p.plotOptions.series = p.plotOptions.series || {};
      p.plotOptions.series.grouping = this.properties.grouping;
    }
    p.plotOptions.series = p.plotOptions.series || {};
    p.plotOptions.series.turboThreshold = 10000;

    timer.end('build_Highcharts_structure');
    // console.log(p);
    // If Hicharts is imported as a module than we don't need jquery to plot the chart into the DOM.
    //this.#_chart  = Highcharts.chart(this.#_properties.id, p);
    this.#_chart = this.#_highcharts.chart(this.properties.id, p);
    //$('#'+this.#_properties.id).highcharts(p);
    // console.log(p);
    this.#_logger.trace(JSON.stringify(p));
    this.#_logger.debug('Plotting into ' + this.properties.id);
    this.#_logger.trace(JSON.stringify(this.result));
    //Highcharts.addEvent(this.#_chart.container, "mousedown", this.getMousedownEvent(this.#_chart, this.#_result.isMultipleSeries()));
    this.#_highcharts.addEvent(this.#_chart.container, 'mousedown', this.getMousedownEvent(this.#_chart, this.result.isMultipleSeries()));
    timer.print();
  }

  /**
   * @description MouseDownEvent specific for Highcharts.chart
   * @private
   * @param {Highchart.chart} targetChart
   * @param {boolean} is3D
   * @returns {function} the MousedownEvent function
   */
  getMousedownEvent(targetChart, is3D) {
    this.#_logger.debug('getMousedownEvent');
    let logger = this.#_logger;
    if (!is3D) {
      this.#_logger.debug('retrieving default mousedown event on charts.');
      return function (e) {
        logger.trace('Default mouse down event on chart.');
      };
    }
    let highcharts = this.#_highcharts;
    return function (eStart) {
      let chart = targetChart;
      //console.log("Mousedown in multiple series");
      eStart = chart.pointer.normalize(eStart);

      let posX = eStart.chartX,
        posY = eStart.chartY,
        alpha = chart.options.chart.options3d.alpha,
        beta = chart.options.chart.options3d.beta,
        sensitivity = 5, // lower is more sensitive
        handlers = [];

      function drag(e) {
        // Get e.chartX and e.chartY
        e = chart.pointer.normalize(e);
        let newAlpha = alpha + (e.chartY - posY) / sensitivity,
          newBeta = beta + (posX - e.chartX) / sensitivity;
        chart.update(
          {
            chart: {
              options3d: {
                alpha: newAlpha,
                beta: newBeta,
              },
            },
          },
          undefined,
          undefined,
          false,
        );
        //console.log("alpha:" + newAlpha + ", beta:" + newBeta);
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
      //handlers.push(Highcharts.addEvent(document, 'mousemove', drag));
      //handlers.push(Highcharts.addEvent(document, 'touchmove', drag));
      //handlers.push(Highcharts.addEvent(document, 'mouseup', unbindAll));
      //handlers.push(Highcharts.addEvent(document, 'touchend', unbindAll));
      handlers.push(highcharts.addEvent(document, 'mousemove', drag));
      handlers.push(highcharts.addEvent(document, 'touchmove', drag));
      handlers.push(highcharts.addEvent(document, 'mouseup', unbindAll));
      handlers.push(highcharts.addEvent(document, 'touchend', unbindAll));
      logger.trace(eStart.toString());
    };
  }
}

class HighchartsCategories {
  #_categoriesArray;
  #_categoriesDictionary;

  constructor() {
    this.#_categoriesArray = [];
    this.#_categoriesDictionary = {};
  }

  getIndex(categoryName) {
    if (!categoryName) throw new TypeError('categoryName parameter cannot be empty');
    if (this.#_categoriesDictionary[categoryName] == undefined) {
      this.#_categoriesArray.push(categoryName);
      this.#_categoriesDictionary[categoryName] = this.#_categoriesArray.length - 1;
    }
    return this.#_categoriesDictionary[categoryName];
  }

  get categories() {
    return this.#_categoriesArray;
  }
}

export {Chart, HighchartsChart, HighchartsCategories};
