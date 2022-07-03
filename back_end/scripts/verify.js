
module.exports = verify;
var req,res;
function verify(rq,rs){
    req=rq;
    res=rs;

    
    /**
     * @description "sents a verification email to the user's email id"
     * @param mail "Email id of user"
     * @param uname "username of user"
     * @param sid "session id of user" 
     */

    this.sendVerification = function(email,uname,sid,callback){
    				console.log('sending verification');
        var mail = require("./mail");

        var body = "<h1>Welcome to Alchemy Downloader!</h1><br> \
                    <h3>Click <a href='http://192.168.137.1:8080/verify?"+uname+"&"+sid+"'>here</a> to verif your E-mail ID </h3>";

        mail.send(email,"Welcome to Alchemy Downloader!",body,function(e){
            if(e) {
                callback(e);
                console.log('error in sending verification: '+e);
            }
            else {
                //expiring email
				console.log('verification sent and now setting it\'s expiry');
                
                var eA = require("./expireAcc");
                eA.setExpiry(root+"/accounts/"+uname,10*60*1000,callback);

                /*setTimeout(
                    function(){
                        console.log("expiring email now");
                        var fs = require("fs");
                        if(fs.existsSync("./accounts/"+uname+"/"+sid)){
                            var del = require("./deleteFolder");
                            del.deleteFolder("./accounts/"+uname,function(){
                                console.log("account deleted");
                            });
                        }
                    },15*60*1000//minutes
                );*/
            }
        });
    };

    this.verifyMail = function(){

        if( !(req.url.split("?")[1]) ){
            res.write("Link broken");
            res.end();
            return;
        }
        if( !(req.url.split("?")[1].split("&")[0] || req.url.split("?")[1].split("&")[1]) ){
            res.write("Link broken");
            res.end();
            return;
        }

        var uname = req.url.split("?")[1].split("&")[0];
        var sid = req.url.split("?")[1].split("&")[1]; 
        console.log('verifying mail \n checking expiry');
        var eA = require("./expireAcc");
        if(eA.isExpired(root+"/accounts/"+uname)){
            console.log('link broken or expired');
            res.write("Link broken or expired");
            res.end();
            return;
        }

        var fs = require("fs");
        console.log('completing verification');
        fs.access(root+"/accounts/"+uname+"/"+sid,function(e){
            if(e){
            					console.log('link broken or expired');
                res.write("Link broken or expired");
                res.end();
                return;
            }
            else {
                fs.readFile(root+"/accounts/"+uname+"/"+sid+"/pass",function(e,d){
                    
                    if(e){
                    	console.log('Error in reading pass file: '+e);
                        res.write("Something went wrong. Try again");
                        res.end();
                    }
                    else {
                        var pass = d.toString("utf8");

                        fs.rename(root+"/accounts/"+uname+"/"+sid,root+"/accounts/"+uname+"/"+pass,function(e){
                            if(e) {
                            	console.log('error in renaming sid to pass: '+e);
                                res.write("Something went wrong. Try again");
                                res.end();
                            }
                            else {
                            	
                                fs.unlinkSync(root+"/accounts/"+uname+"/exp");
                                console.log('verification completed');
                                res.write("Your E-mail is now verified, you can login to your account");
                                res.end();
                            }
                        });
                    }
                });
            }
        });

    };



    return this;
};
