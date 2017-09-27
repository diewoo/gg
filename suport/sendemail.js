const nodemailer = require('nodemailer');
const config = require('../config/config.json');
const mode = config.mode;
const mail = config[mode].mail;
const smtp = mail.mail;
const pwd = mail.pwd;
const dominio = config[mode].link;
const Mailgen = require('mailgen');
let transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: false,
    port: 25, // sets automatically host, port and connection security settings,
    auth: { 
            user:'diegoalonso.renteria@gmail.com',
            pass:'webcamdelima123'
    }
    

});

function confirm(data, done) {
    var mailGenerator = new Mailgen({
        theme: 'cerberus',
        product: {
            name: 'Crenteria S.A.C',
            link: 'http://www.crenteria.com/'
        }
    });
    
    let email = {
        body: {
            greeting: 'Contacto',
            title: 'ALGUIEN TE QUIERE CONTACTAR!!',
            signature: 'Contacto por la página web',             
            intro: ['Sus datos son:',' Nombres:'+' '+ data.name
            ,' Apellidos: '+' '+ data.lastname,'Cargo:'+' '+data.cargo
             ,' Empresa:'+' '+ data.empresa
            ,'Correo:'+' '+ data.correo,'telefono:'+' '+data.telefono,
            'País:'+' '+data.pais,'ruc:'+' '+data.ruc],
            outro:'Mensaje:'+' '+data.mensaje
        }
        
    };
    console.log(email);
    let emailBody = mailGenerator.generate(email);
    var emailText = mailGenerator.generatePlaintext(email);
    let emailOptions = {
        from: '"Crenteria S.A.C" <info@crenteria.com>',
        to: 'shikichaos@gmail.com',
        subject: "Contacto",
        text: emailText,
        html: emailBody
    };
    transporter.sendMail(emailOptions, function(error, info) {
        if (error) {
            console.log(error);
            done(error);
        } else {
            console.log('Message sent: ' + info.response);
            done(null, {
                cod: 1,
                msg: "Mensaje enviado correctamente"
            });
        }
    });


}
module.exports = {
    confirm
}