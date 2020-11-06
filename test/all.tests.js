function importTest(name, path) {
    describe(name, function () {
        require(path);
    });
}

import {options, assert, expect, should} from './common';

describe("All Tests", function () {
    beforeEach(function () {
       console.log("running something before each test");
    });
    importTest("Index", './index.test.js');
    importTest("Common", './common.test.js');
    after(function () {
        console.log("after all tests");
    });
});