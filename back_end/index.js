var actualRequire = require;
 require = function(module) {
    delete actualRequire.cache[actualRequire.resolve(module)];
    return actualRequire(module);
 };
 
 /////////////////

var http = require("http");

global.root = "c:/Alchemy_Downloader/back_end";
//global.sessionFold = root+"/zlzhh0ljzQU^yxy@@$hhS$hhi0SShRA1S^iTATQj%B1/sessions/";
global.secretFolder = root+"/zlzhh0ljzQU^yxy@@$hhS$hhi0SShRA1S^iTATQj%B1";


http.createServer(
    function(req,res){
        
	req.setTimeout(0);
	        
    	res.setHeader("access-control-allow-origin","*");
    	res.setHeader("access-control-allow-headers","*");

        var url = req.url;
        url = url.split("?")[0];
        switch(url){
            
            case "/login": {
               var login = new require("./scripts/login")(req,res);
               break;
            }

            case "/signup": {
                var signup = new require("./scripts/signup")(req,res);
                break;
            }

            case "/verify": {
                var verify = new require("./scripts/verify")(req,res);
                verify.verifyMail();
                break;
            }

            case "/forgotPass": {
                var fgtPass = require("./scripts/forgotPass")(req,res);
                break;
            }

            case "/resetPass": {
                var rstPass = require("./scripts/resetPass")(req,res);
                break;
            }
            
            case "/download": {
                //intitiates download
                //now from 03-03-2020 23:42 onwards, provides with the compressed file 
                var download = require("./scripts/startDownload")(req,res);
                break;
            }

            /*case "/download2": {
                //responds with compressed file
                var download2 = require("./scripts/download2")(req,res);
                break;
            }*/
            
            case "/getProfile":{
                var getProfile = require("./scripts/getProfile")(req,res);
                break;
            }

            default : {
                res.end("Looks like it's a 404");
            }
                
        }

    }
).listen(8080);