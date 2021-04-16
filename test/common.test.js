import {DebugTimer, ResultSeriesType} from '../src/common.js';
import {expect} from './common.js';

/*
let timer = new DebugTimer();

(async () => {
	timer.start('Loading file');
	// Let's pretend we are doing some work here:
	await delay(500);
	timer.end('Loading file');	

	timer.start('Processing data');
	await delay(850);
	timer.end('Processing data');
	
	// Let's see the results!
	timer.print();
})();

async function delay(ms) {
	await new Promise(resolve => setTimeout(resolve, ms));
}
*/
let variableNames = [
  'v_call_unique',
  'd_call_unique',
  'j_call_unique',
  'c_call_unique',
  'v_call_unique_productive',
  'd_call_unique_productive',
  'j_call_unique_productive',
  'c_call_unique_productive',
  'v_call_exists',
  'd_call_exists',
  'j_call_exists',
  'c_call_exists',
  'v_call_exists_productive',
  'd_call_exists_productive',
  'j_call_exists_productive',
  'c_call_exists_productive',
  'v_gene_unique',
  'd_gene_unique',
  'j_gene_unique',
  'c_gene_unique',
  'v_gene_unique_productive',
  'd_gene_unique_productive',
  'j_gene_unique_productive',
  'c_gene_unique_productive',
  'v_gene_exists',
  'd_gene_exists',
  'j_gene_exists',
  'c_gene_exists',
  'v_gene_exists_productive',
  'd_gene_exists_productive',
  'j_gene_exists_productive',
  'c_gene_exists_productive',
  'v_subgroup_unique',
  'd_subgroup_unique',
  'j_subgroup_unique',
  'c_subgroup_unique',
  'v_subgroup_unique_productive',
  'd_subgroup_unique_productive',
  'j_subgroup_unique_productive',
  'c_subgroup_unique_productive',
  'v_subgroup_exists',
  'd_subgroup_exists',
  'j_subgroup_exists',
  'c_subgroup_exists',
  'v_subgroup_exists_productive',
  'd_subgroup_exists_productive',
  'j_subgroup_exists_productive',
  'c_subgroup_exists_productive',
  'top_clones',
  'junction_length',
  'junction_length_productive',
  'junction_aa_length',
  'junction_aa_length_productive',
  'rearrangement_count',
  'rearrangement_count_productive',
  'duplicate_count',
  'duplicate_count_productive',
];
let variableNamesDuplicate = ['duplicate_count', 'duplicate_count_productive'];
let variableNamesRearrangement = ['rearrangement_count', 'rearrangement_count_productive'];
let variableNamesGeneCount = ['rearrangement_count', 'rearrangement_count_productive', 'duplicate_count', 'duplicate_count_productive'];
let variableNamesJunctionAALength = ['junction_aa_length', 'junction_aa_length_productive'];
let variableNamesJunctionLength = ['junction_length', 'junction_length_productive'];
let variableNamesTopClones = ['top_clones'];
let variableNamesSubgroup = [
  'v_subgroup_unique',
  'd_subgroup_unique',
  'j_subgroup_unique',
  'c_subgroup_unique',
  'v_subgroup_unique_productive',
  'd_subgroup_unique_productive',
  'j_subgroup_unique_productive',
  'c_subgroup_unique_productive',
  'v_subgroup_exists',
  'd_subgroup_exists',
  'j_subgroup_exists',
  'c_subgroup_exists',
  'v_subgroup_exists_productive',
  'd_subgroup_exists_productive',
  'j_subgroup_exists_productive',
  'c_subgroup_exists_productive',
];
let variableNamesGene = [
  'v_gene_unique',
  'd_gene_unique',
  'j_gene_unique',
  'c_gene_unique',
  'v_gene_unique_productive',
  'd_gene_unique_productive',
  'j_gene_unique_productive',
  'c_gene_unique_productive',
  'v_gene_exists',
  'd_gene_exists',
  'j_gene_exists',
  'c_gene_exists',
  'v_gene_exists_productive',
  'd_gene_exists_productive',
  'j_gene_exists_productive',
  'c_gene_exists_productive',
];
let variableNamesCall = [
  'v_call_unique',
  'd_call_unique',
  'j_call_unique',
  'c_call_unique',
  'v_call_unique_productive',
  'd_call_unique_productive',
  'j_call_unique_productive',
  'c_call_unique_productive',
  'v_call_exists',
  'd_call_exists',
  'j_call_exists',
  'c_call_exists',
  'v_call_exists_productive',
  'd_call_exists_productive',
  'j_call_exists_productive',
  'c_call_exists_productive',
];
let variableNamesNotProductive = [
  'v_call_unique',
  'd_call_unique',
  'j_call_unique',
  'c_call_unique',
  'v_call_exists',
  'd_call_exists',
  'j_call_exists',
  'c_call_exists',
  'v_gene_unique',
  'd_gene_unique',
  'j_gene_unique',
  'c_gene_unique',
  'v_gene_exists',
  'd_gene_exists',
  'j_gene_exists',
  'c_gene_exists',
  'v_subgroup_unique',
  'd_subgroup_unique',
  'j_subgroup_unique',
  'c_subgroup_unique',
  'v_subgroup_exists',
  'd_subgroup_exists',
  'j_subgroup_exists',
  'c_subgroup_exists',
  'top_clones',
  'junction_length',
  'junction_aa_length',
  'rearrangement_count',
  'duplicate_count',
];
let variableNamesProductive = [
  'v_call_unique_productive',
  'd_call_unique_productive',
  'j_call_unique_productive',
  'c_call_unique_productive',
  'v_call_exists_productive',
  'd_call_exists_productive',
  'j_call_exists_productive',
  'c_call_exists_productive',
  'v_gene_unique_productive',
  'd_gene_unique_productive',
  'j_gene_unique_productive',
  'c_gene_unique_productive',
  'v_gene_exists_productive',
  'd_gene_exists_productive',
  'j_gene_exists_productive',
  'c_gene_exists_productive',
  'v_subgroup_unique_productive',
  'd_subgroup_unique_productive',
  'j_subgroup_unique_productive',
  'c_subgroup_unique_productive',
  'v_subgroup_exists_productive',
  'd_subgroup_exists_productive',
  'j_subgroup_exists_productive',
  'c_subgroup_exists_productive',
  'junction_length_productive',
  'junction_aa_length_productive',
  'rearrangement_count_productive',
  'duplicate_count_productive',
];
let variableNamesExists = [
  'v_call_exists',
  'd_call_exists',
  'j_call_exists',
  'c_call_exists',
  'v_call_exists_productive',
  'd_call_exists_productive',
  'j_call_exists_productive',
  'c_call_exists_productive',
  'v_gene_exists',
  'd_gene_exists',
  'j_gene_exists',
  'c_gene_exists',
  'v_gene_exists_productive',
  'd_gene_exists_productive',
  'j_gene_exists_productive',
  'c_gene_exists_productive',
  'v_subgroup_exists',
  'd_subgroup_exists',
  'j_subgroup_exists',
  'c_subgroup_exists',
  'v_subgroup_exists_productive',
  'd_subgroup_exists_productive',
  'j_subgroup_exists_productive',
  'c_subgroup_exists_productive',
];
let variableNamesUnique = [
  'v_call_unique',
  'd_call_unique',
  'j_call_unique',
  'c_call_unique',
  'v_call_unique_productive',
  'd_call_unique_productive',
  'j_call_unique_productive',
  'c_call_unique_productive',
  'v_gene_unique',
  'd_gene_unique',
  'j_gene_unique',
  'c_gene_unique',
  'v_gene_unique_productive',
  'd_gene_unique_productive',
  'j_gene_unique_productive',
  'c_gene_unique_productive',
  'v_subgroup_unique',
  'd_subgroup_unique',
  'j_subgroup_unique',
  'c_subgroup_unique',
  'v_subgroup_unique_productive',
  'd_subgroup_unique_productive',
  'j_subgroup_unique_productive',
  'c_subgroup_unique_productive',
];
let unkownVariableName = 'unknownVariableName';
describe('ResultSeriesType', function () {
  it("Shouldn't throw TypeError fetching known variable names through getByName", function () {
    variableNames.forEach(function (elem) {
      expect(() => ResultSeriesType.getByName(elem)).to.not.throw(TypeError);
    });
  });
  it('Should throw TypeError fetching undefined variable names through getByName', function () {
    expect(() => ResultSeriesType.getByName()).to.throw(TypeError);
  });
  it('Should throw TypeError fetching unknown variable names through getByName', function () {
    expect(() => ResultSeriesType.getByName(unkownVariableName)).to.throw(TypeError);
  });
  it('Should return true when contains a code', function () {
    let containsShouldBeTrue = ResultSeriesType.contains(ResultSeriesType.CALL);
    expect(containsShouldBeTrue).to.be.an('boolean');
    expect(containsShouldBeTrue).to.be.true;
  });
  it('Should return false when not contains a code', function () {
    let containsShouldBeFalse = ResultSeriesType.contains('inexistentCode');
    expect(containsShouldBeFalse).to.be.an('boolean');
    expect(containsShouldBeFalse).to.be.false;
  });
  it('Should set names through getByName as productive', function () {
    variableNamesProductive.forEach(function (elem) {
      let r = ResultSeriesType.getByName(elem);
      expect(r).to.not.be.undefined;
      expect(r.productive).to.be.a('boolean');
      expect(r.productive).to.be.true;
      expect(r.toString()).to.contain('productive');
    });
  });
  it('Should set names through getByName as not productive', function () {
    variableNamesNotProductive.forEach(function (elem) {
      let r = ResultSeriesType.getByName(elem);
      expect(r).to.not.be.undefined;
      expect(r.productive).to.be.a('boolean');
      expect(r.productive).to.be.false;
      expect(r.toString()).to.not.contain('productive');
    });
  });
  it('Should set names through getByName as exists and not unique', function () {
    variableNamesExists.forEach(function (elem) {
      let r = ResultSeriesType.getByName(elem);
      expect(r).to.not.be.undefined;
      expect(r.unique).to.be.a('boolean');
      expect(r.unique).to.be.false;
      expect(r.exists).to.be.a('boolean');
      expect(r.exists).to.be.true;
      expect(r.toString()).to.contain('exists').and.to.not.contain('unique');
    });
  });
  it('Should set names through getByName as unique and not exists', function () {
    variableNamesUnique.forEach(function (elem) {
      let r = ResultSeriesType.getByName(elem);
      expect(r).to.not.be.undefined;
      expect(r.exists).to.be.a('boolean');
      expect(r.exists).to.be.false;
      expect(r.unique).to.be.a('boolean');
      expect(r.unique).to.be.true;
      expect(r.toString()).to.contain('unique').and.to.not.contain('exists');
    });
  });
  it('Should set names through getByName as Call or Allele', function () {
    variableNamesCall.forEach(function (elem) {
      let r = ResultSeriesType.getByName(elem);
      expect(r).to.not.be.undefined;
      expect(r.typeCode).to.be.a('string');
      expect(r.typeCode).to.be.equal(ResultSeriesType.CALL);
      expect(r.typeName).to.be.a('string');
      expect(r.toString()).to.contain(ResultSeriesType.typeCode.CALL.name);
    });
  });
  it('Should set names through getByName as Gene', function () {
    variableNamesGene.forEach(function (elem) {
      let r = ResultSeriesType.getByName(elem);
      expect(r).to.not.be.undefined;
      expect(r.typeCode).to.be.a('string');
      expect(r.typeCode).to.be.equal(ResultSeriesType.GENE);
      expect(r.typeName).to.be.a('string');
      expect(r.toString()).to.contain(ResultSeriesType.typeCode.GENE.name);
    });
  });
  it('Should set names through getByName as Subgroup or Family', function () {
    variableNamesSubgroup.forEach(function (elem) {
      let r = ResultSeriesType.getByName(elem);
      expect(r).to.not.be.undefined;
      expect(r.typeCode).to.be.a('string');
      expect(r.typeCode).to.be.equal(ResultSeriesType.FAMILY);
      expect(r.typeName).to.be.a('string');
      expect(r.toString()).to.contain(ResultSeriesType.typeCode.FAMILY.name);
    });
  });
  it('Should set names through getByName as Top Clones', function () {
    variableNamesTopClones.forEach(function (elem) {
      let r = ResultSeriesType.getByName(elem);
      expect(r).to.not.be.undefined;
      expect(r.typeCode).to.be.a('string');
      expect(r.typeCode).to.be.equal(ResultSeriesType.TOP_CLONES);
      expect(r.typeName).to.be.a('string');
      expect(r.toString()).to.contain(ResultSeriesType.typeCode.TOP_CLONES.name);
    });
  });
  it('Should set names through getByName as Junction Length', function () {
    variableNamesJunctionLength.forEach(function (elem) {
      let r = ResultSeriesType.getByName(elem);
      expect(r).to.not.be.undefined;
      expect(r.typeCode).to.be.a('string');
      expect(r.typeCode).to.be.equal(ResultSeriesType.JUNCTION_LENGTH);
      expect(r.typeName).to.be.a('string');
      expect(r.toString()).to.contain(ResultSeriesType.typeCode.JUNCTION_LENGTH.name);
    });
  });
  it('Should set names through getByName as Junction AA Length', function () {
    variableNamesJunctionAALength.forEach(function (elem) {
      let r = ResultSeriesType.getByName(elem);
      expect(r).to.not.be.undefined;
      expect(r.typeCode).to.be.a('string');
      expect(r.typeCode).to.be.equal(ResultSeriesType.JUNCTION_AA_LENGTH);
      expect(r.typeName).to.be.a('string');
      expect(r.toString()).to.contain(ResultSeriesType.typeCode.JUNCTION_AA_LENGTH.name);
    });
  });
  it('Should set names through getByName as Gene Count', function () {
    variableNamesGeneCount.forEach(function (elem) {
      let r = ResultSeriesType.getByName(elem);
      expect(r).to.not.be.undefined;
      expect(r.typeCode).to.be.a('string');
      expect(r.typeCode).to.be.equal(ResultSeriesType.GENE_COUNT);
      expect(r.typeName).to.be.a('string');
      expect(r.toString()).to.contain(ResultSeriesType.typeCode.GENE_COUNT.name);
    });
  });
  it('Should set names through getByName as Rearrangement', function () {
    variableNamesRearrangement.forEach(function (elem) {
      let r = ResultSeriesType.getByName(elem);
      expect(r).to.not.be.undefined;
      expect(r.rearrangement).to.be.a('boolean');
      expect(r.rearrangement).to.be.true;
      expect(r.toString()).to.contain('rearrangement');
    });
  });
  it('Should set names through getByName as Duplicate', function () {
    variableNamesDuplicate.forEach(function (elem) {
      let r = ResultSeriesType.getByName(elem);
      expect(r).to.not.be.undefined;
      expect(r.duplicate).to.be.a('boolean');
      expect(r.duplicate).to.be.true;
      expect(r.toString()).to.contain('duplicate');
    });
  });
});
