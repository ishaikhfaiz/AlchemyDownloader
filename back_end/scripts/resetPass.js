var req,res;

/**
 * @description this module have two roles,
 *  1. link sent in mail is verified and a response with the form to take new password is sent
 *  2. new password is applied in the response to the request made by form generated in role 1. 
 */
module.exports = function(rq,rs){
    req=rq; res=rs;
    var fpID = req.url.split("?")[1];
    var fs = require("fs");

    if(fpID){
        if(fs.existsSync(secretFolder+"/fpsessions/"+fpID)){
            var tmp = fs.readFileSync(secretFolder+"/fpsessions/"+fpID).toString();
            tmp = tmp.split("/");
            var uname = tmp[0];
            var pass = tmp[1];
            var fpExp = tmp[2];
            var sid;
            var currT = new Date().getTime();
            if(currT < fpExp){
                res.write("Link is okay, now send the same request with new password setted in header \
                and make sure the new request is done within the expiry time, else link will be expired<br>");
                //it is expected that the response in this part will contain the form to accept the new password
                var npass=req.headers["npass"];
                if(npass){
                    var r = /^[^\/\\;:*?<>|"']{6,20}$/i;
                    if(r.test(npass)){
                        fs.renameSync(root+"/accounts/"+uname+"/"+pass,root+"/accounts/"+uname+"/"+npass);
                        
                        if(fs.existsSync(root+"/accounts/"+uname+"/"+npass+"/sid")) {
                            sid = fs.readFileSync(root+"/accounts/"+uname+"/"+npass+"/sid").toString();
                            
                            fs.unlinkSync(secretFolder+"/sessions/"+sid);
                        }

                        fs.unlinkSync(secretFolder+"/fpsessions/"+fpID);
                        res.write("Password Changed");
                        endResponse();
                    }
                    else {
                        res.write("pass: /\\;:*?<>|\"' end");
                        endResponse();
                    }
                    
                }
                else {
                    endResponse();
                }

            }
            else {
                fs.unlinkSync(secretFolder+"/fpsessions/"+fpID);
                res.write("Link broken or Expired");
                
                endResponse();
            }
        }
        else {
            res.write("Link broken or Expired");
            endResponse();
        }
    }
    else {
        res.write("Link broken or Expired");
        endResponse();
    }

    function endResponse(){
        res.end();
    }
};