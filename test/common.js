/*
 * Common structures to all the tests.
 */
import * as fs from 'fs';
import pkg from 'chai';
const {assert, expect, should} = pkg;

var options = {
  foo: 'foo',
};

export {options, assert, expect, should, fs};
