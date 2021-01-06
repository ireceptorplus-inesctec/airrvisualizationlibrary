import { DebugTimer, ResultSeriesType } from '../src/common.js';
import { expect } from './common.js';

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
let variableNames = ["v_call_unique", "d_call_unique", "j_call_unique", "c_call_unique", "v_call_unique_productive", "d_call_unique_productive",
	"j_call_unique_productive", "c_call_unique_productive", "v_call_exists", "d_call_exists", "j_call_exists", "c_call_exists", "v_call_exists_productive",
	"d_call_exists_productive", "j_call_exists_productive", "c_call_exists_productive", "v_gene_unique", "d_gene_unique", "j_gene_unique", "c_gene_unique",
	"v_gene_unique_productive", "d_gene_unique_productive", "j_gene_unique_productive", "c_gene_unique_productive", "v_gene_exists", "d_gene_exists",
	"j_gene_exists", "c_gene_exists", "v_gene_exists_productive", "d_gene_exists_productive", "j_gene_exists_productive", "c_gene_exists_productive",
	"v_subgroup_unique", "d_subgroup_unique", "j_subgroup_unique", "c_subgroup_unique", "v_subgroup_unique_productive", "d_subgroup_unique_productive",
	"j_subgroup_unique_productive", "c_subgroup_unique_productive", "v_subgroup_exists", "d_subgroup_exists", "j_subgroup_exists", "c_subgroup_exists",
	"v_subgroup_exists_productive", "d_subgroup_exists_productive", "j_subgroup_exists_productive", "c_subgroup_exists_productive", "top_clones",
	"junction_length", "junction_length_productive", "junction_aa_length", "junction_aa_length_productive", "rearrangement_count", "rearrangement_count_productive",
	"duplicate_count", "duplicate_count_productive"];
let unkownVariableName = "unknownVariableName";
describe('ResultSeriesType', function () {
	it('Shouldn\'t throw TypeError fetching known variable names through getByName', function () {
		variableNames.forEach(function (elem) {
			expect(() => ResultSeriesType.getByName(elem)).to.not.throw(TypeError);
		});
	});
	it('Should throw TypeError fetching unknown variable names through getByName', function () {
		expect(() => ResultSeriesType.getByName(unkownVariableName)).to.throw(TypeError);
	});

});