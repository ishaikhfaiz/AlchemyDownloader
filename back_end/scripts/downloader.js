
var http = require("http");
var https = require("https");
var h,sid,url;


exports.req;

exports.download = function(protocol,src,sId){
    sid=sId;
    return new Promise(
        (resolve,reject)=>{
            h = (protocol=="http")?http:https;
            url = protocol+"://"+src;
            download(url).then(
                (p)=>{
                    //res.writeHead(200);
                    resolve(p);
                },
                (e)=>{
                    //res.writeHead(200);
                    reject(e);
                    console.log(e);
                }
            );
        }
    );

};

var rdCnt=0; //redirectionCounter
function download(src){
    src = src.replace(/\\/g,"/");
    return new Promise(
        (resolve,reject)=>{
            if(rdCnt>=7) {
                return reject("Too many redirections");
            } 
   
            
            var get = h.get(src,(clres)=>{

                var r = /3\d\d/i;
                if(r.test(clres.statusCode)) {
                    rdCnt++;
                    if(tmpProtocol=clres.headers.location.split("://")[0]){
                        if(tmpProtocol=="http"){
                            h = http;
                        }
                        else if(tmpProtocol=="https"){
                            h = https;
                        }
                        else {
                            return reject("Link Protocol Error");
                        }
                        return download(clres.headers.location).then(resolve,reject);
                    }
                    return reject("No protocol in redirected link");
                }
                
                if(clres.statusCode==200) {
                    var fileSize,fileName;
                    if(fileSize=clres.headers["content-length"]) {

                        if( fileSize <= ( 2048* (1024*1024)) ) {
                            
                            if(fileName=clres.headers["content-disposition"]){
                                fileName = decodeURIComponent(fileName.split("filename=")[1]);
                            }
                            else {
                                fileName = decodeURIComponent(src.split("/").pop());
                            }

                            saveFile(clres,fileName).then(
                                (p)=>{
                                    return resolve(p);
                                },
                                (e)=>{
                                    return reject("unknow error occured in processing file: "+e);
                                }
                            );

                        }
                        else {
                           return reject("File too big");
                        }

                    }
                    else {
                        return reject("Cant find file size");
                    }
                }

            });
            get.setTimeout(10000,()=>{
                get.abort();
                reject("timeout occured");
            });
            get.on("error",(e)=>{
                console.log("Jhol hai: "+e);
                reject(e);
            });
        }
    );
}

function saveFile(clres,fileName){
    return new Promise(
        (resolve,reject)=>{
            var fs = require("fs");
            try {
                var accPath = fs.readFileSync(secretFolder+"/sessions/"+sid).toString().trim();
                accPath = root+"/accounts/"+accPath;

                if(!fs.existsSync(accPath)){
                    return reject("Invalid Account");
                }

                if(fs.existsSync(accPath+"/file")){
                    return reject("you are already downloading a file");
                }
                else {
                    fs.mkdirSync(accPath+"/file");
                    
                    var writeStream = fs.createWriteStream(accPath+"/file/"+fileName+".zyfa");
                    clres.pipe(writeStream);
                    //  ^
                    // /_\stoped at 13-02-2020 00:40
                    //  |
                    var loadedSize=0;
                    clres.on("data",(c)=>{
                        loadedSize+=c.length;
                        console.log(loadedSize/1024/1024+"mb");
                        ///res.writeHead(100);
                        //res.write("Downloading progress:"+loadedSize+"\n");
                    });

                    exports.req.on("close",()=>{
                        clres.destroy();
                        writeStream.close();
                        writeStream.on("close",()=>{
                            var del = require("./deleteFolder");
                            del.deleteFolder(accPath+"/file");
                        
                        });
                        reject();
                    });
                    
                    clres.on("end",()=>{
                        resolve(accPath+"/file/"+fileName+".zyfa");
                    });
                }
                
                
            }
            catch(e) {
                reject(e);
            }
        }
    );
}
