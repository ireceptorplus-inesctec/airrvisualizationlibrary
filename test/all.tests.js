function importTest(name, path) {
    describe(name, function () {
        require(path);
    });
}

import {options, assert, expect, should} from './common';


describe("All Tests", function () {
 /*
    beforeEach(function () {
       console.log("running something before each test");
    });
*/
    before(function() {
        //console.log("Making it think it has HIghcharts installed");
        window.Highcharts = {"_modules":{"Extensions/Exporting.js": true, "Extensions/Drilldown.js": true, "Extensions/Data.js": true, "Extensions/Math3D.js": true}};
    });
    importTest("Index", './index.test.js');
    importTest("Common", './common.test.js');
    importTest("Properties", './properties.test.js');
    importTest("Result", './result.test.js');

    after(function () {
        console.log("after all tests");
    });
});