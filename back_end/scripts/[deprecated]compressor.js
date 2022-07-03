var fs = require("fs");

exports.startCompression = (path)=>{
    return new Promise(
        (resolve,reject)=>{

            
        try {
            if(fs.existsSync(path)) {
                
                var cmd = "native\\compress \""+path+"\"";
                command(cmd).then(
                    ()=>{
                        resolve();
                    },
                    (e)=>{
                        reject(e);
                    }

                );
            }
            else {
                return reject();
            }
        }
        catch(e) {
            return reject(e);
        }

        }
    );    

};
/*
function command(cmd){
     
    return new Promise(
        (resolve,response)=>{
            var cp = require("child_process");

            cp.exec(cmd,(err,stdout,stderr)=>{
                if(err) {
                    reject(err);
                }
                
                if(stdout){
                    resolve(stdout);
                }
                if(stderr){
                    reject(stderr);
                }
                
            });
        }
    );

}*/