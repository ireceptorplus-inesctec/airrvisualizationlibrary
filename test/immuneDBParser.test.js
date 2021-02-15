import { ImmuneDBStatsParserConstants, ImmuneDBGeneTopCountStatsParser } from '../src/immuneDBParser.js';
import {Properties} from '../src/properties.js'
import { expect, fs } from './common.js';



describe('ImmuneDBStatsParserConstants', function(){
    it('Should return valid constants', function(){
        expect(ImmuneDBStatsParserConstants.INFO).to.be.a('string');
        expect(ImmuneDBStatsParserConstants.MESSAGE).to.be.a('string');
        expect(ImmuneDBStatsParserConstants.STATISTICS).to.be.a('string');
        expect(ImmuneDBStatsParserConstants.STATISTICS_NAME).to.be.a('string');
        expect(ImmuneDBStatsParserConstants.REPERTOIRES).to.be.a('string');
        expect(ImmuneDBStatsParserConstants.REPERTOIRE_ID).to.be.a('string');
        expect(ImmuneDBStatsParserConstants.SAMPLE_PROCESSING_ID).to.be.a('string');
        expect(ImmuneDBStatsParserConstants.DATA_PROCESSING_ID).to.be.a('string');
        expect(ImmuneDBStatsParserConstants.TOTAL).to.be.a('string');
        expect(ImmuneDBStatsParserConstants.DATA).to.be.a('string');
        expect(ImmuneDBStatsParserConstants.KEY).to.be.a('string');
        expect(ImmuneDBStatsParserConstants.VALUE).to.be.a('string');
        expect(ImmuneDBStatsParserConstants.POSTFIX_FAMILY).to.be.a('string');
        expect(ImmuneDBStatsParserConstants.POSTFIX_GENE).to.be.a('string');
        expect(ImmuneDBStatsParserConstants.POSTFIX_CALL).to.be.a('string');
        expect(ImmuneDBStatsParserConstants.SPLITER_GENE).to.be.a('string');
        expect(ImmuneDBStatsParserConstants.SPLITER_CALL).to.be.a('string');
        expect(ImmuneDBStatsParserConstants.STUDY_ID).to.be.a('string');
        expect(ImmuneDBStatsParserConstants.SUBJECT_ID).to.be.a('string');
    });

});

describe('ImmuneDBGeneTopCountStatsParser', function() {
    let properties = new Properties();
    let parser = undefined;
    before(function() {
        parser = new ImmuneDBGeneTopCountStatsParser();
        fs.readFile('test/data/immundeDB-TopClones.json', 'utf8', (err, data) => {
            if (err){
                console.log(err.message);
                throw err;
            } 
            properties.setData(data);
        });
    });
    
    it('Should return instance of GeneTopCountStatsParser', function(){
        expect(parser).to.be.instanceOf(ImmuneDBGeneTopCountStatsParser);
    });
    it('Should have empty series', function(){
        expect(parser.series).to.be.instanceOf(Array);
        expect(parser.series.length).to.equal(0);
    });
    it('Should be single series', function(){
        expect(parser.multipleSeries).to.be.false;
        expect(parser.isMultipleSeries()).to.false;
    });
    it('Shouldn\'t throw error on preparsing', function(){
        expect(() => parser.preparse(properties)).to.not.throw(Error);
    });
    it('Shouldn\'t throw error on parsing', function(){
        expect(() => parser.onparse(properties)).to.not.throw(Error);
    });
    it('Shouldn\'t throw error on postparsing', function(){
        expect(() => parser.postparse(properties)).to.not.throw(Error);
    });
    it('Shouldn\'t throw error on parsing', function(){
        console.log(JSON.stringify(parser.getSeries()));
        expect(true).to.be.true;
    });
    
});