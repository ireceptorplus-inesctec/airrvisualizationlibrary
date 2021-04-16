import {Logger} from './common.js';
import {Parser, DrilldownParser} from './parser.js';
import {Properties} from './properties.js';

/**
 * Abstract class that represents a Result.
 * A Result stores the original data source, the specific {@link Parser} object and the logic for returning a representation of the data to be plotted.
 * @abstract
 */
class Result {
  #_logger;
  #_parser;
  #_defaultProperties;

  /**
   * @description Creates an instance of Result.
   * @param {JSON} [sourceData=undefined] AN AIRR Data JSON file
   */
  constructor() {
    if (this.constructor === Result) {
      // Abstract class can not be constructed.
      throw new Error('Can not construct abstract class.');
    } //else (called from child)
    // Check if all instance methods are implemented.
    if (this.isMultipleSeries === Result.prototype.isMultipleSeries) {
      // Child has not implemented this abstract method.
      throw new TypeError('Please implement abstract method isMultipleSeries.');
    }
    if (this.update === Result.prototype.update) {
      // Child has not implemented this abstract method.
      throw new TypeError('Please implement abstract method update.');
    }

    this.#_logger = new Logger('Result');
    this.#_logger.debug('Constructor.');
    this.#_parser = undefined;
    this.#_defaultProperties = new Properties();
    if (typeof sourceData !== 'undefined') {
      setData(sourceData);
    }
  }

  /**
   * @description Returns the default {@link Properties} for a concrete Result. Concrete classes should update Properties on the constructor to return their default values for the {@link Properties}.
   * @readonly
   * @type {Properties}
   */
  get properties() {
    return this.#_defaultProperties;
  }

  /**
   * @description Returns the Series after being parsed or undefined otherwise.
   * @readonly
   * @type {Array}
   */
  get series() {
    this.#_logger.debug('getting series.');
    if (!this.parser) return undefined;
    return this.parser.series;
  }

  /**
   * @description Returns the Drilldown Series after being parsed if the parser has drilldown or undefined otherwise.
   * @readonly
   * @type {Dictionary}
   */
  get drilldownSeries() {
    this.#_logger.debug('getting drilldownSeries.');
    if (!this.parser) return undefined;
    if (!(this.parser instanceof DrilldownParser)) return undefined;
    return this.parser.drilldownSeries;
  }

  /**
   * @description read only property that returns the same as this.isMultipleSeries().
   * @readonly
   * @type {boolean}
   */
  get multipleSeries() {
    return this.isMultipleSeries();
  }

  /**
   * @description Abstract method that returns true if this result contains multiple data series. Subclasses should overload this.
   * @abstract
   * @returns true if data has multiple series
   */
  isMultipleSeries() {
    this.#_logger.fatal('isMultipleSeries() method should never execute, specializations of Result need to overload it.');
    throw new TypeError('Result.isMultipleSeries() method should not be called, implementations need to overload it.');
  }

  /**
   * @description the {@link Parser} used for the interpretation of the AIRR Data JSON file.
   * @type {Parser}
   */
  get parser() {
    return this.getParser();
  }

  /**
   * @description returns the Parser for the Result
   * @returns {Parser}
   */
  getParser() {
    return this.#_parser;
  }

  set parser(parser) {
    this.setParser(parser);
  }

  /**
   * @description Chainable method that sets the specific {@link Parser} to be used on the interpretation of the source airr data in this Result.
   * @param {Parser} parser a Parser subclass instance
   * @returns {Result} the same instance on which the method was called.
   */
  setParser(parser) {
    this.#_logger.debug('setParser.');
    if (!(parser instanceof Parser)) {
      this.#_logger.fatal('attribute parser must be an instance of Parser.');
      throw new TypeError('parser value must be an instance of Parser.');
    }
    this.#_parser = parser; //this.parse();
    return this;
  }

  /**
   * @description is to implement drilldown feature on the original data?
   * @type {boolean}
   */
  get drilldown() {
    this.#_logger.debug('getting drilldown.');
    return this.isDrilldown();
  }

  /**
   * @description returns the true if this Result has drilldown enabled.
   * @returns {boolean}
   */
  isDrilldown() {
    this.#_logger.debug('getting drilldown.');
    //return this.#_drilldown;
    return this.properties.getDataDrilldown();
  }

  /**
   * @description Abstract method that forces update of a this result based on a Properties instance. Subclasses should overload this.
   * @param {Properties} properties
   * @abstract
   * @returns true if data has multiple series
   */
  update(properties) {
    this.#_logger.fatal('update() method should never execute, specializations of Result need to overload it.');
    throw new TypeError('Result.update() method should not be called, implementations need to overload it.');
  }

  /**
   * @description Execute required validations and starts the parsing of the data. Result subclasses should not overload this method.
   */
  parse(properties) {
    //TODO:
    //TODO: pass a callback to be called when the parse has ended.
    //TODO: or change this to Promises.
    //TODO: the parse() should be called by the chart not internally
    //TODO: this way we can wait for the parse process, ensure that the properties are all updated and then automate the plot procedure.
    //TODO: We also need to receive data from the properties such as parse as "percentage" or "values", is "drilldown", "colors", etc...
    this.update(properties);
    //if (!this.#_data){
    if (!properties.getData()) {
      this.#_logger.trace("Can't parse, please set the Airr Data Commons data first.");
      return;
    }
    if (!this.#_parser) {
      this.#_logger.trace("Can't parse, please set the parser first. Parser should be set on a Result subclass.");
      return;
    }
    this.#_parser.preparse(properties);
    this.#_parser.onparse(properties);
    this.#_parser.postparse(properties);
    //TODO: Get Properties from the parser
    this.properties.updateWith(this.#_parser.properties);
    //TODO: trigger observer?
    properties.updateWith(this.properties);
  }
}

export {Result};
