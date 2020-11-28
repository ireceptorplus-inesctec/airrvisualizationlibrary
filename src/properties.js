import {Logger, Common} from './common.js';

/**
 * @description Properties class for setting visualization properties and costumizations.
 * @author Marco Amaro Oliveira
 * @class Properties
 */
class Properties {
    static CHART_TYPE = 'column';
    static SORT = false;
    static ANIMATION = false;
    static PERCENTAGE = false;
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
    #_percentage;
    #_alpha3D;
    #_beta3D;
    #_depth3D;
    #_sort_userDefined;
    #_percentage_userDefined;
    #_chartType_userDefined;
    #_animation_userDefined;
    #_alpha3D_userDefined;
    #_beta3D_userDefined;
    #_depth3D_userDefined;
    
    /**
     * Creates an instance of Properties.
     * @memberof Properties
     */
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
        this.#_percentage = Properties.PERCENTAGE;
        this.#_chartType = Properties.CHART_TYPE; //defaults to column chart.
        this.#_animation = Properties.ANIMATION; //defaults to false.
        this.#_alpha3D = Properties.ALPHA_3D; //defaults to 20;
        this.#_beta3D = Properties.BETA_3D; //defaults to 0;
        this.#_depth3D = Properties.DEPTH_3D; //defaults to 100;
        this.#_logger.trace(JSON.stringify(this));
        this.#_sort_userDefined = false;
        this.#_percentage_userDefined = false;
        this.#_chartType_userDefined = false;
        this.#_animation_userDefined = false;
        this.#_alpha3D_userDefined = false;
        this.#_beta3D_userDefined = false;
        this.#_depth3D_userDefined = false;
    }

    get title() {
        return this.getTitle();
    }

    getTitle() {
        return this.#_title;
    }

    get subtitle() {
        return this.getSubtitle();
    }

    getSubtitle() {
        return this.#_subtitle;
    }

    get xLabel() {
        return this.getXLabel();
    }

    getXLabel() {
        return this.#_xLabel;
    }

    get yLabel() {
        return this.getYLabel();
    }

    getYLabel() {
        return this.#_yLabel;
    }
    
    get id() {
        return this.getId();
    }
    
    getId() {
        return this.#_id;
    }

    get stackingType() {
        return this.getStackingType();
    }

    getStackingType() {
        return this.#_stackingType;
    }

    get sort() {
        return this.getSort();
    }

    getSort() {
        return this.#_sort;
    }

    get chartType() {
        return this.getChartType();
    }

    getChartType() {
        return this.#_chartType;
    }

    get animation() {
        return this.getAnimation();
    }

    getAnimation() {
        return this.#_animation;
    }

    get alpha3D() {
        return this.getAlpha3D();
    }

    getAlpha3D() {
        return this.#_alpha3D;
    }

    get beta3D() {
        return this.getBeta3D();
    }

    getBeta3D() {
        return this.#_beta3D;
    }

    get depth3D() {
        return this.getDepth3D();
    }

    getDepth3D() {
        return this.#_depth3D;
    }

    get percentage() {
        return this.getPercentage();
    }

    getPercentage() {
        return this.#_percentage;
    }

    set title(value){
        this.setTitle(value);
    }

    setTitle (value) {
        this.#_title = value;
        this.#_logger.debug("setTitle.");
        this.#_logger.trace(JSON.stringify(this));
        return this;
    }

    set subtitle(value){
        this.setSubtitle(value);
    }

    setSubtitle(value) {
        this.#_subtitle = value;
        this.#_logger.debug("setSubtitle");
        this.#_logger.trace(JSON.stringify(this));
        return this;
    }

    set xLabel(value) {
        this.setXLabel(value);
    }
    
    setXLabel( label) {
        this.#_xLabel = label;
        this.#_logger.debug("setXLabel.");
        this.#_logger.trace(JSON.stringify(this));
        return this;
    }

    set yLabel(value) {
        this.setYLabel(value);
    }

    setYLabel (label) {
        this.#_yLabel = label;
        this.#_logger.debug("setYLabel.");
        this.#_logger.trace(JSON.stringify(this));
        return this;
    }

    set id(elementId){
        this.setId(elementId);
    }

    setId (elementId) {
        this.#_id = elementId;
        this.#_logger.debug("setId.");
        this.#_logger.trace(JSON.stringify(this));
        console.log(JSON.stringify(this));
        return this;
    }

    set stackingType(value){
        this.setStackingType(value);
    }
    
    setStackingType (value) {
        this.#_stackingType = value;
        this.#_logger.debug("setStackingType.");
        this.#_logger.trace(JSON.stringify(this));
        return this;
    }

    set sort(value){
        this.setSort(value);
    }
    
    setSort (value) {
        this.#_sort = value;
        this.#_sort_userDefined = true;
        this.#_logger.debug("setSort.");
        this.#_logger.trace(JSON.stringify(this));
        return this;
    }

    set chartType(value){
        this.setChartType(value);
    }

    setChartType (value) {
        this.#_chartType = value;
        this.#_chartType_userDefined = true;
        this.#_logger.debug("setChartType.");
        this.#_logger.trace(JSON.stringify(this));
        return this;
    }

    set animation(value){
        this.setAnimation(value);
    }
    
    setAnimation (value) {
        this.#_animation = value;
        this.#_animation_userDefined = true;
        this.#_logger.debug("setAnimation.");
        this.#_logger.trace(JSON.stringify(this));
        return this;
    }

    set alpha3D(value){
        this.setAlpha3D(value);
    }
    
    setAlpha3D (value) {
        this.#_alpha3D = value;
        this.#_alpha3D_userDefined = true;
        this.#_logger.debug("setAlpha3D.");
        this.#_logger.trace(JSON.stringify(this));
        return this;
    }

    set beta3D(value){
        this.setBeta3D(value);
    }
    
    setBeta3D (value) {
        this.#_beta3D = value;
        this.#_beta3D_userDefined = true;
        this.#_logger.debug("setBeta3D.");
        this.#_logger.trace(JSON.stringify(this));
        return this;
    }

    set depth3D(value){
        this.setDepth3D(value);
    }
    
    setDepth3D (value) {
        this.#_depth3D = value;
        this.#_depth3D_userDefined = true;
        this.#_logger.debug("setDepth3D.");
        this.#_logger.trace(JSON.stringify(this));
        return this;
    }
    
    set percentage(value){
        this.setPercentage(value);
    }

    setPercentage (value) {
        this.#_percentage = value;
        this.#_percentage_userDefined = true;
        this.#_logger.debug("setPercentage.");
        this.#_logger.trace(JSON.stringify(this));
        return this;
    }

    /**
     * @description Updates a Properties with another properties contents. Own contents will only be updated if not yet set.
     * @param {Properties} anotherProperties
     * @memberof Properties
     */
    updateWith (anotherProperties){
        if (! this.#_chartType_userDefined) this.setChartType(anotherProperties.chartType);
        if (! this.title) this.setTitle(anotherProperties.title);
        if (! this.subtitle) this.setSubtitle(anotherProperties.subtitle);
        if (! this.xLabel) this.setXLabel(anotherProperties.xLabel);
        if (! this.yLabel) this.setYLabel(anotherProperties.yLabel);
        if (! this.stackingType) this.setStackingType(anotherProperties.stackingType);
        if (! this.#_sort_userDefined) this.setSort(anotherProperties.sort);
        if (! this.#_animation_userDefined) this.setAnimation(anotherProperties.animation);
        if (! this.#_percentage_userDefined) this.setPercentage(anotherProperties.percentage);
        if (! this.#_alpha3D_userDefined) this.setAlpha3D(anotherProperties.alpha3D);
        if (! this.#_beta3D_userDefined) this.setBeta3D(anotherProperties.beta3D);
        if (! this.#_depth3D_userDefined) this.setDepth3D(anotherProperties.depth3D);
        if (! this.id) this.setId(anotherProperties.id);
    }
    
    /**
     * @description Returns a valid Properties instance. Will create a new Properties if the parameter is invalid, or will return the Properties instance otherwise.
     * @static
     * @param {Properties} properties A Properties instance or a JSON representation of a properties instance
     * @returns {Properties} 
     * @memberof Properties
     */
    static validOrNew(properties){
        let p = undefined;
        if (properties == null){
            console.log("properties is null");
            p = new Properties();
        }else if (properties instanceof Properties){
            console.log("properties is instance of Properties");
            p = properties;
        }else if (typeof properties === "string") {
            properties = JSON.parse(properties);
        }
        
        if (p == undefined && properties.constructor == Common.objectConstructor ){
            p = new Properties();
            try {
                Object.seal(p);
                Object.assign(p, properties);
            } catch(e){
                console.log(e);
                this.#_logger.error("Properties: tried to build a Object with the wrong structure. Returning an empty Properties instance.");
                p = new Properties();  
            }
        }
        return (p || new Properties());
    }
}

/*
module.exports = {
    Properties: Properties
};
*/

  export {Properties};