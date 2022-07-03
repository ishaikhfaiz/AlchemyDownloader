var res,req;
module.exports = function(rq,rs){
    res=rs; req =rq;
    var fs = require("fs");
    var uname,pass,sid;

    if(getParams(req.headers)){
        if(sid) {
            console.log(sid);
            if(getAccFromSID()){
                login();
                return endResponse();
            }
            else {
                return endResponse();
            }
        }
        else {
            login();
            return endResponse();
        }
    }
    else {
        res.write("ERR&Invalid Parameters");
        endResponse();
    }

    //fxn decalrations...
    
    /**
     * 
     * @param {"the request header"} h 
     * @description sets parameters and returns true on success else false
     */
    function getParams(h) {

        if(h["login-type"]=="uname"){
            if(!h["uname"] || !h["pass"]) { return false; }
            uname = h["uname"];
            pass = h["pass"];
            return true;
        }

        if(h["login-type"]=="sid"){
            if(!h["sid"]){ return false; }
            sid = h["sid"];
            return true;
        }

        else {        
            return false;
        }

    }

    /**
     * @description login using uname and pass and then creates and sents a new sid per login
     */
    function login(){
        if(fs.existsSync(root+"/accounts/"+uname)){
            if(fs.existsSync(root+"/accounts/"+uname+"/"+pass)){
                createSession();
            }
            else {
                res.write("ERR&Wrong Password");
                endResponse();
            }
        }
        else {
            res.write("ERR&Invalid Username");
            endResponse();
        }
    }

    /**
     * @description retrieves uname and pass from sid and set them in their respected variables.
     */
    function getAccFromSID(){
        if(fs.existsSync(secretFolder+"/sessions/"+sid)){
            var tmp = fs.readFileSync(secretFolder+"/sessions/"+sid).toString();
            uname = tmp.split("/")[0];
            pass = tmp.split("/")[1];
            fs.unlinkSync(secretFolder+"/sessions/"+sid);
            return true;
        }
        else {
            res.write("ERR&Invalid SID");
            endResponse();
            return false;
        }
    }

    function createSession(){
        var ran = require("./random");
        sid=ran.get(42);
        if(fs.existsSync(root+"/accounts/"+uname+"/"+pass+"/sid")){
            var tmp = fs.readFileSync(root+"/accounts/"+uname+"/"+pass+"/sid");
            if(fs.existsSync(secretFolder+"/sessions/"+tmp)) {
                fs.unlinkSync(secretFolder+"/sessions/"+tmp);
            }
            
        }
        if(fs.existsSync(secretFolder+"/sessions/"+sid)){
            return createSession();
        }
        fs.writeFileSync(secretFolder+"/sessions/"+sid,uname+"/"+pass);
        fs.writeFileSync(root+"/accounts/"+uname+"/"+pass+"/sid",sid);
        res.write("SID&"+sid);
    }

    function endResponse(){
        res.end();
    }        
};
