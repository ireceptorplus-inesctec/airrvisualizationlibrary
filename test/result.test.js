import { Result } from '../src/result.js';
import { DummyParserClass } from './parser.test.js';

import { expect } from './common.js';
import { Properties } from '../src/index.js';

let DummyResultClassPropertiesTitle = "My DummyResultClass Title";

class DummyResultClass extends Result{
    constructor(sourceData = undefined){
        super(sourceData);
        this.properties.setTitle(DummyResultClassPropertiesTitle);
    }

    isMultipleSeries(){
        return false;
    }

    update(properties){
        this.setParser(new DummyParserClass());
        return this;
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

    update(properties){
        return super.update(properties);
    }

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
        expect(() => r.update(new Properties())).to.throw(TypeError);
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
        expect(r.series).to.be.undefined;
        let p = new DummyParserClass();
        expect(() => r.parser=p).to.not.throw(Error);
        expect(r.parser).to.eql(p);
        expect(r.series).to.be.undefined;
        expect(() => r.parse(new Properties())).to.not.throw(Error);
        expect(r.series).to.be.equal(["A"]);
        expect(r.drilldown).to.be.equal(false);
        expect(() => r.drilldown={}).to.throw(TypeError);
        expect(() => r.drilldown=true).to.not.throw(TypeError);
        expect(r.drilldown).to.be.equal(true);
        expect(r.properties.title).to.be.equal(DummyResultClassPropertiesTitle);
    });
});

export {DummyResultClass}