var http = require("http");
var https = require("https");
var fs = require("fs");


//var src = "https://r6---sn-8vguxmoxunva-cvhe.googlevideo.com/videoplayback?expire=1581208203&ei=K_4-Xu7AM9mQkwb-2a7ACg&ip=168.235.86.92&id=o-AGRSZ9g2AbiSO4MplqoGTIaUaPIELE8L_yVm4mmuwGta&itag=22&source=youtube&requiressl=yes&vprv=1&mime=video%2Fmp4&ratebypass=yes&dur=269.026&lmt=1540866708692669&fvip=6&fexp=23842630&c=WEB&txp=5431432&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cvprv%2Cmime%2Cratebypass%2Cdur%2Clmt&sig=ALgxI2wwRAIgGUGWNTJYQ2HLjvfNH3RaNLackHeQDJWFR_zMSFJL148CIBQlTQVNYK-z457XXmJpEt2HO41D1GXYCgjv9_ib0Lti&title=ULTIMATE%204K%20ULTRA%20HD%20OLED%20SAMPLER%20VideoTest%20Demo%2C%20Stock%20Video%20Footage&cms_redirect=yes&mip=103.88.223.183&mm=31&mn=sn-8vguxmoxunva-cvhe&ms=au&mt=1581187492&mv=m&mvi=5&pl=24&lsparams=mip,mm,mn,ms,mv,mvi,pl&lsig=AHylml4wRQIgdU1q7_9B6Mz47aq3TfQNf6FuB00vjSmcDz_eM_Rsxx8CIQCm4L4E_sAD64LoalVnzw2v6KysDwodJgp4FfdHumPrsQ%3D%3D";
/*
http.createServer((clreq,clres)=>{
    var src = "http://localhost";

    function download(src) {

        var get = https.get(src,(res)=>{
            
            console.log(res.statusCode);
            
            var r = /3\d\d/i;
            if(r.test(res.statusCode)){
                return download(res.headers.location);
            }

            r = /2\d\d/i;
            if(r.test(res.statusCode)) {
                return save(res);
            }

        });
        get.on("error",(e)=>{
            console.log("jhol hai: "+e.message);
            clres.end();
            get.abort();
        });
        get.on("abort",()=>{
            console.log("get aborted");
        });

    }
    download();
    
}).listen(80);
*/

/*var src= "http://www.http2demo.io".split("://").pop();
console.log(src);
*/


/*
var clreq = require("http").IncomingMessage.prototype; 
var clres = require("http").OutgoingMessage.prototype; 

var get;
var rdCnt =0;
function download(src){ 
    return new Promise(
        (resolve,reject)=>{
            
            if(rdCnt>=4) {
                return reject("Too many redirections");
            }

            get = http.get(src,(res)=>{
                
                console.log(res.statusCode);
                if(res.statusCode == 301) {
                    rdCnt++;    
                    var src= res.headers.location.split("://").pop();
                    console.log(src);
                    return download("http://"+src).then(resolve,reject);
                }
                if(res.statusCode == 200) {
                    console.log("execute");
                    resolve();
                    gets = [];
                }
            }).setTimeout(10000,()=>{
                console.log("timeout occured");
                get.abort();
            }).on("error",(e)=>{
                console.log("Jhol hai: "+e);
            });

        }
    );
}



setInterval(()=>{
    console.log("hold on");
},1000);


download("http://localhost:8080").then(()=>{
    console.log("completed");
},
(e)=>{
    console.log("Rejected: "+e);
}
);*/
/*
http.createServer(
    (clreq,clres)=>{
        var src1 = "https://www.sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4";
        var http = require("https");
        function download(src){
        http.get(src,(res)=>{
            console.log(res.statusCode);
            console.log(res.headers["content-length"]/(1024*1024)+" mb");
            
            if(res.headers["content-disposition"]) {
                var name = res.headers["content-disposition"].split("filename=")[1];
                console.log("h: "+name);
            }
            else {
                var name = decodeURIComponent(src1.split("/").pop());
                console.log(name);
            }

            if(res.statusCode==302) {
                download(res.headers.location);    
            }
            else {
                clres.setHeader("content-type","text/html");
                
                clres.setHeader("content-length",res.headers["content-length"]);
                var loaded=0;
                var tf= fs.createWriteStream("test1.png");
                res.pipe(tf);
                res.on("data",(c)=>{
                    loaded+=c.length;
                    clres.write(loaded+"<br>");
                });
                
                res.on("end",()=>{
                    console.log("finished writing");
                });
            }
        });
        }

        download(src1);


    }
).listen(8080);
*/
/*

function main(cmd){
     
    var cp = require("child_process");

    cp.exec(cmd,(err,stdout,stderr)=>{
        if(err) {
            console.error(err);
        }
        
        if(stdout){
            console.log(stdout);
        }
        if(stderr){
            console.log(stderr);
        }
        
    });
}

 main("cd test_folder; test.exe hey");
*/

/*
 http.createServer((req,res)=>{
    var m = new require("./pract_module")(req,res);
    m.show();

 }).listen(8080);
*/
////////
/*
var fs = require("fs");
 
    var f = fs.createReadStream(process.argv[2]);
    var w = fs.createWriteStream(process.argv[2]+"_new");
    f.on("data",(d)=>{
        w.write(d);
    });
    f.on("end",()=>{
        console.log("end");
        f.close();
        w.close();
    });

*/
/*
var filePath = fs.readdirSync("test_folder");
    filePath.every(
        (v)=>{
            if(v.split(".").pop()=="exe") {
                filePath =v;
                return false;
            }
            console.log(v);
            return true;          
        }
    );

    http.createServer(
        (req,res)=>{
            res.setHeader("content-disposition","attachment; filename=asfm.exe")
            var rs = fs.createReadStream("test_folder/"+filePath);
            rs.pipe(res);
        }
    ).listen(8080);
    */
/*
    http.createServer(
        (req,res)=>{
            var arr ={};
            var uname ="asfm";
            arr.uname=uname;
            var avt = fs.readFileSync("asfm.png");
            avt = avt.toString("base64");
            avt = "data:image/png;base64,"+avt;
            arr.avt=avt;
            res.setHeader("Access-Control-Allow-Origin","null");
            
            res.write(JSON.stringify(arr));

            res.end();
        }
    ).listen(8080);
    */

http.createServer(
    (req,res)=>{
        /*var src = "C:/Users/thisi/Downloads/lumia_camera.xap";
        var rs = fs.createReadStream(src);
        rs.pipe(res);
        var d =[];
        rs.on("data",(c)=>{
            d.push(c);
            console.log((c.length*d.length)/1024/1024+"mb");
        });
        rs.on("end",()=>{
            res.end();
        });*/
        res.setHeader("content","text");
        res.write("hii hello");
        res.end();
    }
).listen(8080);









