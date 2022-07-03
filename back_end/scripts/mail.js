var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service:"gmail",
    auth: {
      user: "zyfa.apps@gmail.com",
      pass: "asfm@kzma"
    }
});

exports.send = function (mail,sub,body,callback){
    
    var mailOptions = {
        from: 'zyfa.apps@gmail.com',
        to: mail,
        subject: sub,
        html: body
    };
    
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            callback(error);
        } else {
            callback();
        }
    });

};