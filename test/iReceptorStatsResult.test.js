import { CountStatsParser } from '../src/iReceptorStatsParser.js';
import { StatsResult, CountStatsResult } from '../src/iReceptorStatsResult.js';
import { expect } from './common.js';



describe('StatsResult', function(){
    it('should throw Error when instanciating StatsResult directly', function(){
        expect(() => new StatsResult()).to.throw(Error);
    });
});
describe('CountStatsResult', function(){
    it('should not throw Error when instanciating CountStatsResult', function(){
        expect(() => new CountStatsResult()).to.not.throw(Error);
    });
    it('Default values for instances of CountStatsResult', function(){
        let r = new CountStatsResult();
        expect(r).to.exist;
        expect(r).to.be.an('object');
        expect(r).to.be.instanceOf(CountStatsResult);
        expect(r.multipleSeries).to.be.a('boolean');
        expect(r.data).to.be.undefined;
        expect(r.parser).to.not.be.undefined;
        expect(r.properties.title).to.be.equal(CountStatsResult.TITLE);
        expect(r.properties.subtitle).to.be.undefined;
        expect(r.properties.yLabel).to.be.equal(CountStatsResult.Y_LABEL);
    });
});


