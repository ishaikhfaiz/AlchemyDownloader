var req,res;
var sid,accPath,uname;

module.exports = function(rq,rs){
    req=rq; res=rs;
    getParams().then(
        ()=>{
            console.log("Got params");
            verify().then(
                ()=>{
                    console.log("Verified");
                    getProfile().then(
                        (profile)=>{
                            console.log("Got profile");
                            res.write(profile);
                            res.end();
                        },
                        (e)=>{
                            console.log("Error in getProfile");
                            res.write("err&Unknown ");
                            res.end();
                        }
                    );
                },
                (e)=>{
                    res.write("err&Invalid SID");
                    res.end();
                }
            );
        },
        ()=>{
            res.write("err&Invalid Param");
            res.end();
        }
    );

};

function getParams(){
    return new Promise(
        (resolve,reject)=>{
            if(req.headers){
                sid = req.headers["sid"];
                resolve();
            }
            else {
                reject();
            }
        }
    );
}

function verify(){
    return new Promise(
        (resolve,reject)=>{
            var fs = require("fs");
            if(fs.existsSync(secretFolder+"/sessions/"+sid)){
                console.log("sid exists");
                accPath = fs.readFileSync(secretFolder+"/sessions/"+sid).toString();
                uname = accPath.split("/")[0];
                accPath = root+"/accounts/"+accPath;
                if(fs.existsSync(accPath)){
                    resolve();
                }
                else {
                    console.log(accPath+" does not exist");
                    reject(accPath+" does not exist");
                }
            }
            else {
                console.log(sid+" does not exist");
                reject(sid+" does not exist");
            }
        }
    );
}

function getProfile(){
    return new Promise(
        (resolve,reject)=>{
            try{
                
            var fs = require("fs");
            var profile = {};
            profile.uname=uname;
            
            var fname = fs.readFileSync(accPath+"/fname").toString();
            profile.fname =fname;

            var lname = fs.readFileSync(accPath+"/lname").toString();
            profile.lname = lname;

            if(fs.existsSync(accPath+"/avatar.png")){
                var avt = fs.readFileSync(accPath+"/avatar.png").toString("base64");
                avt = "data:image/png;base64,"+avt;
                profile.avt = avt;    
            }
            
            profile = JSON.stringify(profile);
            resolve(profile);
     
            }
            catch(e){
                reject(e);
            }
        }
    );
}