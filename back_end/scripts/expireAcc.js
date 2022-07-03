/**
 * @description "sets a expiry for the account provided"
 * @param accPath "path to the user account with uname only"
 * @param t "expire after 't' milliseconds"
 */
exports.setExpiry = function(accPath,t,callback){
    console.log("setting expiry of mail");
    var fs= require("fs");
    var expf = accPath+"/exp"; //expiry file
    var expt = new Date().getTime()+t; //expiry time
    fs.writeFileSync(expf,expt);
    var uname = accPath.split("/").pop();
    fs.writeFileSync(secretFolder+"/yet2verify/"+uname,expt);


    callback();
};
/**
 * @description "returns true if provided acc is exepired else false"
 * @param accPath "path to the user account with uname only"
 */
exports.isExpired = function(accPath){
					console.log("checking expiry");
    var fs = require("fs");
				
				if(!fs.existsSync(accPath)) {
							return	 false;			
				}
				
    if(!fs.existsSync(accPath+"/exp")){
        return false;
    }

    var expt = parseInt(fs.readFileSync(accPath+"/exp").toString());
    var currt = new Date().getTime();
				console.log('expiry time in ms: '+expt+'\n curr time in ms: '+currt);
    if(currt>expt) {
        var del = require("./deleteFolder");
        del.deleteFolder(accPath);
        return true;
    }
    else {
        return false;
    }

};