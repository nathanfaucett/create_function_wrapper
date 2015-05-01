var assert = require("assert"),
    createFunctionWrapper = require("../src/index");


describe("createFunctionWrapper(fn)", function() {
    it("should create a object with helpers for bind, curry, etc...", function() {

        function test(a, b, c) {
            return this.name + " age: " + a + " last: " + b + " pet: " + c;
        }

        wrapper = createFunctionWrapper(test);

        wrapper.__wrapper__.setThisArg({
            name: "Bob"
        });

        wrapper.__wrapper__.addArgsLeft([32]);
        wrapper.__wrapper__.addArgsRight(["Dog"]);

        assert.equal(wrapper("Bobby"), "Bob age: 32 last: Bobby pet: Dog");
    });
});
