var fs = require("fs");

function deleteFolder(fold,callback){
    function del(path){
        if(!fs.existsSync(path)){
           if(!callback) { return; }
           return callback("Invalid Path");
        }
        var f=fs.readdirSync(path);
        if(f.length==0) {
            fs.rmdirSync(path);
            //console.log("Removing "+path);
        }
        else {
            f.forEach(
                function(v,i,a){
                    var cp = path+"/"+v;
                    if(fs.lstatSync(cp).isDirectory()){
                        del(cp);
                    }
                    else{
                        fs.unlinkSync(cp);
                        console.log("Deleting: "+cp);
                    }
                    if(i==(a.length-1)){
                        try {
                            fs.rmdirSync(path);
                            console.log("removing dir: "+path)
                        }
                        catch(e){
                            del(path);
                        }
                        
                    }
                }
            );
        }
    }
    del(fold);
    if(callback){ callback(); }
}

exports.deleteFolder = deleteFolder;