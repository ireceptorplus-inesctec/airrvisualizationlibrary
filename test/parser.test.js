import {DrilldownParser, Parser} from '../src/parser.js';
import {expect} from './common.js';

class ErrorDummyParserClass extends Parser {
  constructor() {
    super();
  }
}

class AnotherErrorDummyParserClass extends Parser {
  #_series;
  constructor() {
    super();
  }
  getSeries() {
    return super.getSeries();
  }
  preparse(properties) {
    return super.preparse(properties);
  }
  onparse(properties) {
    return super.onparse(properties);
  }
  postparse(properties) {
    return super.postparse(properties);
  }
}

class DummyParserClass extends Parser {
  #_series;
  constructor() {
    super();
    this.#_series = undefined;
  }
  getSeries() {
    return this.#_series;
  }
  preparse(properties) {}
  onparse(properties) {}
  postparse(properties) {
    this.#_series = ['A'];
  }
}

class DummyDrilldownParserClass extends DrilldownParser {
  #_series;
  constructor() {
    super();
  }
  getSeries() {
    return this.#_series;
  }
  preparse(properties) {}
  onparse(properties) {}
  postparse(properties) {
    this.#_series = ['A'];
  }
}

describe('Abstract Class Parser basic structure', function () {
  it('should throw Error when instanciating Parser directly', function () {
    expect(() => new Parser()).to.throw(Error);
  });
  it('Should throw Error when abstract method are not implemented', function () {
    expect(() => new ErrorDummyParserClass()).to.throw(Error);
  });
  it('Should throw Error when abstract methods are called from subclass', function () {
    let c = new AnotherErrorDummyParserClass();
    expect(() => c.preparse()).to.throw(TypeError);
    expect(() => c.onparse()).to.throw(TypeError);
    expect(() => c.postparse()).to.throw(TypeError);
  });
  it('Correct instances of Parser subclasses Should not be null', function () {
    let c = new DummyParserClass();
    expect(c).to.exist;
    expect(c).to.be.an('object');
    expect(c).to.be.instanceOf(Parser);
    expect(c).to.be.instanceOf(DummyParserClass);
    expect(c.series).to.be.undefined;
    expect(c.getSeries()).to.be.undefined;
  });
});

describe('Abstract Class DrilldownParser basic structure', function () {
  it('should throw Error when instanciating DrilldownParser directly', function () {
    expect(() => new DrilldownParser()).to.throw(Error);
  });
  it('Correct instances of Chart subclasses Should not be null', function () {
    let c = new DummyDrilldownParserClass();
    expect(c).to.exist;
    expect(c).to.be.an('object');
    expect(c).to.be.instanceOf(Parser);
    expect(c).to.be.instanceOf(DrilldownParser);
    expect(c).to.be.instanceOf(DummyDrilldownParserClass);
    expect(c.drilldownSeries).to.be.an('array');
    expect(c.getDrilldownSeries()).to.not.be.undefined;
  });
});

export {DummyParserClass};
