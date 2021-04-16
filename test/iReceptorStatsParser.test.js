import {StatsParserConstants} from '../src/iReceptorStatsParser.js';
import {expect, fs} from './common.js';

describe('StatsParserConstants', function () {
  it('Should return valid constants', function () {
    expect(StatsParserConstants.INFO).to.be.a('string');
    expect(StatsParserConstants.MESSAGE).to.be.a('string');
    expect(StatsParserConstants.STATISTICS).to.be.a('string');
    expect(StatsParserConstants.STATISTICS_NAME).to.be.a('string');
    expect(StatsParserConstants.REPERTOIRES).to.be.a('string');
    expect(StatsParserConstants.REPERTOIRE_ID).to.be.a('string');
    expect(StatsParserConstants.SAMPLE_PROCESSING_ID).to.be.a('string');
    expect(StatsParserConstants.DATA_PROCESSING_ID).to.be.a('string');
    expect(StatsParserConstants.TOTAL).to.be.a('string');
    expect(StatsParserConstants.DATA).to.be.a('string');
    expect(StatsParserConstants.KEY).to.be.a('string');
    expect(StatsParserConstants.VALUE).to.be.a('string');
    expect(StatsParserConstants.POSTFIX_FAMILY).to.be.a('string');
    expect(StatsParserConstants.POSTFIX_GENE).to.be.a('string');
    expect(StatsParserConstants.POSTFIX_CALL).to.be.a('string');
    expect(StatsParserConstants.SPLITER_GENE).to.be.a('string');
    expect(StatsParserConstants.SPLITER_CALL).to.be.a('string');
  });
});

/*
describe('GeneUsageDrilldownStatsParser', function() {
    let inputs = undefined;
    before(function() {
        fs.readFile('test/data/ighv2_multiple-repertoire_drilldown.json', 'utf8', (err, data) => {
            if (err){
                console.log(err.message);
                throw err;
            } 
            inputs = data;
            //inputs = new Map(eval(data));
            //done();
        });
    });
    
    it('Should build ', function(){
        let datatypeCode = 'inexistentDataType'
        //expect(undefined).to.be.undefined;
        expect(() => new ResultFactory.build(datatypeCode)).to.throw(TypeError, 'Unknown datatype: '+ datatypeCode);
    });
    it('Should return instance of Result if datatype in known', function(){
        if (inputs == undefined) expect.fail;
        let r = ResultFactory.build(DataType.V_GENE_USAGE, true);
        expect(r).to.be.instanceOf(Result);
        expect(r.drilldown).to.be.true;
        r = ResultFactory.build(DataType.D_GENE_USAGE, true, inputs);
        expect(r).to.be.instanceOf(Result);
        expect(r.drilldown).to.be.true;
        expect(r.data).to.equal(inputs);
        expect(ResultFactory.build(DataType.J_GENE_USAGE)).to.be.instanceOf(Result);
        expect(ResultFactory.build(DataType.C_GENE_USAGE)).to.be.instanceOf(Result);
        expect(ResultFactory.build(DataType.JUNCTION_LENGTH)).to.be.instanceOf(Result);
        expect(ResultFactory.build(DataType.CLONE_COUNT)).to.be.instanceOf(Result);
        expect(ResultFactory.build(DataType.CLONE_COUNT_IMMUNEDB)).to.be.instanceOf(Result);
    });
    
});
*/
