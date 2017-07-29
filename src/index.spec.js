var proxyquire = require("proxyquire");

describe("OptimizeCssClassnamesPlugin", () => {
    var sut, OptimizeCssClassnamesPlugin, mockOptions;

    beforeEach(() => {
        OptimizeCssClassnamesPlugin = proxyquire("./index", {
            "webpack-sources/lib/RawSource": function (source) { this.source = source; }
        });
        mockOptions = {};
        sut = new OptimizeCssClassnamesPlugin(mockOptions);
    });

    it("should export plugin function", () => {
        expect(typeof OptimizeCssClassnamesPlugin).toEqual("function");
    });

    it("should be able to create instance", () => {
        expect(sut).toBeDefined();
    });

    it("should define apply and getNewClassName methods", () => {
        expect(sut.apply).toBeDefined();

expect(sut.getNewClassName).toBeDefined();
    });

    it("should define plugin name", () => {
        expect(sut.name).toEqual("OptimizeCssClassnamesPlugin#V1");
    });


    describe("getNewClassName", ()=> {
        it("should generate new class names starting from a", ()=> {
            var oldClassName = "oldA";
            var newClassName = sut.getNewClassName(oldClassName);

            expect(newClassName).toEqual("a");
        });

        it("should generate unique names for each item", ()=> {
            /* var newClassName1 = */sut.getNewClassName("__a");
            var newClassName2 = sut.getNewClassName("__b");

            expect(newClassName2).toEqual("b");
        });


        it("should generate same name for same class names", ()=> {
            /*var newClassName1 = */sut.getNewClassName("__a");
            /*var newClassName2 = */sut.getNewClassName("__b");
            var newClassName3 = sut.getNewClassName("__a");

            expect(newClassName3).toEqual("a");
        });
    });


    describe("transformCSS", ()=> {
        beforeEach(() => {
            // add css transformation rules __a=> a, __b=>b, __c=>c
            sut.getNewClassName("__a");
            sut.getNewClassName("__b");
            sut.getNewClassName("__c");
        });

        it("should convert class based on transform table", ()=> {
            var oldCss = ".__a {color: \"#AAAAAA\"}";
            var newCss = sut.transformCSS(oldCss);

            expect(newCss).toEqual(".a{color:\"#AAAAAA\"}");
        });

        it("should convert class names multiple selectors", ()=> {
            var oldCss = ".__a .new {color: \"#AAAAAA\"} .__b {color: \"#BBBBBB\"}";
            var newCss = sut.transformCSS(oldCss);

            expect(newCss).toEqual(".a .new{color:\"#AAAAAA\"}.b{color:\"#BBBBBB\"}");
        });

        it("should convert class names with multiple class selectors", ()=> {
            var oldCss = ".__a .new {color: \"#AAAAAA\"}";
            var newCss = sut.transformCSS(oldCss);

            expect(newCss).toEqual(".a .new{color:\"#AAAAAA\"}");
        });
    });


    describe("apply", ()=> {
        var mockCompiler, mockCompilation, mockCompilationFn;

        beforeEach(() => {
            mockCompiler = {
                plugin: jasmine.createSpy().andCallFake((name, fn)=> {
                    fn(mockCompilation);
                })
            };

            mockCompilation = {
                plugin: jasmine.createSpy().andCallFake((name, fn)=> {
                    mockCompilationFn = fn;
                })
            }
        });

        it("should call compiler", ()=> {
            sut.apply(mockCompiler);

            expect(mockCompiler.plugin).toHaveBeenCalledWith("compilation", jasmine.any(Function));
        });

        it("should register to optimize-assets compilation", () => {
            sut.apply(mockCompiler);

            expect(mockCompilation.plugin).toHaveBeenCalledWith("optimize-assets", jasmine.any(Function));
        });

        it("plugin registred function should call done", ()=> {
            sut.apply(mockCompiler);
            var doneFn = jasmine.createSpy();
            mockCompilationFn.call({ transformCSS: function() {} }, {} , doneFn);

            expect(doneFn).toHaveBeenCalledWith();
        });

        describe("css transformation", ()=> {
            var mockTransformCSS;

            beforeEach(() => {
                sut.apply(mockCompiler);
                mockTransformCSS = function(css) {
                    return "-=" + css + "=-";
                };
                mockCompilation.assets = {};
            });

            it("should iterate over assets and apply css for each transform", ()=> {
                var styleString = "css";
                var cssFileName = "styles.css";
                var mockAssets = {
                    "app.js": {}
                };
                mockAssets[cssFileName] = {
                    source: () => {
                        return styleString;
                    }
                };
                mockCompilationFn.call({transformCSS: mockTransformCSS}, mockAssets, ()=>{});

                expect(mockCompilation.assets[cssFileName].source).toEqual("-=css=-");
            });
        });
    });
});
