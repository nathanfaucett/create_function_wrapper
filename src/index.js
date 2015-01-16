var has = require("has"),
    isNative = require("is_native"),
    isNullOrUndefined = require("is_null_or_undefined");


var nativeDefineProperty = Object.defineProperty,
    wrapperDescriptor = {
        configurable: false,
        enumerable: false,
        writable: false,
        value: null
    };


if (!isNative(nativeDefineProperty)) {
    nativeDefineProperty = function defineProperty(obj, prop, desc) {
        obj[prop] = desc.value;
    };
}

function mergeArrays(a, b) {
    var aLength = a.length,
        i = -1,
        il = b.length - 1;

    while (i++ < il) {
        a[aLength + i] = b[i];
    }
}

function FunctionWrapper() {
    this.thisArg = null;
    this.argsLeft = null;
    this.argsRight = null;
}

FunctionWrapper.prototype.setThisArg = function(thisArg) {
    this.thisArg = thisArg;
    return this;
};

FunctionWrapper.prototype.setArgsLeft = function(args) {
    this.argsLeft = args;
    return this;
};

FunctionWrapper.prototype.setArgsRight = function(args) {
    this.argsRight = args;
    return this;
};

FunctionWrapper.prototype.addArgsLeft = function(args) {
    mergeArrays(this.argsLeft || (this.argsLeft = []), args);
    return this;
};

FunctionWrapper.prototype.addArgsRight = function(args) {
    mergeArrays(this.argsRight || (this.argsRight = []), args);
    return this;
};

FunctionWrapper.prototype.getArguments = function(args) {
    var argsLeft = this.argsLeft,
        argsRight = this.argsRight,
        out = [];

    if (argsLeft) {
        mergeArrays(out, argsLeft);
    }

    mergeArrays(out, args);

    if (argsRight) {
        mergeArrays(out, argsRight);
    }

    return out;
};

FunctionWrapper.prototype.run = function(fn, argsArray) {
    var thisArg = this.thisArg,
        args = this.getArguments(argsArray);

    return isNullOrUndefined(thisArg) ? callWithOutThisArg(fn, args) : callWithThisArg(fn, args, thisArg);
};

function callWithOutThisArg(fn, args) {
    switch (args.length) {
        case 0:
            return fn();
        case 1:
            return fn(args[0]);
        case 2:
            return fn(args[0], args[1]);
        case 3:
            return fn(args[0], args[1], args[2]);
        case 4:
            return fn(args[0], args[1], args[2], args[3]);
        case 5:
            return fn(args[0], args[1], args[2], args[3], args[4]);
        default:
            return fn.apply(null, args);
    }
}

function callWithThisArg(fn, args, thisArg) {
    switch (args.length) {
        case 0:
            return fn.call(thisArg);
        case 1:
            return fn.call(thisArg, args[0]);
        case 2:
            return fn.call(thisArg, args[0], args[1]);
        case 3:
            return fn.call(thisArg, args[0], args[1], args[2]);
        case 4:
            return fn.call(thisArg, args[0], args[1], args[2], args[3]);
        case 5:
            return fn.call(thisArg, args[0], args[1], args[2], args[3], args[4]);
        default:
            return fn.apply(thisArg, args);
    }
}

module.exports = function createFunctionWrapper(fn) {
    var wrapper;

    if (has(fn, "__wrapper__")) {
        wrapper = fn;
    } else {
        wrapper = function wrapper() {
            return wrapper.__wrapper__.run(fn, arguments);
        };

        wrapperDescriptor.value = new FunctionWrapper();
        nativeDefineProperty(wrapper, "__wrapper__", wrapperDescriptor);
        wrapperDescriptor.value = null;
    }

    return wrapper;
};
