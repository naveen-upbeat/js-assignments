/* Todo: write frontend test cases using jasmine */

describe("The AJAX Feature", function(){
    window.__html__ = window.__html__ || {};
    document.body.innerHTML = __html__['frontend/index.html'];

    it("If XmlHttpRequest Object Exists",function(){
        expect(makeAjaxCall()).toBe(defined);
    });

});