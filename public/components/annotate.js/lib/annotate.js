(function(root, factory) {
    var nodeColors = {
        red: function(str) {
            return ['\033[31m' + str + '\033[0m'];
        },
        green: function(str) {
            return ['\033[32m' + str + '\033[0m'];
        },
        yellow: function(str) {
            return ['\033[33m' + str + '\033[0m'];
        }
    };

    var browserColors = {
        red: function(str) {
            return ['%c' + str, 'color: red; background: #333'];
        },
        green: function(str) {
            return ['%c' + str, 'color: green'];
        },
        yellow: function(str) {
            return ['%c' + str, 'color: yellow; background: #333'];
        }
    };

    if(typeof exports === 'object') {
        module.exports = factory(require('is-js'), nodeColors);
    } else if(typeof define === 'function' && define.amd) {
        define(['is-js'], function(is) {
            return (root.annotate = factory(is, browserColors));
        });
    } else {
        root.annotate = factory(root.is, browserColors);
    }
}(this, function(is, colors) {
    return function() {
        var doc = arguments[1];
        var functions = [];
        var preconditions = [];
        var postconditions = [];
        var name = arguments[0];
        var ret = function() {
            warn(colors.red('\n"' + name + '" is missing dispatcher!'));
        };

        return attachMeta(ret);

        function on() {
            var len = arguments.length - 1;
            var fn = arguments[len];
            var inv = [];

            for(var i = 0; i < len; i++) {
                inv.push(arguments[i]);
            }

            functions.push(wrapFn(fn));
            preconditions.push(inv);

            return attachMeta(check(preconditions, postconditions, functions, name));
        }

        function satisfies(postCondition) {
            postconditions.push(postCondition);

            return attachMeta(check(preconditions, postconditions, functions, name));
        }

        function attachMeta(a) {
            a.on = on;
            a.satisfies = satisfies;

            a._doc = doc || '';
            a._preconditions = preconditions;
            a._postconditions = postconditions;
            a._name = name || '';

            return a;
        }
    };

    function wrapFn(a) {
        return is.fn(a)? a: function() {return a;};
    }

    function check(preconditions, postconditions, functions, name) {
        return function() {
            var args = Array.prototype.slice.call(arguments);
            var i, j, n, len1, len2, precondition, pre, allMatched, ret, failedPre;

            n = name || '<undefined>';
            for(i = 0, len1 = preconditions.length; i < len1; i++) {
                allMatched = true;
                precondition = preconditions[i];

                for(j = 0, len2 = precondition.length; j < len2; j++) {
                    pre = precondition[j];
                    pre = is.fn(pre)? pre: is.array(pre)? arr(pre): eq(pre);

                    if(!pre(args[j], args)) {
                        allMatched = false;
                        failedPre = pre;
                        break;
                    }
                }

                if(allMatched) {
                    return postOk(functions[i].apply(undefined, arguments), postconditions, args, n);
                }
            }

            warnPost('precondition', failedPre, n, args);
        };
    }

    function arr(pre) {
        return function(i) {
            return pre[0] === i;
        };
    }

    function eq(a) {
        return function(i) {
            return a === i;
        };
    }

    function postOk(res, postconditions, args, name) {
        var i, len, postcondition;

        if(!postconditions.length) return res;

        for(i = 0, len = postconditions.length; i < len; i++) {
            postcondition = postconditions[i];

            if(!postcondition.apply(undefined, [res].concat(args))) {
                warnPost('postcondition', postcondition, name, args);

                return false;
            }
        }

        return res;
    }

    function warnPost(prefix, fn, name, args) {
        warn(colors.yellow(name).concat(prefix, '\n', fn, '\n', 'failed with parameters ('));
        warn(colors.green(args.join(', ')));
        warn(')!');
    }

    function warn(o) {
        o = is.array(o)? o: [o];
        console.warn.apply(console, o);
    }
}));
