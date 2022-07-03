/**
 * @param max length of random id
 * @description returns a random id
 */
exports.get = function(max){
    var result="";
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

    for (var i=0; i<max; i++){
        var m = Math.floor(Math.random()*5);
        var n = Math.floor(Math.random()*5);
        
        result+=a[m][n];
    }

    return result;

};
