createFunctionWrapper
=======

creates a function wrapper for binding arguments and this values

```javascript
var createFunctionWrapper = require("@nathanfaucett/create_function_wrapper");


function test(a, b, c) {
    return this.name + " age: " + a + " last: " + b + " pet: " + c;
}

var wrapper = createFunctionWrapper(test);

wrapper.__wrapper__.setThisArg({
    name: "Bob"
});
wrapper.__wrapper__.addArgsLeft([32]);
wrapper.__wrapper__.addArgsRight(["Dog"]);

// wrapper("Bobby") === "Bob age: 32 last: Bobby pet: Dog");
```
