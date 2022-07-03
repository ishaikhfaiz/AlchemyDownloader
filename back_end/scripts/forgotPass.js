var req,res;
module.exports = function (rq,rs) {
    req=rq; res=rs;
    var fs = require("fs");
    var h = req.headers;
    if(h["uname"]){
        if(fs.existsSync(root+"/accounts/"+h["uname"])){
            var uname = h["uname"];
            var pass = fs.readdirSync(root+"/accounts/"+uname)[0];
            var mail = fs.readFileSync(root+"/accounts/"+uname+"/"+pass+"/mail").toString();

            createFP();
            
        }
        else {
            res.write("Invalid Uname");
            endResponse();
        }
    }
    else {
        res.write("Invalid Param");
        endResponse();
    }
    
    /**
     * @description Creates the forgot password session file
     */
    function createFP(){
        var mail_m = require("./mail");
        var fpID = require("./random").get(48);

        if(fs.existsSync(root+"/zlzhh0ljzQU^yxy@@$hhS$hhi0SShRA1S^iTATQj%B1/fpsessions/"+fpID)){
            return createFP();
        }
        var fpExp = new Date().getTime()+(10*60*1000);
        fs.writeFileSync(root+"/zlzhh0ljzQU^yxy@@$hhS$hhi0SShRA1S^iTATQj%B1/fpsessions/"+fpID,uname+"/"+pass+"/"+fpExp);
        //send mail
        var fpURL = "http://localhost:8080/resetPass?"+fpID;
        var body = "<h3>Click the link below to change your password</h3><br>\
                    <h4> <a href='"+fpURL+"'>change password</a> </h4>";
        
        var callback = function(){
            res.write("Check the mail sent to your E-mail ID to reset password. The link is valid for 10 minutes only");
            endResponse();
        };

        mail_m.send(mail,"Reset password of Alchemy Downloader account",body,callback); 

    }

    function endResponse(){
        res.end();
    }

};
