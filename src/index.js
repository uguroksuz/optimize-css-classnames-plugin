function OptimizeCssClassnamesPlugin(options) {
    this.options = options;
    this.name = "OptimizeCssClassnamesPlugin#V1";
    this.classNameSet = new Set();
}

OptimizeCssClassnamesPlugin.prototype.apply = function(compiler) {
    compiler.plugin("compile", function(/* params */) {
        //console.log("Optimize CSS Classnames Plugin starting to compile...");
    });
};

OptimizeCssClassnamesPlugin.prototype.getNewClassName = function(className) {
    return className;
};

module.exports = OptimizeCssClassnamesPlugin;
