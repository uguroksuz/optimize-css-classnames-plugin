describe("cssClassNameGenerator", () => {
    var sut, cssClassNameGenerator;

    beforeEach(() => {
        cssClassNameGenerator = require("./idgenerator");
        sut = new cssClassNameGenerator();
    });

    it("should export function", () => {
        expect(typeof cssClassNameGenerator).toEqual("function");
    });

    it("should return function generator on call", () => {
        expect(typeof sut).toEqual("function");
    });

    it("should return a for first time", ()=> {
        var res = sut();

        expect(res).toEqual("a");
    });

    it("should not return string starting with numbers", ()=> {
        "abcefghijklmnopqrstuvwxyz".split("").forEach(sut);
        var res = sut();

        expect(res).toEqual("ba");
    });

    it("should use number at second position", ()=> {
        "abcefghijklmnopqrstuvwxyz".split("").forEach(sut);
        "abcefghijklmnopqrstuvwxyz".split("").forEach(sut);

        var res = sut();

        expect(res).toEqual("b0");
    });
});
