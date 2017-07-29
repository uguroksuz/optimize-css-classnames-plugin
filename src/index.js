var incstr = require("incstr");
var RawSource = require("webpack-sources/lib/RawSource");
var csstree = require("css-tree");

function OptimizeCssClassnamesPlugin(options) {
    this.options = options;
    this.name = "OptimizeCssClassnamesPlugin#V1";
    this.classNameMap = new Map();
    this.generateNextId = incstr.idGenerator({
        alphabet: "abcdefghijklmnopqrstuvwxyz0123456789"
    });
}

OptimizeCssClassnamesPlugin.prototype.apply = function(compiler) {

    compiler.plugin("compilation", (compilation) => {

        // Setup callback for accessing a compilation:
        compilation.plugin("optimize-assets", function(assets, done) {

            var files = Object.keys(assets);
            var transformCSS = this.transformCSS.bind(this);

            files.forEach(function(file) {
                if (file === "styles.css") {
                    var asset = assets[file];
                    var source = asset.source();
                    var css = transformCSS(source);

                    let out = new RawSource(css);
                    compilation.assets[file] = out;
                }
            });

            done();
        });
    });
};

OptimizeCssClassnamesPlugin.prototype.getNewClassName = function(className) {
    var map = this.classNameMap;
    var name = map.get(className);
    if (name) {
        return name;
    }
    var newClassName = this.generateNextId();
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
}

module.exports = OptimizeCssClassnamesPlugin;
