var http =require("http");
var i=0;
http.createServer(
    function(req,res){
        if(req.url.substring(1)!=""){
            i++;
        }
        res.end();
        console.log(i); 
    }
).listen(8080);

var a = [
    ["A","Q","h","x","@"],
    ["B","R","i","y","hh"],
    ["C","S","j","z","$"],
    ["D","T","k","0","^"],
    ["E","U","l","1","%"],
    ["F","V","m","2","cc"],
    ["G","X","n","3","*"],
    ["H","Y","o","4","("],
    ["I","Z","p","5",")"],
    ["J","a","q","6","-"],
    ["K","b","r","7","_"],
    ["L","c","s","8","+"],
    ["M","d","t","9","="],
    ["N","e","u","!","aa"],
    ["O","f","v","~","as"],
    ["P","g","w","`","fm"]
];

var options = {
    hostname: 'localhost',
    port: 8080,
    path: '',
    method: 'GET'
  }

a.forEach(function(v){
    v.forEach(
        function(v){
            http.request("http://localhost:8080/"+v).end();
        }
    );
});


