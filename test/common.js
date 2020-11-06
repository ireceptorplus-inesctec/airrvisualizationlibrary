/*
 * Common structures to all the tests.
 */
import { assert, expect, should } from 'chai';  // Using Should style

var options = {
    foo: "foo"
};


module.exports = {
    options: options,
    assert: assert,
    expect: expect,
    should: should
  };

export {options, assert, expect, should};