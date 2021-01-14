import { expect } from 'chai';
import { prototype } from 'mocha';
import { Properties } from '../src';
import {DebugTimer} from '../src/common';
let timer = new DebugTimer();

function defaultValues(properties){
    if (properties == null) return false;
    if (!(properties instanceof Properties)) return false;
    if (properties.id == undefined) return false;
    if (!(typeof properties.id == "string")) return false;
    if (!(properties.title == undefined)) return false;
    if (!(properties.subtitle == undefined)) return false;
    if (!(properties.xLabel == undefined)) return false;
    if (!(properties.yLabel == undefined)) return false;
    if (!(properties.stackingType == undefined)) return false;
    if (!(properties.data == undefined)) return false;
    if (!(properties.dataType == undefined)) return false;
    if (!(properties.sort == Properties.DEFAULT_SORT)) return false;
    if (!(properties.chartType == Properties.DEFAULT_CHART_TYPE)) return false;
    if (!(properties.animation == Properties.DEFAULT_ANIMATION)) return false;
    if (!(properties.alpha3D == Properties.DEFAULT_ALPHA_3D)) return false;
    if (!(properties.beta3D == Properties.DEFAULT_BETA_3D)) return false;
    if (!(properties.depth3D == Properties.DEFAULT_DEPTH_3D)) return false;
    if (!(properties.percentage == Properties.DEFAULT_PERCENTAGE)) return false;
    if (!(properties.dataDrilldown == Properties.DEFAULT_DATA_DRILLDOWN)) return false;
    return true;
}
function defaultTypes(properties){
    if (properties == null) return false;
    if (!(properties instanceof Properties)) return false;
    if (properties.id == undefined) return false;
    else if (!(typeof properties.id == "string")) return false;
    if (!(properties.title == undefined) && !(typeof properties.title == "string")) return false;
    if (!(properties.subtitle == undefined) && !(typeof properties.subtitle == "string")) return false;
    if (!(properties.xLabel == undefined) && !(typeof properties.xLabel == "string")) return false;
    if (!(properties.yLabel == undefined) && !(typeof properties.yLabel == "string")) return false;
    if (!(properties.stackingType == undefined) && !(typeof properties.stackingType == "string")) return false;
    if (!(properties.data == undefined) && !(typeof properties.data == "string")) return false;
    if (!(properties.dataType == undefined) && !(typeof properties.dataType == "string")) return false;
    if (!(typeof properties.sort == "boolean")) return false;
    if (!(typeof properties.chartType == "string")) return false;
    if (!(typeof properties.animation == "boolean")) return false;
    if (!(typeof properties.alpha3D == "number")) return false;
    if (!(typeof properties.beta3D == "number")) return false;
    if (!(typeof properties.depth3D == "number")) return false;
    if (!(typeof properties.percentage == "boolean")) return false;
    if (!(typeof properties.dataDrilldown == "boolean")) return false;
    return true;
}

let propertiesJsonUndefined = undefined;
let propertyId = "test1234";
let propertyTitle = "My Test Title";
let propertySubtitle = "My Test Subtitle";
let propertyXLabel = "xLabel Label";
let propertyYLabel = "yLabel Label";
let propertyStackingType = "normal";
let propertySort = true;
let propertyChartType = "linear";
let propertyAnimation = false;
let propertyAlpha3D = 2;
let propertyBeta3D = 3;
let propertyDepth3D = 4;
let propertyPercentage = true;
let propertyData = {};
let propertyDatatype = "VGeneUsage";
let propertyDatatypeError = "inexistentDataType";
let propertyDataDrilldown = true;
let propertyIdUpdated = "test1234_updated";
let propertyTitleUpdated = "My Test Title updated";
let propertySubtitleUpdated = "My Test Subtitle updated";
let propertyXLabelUpdated = "xLabel Label updated";
let propertyYLabelUpdated = "yLabel Label updated";
let propertyStackingTypeUpdated = "overlap";
let propertySortUpdated = false;
let propertyChartTypeUpdated = "cylinder";
let propertyAnimationUpdated = true;
let propertyAlpha3DUpdated = 21;
let propertyBeta3DUpdated = 31;
let propertyDepth3DUpdated = 41;
let propertyPercentageUpdated = false;
let propertiesJsonObjectError = {"id":propertyId, "title":propertyTitle, "subtitle": propertySubtitle, "inexistentProperty": "This property does not exist"};
let propertiesJsonObjectWithoutId = {
    "title":propertyTitle, 
    "subtitle": propertySubtitle, 
    "xLabel": propertyXLabel, 
    "yLabel": propertyYLabel,
    "stackingType": propertyStackingType,
    "sort": propertySort,
    "chartType": propertyChartType,
    "animation": propertyAnimation,
    "alpha3D": propertyAlpha3D,
    "beta3D": propertyBeta3D,
    "depth3D": propertyDepth3D,
    "percentage": propertyPercentage
};
let propertiesJsonObject = {
    "id":propertyId, 
    "title":propertyTitle, 
    "subtitle": propertySubtitle, 
    "xLabel": propertyXLabel, 
    "yLabel": propertyYLabel,
    "stackingType": propertyStackingType,
    "sort": propertySort,
    "chartType": propertyChartType,
    "animation": propertyAnimation,
    "alpha3D": propertyAlpha3D,
    "beta3D": propertyBeta3D,
    "depth3D": propertyDepth3D,
    "percentage": propertyPercentage
};
let propertiesJsonObjectToUpdate = {
    "id":propertyIdUpdated, 
    "title":propertyTitleUpdated, 
    "subtitle": propertySubtitleUpdated, 
    "xLabel": propertyXLabelUpdated, 
    "yLabel": propertyYLabelUpdated,
    "stackingType": propertyStackingTypeUpdated,
    "sort": propertySortUpdated,
    "chartType": propertyChartTypeUpdated,
    "animation": propertyAnimationUpdated,
    "alpha3D": propertyAlpha3DUpdated,
    "beta3D": propertyBeta3DUpdated,
    "depth3D": propertyDepth3DUpdated,
    "percentage": propertyPercentageUpdated
};
let propertiesJsonStringError = "{\"id\":\""+propertyId+"\", \"title\":\""+propertyTitle+"\", \"subtitle\":\""+propertySubtitle+"\", \"inexistentProperty\": \"This property does not exist\"}";
let propertiesJsonString = "{\"id\":\""+propertyId+"\", \"title\":\""+propertyTitle+"\", \"subtitle\":\""+propertySubtitle+"\", \"xLabel\":\""+propertyXLabel+"\", \"yLabel\":\""+propertyYLabel+"\", \"dataDrilldown\": "+propertyDataDrilldown+"}";
let propertiesJsonStringWithoutId = "{\"title\":\""+propertyTitle+"\", \"subtitle\":\""+propertySubtitle+"\", \"xLabel\":\""+propertyXLabel+"\", \"yLabel\":\""+propertyYLabel+"\"}";

describe('Construct instances', function() {
    it('should create a new instance calling constructor without parameters', function(){
        let properties = new Properties();
        expect(properties).to.not.be.undefined;
        expect(properties).to.be.instanceOf(Properties);
        expect(defaultValues(properties)).to.be.true;
        expect(defaultTypes(properties)).to.be.true;
    });
    it('should have default parameters when built without parameters', function(){
        let properties = new Properties();
        expect(properties.id).to.not.be.undefined;
        expect(properties.id).to.be.an("string");
        expect(properties.title).to.be.undefined;
        expect(properties.subtitle).to.be.undefined;
        expect(properties.xLabel).to.be.undefined;
        expect(properties.yLabel).to.be.undefined;
        expect(properties.stackingType).to.be.undefined;
        expect(properties.sort).to.equal(Properties.DEFAULT_SORT);
        expect(properties.sort).to.be.an("boolean");
        expect(properties.chartType).to.equal(Properties.DEFAULT_CHART_TYPE);
        expect(properties.chartType).to.be.an("string");
        expect(properties.animation).to.equal(Properties.DEFAULT_ANIMATION);
        expect(properties.animation).to.be.an("boolean");
        expect(properties.alpha3D).to.equal(Properties.DEFAULT_ALPHA_3D);
        expect(properties.alpha3D).to.be.an("number");
        expect(properties.beta3D).to.equal(Properties.DEFAULT_BETA_3D);
        expect(properties.beta3D).to.be.an("number");
        expect(properties.depth3D).to.equal(Properties.DEFAULT_DEPTH_3D);
        expect(properties.depth3D).to.be.an("number");
        expect(properties.percentage).to.equal(Properties.DEFAULT_PERCENTAGE);
        expect(properties.percentage).to.be.an("boolean");
    });
    it('should create a new default instance calling the creator with undefined properties', function(){
        let properties = Properties.create(propertiesJsonUndefined);
        expect(properties).to.not.be.undefined;
        expect(properties).to.be.instanceOf(Properties);
        expect(defaultValues(properties)).to.be.true;
        expect(defaultTypes(properties)).to.be.true;
    });
    it('should create a new default instance calling the creator with null parameter', function(){
        let properties = Properties.create(null);
        expect(properties).to.not.be.undefined;
        expect(properties).to.be.instanceOf(Properties);
        expect(defaultValues(properties)).to.be.true;
        expect(defaultTypes(properties)).to.be.true;
    });
    it('should create a new default instance calling the creator with a JSON Properties Object that contains an error', function(){
        let properties = Properties.create(propertiesJsonObjectError);
        expect(properties).to.not.be.undefined;
        expect(properties).to.be.instanceOf(Properties);
        expect(defaultValues(properties)).to.be.true;
        expect(defaultTypes(properties)).to.be.true;
    });
    it('should create a new instance calling the creator with a JSON Properties Object that is correct', function(){
        let properties = Properties.create(propertiesJsonObject);
        expect(properties).to.not.be.undefined;
        expect(properties).to.be.instanceOf(Properties);
        expect(properties.id).to.equal(propertyId);
        expect(properties.title).to.equal(propertyTitle);
        expect(properties.subtitle).to.equal(propertySubtitle);
        expect(properties.xLabel).to.equal(propertyXLabel);
        expect(properties.yLabel).to.equal(propertyYLabel);
        expect(properties.stackingType).to.equal(propertyStackingType);
        expect(properties.sort).to.equal(propertySort);
        expect(properties.chartType).to.equal(propertyChartType);
        expect(properties.animation).to.equal(propertyAnimation);
        expect(properties.alpha3D).to.equal(propertyAlpha3D);
        expect(properties.beta3D).to.equal(propertyBeta3D);
        expect(properties.depth3D).to.equal(propertyDepth3D);
        expect(properties.percentage).to.equal(propertyPercentage);
        expect(defaultTypes(properties)).to.be.true;
    });
    it('should create a new default instance calling the creator with a JSON Properties String that contains an error', function(){
        let properties = Properties.create(propertiesJsonStringError);
        expect(properties).to.not.be.undefined;
        expect(properties).to.be.instanceOf(Properties);
        expect(defaultValues(properties)).to.be.true;
        expect(defaultTypes(properties)).to.be.true;
    });
    it('should create a new instance calling the creator with a JSON Properties String that is correct', function(){
        let properties = Properties.create(propertiesJsonString);
        expect(properties).to.not.be.undefined;
        expect(properties).to.be.instanceOf(Properties);
        expect(properties.id).to.equal(propertyId);
        expect(properties.title).to.equal(propertyTitle);
        expect(properties.subtitle).to.equal(propertySubtitle);
        expect(properties.dataDrilldown).to.equal(propertyDataDrilldown);
        expect(properties.inexistentProperty).to.be.undefined;
        expect(defaultTypes(properties)).to.be.true;
    });
    it('should create a new instance calling the creator with a Properties Object', function(){
        let p = Properties.create(propertiesJsonObject);
        let pId = p.id;
        let properties = Properties.create(p);
        expect(properties).to.not.be.undefined;
        expect(properties).to.be.instanceOf(Properties);
        expect(properties.id).to.equal(pId);
        expect(properties.title).to.equal(propertyTitle);
        expect(properties.subtitle).to.equal(propertySubtitle);
        expect(properties.inexistentProperty).to.be.undefined;
        expect(defaultTypes(properties)).to.be.true;
        expect(properties).to.eql(p); //deeply equal
        expect(properties).to.not.equal(p); //strickly equal
    });
});

describe('Set Properties', function() {
    it('should allow to set and get individual property: id', function(){
        // Set/get as method
        let properties = new Properties().setId(propertyId);
        expect(properties.getId()).to.be.an("string");
        expect(properties.getId()).to.equal(propertyId);
        
        // Set/get as property
        properties = new Properties();
        properties.id = propertyId;
        expect(properties.id).to.be.an("string");
        expect(properties.id).to.equal(propertyId);
    });
    it('should allow to set and get individual property: title', function(){
        // Set/get as method
        let properties = new Properties().setTitle(propertyTitle);
        expect(properties.getTitle()).to.be.an("string");
        expect(properties.getTitle()).to.equal(propertyTitle);
        
        // Set/get as property
        properties = new Properties();
        expect(properties.title).to.be.undefined;
        properties.title = propertyTitle;
        expect(properties.title).to.be.an("string");
        expect(properties.title).to.equal(propertyTitle);
    });
    it('should allow to set and get individual property: subtitle', function(){
        // Set/get as method
        let properties = new Properties().setSubtitle(propertySubtitle);
        expect(properties.getSubtitle()).to.be.an("string");
        expect(properties.getSubtitle()).to.equal(propertySubtitle);
        
        // Set/get as property
        properties = new Properties();
        expect(properties.subtitle).to.be.undefined;
        properties.subtitle = propertySubtitle;
        expect(properties.subtitle).to.be.an("string");
        expect(properties.subtitle).to.equal(propertySubtitle);
    });
    it('should allow to set and get individual property: xLabel', function(){
        // Set/get as method
        let properties = new Properties().setXLabel(propertyXLabel);
        expect(properties.getXLabel()).to.be.an("string");
        expect(properties.getXLabel()).to.equal(propertyXLabel);
        
        // Set/get as property
        properties = new Properties();
        expect(properties.xLabel).to.be.undefined;
        properties.xLabel = propertyXLabel;
        expect(properties.xLabel).to.be.an("string");
        expect(properties.xLabel).to.equal(propertyXLabel);
    });
    it('should allow to set and get individual property: yLabel', function(){
        // Set/get as method
        let properties = new Properties().setYLabel(propertyYLabel);
        expect(properties.getYLabel()).to.be.an("string");
        expect(properties.getYLabel()).to.equal(propertyYLabel);
        
        // Set/get as property
        properties = new Properties();
        expect(properties.yLabel).to.be.undefined;
        properties.yLabel = propertyYLabel;
        expect(properties.yLabel).to.be.an("string");
        expect(properties.yLabel).to.equal(propertyYLabel);
    });
    it('should allow to set and get individual property: stackingType', function(){
        // Set/get as method
        let properties = new Properties().setStackingType(propertyStackingType);
        expect(properties.getStackingType()).to.be.an("string");
        expect(properties.getStackingType()).to.equal(propertyStackingType);
        
        // Set/get as property
        properties = new Properties();
        expect(properties.stackingType).to.be.undefined;
        properties.stackingType = propertyStackingType;
        expect(properties.stackingType).to.be.an("string");
        expect(properties.stackingType).to.equal(propertyStackingType);
    });
    it('should allow to set and get individual property: sort', function(){
        // Set/get as method
        let properties = new Properties().setSort(propertySort);
        expect(properties.getSort()).to.be.an("boolean");
        expect(properties.getSort()).to.equal(propertySort);
        
        // Set/get as property
        properties = new Properties();
        expect(properties.sort).to.equal(Properties.DEFAULT_SORT);
        properties.sort = propertySort;
        expect(properties.sort).to.be.an("boolean");
        expect(properties.sort).to.equal(propertySort);
    });
    it('should allow to set and get individual property: chartType', function(){
        // Set/get as method
        let properties = new Properties().setChartType(propertyChartType);
        expect(properties.getChartType()).to.be.an("string");
        expect(properties.getChartType()).to.equal(propertyChartType);
        
        // Set/get as property
        properties = new Properties();
        expect(properties.chartType).to.equal(Properties.DEFAULT_CHART_TYPE);
        properties.chartType = propertyChartType;
        expect(properties.chartType).to.be.an("string");
        expect(properties.chartType).to.equal(propertyChartType);
    });
    it('should allow to set and get individual property: animation', function(){
        // Set/get as method
        let properties = new Properties().setAnimation(propertyAnimation);
        expect(properties.getAnimation()).to.be.an("boolean");
        expect(properties.getAnimation()).to.equal(propertyAnimation);
        
        // Set/get as property
        properties = new Properties();
        expect(properties.animation).to.equal(Properties.DEFAULT_ANIMATION);
        properties.animation = propertyAnimation;
        expect(properties.animation).to.be.an("boolean");
        expect(properties.animation).to.equal(propertyAnimation);
    });
    it('should allow to set and get individual property: alpha3D', function(){
        // Set/get as method
        let properties = new Properties().setAlpha3D(propertyAlpha3D);
        expect(properties.getAlpha3D()).to.be.an("number");
        expect(properties.getAlpha3D()).to.equal(propertyAlpha3D);
        
        // Set/get as property
        properties = new Properties();
        expect(properties.alpha3D).to.equal(Properties.DEFAULT_ALPHA_3D);
        properties.alpha3D = propertyAlpha3D;
        expect(properties.alpha3D).to.be.an("number");
        expect(properties.alpha3D).to.equal(propertyAlpha3D);
    });
    it('should allow to set and get individual property: beta3D', function(){
        // Set/get as method
        let properties = new Properties().setBeta3D(propertyBeta3D);
        expect(properties.getBeta3D()).to.be.an("number");
        expect(properties.getBeta3D()).to.equal(propertyBeta3D);
        
        // Set/get as property
        properties = new Properties();
        expect(properties.beta3D).to.equal(Properties.DEFAULT_BETA_3D);
        properties.beta3D = propertyBeta3D;
        expect(properties.beta3D).to.be.an("number");
        expect(properties.beta3D).to.equal(propertyBeta3D);
    });
    it('should allow to set and get individual property: depth3D', function(){
        // Set/get as method
        let properties = new Properties().setDepth3D(propertyDepth3D);
        expect(properties.getDepth3D()).to.be.an("number");
        expect(properties.getDepth3D()).to.equal(propertyDepth3D);
        
        // Set/get as property
        properties = new Properties();
        expect(properties.depth3D).to.equal(Properties.DEFAULT_DEPTH_3D);
        properties.depth3D = propertyDepth3D;
        expect(properties.depth3D).to.be.an("number");
        expect(properties.depth3D).to.equal(propertyDepth3D);
    });
    it('should allow to set and get individual property: percentage', function(){
        let obj = {"setAs":propertyPercentage, "typeof":"boolean", "default": Properties.DEFAULT_PERCENTAGE};
        // Set/get as method
        let properties = new Properties().setPercentage(obj.setAs);
        expect(properties.getPercentage()).to.be.an(obj.typeof);
        expect(properties.getPercentage()).to.equal(obj.setAs);
        
        // Set/get as property
        properties = new Properties();
        expect(properties.percentage).to.equal(obj.default);
        properties.percentage = obj.setAs;
        expect(properties.percentage).to.be.an(obj.typeof);
        expect(properties.percentage).to.equal(obj.setAs);
    });
    it('should allow to set and get individual property: dataType', function(){
        let obj = {"setAs":propertyDatatype, "typeof":"string", "default": undefined};
        // Set/get as method
        let properties = new Properties().setDataType(obj.setAs);
        expect(properties.getDataType()).to.be.an(obj.typeof);
        expect(properties.getDataType()).to.equal(obj.setAs);
        
        // Set/get as property
        properties = new Properties();
        expect(properties.dataType).to.equal(obj.default);
        properties.dataType = obj.setAs;
        expect(properties.dataType).to.be.an(obj.typeof);
        expect(properties.dataType).to.equal(obj.setAs);
    });
    it('should throw an error when setting an unknow dataType value', function(){
        let obj = {"setAs":propertyDatatypeError, "typeof":"string", "default": undefined};
        // Set/get as method
        let properties = new Properties();
        expect(() => properties.setDataType(obj.setAs)).to.throw(TypeError, "An unknown Data Type was set in the properties file: " + obj.setAs);
    });
    it('should allow to set and get individual property: data', function(){
        let obj = {"setAs":{}, "typeof":"object", "default": undefined};
        // Set/get as method
        let properties = new Properties().setData(obj.setAs);
        expect(properties.getData()).to.be.an(obj.typeof);
        expect(properties.getData()).to.equal(obj.setAs);
        
        // Set/get as property
        properties = new Properties();
        expect(properties.data).to.equal(obj.default);
        properties.data = obj.setAs;
        expect(properties.data).to.be.an(obj.typeof);
        expect(properties.data).to.equal(obj.setAs);
    });
    it('should allow to set and get individual property: dataDrilldown', function(){
        let obj = {"setAs": true, "typeof":"boolean", "default": Properties.DEFAULT_DATA_DRILLDOWN};
        // Set/get as method
        let properties = new Properties().setDataDrilldown(obj.setAs);
        expect(properties.getDataDrilldown()).to.be.an(obj.typeof);
        expect(properties.getDataDrilldown()).to.equal(obj.setAs);
        
        // Set/get as property
        properties = new Properties();
        expect(properties.dataDrilldown).to.equal(obj.default);
        properties.dataDrilldown = obj.setAs;
        expect(properties.dataDrilldown).to.be.an(obj.typeof);
        expect(properties.dataDrilldown).to.equal(obj.setAs);
    });
    it('should allow to set properties: data, dataType, dataDrilldown', function(){
        let obj = {"setAsData": propertyData, "setAsDataType": propertyDatatype, "setAsDataDrilldown": propertyDataDrilldown, 
            "typeofData":"object", "typeofDataType":"string", "typeofDataDrilldown":"boolean",
            "defaultData": undefined, "defaultDataType": undefined, "defaultDataDrilldown": Properties.DEFAULT_DATA_DRILLDOWN};
        // Set/get as method
        let properties = new Properties().setData(obj.setAsData, obj.setAsDataType, obj.setAsDataDrilldown);
        expect(properties.getData()).to.be.an(obj.typeofData);
        expect(properties.getData()).to.equal(obj.setAsData);
        expect(properties.getDataType()).to.be.an(obj.typeofDataType);
        expect(properties.getDataType()).to.equal(obj.setAsDataType);
        expect(properties.getDataDrilldown()).to.be.an(obj.typeofDataDrilldown);
        expect(properties.getDataDrilldown()).to.equal(obj.setAsDataDrilldown);
        
        // get as property
        expect(properties.data).to.be.an(obj.typeofData);
        expect(properties.data).to.equal(obj.setAsData);
        expect(properties.dataType).to.be.an(obj.typeofDataType);
        expect(properties.dataType).to.equal(obj.setAsDataType);
        expect(properties.dataDrilldown).to.be.an(obj.typeofDataDrilldown);
        expect(properties.dataDrilldown).to.equal(obj.setAsDataDrilldown);
    });
});
describe('Unsuported undefined Properties', function() {
    it('shouldn\'t allow to set property as undefined: id', function(){
        let obj = {"setAs":undefined, "typeof":"string"};
        // Set/get as method
        let properties = new Properties().setId(obj.setAs);
        expect(properties.getId()).to.be.an(obj.typeof);
        expect(properties.getId()).to.not.equal(obj.setAs);
        
        // Set/get as property
        properties = new Properties();
        expect(properties.id).to.not.be.undefined;
        properties.id = obj.setAs;
        expect(properties.id).to.be.an(obj.typeof);
        expect(properties.id).to.not.equal(obj.setAs);
        
        properties = Properties.create(propertiesJsonObjectWithoutId);
        expect(properties.id).to.not.be.undefined;
        properties = Properties.create(propertiesJsonStringWithoutId);
        expect(properties.id).to.not.be.undefined;
    });
    it('shouldn\'t allow to set property as undefined: dataDrilldown', function(){
        let obj = {"setAs": undefined, "typeof":"boolean", "default": Properties.DEFAULT_DATA_DRILLDOWN};
        // Set/get as method
        let properties = new Properties().setDataDrilldown(obj.setAs);
        expect(properties.getDataDrilldown()).to.be.an(obj.typeof);
        expect(properties.getDataDrilldown()).to.equal(obj.default);
        
        // Set/get as property
        properties = new Properties();
        expect(properties.dataDrilldown).to.equal(obj.default);
        properties.dataDrilldown = obj.setAs;
        expect(properties.dataDrilldown).to.be.an(obj.typeof);
        expect(properties.dataDrilldown).to.equal(obj.default);
    });
    it('shouldn\'t allow to set property as undefined: sort', function(){
        let obj = {"setAs":undefined, "typeof":"boolean", "default": Properties.DEFAULT_SORT};
        // Set/get as method
        let properties = new Properties().setSort(obj.setAs);
        expect(properties.getSort()).to.be.an(obj.typeof);
        expect(properties.getSort()).to.equal(obj.default);
        
        // Set/get as property
        properties = new Properties();
        expect(properties.sort).to.equal(obj.default);
        properties.sort = obj.setAs;
        expect(properties.sort).to.be.an(obj.typeof);
        expect(properties.sort).to.equal(obj.default);
    });
    it('shouldn\'t allow to set property as undefined: chartType', function(){
        let obj = {"setAs":undefined, "typeof":"string", "default": Properties.DEFAULT_CHART_TYPE};
        // Set/get as method
        let properties = new Properties().setChartType(obj.setAs);
        expect(properties.getChartType()).to.be.an(obj.typeof);
        expect(properties.getChartType()).to.equal(obj.default);
        
        // Set/get as property
        properties = new Properties();
        expect(properties.chartType).to.equal(obj.default);
        properties.chartType = obj.setAs;
        expect(properties.chartType).to.be.an(obj.typeof);
        expect(properties.chartType).to.equal(obj.default);
    });
    it('shouldn\'t allow to set property as undefined: animation', function(){
        let obj = {"setAs":undefined, "typeof":"boolean", "default": Properties.DEFAULT_ANIMATION};
        // Set/get as method
        let properties = new Properties().setAnimation(obj.setAs);
        expect(properties.getAnimation()).to.be.an(obj.typeof);
        expect(properties.getAnimation()).to.equal(obj.default);
        
        // Set/get as property
        properties = new Properties();
        expect(properties.animation).to.equal(obj.default);
        properties.animation = obj.setAs;
        expect(properties.animation).to.be.an(obj.typeof);
        expect(properties.animation).to.equal(obj.default);
    });
    it('shouldn\'t allow to set property as undefined: alpha3D', function(){
        let obj = {"setAs":undefined, "typeof":"number", "default": Properties.DEFAULT_ALPHA_3D};
        // Set/get as method
        let properties = new Properties().setAlpha3D(obj.setAs);
        expect(properties.getAlpha3D()).to.be.an(obj.typeof);
        expect(properties.getAlpha3D()).to.equal(obj.default);
        
        // Set/get as property
        properties = new Properties();
        expect(properties.alpha3D).to.equal(obj.default);
        properties.alpha3D = obj.setAs;
        expect(properties.alpha3D).to.be.an(obj.typeof);
        expect(properties.alpha3D).to.equal(obj.default);
    });
    it('shouldn\'t allow to set property as undefined: beta3D', function(){
        let obj = {"setAs":undefined, "typeof":"number", "default": Properties.DEFAULT_BETA_3D};
        // Set/get as method
        let properties = new Properties().setBeta3D(obj.setAs);
        expect(properties.getBeta3D()).to.be.an(obj.typeof);
        expect(properties.getBeta3D()).to.equal(obj.default);
        
        // Set/get as property
        properties = new Properties();
        expect(properties.beta3D).to.equal(obj.default);
        properties.beta3D = obj.setAs;
        expect(properties.beta3D).to.be.an(obj.typeof);
        expect(properties.beta3D).to.equal(obj.default);
    });
    it('shouldn\'t allow to set property as undefined: depth3D', function(){
        let obj = {"setAs":undefined, "typeof":"number", "default": Properties.DEFAULT_DEPTH_3D};
        // Set/get as method
        let properties = new Properties().setDepth3D(obj.setAs);
        expect(properties.getDepth3D()).to.be.an(obj.typeof);
        expect(properties.getDepth3D()).to.equal(obj.default);
        
        // Set/get as property
        properties = new Properties();
        expect(properties.depth3D).to.equal(obj.default);
        properties.depth3D = obj.setAs;
        expect(properties.depth3D).to.be.an(obj.typeof);
        expect(properties.depth3D).to.equal(obj.default);
    });
    it('shouldn\'t allow to set property as undefined: percentage', function(){
        let obj = {"setAs":undefined, "typeof":"boolean", "default": Properties.DEFAULT_PERCENTAGE};
        // Set/get as method
        let properties = new Properties().setPercentage(obj.setAs);
        expect(properties.getPercentage()).to.be.an(obj.typeof);
        expect(properties.getPercentage()).to.equal(obj.default);
        
        // Set/get as property
        properties = new Properties();
        expect(properties.percentage).to.equal(obj.default);
        properties.percentage = obj.setAs;
        expect(properties.percentage).to.be.an(obj.typeof);
        expect(properties.percentage).to.equal(obj.default);
    });

});

describe('Update Properties instances with other Properties', function() {

    it('shouldn\'t throw Error when update properties with undefined', function(){
        let properties = new Properties();
        expect(properties).to.not.be.undefined;
        expect(properties).to.be.instanceOf(Properties);
        let propertiesToUpdate = undefined;
        expect(propertiesToUpdate).to.be.undefined;
        properties.updateWith(propertiesToUpdate);
        expect(defaultValues(properties)).to.be.true;
        expect(defaultTypes(properties)).to.be.true;
    });
    it('shouldn\'t throw Error when update properties with not instance of Properties', function(){
        let properties = new Properties();
        expect(properties).to.not.be.undefined;
        expect(properties).to.be.instanceOf(Properties);
        let propertiesToUpdate = {};
        expect(propertiesToUpdate).to.not.be.undefined;
        properties.updateWith(propertiesToUpdate);
        expect(defaultValues(properties)).to.be.true;
        expect(defaultTypes(properties)).to.be.true;
    });
    it('should update all unchanged properties with id set', function(){
        let properties = new Properties();
        expect(properties).to.not.be.undefined;
        expect(properties).to.be.instanceOf(Properties);
        let propertiesToUpdate = Properties.create(propertiesJsonObjectToUpdate);
        expect(propertiesToUpdate).to.not.be.undefined;
        expect(propertiesToUpdate).to.be.instanceOf(Properties);
        properties.updateWith(propertiesToUpdate);
        
        expect(properties.id).to.not.equal(propertyIdUpdated);
        expect(properties.title).to.equal(propertyTitleUpdated);
        expect(properties.subtitle).to.equal(propertySubtitleUpdated);
        expect(properties.xLabel).to.equal(propertyXLabelUpdated);
        expect(properties.yLabel).to.equal(propertyYLabelUpdated);
        expect(properties.stackingType).to.equal(propertyStackingTypeUpdated);
        expect(properties.sort).to.equal(propertySortUpdated);
        expect(properties.chartType).to.equal(propertyChartTypeUpdated);
        expect(properties.animation).to.equal(propertyAnimationUpdated);
        expect(properties.alpha3D).to.equal(propertyAlpha3DUpdated);
        expect(properties.beta3D).to.equal(propertyBeta3DUpdated);
        expect(properties.depth3D).to.equal(propertyDepth3DUpdated);
        expect(properties.percentage).to.equal(propertyPercentageUpdated);
        expect(defaultTypes(properties)).to.be.true;
    });
    it('should never update id property even if not directly defined', function(){
        let properties = Properties.create(propertiesJsonObjectWithoutId);
        expect(properties).to.not.be.undefined;
        expect(properties).to.be.instanceOf(Properties);

        let propertiesToUpdate = Properties.create(propertiesJsonObjectToUpdate);
        expect(propertiesToUpdate).to.not.be.undefined;
        expect(propertiesToUpdate).to.be.instanceOf(Properties);
        properties.updateWith(propertiesToUpdate);
        expect(properties.id).to.not.equal(propertyIdUpdated);
        
        properties = Properties.create(propertiesJsonObject);
        expect(properties).to.not.be.undefined;
        expect(properties).to.be.instanceOf(Properties);
        properties.updateWith(propertiesToUpdate);
        expect(properties.id).to.equal(propertyId);
    });
    it('shouldn\'t update existing \"user defined\" properties', function(){
        let properties = Properties.create(propertiesJsonObject);
        expect(properties).to.not.be.undefined;
        expect(properties).to.be.instanceOf(Properties);
        let propertiesToUpdate = Properties.create(propertiesJsonObjectToUpdate);
        expect(propertiesToUpdate).to.not.be.undefined;
        expect(propertiesToUpdate).to.be.instanceOf(Properties);
        properties.updateWith(propertiesToUpdate);
        expect(properties.id).to.equal(propertyId);
        expect(properties.title).to.equal(propertyTitle);
        expect(properties.subtitle).to.equal(propertySubtitle);
        expect(properties.xLabel).to.equal(propertyXLabel);
        expect(properties.yLabel).to.equal(propertyYLabel);
        expect(properties.stackingType).to.equal(propertyStackingType);
        expect(properties.sort).to.equal(propertySort);
        expect(properties.chartType).to.equal(propertyChartType);
        expect(properties.animation).to.equal(propertyAnimation);
        expect(properties.alpha3D).to.equal(propertyAlpha3D);
        expect(properties.beta3D).to.equal(propertyBeta3D);
        expect(properties.depth3D).to.equal(propertyDepth3D);
        expect(properties.percentage).to.equal(propertyPercentage);
        expect(defaultTypes(properties)).to.be.true;
    });
});