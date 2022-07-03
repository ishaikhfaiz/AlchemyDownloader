/*/tmp // remove it when executing
var req = require("http").IncomingMessage.prototype; 
var res = require("http").OutgoingMessage.prototype; 

////
*/

var fs = require("fs");

var src,protocol,sid,accPath;
var req,res;


module.exports = function(rq,rs){
    req=rq,res=rs;


    getParams().then(
        ()=>{//resolved

            verify().then(
                ()=>{
                    var actualRequire = require;
                    require1 = function(module) {
                        delete actualRequire.cache[actualRequire.resolve(module)];
                        return actualRequire(module);
                    };

                    var downloader = require1("./downloader");
                    downloader.req = req;
                    var d = downloader.download(protocol,src,sid);
                    d.then(
                        (path)=>{
                            var ogFileSize = fs.statSync(path).size;
                            //console.log("downloaded now compressing");
                            var compressor = require("./compressor");
                            compressor.startCompression(path).then(
                                (cmpPath)=>{
                                    //console.log("compressed");
                                    var cmpRS = fs.createReadStream(cmpPath);
                                    var fileSize = fs.statSync(cmpPath).size;
                                    var fileName = cmpPath.split("/").pop();
                                    fileName = fileName.split(".");
                                    fileName.pop(); fileName.pop();
                                    fileName = fileName.join(".");

                                    res.setHeader("status","success");
                                    res.setHeader("fileSize",fileSize);
                                    res.setHeader("ogFileSize",ogFileSize);
                                    res.setHeader("fileName",fileName);
                                    
                                    if(req.aborted) {
                                        cmpRS.close();
                                        res.end();
                                        var delFold = require("./deleteFolder");
                                        delFold.deleteFolder(accPath+"/file");
                                        return;
                                    }

                                    req.on("close",()=>{
                                
                                        cmpRS.close();
                                        res.end();
                                        var delFold = require("./deleteFolder");
                                        delFold.deleteFolder(accPath+"/file");
        
                                    });        

                                    cmpRS.on("end",()=>{

                                        cmpRS.close();
                                        res.end();

                                        var delFold = require("./deleteFolder");
                                        delFold.deleteFolder(accPath+"/file");

                                        
                                    });

                                    cmpRS.pipe(res);
                                    
                                },
                                (e)=>{
                                    res.write("err&Error occured in processing file: "+e);
                                    res.end();
                                }
                            );
                            
                            
                        },
                        (e)=>{
                            res.write("err&"+e);
                            res.end();
                        }
                    );

                },
                (err)=>{
                    res.write("err&"+err);
                    res.end();
                }
            );

        },
        (err)=>{//rejected
            res.write("Error: "+err);
        }
    );
    
};

function getParams(){
    return new Promise(
        (resolve,reject)=>{
            msg='';
            
            if( !(protocol=req.headers["protocol"]) ){
                msg+="no protocol";
            }
            if( !(src=req.headers["src"]) ) {
                msg+="no source";
            }
            if( !(sid=req.headers["sid"]) ) {
                msg+="no sid";
            }
            
            if(msg){
                reject(msg);
            }
            else {
                resolve();
            }

        }
    );
}

function verify(){

    return new Promise(
        (resolve,reject)=>{
            var msg='';
            console.log(sid);
	    if( !fs.existsSync(secretFolder+"/sessions/"+sid)) {
                msg+="invalid sid";
            }
            else {
                accPath = fs.readFileSync(secretFolder+"/sessions/"+sid);
                accPath = root+"/accounts/"+accPath;
                if(!fs.existsSync(accPath)){
                    msg+="sid expired";
                }
            }
            
            if( !(protocol=="http" || protocol=="https") ){
                msg+="invalid protocol";
            }

            if(msg) {
                reject(msg);
            }
            else {
                resolve();
            }

        }
    );

}