// Import and export other modules from AIIR Visualization Library
import {Logger, ResultSeriesType} from './common';

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
        return this.#_name;
    }
    
    get x(){
        return this.#_x;
    }
    
    get y(){
        return this.#_y;
    }
    
    get z(){
        return this.#_z;
    }
    
    get color(){
        return this.#_color;
    }
    
    get drilldown(){
        return this.#_drilldown;
    }

    set name(name){
        this.setName(name);
    }
    
    set x(x){
        this.setX(x);
    }
    
    set y(y){
        this.setY(y);
    }
    
    set z(z){
        this.setZ(z);
    }
    
    set color(value){
        this.setColor(value);
    }
    
    set drilldown(drilldown){
        this.setDrilldown(drilldown);
    }

    setName(name){
        this.#_name = name;
        return this;
    }
    
    setX(x){
        this.#_x = x;
        return this;
    }
    
    setY(y){
        this.#_y = y;
        return this;
    }
    
    setZ(z){
        this.#_z = z;
        return this;
    }
    
    setColor(value){
        this.#_color = value;
        return this;
    }

    setDrilldown(drilldown){
        this.#_drilldown = drilldown;
        return this;
    }

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

    set repertoireId(repertoireId){
        setRepertoireId(repertoireId);
    }

    set sampleProcessingId(sampleProcessingId){
        setSampleProcessingId(sampleProcessingId);
    }

    set dataProcessingId(dataProcessingId){
        setDataProcessingId(dataProcessingId);
    }

    set id(id){
        setId(id);
    }

    set name(name){
        setName(name);
    }

    set fieldName(fieldName){
        setFieldName(fieldName);
    }

    set data(data){
        setData(data);
    }

    set type(type){
        setType(type);
    }

    set parentName(name){
        setParentName(name);
    }

    set color(color){
        setColor(color);
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
    
    toJSON(){
        let {repertoireId, sampleProcessingId, dataProcessingId, name, fieldName, parentName, type, color, data} = this;
        return {repertoireId, sampleProcessingId, dataProcessingId, name, fieldName, parentName, type, color, data};
    }
        
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

module.exports = {
    ResultSeriesDataItem: ResultSeriesDataItem,
    ResultSeries: ResultSeries
  };

export {ResultSeriesDataItem, ResultSeries};