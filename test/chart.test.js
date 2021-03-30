import { Chart, HighchartsChart, HighchartsCategories } from '../src/charts.js';
import { DataType } from '../src/index.js';
import { Properties } from '../src/properties.js';
import { expect } from './common.js';
import { DummyResultClass } from './result.test.js';

class ErrorDummyChartClass extends Chart{
    constructor(properties){
        super(properties);
    }
}

class AnotherErrorDummyChartClass extends Chart{
    constructor(properties){
        super(properties);
    }
    
    plot(){
        return super.plot();
    }
    
}

class DummyChartClass extends Chart{
    constructor(properties){
        super(properties);
    }
    
    plot(){
        return;
    }
}


describe('Abstract Class Chart basic structure', function() {
    it('should throw Error when instanciating Chart directly', function(){
        expect(() => new Chart()).to.throw(Error);
    });
    it('Should throw Error when abstract method are not implemented', function(){
        let p = new Properties();
        expect(() => new ErrorDummyChartClass(p)).to.throw(Error);
    });
    it('Should throw Error when abstract methods are called from subclass', function(){
        let p = new Properties().setDataType(DataType.V_GENE_USAGE);
        let c = new AnotherErrorDummyChartClass(p);
        expect(() => c.plot()).to.throw(TypeError);
    });
    it('Correct instances of Chart subclasses Should not be null', function(){
        let p = new Properties().setDataType(DataType.V_GENE_USAGE);
        let c = new DummyChartClass(p);
        expect(c).to.exist;
        expect(c).to.be.an('object');
        expect(c).to.be.instanceOf(Chart);
        expect(c).to.be.instanceOf(DummyChartClass);
        expect(c.id).to.be.a('string');
        expect(c.id).to.be.equal(p.id);
        expect(() => c.properties={}).to.throw(TypeError);
        expect(() => c.setProperties({})).to.throw(TypeError);
        expect(() => c.setProperties(undefined)).to.throw(TypeError);
        expect(c.properties).to.be.eql(p);
        expect(c.result).to.not.be.undefined;
        //expect(() => c.result = {}).to.throw(TypeError);
        //expect(() => c.result = undefined).to.throw(TypeError);
        //expect(() => c.setResult(undefined)).to.throw(TypeError);
        //let r = new DummyResultClass();
        //expect(() => c.setResult(r)).to.not.throw(TypeError);
        //expect(c.result).to.be.eql(r);
        expect(() => c.plot()).to.not.throw(TypeError);
    });
});

describe('Highcharts Categories structure', function() {
    let  c = new HighchartsCategories();
    it('should create a valid structure', function(){
        expect(c).to.exist;
        expect(c).to.be.an('object');
        expect(c).to.be.instanceOf(HighchartsCategories);
    });
    it('Should return an empty array', function(){
        expect(c.categories).to.be.an('array');
        expect(c.categories).to.be.eql([]);
    });
    it('Should return TypeError when adding an empty category', function(){
        expect(() => c.getIndex()).to.throw(TypeError);
    });
    it('Should return the correct index after requesting an inexistent value', function(){
        expect(c.getIndex('I1')).to.be.equal(0);
        expect(c.getIndex('I2')).to.be.equal(1);
        expect(c.getIndex('I3')).to.be.equal(2);
    });
    it('Should return the correct index on requesting an existent value', function(){
        expect(c.getIndex('I1')).to.be.equal(0);
        expect(c.getIndex('I2')).to.be.equal(1);
        expect(c.getIndex('I3')).to.be.equal(2);
    });
    it('Should return an ordered array with all the existent categories', function(){
        expect(c.categories).to.be.eql(['I1','I2','I3']);
    });
});

