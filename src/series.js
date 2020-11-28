// Import and export other modules from AIIR Visualization Library
import {Logger, ResultSeriesType} from './common.js';

/**
 * @description A Data Item in a Result Series
 * @author Marco Amaro Oliveira
 * @class ResultSeriesDataItem
 */
class ResultSeriesDataItem{
    #_logger;
    #_name;
    #_x;
    #_y;
    #_z;
    #_color;
    #_drilldown;
    
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
    
    get name(){
        return this.getName();
    }
    
    /**
     * @description returns the name of the Data item
     * @returns {string} 
     * @memberof ResultSeriesDataItem
     */
    getName(){
        return this.#_name;
    }
    
    get x(){
        return this.getX();
    }
        
    /**
     * @description returns the x value of the Data item
     * @returns {Number} 
     * @memberof ResultSeriesDataItem
     */
    getX(){
        return this.#_x;
    }
    
    get y(){
        return this.getY();
    }
            
    /**
     * @description returns the y value of the Data item
     * @returns {Number} 
     * @memberof ResultSeriesDataItem
     */
    getY(){
        return this.#_y;
    }
    
    get z(){
        return this.getZ();
    }
            
    /**
     * @description returns the z value of the Data item
     * @returns {Number} 
     * @memberof ResultSeriesDataItem
     */
    getZ(){
        return this.#_z;
    }
    
    get color(){
        return this.getColor();
    }
            
    /**
     * @description returns the color value of the Data item
     * @returns {Number} 
     * @memberof ResultSeriesDataItem
     */
    getColor(){
        return this.#_color;
    }
    
    get drilldown(){
        return this.getDrilldown();
    }
            
    /**
     * @description returns the name of the ResultSeries that is to be used as drilldown for the Data item
     * @returns {Number} 
     * @memberof ResultSeriesDataItem
     */
    getDrilldown(){
        return this.#_drilldown;
    }

    set name(name){
        this.setName(name);
    }

    /**
     * @description Sets the name of this Data item
     * @param {string} name
     * @returns {DataItem} this data item
     * @memberof ResultSeriesDataItem
     */
    setName(name){
        this.#_name = name;
        return this;
    }
    
    set x(x){
        this.setX(x);
    }
    
    /**
     * @description Sets the x value of this Data item
     * @param {Number} xValue
     * @returns {DataItem} this data item
     * @memberof ResultSeriesDataItem
     */
    setX(xValue){
        this.#_x = xValue;
        return this;
    }
    
    set y(y){
        this.setY(y);
    }

    /**
     * @description Sets the y value of this Data item
     * @param {Number} yValue
     * @returns {DataItem} this data item
     * @memberof ResultSeriesDataItem
     */
    setY(yValue){
        this.#_y = yValue;
        return this;
    }
    
    set z(z){
        this.setZ(z);
    }
        
    /**
     * @description Sets the z value of this Data item
     * @param {Number} zValue
     * @returns {DataItem} this data item
     * @memberof ResultSeriesDataItem
     */
    setZ(zValue){
        this.#_z = zValue;
        return this;
    }
    
    set color(value){
        this.setColor(value);
    }

    /**
     * @description Sets the color value of this Data item
     * @param {Number} value
     * @returns {DataItem} this data item
     * @memberof ResultSeriesDataItem
     */
    setColor(value){
        this.#_color = value;
        return this;
    }
    
    set drilldown(drilldown){
        this.setDrilldown(drilldown);
    }

    /**
     * @description Sets the name of the drilldown series of this Data item
     * @param {string} drilldownName
     * @returns {DataItem} this data item
     * @memberof ResultSeriesDataItem
     */
    setDrilldown(drilldownName){
        this.#_drilldown = drilldownName;
        return this;
    }

    /**
     * @description Returns a JSON representation of this object
     * @returns {*} 
     * @memberof ResultSeriesDataItem
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
 * @description A ResultSeries is a set of ResultSeriesDataItem and the metadata of that set.
 * @author Marco Amaro Oliveira
 * @class ResultSeries
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

    get repertoireId(){
        return this.#_repertoireId;
    }

    get sampleProcessingId(){
        return this.#_sampleProcessingId;
    }

    get dataProcessingId(){
        return this.#_dataProcessingId;
    }

    get id(){
        return this.#_id;
    }

    get name(){
        return this.#_name;
    }

    get fieldName(){
        return this.#_fieldName;
    }

    get data(){
        if (!this.#_data){
            this.#_data = [];
        }
        return this.#_data;
    }

    get type(){
        return this.#_type;
    }

    get parentName(){
        return this.#_parentName;
    }

    get color(){
        return this.#_color;
    }
    
    get stack(){
        return this.#_stack;
    }

    set repertoireId(repertoireId){
        this.setRepertoireId(repertoireId);
    }

    set sampleProcessingId(sampleProcessingId){
        this.setSampleProcessingId(sampleProcessingId);
    }

    set dataProcessingId(dataProcessingId){
        this.setDataProcessingId(dataProcessingId);
    }

    set id(id){
        this.setId(id);
    }

    set name(name){
        this.setName(name);
    }

    set fieldName(fieldName){
        this.setFieldName(fieldName);
    }

    set data(data){
        this.setData(data);
    }

    set type(type){
        this.setType(type);
    }

    set parentName(name){
        this.setParentName(name);
    }

    set color(color){
        this.setColor(color);
    }
    
    set stack(value){
        this.setStack(value);
    }

    setRepertoireId(repertoireId){
        this.#_repertoireId = repertoireId;
        return this;
    }

    setSampleProcessingId(sampleProcessingId){
        this.#_sampleProcessingId = sampleProcessingId;
        return this;
    }

    setDataProcessingId(dataProcessingId){
        this.#_dataProcessingId = dataProcessingId;
        return this;
    }

    setId(id){
        this.#_id = id;
        return this;
    }

    setName(name){
        this.#_name = name;
        return this;
    }

    setFieldName(fieldName){
        this.#_fieldName = fieldName;
        return this;
    }

    setData(data){
        this.#_data = data;
        return this;
    }

    /**
     * @description Sets the Type of the ResultSeries.
     * @param {ResultSeriesType} type
     * @returns {ResultSeries} 
     * @memberof ResultSeries
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
        
    setParentName(name){
        this.#_parentName = name;
        return this;
    }
    
    setColor(color){
        this.#_color = color;
        return this;
    }

    /**
     * @description Sets the stack name to be used by this Series when using stacked Charts
     * @param {string} stackName
     * @returns {ResultSeries} 
     * @memberof ResultSeries
     */
    setStack(stackName){
        this.#_stack = stackName;
        return this;
    }
    
    /**
     * @description Returns a JSON representation of the ResultSeries
     * @returns {JSON} 
     * @memberof ResultSeries
     */
    toJSON(){
        let {repertoireId, sampleProcessingId, dataProcessingId, name, fieldName, parentName, type, color, data} = this;
        return {repertoireId, sampleProcessingId, dataProcessingId, name, fieldName, parentName, type, color, data};
    }
        
    //TODO: This method (or this action) must be moved into a Highcharts 'package'. Probably into HighchartsChart class.
    /**
     * @description Returns a this ResultSeries formatted as an HighCharts.series
     * @returns {HighCharts.series} 
     * @memberof ResultSeries
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

/*
module.exports = {
    ResultSeriesDataItem: ResultSeriesDataItem,
    ResultSeries: ResultSeries
};
*/

export {ResultSeriesDataItem, ResultSeries};