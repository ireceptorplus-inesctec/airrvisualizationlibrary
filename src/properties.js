import {Logger, Common} from './common';

class Properties {
    static CHART_TYPE = 'column';
    static SORT = false;
    static ANIMATION = false;
    static ALPHA_3D = 20;
    static BETA_3D = 0;
    static DEPTH_3D = 100;

    #_logger;
    #_title;
    #_subtitle;
    #_xLabel;
    #_yLabel;
    #_stackingType;
    #_id;
    #_sort;
    #_chartType;
    #_animation;
    #_alpha3D;
    #_beta3D;
    #_depth3D;
    #_sort_userDefined;
    #_chartType_userDefined;
    #_animation_userDefined;
    #_alpha3D_userDefined;
    #_beta3D_userDefined;
    #_depth3D_userDefined;
                    
    constructor(){
        this.#_logger = new Logger('Properties');
        this.#_logger.debug("Constructor.");
        this.#_title = undefined;
        this.#_subtitle = undefined;
        this.#_xLabel = undefined;
        this.#_yLabel = undefined;
        this.#_stackingType = undefined;
        this.#_id = Common.makeid(12);
        this.#_sort = Properties.SORT;
        this.#_chartType = Properties.CHART_TYPE; //defaults to column chart.
        this.#_animation = Properties.ANIMATION; //defaults to false.
        this.#_alpha3D = Properties.ALPHA_3D; //defaults to 20;
        this.#_beta3D = Properties.BETA_3D; //defaults to 0;
        this.#_depth3D = Properties.DEPTH_3D; //defaults to 100;
        this.#_logger.trace(JSON.stringify(this));
        this.#_sort_userDefined = false;
        this.#_chartType_userDefined = false;
        this.#_animation_userDefined = false;
        this.#_alpha3D_userDefined = false;
        this.#_beta3D_userDefined = false;
        this.#_depth3D_userDefined = false;
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

    get stackingType() {
        return this.#_stackingType;
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

    get alpha3D() {
        return this.#_alpha3D;
    }

    get beta3D() {
        return this.#_beta3D;
    }

    get depth3D() {
        return this.#_depth3D;
    }

    set title(value){
        this.setTitle(value);
    }

    set subtitle(value){
        this.setSubtitle(value);
    }

    set stackingType(value){
        this.setStackingType(value);
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

    set alpha3D(value){
        this.setAlpha3D(value);
    }

    set beta3D(value){
        this.setBeta3D(value);
    }

    set depth3D(value){
        this.setDepth3D(value);
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
    
    setStackingType (value) {
        this.#_stackingType = value;
        this.#_logger.debug("setStackingType.");
        this.#_logger.trace(JSON.stringify(this));
        return this;
    }
    
    setSort (value) {
        this.#_sort = value;
        this.#_sort_userDefined = true;
        this.#_logger.debug("setSort.");
        this.#_logger.trace(JSON.stringify(this));
        return this;
    }


    setChartType (value) {
        this.#_chartType = value;
        this.#_chartType_userDefined = true;
        this.#_logger.debug("setChartType.");
        this.#_logger.trace(JSON.stringify(this));
        return this;
    }
    
    setAnimation (value) {
        this.#_animation = value;
        this.#_animation_userDefined = true;
        this.#_logger.debug("setAnimation.");
        this.#_logger.trace(JSON.stringify(this));
        return this;
    }
    
    setAlpha3D (value) {
        this.#_alpha3D = value;
        this.#_alpha3D_userDefined = true;
        this.#_logger.debug("setAlpha3D.");
        this.#_logger.trace(JSON.stringify(this));
        return this;
    }
    
    setBeta3D (value) {
        this.#_beta3D = value;
        this.#_beta3D_userDefined = true;
        this.#_logger.debug("setBeta3D.");
        this.#_logger.trace(JSON.stringify(this));
        return this;
    }
    
    setDepth3D (value) {
        this.#_depth3D = value;
        this.#_depth3D_userDefined = true;
        this.#_logger.debug("setDepth3D.");
        this.#_logger.trace(JSON.stringify(this));
        return this;
    }
        
    updateWith (anotherProperties){
        if (! this.title) this.setTitle(anotherProperties.title);
        if (! this.subtitle) this.setSubtitle(anotherProperties.subtitle);
        if (! this.xLabel) this.setXLabel(anotherProperties.xLabel);
        if (! this.yLabel) this.setYLabel(anotherProperties.yLabel);
        if (! this.stackingType) this.setStackingType(anotherProperties.stackingType);
        if (! this.id) this.setId(anotherProperties.id);
        if (! this.#_sort_userDefined) this.setSort(anotherProperties.sort);
        if (! this.#_chartType_userDefined) this.setChartType(anotherProperties.chartType);
        if (! this.#_animation_userDefined) this.setAnimation(anotherProperties.animation);

        if (! this.#_alpha3D_userDefined) this.setAlpha3D(anotherProperties.alpha3D);
        if (! this.#_beta3D_userDefined) this.setBeta3D(anotherProperties.beta3D);
        if (! this.#_depth3D_userDefined) this.setDepth3D(anotherProperties.depth3D);
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