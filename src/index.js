var RawSource = require("webpack-sources/lib/RawSource");
var csstree = require("css-tree");
var cssClassNameGenerator = require("./idgenerator");

function OptimizeCssClassnamesPlugin(options) {
    this.options = options;
    this.name = "OptimizeCssClassnamesPlugin#V1";
    this.classNameMap = new Map();
    this.generateNextId = cssClassNameGenerator();
    if (options.prefix && !options.prefix.match(/^[\w\-_]*$/gi)) {
        throw new Error("prefix should contain only alphanumeric symbols");
    }
}

OptimizeCssClassnamesPlugin.prototype.apply = function(compiler) {

    var transformCSS = this.transformCSS.bind(this);

    compiler.plugin("compilation", (compilation) => {

        // Setup callback for accessing a compilation:
        compilation.plugin("optimize-assets", function(assets, done) {

            var files = Object.keys(assets);

            files.forEach(function(file) {
                if (isCSSFile(file)) {
                    var asset = assets[file];
                    var source = asset.source();
                    var css = transformCSS(source);

                    var out = new RawSource(css);
                    compilation.assets[file] = out;
                }
            });

            done();
        });
    });
};

OptimizeCssClassnamesPlugin.prototype.getNewClassName = function(className) {
    var map = this.classNameMap;
    var prefix = this.options.prefix || "";
    var name = map.get(className);
    if (name) {
        return name;
    }
    var newClassName = prefix + this.generateNextId();
    map.set(className, newClassName);
    return newClassName;
};

OptimizeCssClassnamesPlugin.prototype.transformCSS = function(source) {
    var map = this.classNameMap;
    var ast = csstree.parse(source);

    csstree.walk(ast, function(node) {
        if (node.type === "ClassSelector" && node.name) {
            var newClassName = map.get(node.name);
            if (newClassName) {
                node.name = newClassName;
            }
        }
    });

    return csstree.translate(ast);
};

function isCSSFile(fileName) {
    return !!((fileName || "").match(/\.css$/));
}

module.exports = OptimizeCssClassnamesPlugin;
