const { equal } = require("assert").strict;
const createTestHelperFor = require("babel-plugin-test-helper");

module.exports = function setup(plugin) {
    const isEqual = createTestHelperFor(plugin);

    globalThis.test = function (source, expected) {
        equal(isEqual(source, expected), true);
    };
};
