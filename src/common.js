/**
 * A logger class.
 */
class Logger {

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

    static get LEVEL_OFF() {
        return Logger.level.OFF;
    }

    static get LEVEL_TRACE() {
        return Logger.level.TRACE;
    }

    static get LEVEL_DEBUG() {
        return Logger.level.DEBUG;
    }

    static get LEVEL_INFO() {
        return Logger.level.INFO;
    }

    static get LEVEL_WARN() {
        return Logger.level.WARN;
    }

    static get LEVEL_ERROR() {
        return Logger.level.ERROR;
    }

    static get LEVEL_FATAL() {
        return Logger.level.FATAL;
    }
    /**
     * Static variable to set the debug level of visible messages.
     */
    static DEBUG_LEVEL = Logger.LEVEL_OFF;

    /**
     * Sets the debug level.
     * 
     * @param {number} level use a value between 0-100 (0:all, 100:none) or one of the Logger static constants.
     */
    static setDebugLevel(level) {
        Logger.DEBUG_LEVEL = level;
    }

    #_source;

    constructor(sourceName) {

        this.#_source = sourceName;

    }

    _datetime() {
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

    _log(type, text) {
        console.log(this._datetime().concat(' ').concat(this.#_source).concat(' ').concat(type).concat(': \r\n').concat(text));
    }

    trace(text) {
        if (Logger.DEBUG_LEVEL <= Logger.LEVEL_TRACE) {
            this._log('TRACE', text);
        }
    }

    debug(text) {
        if (Logger.DEBUG_LEVEL <= Logger.LEVEL_DEBUG) {
            this._log('DEBUG', text);
        }
    }

    info(text) {
        if (Logger.DEBUG_LEVEL <= Logger.LEVEL_INFO) {
            this._log('INFO', text);
        }
    }

    warn(text) {
        if (Logger.DEBUG_LEVEL <= Logger.LEVEL_WARN) {
            this._log('WARN', text);
        }
    }

    error(text) {
        if (Logger.DEBUG_LEVEL <= Logger.LEVEL_ERROR) {
            this._log('ERROR', text);
        }
    }

    fatal(text) {
        if (Logger.DEBUG_LEVEL <= Logger.LEVEL_FATAL) {
            this._log('FATAL', text);
        }
    }
}
/**
 * Result Series types
 */
class ResultSeriesType {

    static types = {
        FAMILY: 'f',
        GENE: 'g',
        CELL: 'c',
        GENE_COUNT: 'gc',
        TOP_CLONES: 'tc'
    };

    static get FAMILY() {
        return ResultSeriesType.types.FAMILY;
    }

    static get GENE() {
        return ResultSeriesType.types.GENE;
    }

    static get CELL() {
        return ResultSeriesType.types.CELL;
    }

    static get GENE_COUNT() {
        return ResultSeriesType.types.GENE_COUNT;
    }

    static get TOP_CLONES() {
        return ResultSeriesType.types.TOP_CLONES;
    }

    static contains(value) {
        return Object.values(ResultSeriesType.types).includes(value);
    }
}

class GeneType {

    static genes = {
        V_GENE: 'v',
        D_GENE: 'd',
        J_GENE: 'j'
    };

    static get V_GENE() {
        return GeneType.genes.V_GENE;
    }

    static get D_GENE() {
        return GeneType.genes.D_GENE;
    }

    static get J_GENE() {
        return GeneType.genes.J_GENE;
    }

    static contains(value) {
        return Object.values(GeneType.genes).includes(value);
    }
}

class Common {

    static get objectConstructor() {
        return ({}).constructor;
    }

    static makeid(length) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    static roundTo(number, precision) {
        return +(Math.round(number + "e+" + precision) + "e-" + precision);
    }

}

/**
 * Measure the execution time of multiple sections of your code, then
 * effortlessly print all the timer results at once to the console.
 * Based on the work of Anton Ivanov <anton@ivanov.hk> 
 * https://github.com/SoulHarsh007/debugging-timer
 */
class DebugTimer {
    #_logger;
    #_data;

    constructor() {
        this.#_data = {};
        this.#_logger = new Logger("DebugTimer");
    }

    /**
     * Begin the timer.
     * @param {string} what - Label, e.g. "loading file".
     */
    start(what) {
        this.#_data[what] = {
            start: Date.now(),
        };
    }

    /**
     * End the timer.
     * @param {string} what - Label, e.g. "loading file".
     */
    end(what) {
        this.#_data[what].end = Date.now();
        this.#_data[what].total = this.#_data[what].end - this.#_data[what].start;
    }

    /**
     * Print the results to the console.
     * @returns {str} - The formatted result, same as those printed to console.
     */
    print() {
        let str = '';
        for (let key of Object.keys(this.#_data)) {
            str += `${key}: ${this.#_data[key].total} ms \r\n`;
        }

        this.#_logger.info(str);
        return str;
    }
    clean() {
        let cleaned = {};
        this.#_data = cleaned;
    }
}


module.exports = {
    Logger: Logger,
    ResultSeriesType: ResultSeriesType,
    GeneType: GeneType,
    Common: Common,
    DebugTimer: DebugTimer
};

export { Logger, ResultSeriesType, GeneType, Common, DebugTimer };