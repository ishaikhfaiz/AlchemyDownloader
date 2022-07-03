var sid,accPath;
var req,res;


var fs = require("fs");

module.exports = (rq,rs)=>{
    req=rq; res=rs;

    getParams().then(
        ()=>{
            respondFile().then(
                (rsObj)=>{
                    var rs = rsObj["rs"];
                    var fileName = rsObj["fileName"];
                    res.setHeader("status","done");
                    res.setHeader("fileName",fileName);
                    rs.pipe(res);
                    rs.on("end",()=>{
                        deleteFile();
                        res.end();
                    });
                },  
                ()=>{
                    res.setHeader("status","remaining");
                    res.write("not completed yet");
                    res.end();
                }
            );
        },
        (e)=>{
            res.write(e);
            res.end();
        }
    );
    
};

/**
 * @description gets params and validates them
 */
function getParams() {
    return new Promise(
        (resolve,reject)=>{

            if(sid=req.headers["sid"]){
                if(fs.existsSync(secretFolder+"/sessions/"+sid)){
                        return resolve();
                }
                else {
                    return reject("invalid sid");
                }

            }
            else {
                return reject("no sid present");
            }

        }
    );
}

function respondFile() {

    return new Promise(
        (resolve,reject)=>{
            accPath = fs.readFileSync(secretFolder+"/sessions/"+sid);
            accPath = root+"/accounts/"+accPath;
            if(fs.existsSync(accPath+"/file/completed")){
                var filePath = fs.readdirSync(accPath+"/file");
                filePath.every(
                    (v)=>{
                        if( v.split(".").pop() =="zyfa" ) {
                            filePath = accPath+"/file/"+v;
                            return false;
                        }
                        return true;   
                    }
                );
                
                if(fs.existsSync(filePath)){
            
            
                    var rs = fs.createReadStream(filePath)
                    var fileName = filePath.split("/").pop();
                    return resolve({"rs":rs, "fileName":fileName });
                }
                else {
                    return reject();
                }
            }   
            else {
                return reject();
            }
        }
    );

}

function deleteFile(){
    var delFold = require("./deleteFolder");
    delFold.deleteFolder(accPath+"/file");
}