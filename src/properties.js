import {Logger, Common} from './common';

class Properties {
    #_logger;
    #_title;
    #_subtitle;
    #_xLabel;
    #_yLabel;
    #_id;
    #_sort;
    #_chartType;
    #_animation;
    #_stackingType;
                    
    constructor(){
        this.#_logger = new Logger('Properties');
        this.#_logger.debug("Constructor.");
        this.#_title = undefined;
        this.#_subtitle = undefined;
        this.#_xLabel = undefined;
        this.#_yLabel = undefined;
        this.#_id = Common.makeid(12);
        this.#_sort = false;
        this.#_logger.trace(JSON.stringify(this));
        this.#_chartType = 'column'; //defaults to column chart.
        this.#_animation = false; //defaults to false.
        this.#_stackingType = undefined;
    }

    get title() {
        return this.#_title;
    }


    get subtitle() {
        return this.#_subtitle;
    }


    get xLabel() {
        return this.#_xLabel;
    }

    get yLabel() {
        return this.#_yLabel;
    }

    get id() {
        return this.#_id;
    }

    get sort() {
        return this.#_sort;
    }

    get chartType() {
        return this.#_chartType;
    }

    get animation() {
        return this.#_animation;
    }

    get stackingType() {
        return this.#_stackingType;
    }

    set title(value){
        this.setTitle(value);
    }

    set subtitle(value){
        this.setSubtitle(value);
    }

    set id(elementId){
        this.setId(elementId);
    }

    set sort(value){
        this.setSort(value);
    }

    set chartType(value){
        this.setChartType(value);
    }

    set animation(value){
        this.setAnimation(value);
    }

    set stackingType(value){
        this.setStackingType(value);
    }

    setTitle (value) {
        this.#_title = value;
        this.#_logger.debug("setTitle.");
        this.#_logger.trace(JSON.stringify(this));
        return this;
    }

    setSubtitle(value) {
        this.#_subtitle = value;
        this.#_logger.debug("setSubtitle");
        this.#_logger.trace(JSON.stringify(this));
        return this;
    }
    
    setXLabel( label) {
        this.#_xLabel = label;
        this.#_logger.debug("setXLabel.");
        this.#_logger.trace(JSON.stringify(this));
        return this;
    }

    setYLabel (label) {
        this.#_yLabel = label;
        this.#_logger.debug("setYLabel.");
        this.#_logger.trace(JSON.stringify(this));
        return this;
    }

    setId (elementId) {
        this.#_id = elementId;
        this.#_logger.debug("setId.");
        this.#_logger.trace(JSON.stringify(this));
        console.log(JSON.stringify(this));
        return this;
    }

    setSort (value) {
        this.#_sort = value;
        this.#_logger.debug("setSort.");
        this.#_logger.trace(JSON.stringify(this));
        return this;
    }

    setChartType (value) {
        this.#_chartType = value;
        this.#_logger.debug("setChartType.");
        this.#_logger.trace(JSON.stringify(this));
        return this;
    }

    setAnimation (value) {
        this.#_animation = value;
        this.#_logger.debug("setAnimation.");
        this.#_logger.trace(JSON.stringify(this));
        return this;
    }

    setStackingType (value) {
        this.#_stackingType = value;
        this.#_logger.debug("setStackingType.");
        this.#_logger.trace(JSON.stringify(this));
        return this;
    }
        
    updateWith (anotherProperties){
        if (! this.id) this.setId(anotherProperties.id);
        if (! this.title) this.setTitle(anotherProperties.title);
        if (! this.subtitle) this.setSubtitle(anotherProperties.subtitle);
        if (! this.xLabel) this.setXLabel(anotherProperties.xLabel);
        if (! this.yLabel) this.setYLabel(anotherProperties.yLabel);
        if (! this.sort) this.setSort(anotherProperties.sort);
        if (! this.chartType) this.setChartType(anotherProperties.chartType);
        if (! this.animation) this.setAnimation(anotherProperties.animation);
        if (! this.stackingType) this.setStackingType(anotherProperties.stackingType);
    }
        
    static validOrNew(properties){
        console.log(properties);
        if (properties == null){
            console.log("properties is null");
            return new Properties();
        }
        if (properties instanceof Properties){
            console.log("properties is instance of Properties");
            return properties;
        }
        if (properties.constructor == Common.objectConstructor ){
            let p = new Properties();
            try {
                Object.seal(p);
                return Object.assign(p, properties);
            } catch(e){
                console.log(e);
                console.log("Properties: tried to build a Object with the wrong structure. Returning an empty Properties instance.");
                return p;
                
            }
        }
    }
}

module.exports = {
    Properties: Properties
  };

  export {Properties};