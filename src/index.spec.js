var proxyquire = require("proxyquire");

describe("OptimizeCssClassnamesPlugin", () => {
    var sut, OptimizeCssClassnamesPlugin, mockOptions;

    beforeEach(() => {
        OptimizeCssClassnamesPlugin = proxyquire("./index", {
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
});
