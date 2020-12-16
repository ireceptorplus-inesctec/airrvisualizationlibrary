import { Logger, Common } from './common.js';

/**
 * Properties class for setting visualization properties and costumizations.
 */
class Properties {
    /**
     * @description default value for chart type
     * @type {String}
     * @constant
     * @static
     */
    static CHART_TYPE = 'column';
    /**
     * @description default value for sort
     * @type {Boolean}
     * @constant
     * @static
     */
    static SORT = false;
    /**
     * @description default value for animation
     * @type {Boolean}
     * @constant
     * @static
     */
    static ANIMATION = false;
    /**
     * @description default value for percentage (chart plots as percentages or as values)
     * @type {Boolean}
     * @constant
     * @static
     */
    static PERCENTAGE = false;
    /**
     * @description default value for alpha distance on 3D charts
     * @type {Number}
     * @constant
     * @static
     */
    static ALPHA_3D = 20;
    /**
     * @description default value for beta distance on 3D charts
     * @type {Number}
     * @constant
     * @static
     */
    static BETA_3D = 0;
    /**
     * @description default value for depth distance on 3D charts
     * @type {Number}
     * @constant
     * @static
     */
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
     * @description Creates an instance of Properties.
     */
    constructor() {
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

    /**
     * @description the Chart title
     * @type {String}
     */
    get title() {
        return this.getTitle();
    }

    set title(value) {
        this.setTitle(value);
    }

    /**
     * @description returns the title of the Chart.
     * @returns {String} the title of the Chart.
     */
    getTitle() {
        return this.#_title;
    }

    /**
     * @description Sets the title of the Chart.
     * @param {String} value the title of the Chart.
     * @returns {Properties} the same instance on which the method was called.
     */
    setTitle(value) {
        this.#_title = value;
        this.#_logger.debug("setTitle.");
        this.#_logger.trace(JSON.stringify(this));
        return this;
    }

    /**
     * @description the Chart subtitle
     * @type {String}
     */
    get subtitle() {
        return this.getSubtitle();
    }

    set subtitle(value) {
        this.setSubtitle(value);
    }

    /**
     * @description returns the subtitle of this Chart.
     * @returns {String} the subtitle of the Chart.
     */
    getSubtitle() {
        return this.#_subtitle;
    }

    /**
     * @description Sets the subtitle of the Chart.
     * @param {String} value the subtitle of the Chart.
     * @returns {Properties} the same instance on which the method was called.
     */
    setSubtitle(value) {
        this.#_subtitle = value;
        this.#_logger.debug("setSubtitle");
        this.#_logger.trace(JSON.stringify(this));
        return this;
    }

    /**
     * @description the Chart label for the Xx axis
     * @type {String}
     */
    get xLabel() {
        return this.getXLabel();
    }

    set xLabel(value) {
        this.setXLabel(value);
    }

    /**
     * @description returns the Chart label for the Xx axis
     * @returns {String} the Chart label for the Xx axis
     */
    getXLabel() {
        return this.#_xLabel;
    }

    /**
     * @description Sets the Chart label for the Xx axis
     * @param {String} value the Chart label for the Xx axis
     * @returns {Properties} the same instance on which the method was called.
     */
    setXLabel(label) {
        this.#_xLabel = label;
        this.#_logger.debug("setXLabel.");
        this.#_logger.trace(JSON.stringify(this));
        return this;
    }

    /**
     * @description the Chart label for the Yy axis
     * @type {String}
     */
    get yLabel() {
        return this.getYLabel();
    }

    set yLabel(value) {
        this.setYLabel(value);
    }

    /**
     * @description returns the Chart label for the Yy axis
     * @returns {String} the Chart label for the Yy axis
     */
    getYLabel() {
        return this.#_yLabel;
    }

    /**
     * @description Sets the Chart label for the Yy axis
     * @param {String} value the Chart label for the Yy axis
     * @returns {Properties} the same instance on which the method was called.
     */
    setYLabel(label) {
        this.#_yLabel = label;
        this.#_logger.debug("setYLabel.");
        this.#_logger.trace(JSON.stringify(this));
        return this;
    }

    /**
     * @description the id of the HTML element where the chart is to be plotted. Will be used as {@link Chart}.id.
     * @type {String}
     */
    get id() {
        return this.getId();
    }

    set id(elementId) {
        this.setId(elementId);
    }

    /**
     * @description returns the id of the HTML element where the chart is to be plotted.
     * @returns {String} the id of the HTML element where the chart is to be plotted.
     */
    getId() {
        return this.#_id;
    }

    /**
     * @description Sets the id of the HTML element where the chart is to be plotted.
     * @param {String} elementId the id of the HTML element where the chart is to be plotted.
     * @returns {Properties} the same instance on which the method was called.
     */
    setId(elementId) {
        this.#_id = elementId;
        this.#_logger.debug("setId.");
        this.#_logger.trace(JSON.stringify(this));
        console.log(JSON.stringify(this));
        return this;
    }

    /**
     * @description the stacking type value of the chart.
     * @type {String}
     */
    get stackingType() {
        return this.getStackingType();
    }

    set stackingType(value) {
        this.setStackingType(value);
    }

    /**
     * @description returns the stacking type value of the chart.
     * @returns {String} the stacking type value of the chart.
     */
    getStackingType() {
        return this.#_stackingType;
    }

    /**
     * @description Sets the stacking type value of the chart.
     * @param {String} value the stacking type value of the chart.
     * @returns {Properties} the same instance on which the method was called.
     */
    setStackingType(value) {
        this.#_stackingType = value;
        this.#_logger.debug("setStackingType.");
        this.#_logger.trace(JSON.stringify(this));
        return this;
    }

    /**
     * @description the value of the sorting property to be used by the {@link resultseries}.
     * @type {Boolean}
     */
    get sort() {
        return this.getSort();
    }

    set sort(value) {
        this.setSort(value);
    }

    /**
     * @description Returns the value of the sorting property to be used by the {@link resultseries}.
     * @returns {Boolean} the value of the sorting property to be used by the {@link resultseries}.
     */
    getSort() {
        return this.#_sort;
    }

    /**
     * @description Sets the value of the sorting property to be used by the {@link resultseries}.
     * @param {String} value the value of the sorting property to be used by the {@link resultseries}.
     * @returns {Properties} the same instance on which the method was called.
     */
    setSort(value) {
        this.#_sort = value;
        this.#_sort_userDefined = true;
        this.#_logger.debug("setSort.");
        this.#_logger.trace(JSON.stringify(this));
        return this;
    }

    /**
     * @description the type of chart to be plotted. Default to {@link Properties}.CHART_TYPE.
     * @type {String}
     */
    get chartType() {
        return this.getChartType();
    }

    set chartType(value) {
        this.setChartType(value);
    }

    /**
     * @description Returns the type of chart to be plotted.
     * @returns {String} the type of chart to be plotted.
     */
    getChartType() {
        return this.#_chartType;
    }

    /**
     * @description Sets the type of chart to be plotted.
     * @param {String} value the type of chart to be plotted.
     * @returns {Properties} the same instance on which the method was called.
     */
    setChartType(value) {
        this.#_chartType = value;
        this.#_chartType_userDefined = true;
        this.#_logger.debug("setChartType.");
        this.#_logger.trace(JSON.stringify(this));
        return this;
    }

    /**
     * @description the value of the animation property to be used by the Chart.
     * @type {Boolean}
     */
    get animation() {
        return this.getAnimation();
    }

    set animation(value) {
        this.setAnimation(value);
    }

    /**
     * @description Returns the value of the animation property to be used by the Chart.
     * @returns {Boolean} the value of the animation property to be used by the Chart.
     */
    getAnimation() {
        return this.#_animation;
    }

    /**
     * @description Sets the value of the animation property to be used by the Chart.
     * @param {String} value the value of the animation property to be used by the Chart.
     * @returns {Properties} the same instance on which the method was called.
     */
    setAnimation(value) {
        this.#_animation = value;
        this.#_animation_userDefined = true;
        this.#_logger.debug("setAnimation.");
        this.#_logger.trace(JSON.stringify(this));
        return this;
    }

    /**
     * @description the value of the alpha distance to be used on 3D charts.
     * @type {Number}
     */
    get alpha3D() {
        return this.getAlpha3D();
    }

    set alpha3D(value) {
        this.setAlpha3D(value);
    }

    /**
     * @description Returns the value of the alpha distance to be used on 3D charts.
     * @returns {Number} the value of the alpha distance to be used on 3D charts.
     */
    getAlpha3D() {
        return this.#_alpha3D;
    }

    /**
     * @description Sets the value of the alpha distance to be used on 3D charts.
     * @param {Number} value the value of the alpha distance to be used on 3D charts.
     * @returns {Properties} the same instance on which the method was called.
     */
    setAlpha3D(value) {
        this.#_alpha3D = value;
        this.#_alpha3D_userDefined = true;
        this.#_logger.debug("setAlpha3D.");
        this.#_logger.trace(JSON.stringify(this));
        return this;
    }

    /**
     * @description the value of the beta distance to be used on 3D charts.
     * @type {Number}
     */
    get beta3D() {
        return this.getBeta3D();
    }

    set beta3D(value) {
        this.setBeta3D(value);
    }

    /**
     * @description Returns the value of the beta distance to be used on 3D charts.
     * @returns {Number} the value of the beta distance to be used on 3D charts.
     */
    getBeta3D() {
        return this.#_beta3D;
    }

    /**
     * @description Sets the value of the beta distance to be used on 3D charts.
     * @param {Number} value the value of the beta distance to be used on 3D charts.
     * @returns {Properties} the same instance on which the method was called.
     */
    setBeta3D(value) {
        this.#_beta3D = value;
        this.#_beta3D_userDefined = true;
        this.#_logger.debug("setBeta3D.");
        this.#_logger.trace(JSON.stringify(this));
        return this;
    }

    /**
     * @description the value of the depth distance to be used on 3D charts.
     * @type {Number}
     */
    get depth3D() {
        return this.getDepth3D();
    }

    set depth3D(value) {
        this.setDepth3D(value);
    }

    /**
     * @description Returns the value of the depth distance to be used on 3D charts.
     * @returns {Number} the value of the depth distance to be used on 3D charts.
     */
    getDepth3D() {
        return this.#_depth3D;
    }

    /**
     * @description Sets the value of the depth distance to be used on 3D charts.
     * @param {Number} value the value of the depth distance to be used on 3D charts.
     * @returns {Properties} the same instance on which the method was called.
     */
    setDepth3D(value) {
        this.#_depth3D = value;
        this.#_depth3D_userDefined = true;
        this.#_logger.debug("setDepth3D.");
        this.#_logger.trace(JSON.stringify(this));
        return this;
    }

    /**
     * @description indicates if the chart is to be plotted as percentages or as values.
     * @type {Boolean}
     */
    get percentage() {
        return this.getPercentage();
    }

    set percentage(value) {
        this.setPercentage(value);
    }

    /**
     * @description Returns true if the chart is to be plotted as percentages or as values.
     * @returns {Boolean} 
     */
    getPercentage() {
        return this.#_percentage;
    }

    /**
     * @description Sets the value if the data is to be plotted as percentage or as values.
     * @param {Boolean} value 
     * @returns {Properties} the same instance on which the method was called.
     */
    setPercentage(value) {
        this.#_percentage = value;
        this.#_percentage_userDefined = true;
        this.#_logger.debug("setPercentage.");
        this.#_logger.trace(JSON.stringify(this));
        return this;
    }

    /**
     * @description Updates a Properties with another properties contents. Own contents will only be updated if not yet set.
     * @param {Properties} anotherProperties
     */
    updateWith(anotherProperties) {
        if (!this.#_chartType_userDefined) this.setChartType(anotherProperties.chartType);
        if (!this.title) this.setTitle(anotherProperties.title);
        if (!this.subtitle) this.setSubtitle(anotherProperties.subtitle);
        if (!this.xLabel) this.setXLabel(anotherProperties.xLabel);
        if (!this.yLabel) this.setYLabel(anotherProperties.yLabel);
        if (!this.stackingType) this.setStackingType(anotherProperties.stackingType);
        if (!this.#_sort_userDefined) this.setSort(anotherProperties.sort);
        if (!this.#_animation_userDefined) this.setAnimation(anotherProperties.animation);
        if (!this.#_percentage_userDefined) this.setPercentage(anotherProperties.percentage);
        if (!this.#_alpha3D_userDefined) this.setAlpha3D(anotherProperties.alpha3D);
        if (!this.#_beta3D_userDefined) this.setBeta3D(anotherProperties.beta3D);
        if (!this.#_depth3D_userDefined) this.setDepth3D(anotherProperties.depth3D);
        if (!this.id) this.setId(anotherProperties.id);
    }

    /**
     * @description Returns a valid Properties instance. Will create a new Properties if the parameter is invalid, or will return the Properties instance otherwise.
     * @static
     * @param {Properties} properties A Properties instance or a JSON representation of a properties instance
     * @returns {Properties} 
     */
    static validOrNew(properties) {
        let p = undefined;
        if (properties == null) {
            console.log("properties is null");
            p = new Properties();
        } else if (properties instanceof Properties) {
            console.log("properties is instance of Properties");
            p = properties;
        } else if (typeof properties === "string") {
            properties = JSON.parse(properties);
        }

        if (p == undefined && properties.constructor == Common.objectConstructor) {
            p = new Properties();
            try {
                Object.seal(p);
                Object.assign(p, properties);
            } catch (e) {
                console.log(e);
                this.#_logger.error("Properties: tried to build a Object with the wrong structure. Returning an empty Properties instance.");
                p = new Properties();
            }
        }
        return (p || new Properties());
    }
}

export { Properties };