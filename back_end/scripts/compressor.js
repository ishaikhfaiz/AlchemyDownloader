var fs = require("fs");

exports.startCompression = (path)=>{

    return new Promise(
        (resolve,reject)=>{


            if(!fs.existsSync(path)){
                reject("Invalid Path");
                return;    
            }
            
            var archiver = require("archiver");

            var fileName = path.split("/").pop();
            fileName = fileName.split(".");
            fileName.pop();
            fileName = fileName.join(".");

            var compressedFile = fs.createWriteStream(path+".zip");
            var uncompressedFile = fs.createReadStream(path);

            var archive = archiver("zip",{
                zlib:{level:9}
            }); 

            archive.on("error",(e)=>{
                reject(e);
                return;
            });
            archive.on("warning",(e)=>{
                console.log(e);
                return;
            });

            archive.on("end",()=>{
                uncompressedFile.close();
                compressedFile.close();
                fs.unlinkSync(path);
                resolve(path+".zip");
                return;
            });

            archive.pipe(compressedFile);

            archive.append(uncompressedFile,{ name:fileName });
            archive.finalize();
        }
    );

};