import { Result } from '../src/result.js';
import { Parser } from '../src/parser.js';
import { expect } from './common.js';

class DummyResultClass extends Result{
    constructor(sourceData = undefined){
        super(sourceData);
    }

    isMultipleSeries(){
        return false;
    }
}

class ErrorDummyResultClass extends Result{
    constructor(sourceData = undefined){
        super(sourceData);
    }
}

class AnotherErrorDummyResultClass extends Result{
    constructor(sourceData = undefined){
        super(sourceData);
    }

    isMultipleSeries(){
        return super.isMultipleSeries();
    }

}

class DummyParserClass extends Parser{
    
    constructor(){
        super();
        this.run = false
    }

    preparse(){}
    onparse(){}
    postparse(){this.run = true;}
}

describe('Abstract Class Result basic structure', function() {
    it('should throw Error when instanciating Result directly', function(){
        expect(() => new Result()).to.throw(Error);
    });
    it('Should throw Error when abstract method are not implemented', function(){
        expect(() => new ErrorDummyResultClass()).to.throw(TypeError);
    });
    it('Should throw Error when abstract method are called from subclass', function(){
        let r = new AnotherErrorDummyResultClass();
        expect(() => r.isMultipleSeries()).to.throw(TypeError);
    });
    it('Correct instances of Result subclasses Should not be null', function(){
        let r = new DummyResultClass();
        expect(r).to.exist;
        expect(r).to.be.an('object');
        expect(r).to.be.instanceOf(Result);
        expect(r).to.be.instanceOf(DummyResultClass);
        expect(r.multipleSeries).to.be.a('boolean');
        expect(r.data).to.be.undefined;
        expect(r.parser).to.be.undefined;
        expect(() => r.parser={}).to.throw(TypeError);
        let p = new DummyParserClass();
        expect(() => r.parser=p).to.not.throw(Error);
        expect(r.parser).to.eql(p);
        expect(p.run).to.be.equal(false);
        expect(() => r.data={}).to.not.throw(Error);
        expect(p.run).to.be.equal(true);
        expect(r.drilldown).to.be.equal(false);
        expect(() => r.drilldown={}).to.throw(TypeError);
        expect(() => r.drilldown=true).to.not.throw(TypeError);
        expect(r.drilldown).to.be.equal(true);


    });

});