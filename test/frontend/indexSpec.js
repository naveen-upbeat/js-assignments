/* Todo: write frontend test cases using jasmine */

var showConsole = true;
var statusCode = 200;
var myConsole = {
    dir: function(obj){
        if(showConsole){
            console.dir(obj);
        }

    },
    log: function(data){
        if(showConsole){
            console.log(data);
        }
    }
}


function XMLHttpRequest(){
    return{
        status: statusCode,
        response:JSON.stringify({message:"mocked message"}),
        statusText:"this is insane mock",
        open: function(){

        },
        onload: function(){

        },
        onerror:function(){

        },
        send: function(){
            this.onload();
        }
    }
}

function Promise2(){
    return{
        then:function(){

        },
        reject:function(){

        }
    }
}

describe("getAjaxFunction: ",function(){

    it("check if function is defined",function(){
        expect(getAjaxPromise).not.toBe(undefined);
    })

    describe("check if function takes two required arguments",function(){

        describe("1. takes url parameter",function(){
            it("Throw error when no request url",function(){
                var testPromise = getAjaxPromise();
                var isInstanceOf = testPromise instanceof Error;
                expect(isInstanceOf).toBe(true);
                myConsole.dir(JSON.parse(testPromise.message));
                expect(JSON.parse(testPromise.message).name).toBe("NoReqURL");
            });

            it("For Valid URL gets a promise",function(){
                var testPromise = getAjaxPromise("valid url");
                myConsole.dir(testPromise);
                expect(testPromise instanceof Promise).toBe(true);
            });
        });

        describe("2. takes postData when requestType is POST",function(){
            it("throws error if postData is not passed", function(){
                var testPromise = getAjaxPromise("test","POST");
                var isInstanceOf = testPromise instanceof Error;
                expect(isInstanceOf).toBe(true);
                myConsole.dir(JSON.parse(testPromise.message));
                expect(JSON.parse(testPromise.message).name).toBe("NoPostData");
            });
            it("For valid URL and PostData will get a promise",function(){
                var testPromise = getAjaxPromise("/api/addcar","POST","{carid:test}");
                myConsole.dir(testPromise);
                expect(testPromise instanceof Promise).toBe(true);
            });
        });
    });

    it("check if it returns a promise object for valid arguments",function(){
        var testPromise = getAjaxPromise("/api/getcars","GET");
        expect(testPromise instanceof Promise).toBe(true);
    });

    it("throws a reject response if server sends an error", function(done){
        statusCode = 300;
        var testPromise = getAjaxPromise("valid url","GET");
        var customResp = "";
        testPromise.catch(function(rejectText){
            customResp = rejectText;
        });
        expect(testPromise instanceof Promise).toBe(true);
        done();
        expect(customResp).toBe("this is insane mock");
    });

});
