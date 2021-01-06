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

    /**
     * @description Logger level OFF
     * @type {number}
     * @static
     * @const
     * @default 100
     */
    static get LEVEL_OFF() {
        return Logger.level.OFF;
    }

    /**
     * @description Logger level TRACE
     * @type {number}
     * @static
     * @const
     * @default 20
     */
    static get LEVEL_TRACE() {
        return Logger.level.TRACE;
    }

    /**
     * @description Logger level DEBUG
     * @type {number}
     * @static
     * @const
     * @default 30
     */
    static get LEVEL_DEBUG() {
        return Logger.level.DEBUG;
    }

    /**
     * @description Logger level INFO
     * @type {number}
     * @static
     * @const
     * @default 40
     */
    static get LEVEL_INFO() {
        return Logger.level.INFO;
    }

    /**
     * @description Logger level WARN
     * @type {number}
     * @static
     * @const
     * @default 50
     */
    static get LEVEL_WARN() {
        return Logger.level.WARN;
    }

    /**
     * @description Logger level ERROR
     * @type {number}
     * @static
     * @const
     * @default 70
     */
    static get LEVEL_ERROR() {
        return Logger.level.ERROR;
    }

    /**
     * @description Logger level FATAL
     * @type {number}
     * @static
     * @const
     * @default 90
     */
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
        //TODO: Allow logging to the chart window. For example when error on chart plot.
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

    static error(sourceName, text){
        if (Logger.DEBUG_LEVEL <= Logger.LEVEL_ERROR) {
            new Logger(sourceName)._log('ERROR', text);
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
 * ResultSeries types
 */
class ResultSeriesType {

    static typeCode = {
        FAMILY : {code: 'f', name: 'Subgroup'},
        GENE : {code: 'g', name: 'Gene'},
        CALL : {code: 'c', name: 'Allele'},
        GENE_COUNT : {code: 'gc', name: 'Gene Count'},
        TOP_CLONES : {code: 'tc', name: 'Top Clones'},
        JUNCTION_LENGTH : {code: 'jl', name: 'Junction Length'},
        JUNCTION_AA_LENGTH : {code: 'jal', name: 'Junction aa Length'},
    };

    static names = {
        "v_call_unique" : ResultSeriesType.typeCode.CALL,
        "d_call_unique" : ResultSeriesType.typeCode.CALL,
        "j_call_unique" : ResultSeriesType.typeCode.CALL,
        "c_call_unique" : ResultSeriesType.typeCode.CALL,
        "v_call_unique_productive" : ResultSeriesType.typeCode.CALL,
        "d_call_unique_productive" : ResultSeriesType.typeCode.CALL,
        "j_call_unique_productive" : ResultSeriesType.typeCode.CALL,
        "c_call_unique_productive" : ResultSeriesType.typeCode.CALL,
        "v_call_exists" : ResultSeriesType.typeCode.CALL,
        "d_call_exists" : ResultSeriesType.typeCode.CALL,
        "j_call_exists" : ResultSeriesType.typeCode.CALL,
        "c_call_exists" : ResultSeriesType.typeCode.CALL,
        "v_call_exists_productive" : ResultSeriesType.typeCode.CALL,
        "d_call_exists_productive" : ResultSeriesType.typeCode.CALL,
        "j_call_exists_productive" : ResultSeriesType.typeCode.CALL,
        "c_call_exists_productive" : ResultSeriesType.typeCode.CALL,
        "v_gene_unique" : ResultSeriesType.typeCode.GENE,
        "d_gene_unique" : ResultSeriesType.typeCode.GENE,
        "j_gene_unique" : ResultSeriesType.typeCode.GENE,
        "c_gene_unique" : ResultSeriesType.typeCode.GENE,
        "v_gene_unique_productive" : ResultSeriesType.typeCode.GENE,
        "d_gene_unique_productive" : ResultSeriesType.typeCode.GENE,
        "j_gene_unique_productive" : ResultSeriesType.typeCode.GENE,
        "c_gene_unique_productive" : ResultSeriesType.typeCode.GENE,
        "v_gene_exists" : ResultSeriesType.typeCode.GENE,
        "d_gene_exists" : ResultSeriesType.typeCode.GENE,
        "j_gene_exists" : ResultSeriesType.typeCode.GENE,
        "c_gene_exists" : ResultSeriesType.typeCode.GENE,
        "v_gene_exists_productive" : ResultSeriesType.typeCode.GENE,
        "d_gene_exists_productive" : ResultSeriesType.typeCode.GENE,
        "j_gene_exists_productive" : ResultSeriesType.typeCode.GENE,
        "c_gene_exists_productive" : ResultSeriesType.typeCode.GENE,
        "v_subgroup_unique" : ResultSeriesType.typeCode.FAMILY,
        "d_subgroup_unique" : ResultSeriesType.typeCode.FAMILY,
        "j_subgroup_unique" : ResultSeriesType.typeCode.FAMILY,
        "c_subgroup_unique" : ResultSeriesType.typeCode.FAMILY,
        "v_subgroup_unique_productive" : ResultSeriesType.typeCode.FAMILY,
        "d_subgroup_unique_productive" : ResultSeriesType.typeCode.FAMILY,
        "j_subgroup_unique_productive" : ResultSeriesType.typeCode.FAMILY,
        "c_subgroup_unique_productive" : ResultSeriesType.typeCode.FAMILY,
        "v_subgroup_exists" : ResultSeriesType.typeCode.FAMILY,
        "d_subgroup_exists" : ResultSeriesType.typeCode.FAMILY,
        "j_subgroup_exists" : ResultSeriesType.typeCode.FAMILY,
        "c_subgroup_exists" : ResultSeriesType.typeCode.FAMILY,
        "v_subgroup_exists_productive" : ResultSeriesType.typeCode.FAMILY,
        "d_subgroup_exists_productive" : ResultSeriesType.typeCode.FAMILY,
        "j_subgroup_exists_productive" : ResultSeriesType.typeCode.FAMILY,
        "c_subgroup_exists_productive" : ResultSeriesType.typeCode.FAMILY,
        "top_clones" : ResultSeriesType.typeCode.TOP_CLONES,
        "junction_length" : ResultSeriesType.typeCode.JUNCTION_LENGTH,
        "junction_length_productive" : ResultSeriesType.typeCode.JUNCTION_LENGTH,
        "junction_aa_length" : ResultSeriesType.typeCode.JUNCTION_AA_LENGTH,
        "junction_aa_length_productive" : ResultSeriesType.typeCode.JUNCTION_AA_LENGTH,
        "rearrangement_count" : ResultSeriesType.typeCode.GENE_COUNT,
        "rearrangement_count_productive" : ResultSeriesType.typeCode.GENE_COUNT,
        "duplicate_count" : ResultSeriesType.typeCode.GENE_COUNT,
        "duplicate_count_productive" : ResultSeriesType.typeCode.GENE_COUNT,
    };

    /**
     * @description Family or subgroup code
     * @type {string}
     * @static
     * @const
     * @default 'f'
     */
    static get FAMILY() {
        return ResultSeriesType.typeCode.FAMILY.code;
    }

    /**
     * @description Gene code
     * @type {string}
     * @static
     * @const
     * @default 'g'
     */
    static get GENE() {
        return ResultSeriesType.typeCode.GENE.code;
    }

    /**
     * @description Call or Allele code
     * @type {string}
     * @static
     * @const
     * @default 'c'
     */
    static get CALL() {
        return ResultSeriesType.typeCode.CALL.code;
    }

    /**
     * @description Gene Count code
     * @type {string}
     * @static
     * @const
     * @default 'gc'
     */
    static get GENE_COUNT() {
        return ResultSeriesType.typeCode.GENE_COUNT.code;
    }

    /**
     * @description Top Clones code
     * @type {string}
     * @static
     * @const
     * @default 'tc'
     */
    static get TOP_CLONES() {
        return ResultSeriesType.typeCode.TOP_CLONES.code;
    }

    /**
     * @description Junction Length code
     * @type {string}
     * @static
     * @const
     * @default 'gl'
     */
    static get JUNCTION_LENGTH() {
        return ResultSeriesType.typeCode.JUNCTION_LENGTH.code;
    }

    /**
     * @description Junction AA Length code
     * @type {string}
     * @static
     * @const
     * @default 'jal'
     */
    static get JUNCTION_AA_LENGTH() {
        return ResultSeriesType.typeCode.JUNCTION_AA_LENGTH.code;
    }

    /**
     * @description return true if the code is a valid code (i.e. exists in the list of possible codes).
     * @static
     * @param {String} code
     * @returns {boolean} 
     */
    static contains(code) {
        return Object.values(ResultSeriesType.typeCode).map( a => a.code).includes(code);
    }
    
    /**
     * @description return a ResultSeriesType by its code.
     * @static
     * @param {String} name
     * @returns {ResultSeriesType} 
     * @throws TypeError if code is undefined or inexistent.
     */
    static getByName(name){
        //TODO: Verify if name is not undefined.
        if (!name ){
            throw new TypeError('undefined name value. Name parameter is required.');
        }
        if (ResultSeriesType.names[name] == undefined){
            throw new TypeError('inexistent name in list.');
        }
        let unique = name.includes('unique');
        let exists = name.includes('exists');
        let productive = name.includes('productive');
        let rearrangement = name.includes('rearrangement');
        let duplicate = name.includes('duplicate');
        let type = ResultSeriesType.names[name];
        return new ResultSeriesType(type.code, type.name, unique, exists, productive, rearrangement, duplicate);

    }

    #_typeCode;
    #_typeName;
    #_unique;
    #_exists;
    #_productive;
    #_rearrangement;
    #_duplicate;

    /**
     * @description Creates an instance of ResultSeriesType.
     * @param {string} typeCode
     * @param {string} typeName
     * @param {boolean} unique
     * @param {boolean} exists
     * @param {boolean} productive
     * @param {boolean} rearrangement
     * @param {boolean} duplicate
     */
    constructor(typeCode, typeName, unique, exists, productive, rearrangement, duplicate){
        this.#_typeCode = typeCode;
        this.#_typeName = typeName;
        this.#_unique = unique;
        this.#_exists = exists;
        this.#_productive = productive;
        this.#_rearrangement = rearrangement;
        this.#_duplicate = duplicate;
    }

    /**
     * @description the code for this type
     * @readonly
     * @type {string}
     */
    get typeCode(){
        return this.#_typeCode;
    }
    
    /**
     * @description the name of the type
     * @readonly
     * @type {string}
     */
    get typeName(){
        return this.#_typeName;
    }
    
    /**
     * @description returns true if unique flag is set, returns false otherwise.
     * @readonly
     * @type {boolean}
     */
    get unique(){
        return this.#_unique;
    }
    
    /**
     * @description returns true if exists flag is set, returns false otherwise.
     * @readonly
     * @type {boolean}
     */
    get exists(){
        return this.#_exists;
    }
    
    /**
     * @description returns true if productive flag is set, returns false otherwise.
     * @readonly
     * @type {boolean}
     */
    get productive(){
        return this.#_productive;
    }
    
    /**
     * @description returns true if rearrangement flag is set, returns false otherwise.
     * @readonly
     * @type {boolean}
     */
    get rearrangement(){
        return this.#_rearrangement;
    }
    
    /**
     * @description returns true if duplicate flag is set, returns false otherwise.
     * @readonly
     * @type {boolean}
     */
    get duplicate(){
        return this.#_duplicate;
    }

    /**
     * @description Build a String representation of the ResultSeriesType
     * @returns {string} 
     */
    toString(){
        let result = this.#_typeName;
        if (this.#_exists || this.#_productive || this.#_unique || this.#_rearrangement || this.#_duplicate){
            let first = true;
            result += '[';
            if (this.#_exists){
                result += 'exists';
                first = false;
            }
            if (this.#_unique){
                if (!first){
                    result += ', ';   
                }
                result += 'unique';
                first = false;
            }
            if (this.#_productive){
                if (!first){
                    result += ', ';
                }
                result += 'productive';
                first = false;
            }
            if (this.#_rearrangement){
                if (!first){
                    result += ', ';
                }
                result += 'rearrangement';
                first = false;
            }
            if (this.#_duplicate){
                if (!first){
                    result += ', ';
                }
                result += 'duplicate';
                first = false;
            }
            result += ']';
        }
        return result; 
    }
}

/**
 * A static class for Codes of Gene Types
 */
class GeneType {

    static genes = {
        V_GENE: 'v',
        D_GENE: 'd',
        J_GENE: 'j',
        C_GENE: 'c'
    };

    /**
     * @description The code for V Gene
     * @const
     * @static
     * @type {string}
     * @default 'v'
     */
    static get V_GENE() {
        return GeneType.genes.V_GENE;
    }

    /**
     * @description The code for D Gene
     * @const
     * @static
     * @type {string}
     * @default 'd'
     */
    static get D_GENE() {
        return GeneType.genes.D_GENE;
    }

    static get J_GENE() {
        return GeneType.genes.J_GENE;
    }

    /**
     * @description The code for D Gene
     * @const
     * @static
     * @type {string}
     * @default 'd'
     */
    static get C_GENE() {
        return GeneType.genes.C_GENE;
    }

     /**
     * @description return true if the code is a valid code (i.e. exists in the list of possible codes).
     * @static
     * @param {String} value
     * @returns {boolean} 
     */
    static contains(value) {
        return Object.values(GeneType.genes).includes(value);
    }
}

/**
 * DataType class for setting types at the Properties and help decide the proper {@link Result} Structure at the Abstract Result Factory
 */
class DataType {

    static types = {
        V_GENE_USAGE: 'VGeneUsage',
        D_GENE_USAGE: 'DGeneUsage',
        J_GENE_USAGE: 'JGeneUsage',
        C_GENE_USAGE: 'CGeneUsage',
        JUNCTION_LENGTH: 'JunctionLength',
        CLONE_COUNT: 'CloneCount',
        CLONE_COUNT_IMMUNEDB: 'CloneCountImmuneDB'
    };

    /**
     * @description V Gene Usage data type
     * @constant
     * @static
     * @default 'VGeneUsage'
     */
    static get V_GENE_USAGE() {
        return DataType.types.V_GENE_USAGE;
    }
    
    /**
     * @description D Gene Usage data type
     * @constant
     * @static
     * @default 'DGeneUsage'
     */
    static get D_GENE_USAGE() {
        return DataType.types.D_GENE_USAGE;
    }
    
    /**
     * @description J Gene Usage data type
     * @constant
     * @static
     * @default 'JGeneUsage'
     */
    static get J_GENE_USAGE() {
        return DataType.types.J_GENE_USAGE;
    }
    
    /**
     * @description C Gene Usage data type
     * @constant
     * @static
     * @default 'CGeneUsage'
     */
    static get C_GENE_USAGE() {
        return DataType.types.C_GENE_USAGE;
    }
    
    /**
     * @description Junction Length data type
     * @constant
     * @static
     * @default 'JunctionLength'
     */
    static get JUNCTION_LENGTH() {
        return DataType.types.JUNCTION_LENGTH;
    }
    
    /**
     * @description Clone Count data type
     * @constant
     * @static
     * @default 'ConeCount'
     */
    static get CLONE_COUNT() {
        return DataType.types.CLONE_COUNT;
    }
    
    /**
     * @description Clone Count (ImmuneDB) data type
     * @constant
     * @static
     * @default 'CloneCountImmuneDB'
     */
    static get CLONE_COUNT_IMMUNEDB() {
        return DataType.types.CLONE_COUNT_IMMUNEDB;
    }

    /**
     * @description Validates if the value is a valid code for a known data type.
     * @static
     * @param {string} value the data type code to check if exists in known types
     * @returns {boolean} true if value is and existing valid code, false otherwise
     */
    static contains(value) {
        return Object.values(DataType.types).includes(value);
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

    static quote(text){
        return "\'"+text+"\'";
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

    /**
     * @description Creates an instance of DebugTimer.
     */
    constructor() {
        this.#_data = {};
        this.#_logger = new Logger("DebugTimer");
    }

    /**
     * @description Begin the timer.
     * @param {string} what - Label, e.g. "loading file".
     */
    start(what) {
        this.#_data[what] = {
            start: Date.now(),
        };
    }

    /**
     * @description End the timer.
     * @param {string} what - Label, e.g. "loading file".
     */
    end(what) {
        this.#_data[what].end = Date.now();
        this.#_data[what].total = this.#_data[what].end - this.#_data[what].start;
    }

    /**
     * @description Print the results to the console.
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

    /**
     * @description cleans the Timer
     */
    clean() {
        let cleaned = {};
        this.#_data = cleaned;
    }
}


export { Logger, ResultSeriesType, GeneType, DataType, Common, DebugTimer };