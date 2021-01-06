import { VisualizationLibrary, ResultFactory, Result, DataType } from '../src/index.js';
import { Properties } from '../src/properties.js'
import { Chart } from '../src/charts.js';
import { expect } from './common.js';

/*
describe('first test', function() {
    it('Should work', function(){
        expect(true).to.be.true;
    });

});
*/
describe('VisualizationLibrary basic structure', function() {
    let vis = undefined;
    let winvis = undefined;
    let testChartId = "testChartId123";
    let testProperties = undefined;
    before(function() {
        //console.log("Running before");
        vis = VisualizationLibrary;
        winvis = window.airrvisualization;
    });
    it('should throw Error when instanciating VisualizationLibrary', function(){
        //expect(undefined).to.be.undefined;
        expect(() => new VisualizationLibrary()).to.throw(Error);
    });
    it('VisualizationLibrary should not be null', function(){
        expect(vis).to.exist;
    });
    it('window.airrvisualization should not be null', function(){
        expect(winvis).to.exist;
        expect(winvis.charts).to.be.an('object');
        //expect(winvis).to.be.an('object');
        //expect(winvis).to.be.instanceOf(VisualizationLibrary);
    });
    it('should return the version as a String', function(){
        expect(vis.VERSION).to.be.a('string');
        expect(winvis.VERSION).to.be.a('string');
        expect(winvis.VERSION).to.equal(vis.VERSION);
    });
    it('should return the product name as a String', function(){
        expect(vis.PRODUCT).to.be.a('string');
        expect(winvis.PRODUCT).to.be.a('string');
        expect(winvis.PRODUCT).to.equal(vis.PRODUCT);
    });
    it('should create a Properties: no parameter', function(){
        let pVis = vis.createProperties().setId(testChartId);
        let pWinvis = winvis.createProperties();
        expect(pVis).to.not.be.undefined;
        expect(pWinvis).to.not.be.undefined;
        expect(pVis).to.be.an('object');
        expect(pWinvis).to.be.an('object');
        expect(pVis).to.be.instanceOf(Properties);
        expect(pWinvis).to.be.instanceOf(Properties);
    });
    it('should create a Properties: Properties parameter', function(){
        let p = new Properties();
        let pVis = vis.createProperties(p);
        let pWinvis = winvis.createProperties(p);
        expect(pVis).to.not.be.undefined;
        expect(pWinvis).to.not.be.undefined;
        expect(pVis).to.be.an('object');
        expect(pWinvis).to.be.an('object');
        expect(pVis).to.be.instanceOf(Properties);
        expect(pWinvis).to.be.instanceOf(Properties);
    });
    it('should create a Properties: JSON parameter', function(){
        let p = {"id":testChartId};
        let pVis = vis.createProperties(p);
        let pWinvis = winvis.createProperties(p);
        expect(pVis).to.not.be.undefined;
        expect(pWinvis).to.not.be.undefined;
        expect(pVis).to.be.an('object');
        expect(pWinvis).to.be.an('object');
        expect(pVis).to.be.instanceOf(Properties);
        expect(pWinvis).to.be.instanceOf(Properties);
    });
    it('should create a Properties: String parameter', function(){
        let p = "{\"id\":\"" + testChartId + "\"}";
        let pVis = vis.createProperties(p);
        let pWinvis = winvis.createProperties(p);
        expect(pVis).to.not.be.undefined;
        expect(pWinvis).to.not.be.undefined;
        expect(pVis).to.be.an('object');
        expect(pWinvis).to.be.an('object');
        expect(pVis).to.be.instanceOf(Properties);
        expect(pWinvis).to.be.instanceOf(Properties);
    });
    it('should return an empty dictionary when no charts created', function(){
        expect(vis.charts).to.eql({});
        expect(winvis.charts).to.eql({});
    });
    it('should throw a TypeError when attempting to create a Chart with an undefined properties', function(){
        expect(() => vis.createChart()).to.throw(TypeError, "properties parameter is mandatory.");
        expect(() => winvis.createChart()).to.throw(TypeError, "properties parameter is mandatory.");
    });
    it('should throw TypeError if creating a Chart passing properties with unset dataType', function(){
        let pVis = vis.createProperties().setId(testChartId);
        expect(() => vis.createChart(pVis)).to.throw(TypeError);
        expect(() => winvis.createChart(pVis)).to.throw(TypeError);
    });
    it('should create a Chart passing properties', function(){
        let pVis = vis.createProperties().setId(testChartId).setDataType(DataType.V_GENE_USAGE);
        let cVis = vis.createChart(pVis);
        let cWinvis = winvis.createChart(pVis);
        expect(cVis).to.not.be.undefined;
        expect(cWinvis).to.not.be.undefined;
        expect(cVis).to.be.an('object');
        expect(cWinvis).to.be.an('object');
        expect(cVis).to.be.instanceOf(Chart);
        expect(cWinvis).to.be.instanceOf(Chart);
    });
    it('should return undefined when getting a chart by its id that do not exists', function(){
        expect(vis.get("123")).to.be.undefined;
        expect(winvis.get("123")).to.be.undefined;
    });
    it('should return a chart when getting a chart by its id', function(){
        let cVis = vis.get(testChartId);
        let cWinvis = winvis.get(testChartId);
        expect(cVis).to.not.be.undefined;
        expect(cWinvis).to.not.be.undefined;
        expect(cVis).to.be.instanceOf(Chart);
        expect(cWinvis).to.be.instanceOf(Chart);
    });
    it('shouldn\'t reuse a chart whose id already exists', function(){
        let pVis = vis.createProperties().setId(testChartId).setDataType(DataType.V_GENE_USAGE);
        let ceVis = vis.get(testChartId);
        let ceWinvis = winvis.get(testChartId);
        let cVis = vis.createChart(pVis);
        let cWinvis = winvis.createChart(pVis);
        expect(cVis).to.eql(ceVis);
        expect(cWinvis).to.eql(ceWinvis);
        expect(cVis).to.not.equal(ceVis);
        expect(cWinvis).to.not.equal(ceWinvis);
    });

});

describe('ResultFactory basic structure', function() {
    it('Should throw TypeError if dataType is unknown', function(){
        let datatypeCode = 'inexistentDataType'
        //expect(undefined).to.be.undefined;
        expect(() => new ResultFactory.build(datatypeCode)).to.throw(TypeError, 'Unknown datatype: '+ datatypeCode);
    });
    it('Should return instance of Result if datatype in known', function(){
        expect(ResultFactory.build(DataType.V_GENE_USAGE)).to.be.instanceOf(Result);
    });


});