// Import and export other modules from AIIR Visualization Library
import {Logger, ResultSeriesType} from './common.js';

/**
 * A Data Item in a Result Series
 */
class ResultSeriesDataItem{
    #_logger;
    #_name;
    #_x;
    #_y;
    #_z;
    #_color;
    #_drilldown;
    
    /**
     * @description Creates an instance of ResultSeriesDataItem.
     */
    constructor(){
        this.#_logger = new Logger('ResultSeriesDataItem');
        this.#_logger.debug("Constructor.");
        this.#_name = undefined;
        this.#_x = undefined;
        this.#_y = undefined;
        this.#_z = undefined;
        this.#_color = undefined;
        this.#_drilldown = undefined;
    }
    
    /**
     * @description the name of this data item. It is used to group Data Items of distinct {@link ResultSeries}
     * @type {String}
     */
    get name(){
        return this.getName();
    }

    set name(name){
        this.setName(name);
    }
    
    /**
     * @description returns the name of the Data item
     * @returns {string} 
     */
    getName(){
        return this.#_name;
    }

    /**
     * @description Chainable method that sets the name of this Data item
     * @param {string} name
     * @returns {DataItem} the same instance on which the method was called.
     */
    setName(name){
        this.#_name = name;
        return this;
    }
    
    /**
     * @description the `x` value of the data item.
     * @type {Number}
     */
    get x(){
        return this.getX();
    }
    
    set x(x){
        this.setX(x);
    }
        
    /**
     * @description returns the `x` value of the Data item
     * @returns {Number} 
     */
    getX(){
        return this.#_x;
    }
    
    /**
     * @description Sets the `x` value of this Data item
     * @param {Number} xValue
     * @returns {DataItem} this data item
     */
    setX(xValue){
        this.#_x = xValue;
        return this;
    }
    
    /**
     * @description the `y` value of the data item.
     * @type {Number}
     */
    get y(){
        return this.getY();
    }
    
    set y(y){
        this.setY(y);
    }
            
    /**
     * @description returns the `y` value of the Data item
     * @returns {Number} 
     */
    getY(){
        return this.#_y;
    }

    /**
     * @description Sets the `y` value of this Data item
     * @param {Number} yValue
     * @returns {DataItem} this data item
     */
    setY(yValue){
        this.#_y = yValue;
        return this;
    }
    
    /**
     * @description the `z` value of the data item.
     * @type {Number}
     */
    get z(){
        return this.getZ();
    }
    
    set z(z){
        this.setZ(z);
    }
            
    /**
     * @description returns the `z` value of the Data item
     * @returns {Number} 
     */
    getZ(){
        return this.#_z;
    }
        
    /**
     * @description Sets the z value of this Data item
     * @param {Number} zValue
     * @returns {DataItem} this data item
     */
    setZ(zValue){
        this.#_z = zValue;
        return this;
    }
    
    /**
     * @description the color value for the data item.
     * @type {Number}
     */
    get color(){
        return this.getColor();
    }
    
    set color(value){
        this.setColor(value);
    }
            
    /**
     * @description returns the color value of the Data item
     * @returns {Number} 
     */
    getColor(){
        return this.#_color;
    }

    /**
     * @description Sets the color value of this Data item
     * @param {Number} value
     * @returns {DataItem} this data item
     */
    setColor(value){
        this.#_color = value;
        return this;
    }
            
    /**
     * @description the name of the {@link ResultSeries} that corresponds to the data detail (drilldown) of the Data item
     * @returns {String} 
     */
    get drilldown(){
        return this.getDrilldown();
    }
    
    set drilldown(drilldown){
        this.setDrilldown(drilldown);
    }
            
    /**
     * @description returns the name of the {@link ResultSeries} that is to be used as data detail (drilldown) for the Data item
     * @returns {Number} 
     */
    getDrilldown(){
        return this.#_drilldown;
    }

    /**
     * @description Sets the name of the drilldown series of this Data item
     * @param {string} drilldownName
     * @returns {DataItem} this data item
     */
    setDrilldown(drilldownName){
        this.#_drilldown = drilldownName;
        return this;
    }

    /**
     * @description Returns a JSON representation of this object
     * @returns {JSON} 
     */
    toJSON(){
        let {name, x, y, z, color, drilldown} = this;
        let json = {name, x, y, z, color, drilldown};
        /*
         * Simple implementation (doesn't check for undefined values)
         */
        //return {name, x, y, z, drilldown};
        /* 
         * More complex impementation 
         */
        for (const key in json) {
            if (json.hasOwnProperty(key)) {
                let value = json[key];
                if (value == undefined) delete json[key];
            }
        }
        return json;
    }
}

/**
 * A ResultSeries is a set of ResultSeriesDataItem and the metadata of that set.
 */
class ResultSeries{
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
    #_stack;
    
    constructor(){
        this.#_logger = new Logger('ResultSeries');
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
        this.#_stack = undefined;
    }
    
    /**
     * @description the value of the repertoire_id of the result series.
     * @type {String}
     */
    get repertoireId(){
        return this.#_repertoireId;
    }

    set repertoireId(repertoireId){
        this.setRepertoireId(repertoireId);
    }
    
    /**
     * @description sets the value of the repertoire_id of the result series.
     * @param {String} repertoireId the value of the repertoire_id
     * @returns {ResultSeries} the same instance on which the method was called.
     */
    setRepertoireId(repertoireId){
        this.#_repertoireId = repertoireId;
        return this;
    }
    
    /**
     * @description the value of the sample_processing_id of the result series.
     * @type {String}
     */
    get sampleProcessingId(){
        return this.#_sampleProcessingId;
    }

    set sampleProcessingId(sampleProcessingId){
        this.setSampleProcessingId(sampleProcessingId);
    }

    /**
     * @description sets the value of the sample_processing_id of the result series.
     * @param {String} sampleProcessingId
     * @returns {ResultSeries} the same instance on which the method was called.
     */
    setSampleProcessingId(sampleProcessingId){
        this.#_sampleProcessingId = sampleProcessingId;
        return this;
    }
    
    /**
     * @description the value of the data_processing_id of the result series.
     * @type {String}
     */
    get dataProcessingId(){
        return this.#_dataProcessingId;
    }

    set dataProcessingId(dataProcessingId){
        this.setDataProcessingId(dataProcessingId);
    }

    /**
     * @description sets the value of the data_processing_id of the result series.
     * @param {String} dataProcessingId
     * @returns {ResultSeries} the same instance on which the method was called.
     */
    setDataProcessingId(dataProcessingId){
        this.#_dataProcessingId = dataProcessingId;
        return this;
    }
    
    /**
     * @description the id of the result series.
     * @type {String}
     */
    get id(){
        return this.#_id;
    }

    set id(id){
        this.setId(id);
    }

    /**
     * @description sets the id of the result series.
     * @param {String} id
     * @returns {ResultSeries} the same instance on which the method was called.
     */
    setId(id){
        this.#_id = id;
        return this;
    }
    
    /**
     * @description the name of the result series.
     * @type {String}
     */
    get name(){
        return this.#_name;
    }

    set name(name){
        this.setName(name);
    }

    /**
     * @description sets the name of the result series.
     * @param {String} name
     * @returns {ResultSeries} the same instance on which the method was called.
     */
    setName(name){
        this.#_name = name;
        return this;
    }
    
    /**
     * @description the value of the fieldname of the result series.
     * @type {String}
     */
    get fieldName(){
        return this.#_fieldName;
    }

    set fieldName(fieldName){
        this.setFieldName(fieldName);
    }

    /**
     * @description sets the value of the fieldname of the result series.
     * @param {String} fieldName
     * @returns {ResultSeries} the same instance on which the method was called.
     */
    setFieldName(fieldName){
        this.#_fieldName = fieldName;
        return this;
    }
    
    /**
     * @description the array of {@link ResultSeriesDataItem} of the result series.
     * @type {ResultSeriesDataItem[]}
     */
    get data(){
        if (!this.#_data){
            this.#_data = [];
        }
        return this.#_data;
    }

    set data(data){
        this.setData(data);
    }

    /**
     * @description sets the array of {@link ResultSeriesDataItem} of the result series.
     * @param {ResultSeriesDataItem[]} data
     * @returns {ResultSeries} the same instance on which the method was called.
     */
    setData(data){
        this.#_data = data;
        return this;
    }
    
    /**
     * @description the {@link ResultSeriesType} of the result series.
     * @type {ResultSeriesType}
     */
    get type(){
        return this.#_type;
    }

    set type(type){
        this.setType(type);
    }

    /**
     * @description Sets the Type of the ResultSeries.
     * @param {ResultSeriesType} type
     * @returns {ResultSeries} the same instance on which the method was called.
     */
    setType(type){
        if (!type instanceof ResultSeriesType){
            throw 'type mus be an instance of ResultSeriesType';
        }
        if (!ResultSeriesType.contains(type.typeCode)){
            throw 'type must exist in ResultSeriesType.types';
        }
        this.#_type = type;
        return this;
    }
    
    /**
     * @description the name of the parent {@link ResultSeries} for the result series. This value allows for setting hierarchy relations between ResultSeries.
     * @type {String}
     */
    get parentName(){
        return this.#_parentName;
    }

    set parentName(name){
        this.setParentName(name);
    }
    
    /** 
     * @description Sets the name of the parent {@link ResultSeries} for the result series.
     * @param {String} name
     * @returns {ResultSeries} the same instance on which the method was called.
     */
    setParentName(name){
        this.#_parentName = name;
        return this;
    }
    
    /**
     * @description the color value of the result series. If this is set all {@link ResultSeriesDataItem} will apply this color.
     * @type {Number}
     */
    get color(){
        return this.#_color;
    }

    set color(color){
        this.setColor(color);
    }
    
    /**
     * @description Sets the color value of the result series.
     * @param {Number} color
     * @returns {ResultSeries} the same instance on which the method was called.
     */
    setColor(color){
        this.#_color = color;
        return this;
    }
    
    /**
     * @description the name to be used by the ResultSeries when using stacked Charts
     * @type {String}
     */
    get stack(){
        return this.#_stack;
    }
    
    set stack(value){
        this.setStack(value);
    }

    /**
     * @description Sets the stack name to be used by this Series when using stacked Charts
     * @param {String} stackName
     * @returns {ResultSeries} the same instance on which the method was called.
     */
    setStack(stackName){
        this.#_stack = stackName;
        return this;
    }
    
    /**
     * @description Returns a JSON representation of the ResultSeries
     * @returns {JSON} 
     */
    toJSON(){
        let {repertoireId, sampleProcessingId, dataProcessingId, name, fieldName, parentName, type, color, data} = this;
        return {repertoireId, sampleProcessingId, dataProcessingId, name, fieldName, parentName, type, color, data};
    }
        
    //TODO: This method (or this action) must be moved into a Highcharts 'package'. Probably into HighchartsChart class.
    /**
     * @description Returns this ResultSeries formatted as an HighCharts.series
     * @returns {HighCharts.series} 
     */
    asHighchartSeries(){

        let {id, name, color} = this;
        let json = {id, name, color};

        for (const key in json) {
            if (json.hasOwnProperty(key)) {
                let value = json[key];
                if (value == undefined) delete json[key];
            }
        }
        /*
        let json = {
            name: this.#_name,
            color: this.#_color
        };
        
        if (this.#_id) { json.id = this.#_id; }
        */  
        if (this.#_data) { json.data = this.#_data.map(d => d.toJSON()); }
        
        return json;
    }
}

export {ResultSeriesDataItem, ResultSeries};