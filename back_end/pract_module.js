
var i=0;
var res,req;
module.exports = function(rq,rs) {
    req=rq; res=rs;
    i++;

    this.show = function(){ 
        pr().then(()=>{
            res.write(req.url);
            res.end();
        });
    };

    
    return this;
};


 function pr() {
     return new Promise((resolve,reject)=>{

            setTimeout(resolve,5000);

     });
 }
 