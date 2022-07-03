var actualRequire = require;
 require = function(module) {
    delete actualRequire.cache[actualRequire.resolve(module)];
    return actualRequire(module);
 };
 

module.exports = signup;
var req,res;
function signup(rq,rs){
    req =rq; res =rs;
    
    var fs = require("fs");
    var uname,fname,lname,mail,pass,dob,avt,session;
    var Promises =[];
    
    console.log("root: "+root);

    if(getParams(req.headers)){
        /*if(tmp1 = validate()){ //old stuff
           console.log("validate: "+tmp1); 
            createAcc();
        } */  

        validate().then(
            //on success
            ()=>{
                createAcc();
                endResponse();
            },
            //on error
            ()=>{
                endResponse();
            });

    }
    else {
        endResponse();
    }

    //endResponse();


    //fxn creations and declarations
    function createAcc(){
        Promises.push(new Promise(
            function(resolve,reject){
            	console.log("creating account...");
                fs.mkdir(root+"/accounts/"+uname,function(err){
                    if(err) {
                    	console.log("uname folder creation: "+err);
                        if(err.code=="EEXIST") {
                            
                            var eA = require("./expireAcc");
                            if(eA.isExpired(root+"/accounts/"+uname)) {
                                resolve();
                                return createAcc();
                            }

                            res.write("Account already exist");
                        }
                        resolve();
                    }
                    else {
                        
                        session = getSessionId();
							console.log('creating account folder for '+uname);
                        fs.mkdirSync(root+"/accounts/"+uname+"/"+session);
                        fs.writeFileSync(root+"/accounts/"+uname+"/"+session+"/fname",fname);
                        fs.writeFileSync(root+"/accounts/"+uname+"/"+session+"/lname",lname);
                        fs.writeFileSync(root+"/accounts/"+uname+"/"+session+"/mail",mail);
                        fs.writeFileSync(root+"/accounts/"+uname+"/"+session+"/dob",dob);
                        fs.writeFileSync(root+"/accounts/"+uname+"/"+session+"/pass",pass);

                        //somehow, storing avatar cannot be made synchronous like the above things(fname,lname,mail ....)  
                        
                        if(avt){
                            console.log("writing avt "+avt);
                            var np = fs.createWriteStream(root+"/accounts/"+uname+"/"+session+"/avatar.png");
                            avt.pipe(np).on("finish",()=>{
                                fs.unlinkSync(avt.path);
                                console.log("avt pipe finish");
                                sendVerificationMail();
                                resolve();
                            });
                            
                        }
                        else {
                            sendVerificationMail();
                            resolve();
                        }
                        
                    }
                });
            }
        ));
    }

    


    function sendVerificationMail(){
        Promises.push(
            new Promise(
                function(resolve,reject){
                    var verify = new require("./verify")(req,res);
                    verify.sendVerification(mail,uname,session,function(e){
                        if(e) {
                            res.write("Error: "+e);
                            res.write("Something went wrong in sending verification mail. check your E-mail id and Try Again.");
                            var del = require("./deleteFolder");
                            del.deleteFolder(root+"/accounts/"+uname,resolve);
                        }
                        else {
                            res.write("success&Click on the link sent to your E-mail id to verify your account. Do it quickly as the link will expire in 10 minutes. ");
                            resolve();
                        }
                    });
                }
            )
        );
    }

    function endResponse(){
        var tmp =[];
        Promises.forEach(function(v){
            tmp.push(v);
        });
        //console.log(tmp.length);
        Promise.all(Promises).then(function(){
            if(tmp.length==Promises.length){
                //console.log(tmp.length+" : "+Promises.length)
                console.log("response ended");
                res.end();
            }
            else {
                endResponse();
            }
        });
    }
    
    function getParams(h) {
    	console.log('getting params');
        var r;
        if(h['uname']) { uname = h['uname']; } else { return error("param"); }
        if(h['fname']) { fname = h['fname']; } else { return error("param"); }
        if(h['lname']) { lname = h['lname']; } else { return error("param"); }
        if(h['mail']) { mail = h['mail']; } else { return error("param"); }
        if(h['pass']) { pass = h['pass']; } else { return error("param"); }
        if(h['dob']) { dob = h['dob']; } else { return error("param"); }
        
        console.log(h);
        //validation from here
        
        return true;
    }
    
    function validate(){
        var validatePromise = new Promise(
            function(resolve,reject){
                ////////////////////
                                
                console.log('validating');
                var msg="",r;
                
                r = /^\w{6,15}$/i;
                if(!r.test(uname)){ msg+="uname: 6,15,a-z,0-9,_end"; }

                r = /^[a-z\s]{2,18}$/i;
                if(!r.test(fname)){ msg+="fname: 2,18,a-z,space end"; }
                if(!r.test(lname)){ msg+="lname: 2,18,a-z,space end"; }

                r = /^(?!.{40,})(\w+[.\w_-]+@\w+[.]+\w+)+$/i;
                if(!r.test(mail)){ msg+="mail: end"; }

                r = /^[^\/\\;:*?<>|"']{6,20}$/i;
                if(!r.test(pass)){ msg+="pass: /\\;:*?<>|\"' end"; }

                r=/^[1-2][90][0-9][0-9]-[0-1][0-9]-[0-3][0-9]$/i;
                if(!r.test(dob)){ msg+="dob: end"; }

                //avatar validation and assignation

                var avtValPromise = new Promise(
                    function(resolve,reject){
                                console.log("avtvalPromise invoked");
                                var fd = require("formidable");
                                var form = fd.IncomingForm();

                                console.log("parsing form");
                                form.on("error",(e)=>{
                                    console.log(e);
                                });
                                form.parse(req,(e,fields,files)=>{
                                    console.log("form parsed");
                                    if(files){
                                        

                                        console.log("file present in request");
                                        for (t in files){
                                            console.log(t+":"+files[t]);
                                        }
                                        if(!files["avt"]) {
                                            console.log("wrong name");
                                            avtVal = true;
                                            resolve();
                                            return true;    
                                        }

                                        var fs = require("fs");
                                        

                                        if(files["avt"].size/1024>200){
                                            msg+="avt: <200kb";
                                            console.log("avt is larger");
                                            resolve();
                                            return true;
                                        } 
                                        
                                        var op = fs.createReadStream(files["avt"].path);
                                        var avtChunks = new Array();
                                        op.on("data",(chunks)=>{
                                            avtChunks.push(chunks);
                                        });
                                        op.on("end",()=>{
                                            var hexSign = avtChunks[0][0].toString(16)+" "+avtChunks[0][1].toString(16);
                                            hexSign = hexSign.toUpperCase();
                                            if(! (hexSign=="89 50" || hexSign=="FF D8") ) {
                                                msg+="avt: only .png .jpg .jpeg";
                                                console.log("avt is not a image");
                                                resolve();
                                                return true;
                                            }

                                            op.close();
                                            op = fs.createReadStream(files["avt"].path);
                                            

                                            /**
                                             * @description this variable is assigned with the readstream of the avatar file (if present) in the validate method
                                             */
                                            avt = op;
                                            console.log("avt is fine, size: "+ files["avt"].size);
                                            resolve();
                                            return true;
                                        });
                                    }
                                    else {
                                        avtVal = true;
                                        console.log("no avt");
                                        resolve();
                                        return true;
                                    }
                                });
                            
                    }
                );

                avtValPromise.then(()=>{    
                    if(msg) {
                        res.write(msg);
                        reject();
                    }
                    else {
                        resolve();
                    }
                });

                ////////////////////
            }
        );
        return validatePromise;
    }

    function error(s) {
    	console.log('error occured by user');
        if(s=="param") { 
            res.write("Invalid Parameter");
            return false;
         }
    }

    function getSessionId() {
    			console.log('getting session');
        var random = require("./random");
        return random.get(48);

    }

    
    return this;
};
