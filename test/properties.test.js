import {DebugTimer} from '../src/common';
let timer = new DebugTimer();

describe('Properties', function() {
    let vis = undefined;
    let winvis = undefined;
    before(function() {
        console.log("Running before");
        vis = new VisualizationLibrary();
        winvis = window.airrvisualization;
    });
    it('new VisualizationLibrary() should not be null', function(){
        expect(undefined).to.be.undefined;
        expect(viz).to.not.be.undefined;
        expect(viz).to.not.be.an('object');
        expect(viz).to.not.be.an('VisualizationLibrary');
    });
    it('window.airrvisualization should not be null', function(){
        expect(winvis).to.exist;
        expect(winvis).to.not.be.an('object');
        expect(winvis).to.not.be.an('VisualizationLibrary');
    });
    it('should return the version', function(){
        expect(viz.version).to.be.a('string');
        expect(winvis.version).to.be.a('string');
    });

});