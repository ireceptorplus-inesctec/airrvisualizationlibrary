import { VisualizationLibrary } from '../src/index';
import {expect} from './common';

describe('first test', function() {
    it('Should work', function(){
        expect(true).to.be.true;
    });

});

describe('VisualizationLibrary', function() {
    let vis = undefined;
    before(function() {
        vis = new VisualizationLibrary();
    });
    it('should not be null', function(){
        expect(true).to.be.true;
    });
    it('should return the version', function(){
        expect(true).to.be.true;
    });

});