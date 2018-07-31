const app = require('./app');
const config = require('./config/cfg');

app.listen(config.port, () => {
  console.log(`API REST corriendo en http://localhost:${config.port}`);
});

// Ejemplo envio correo
/*
console.log('empieza');
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'correounqfy@gmail.com',
    pass: 'relojroto'
  }
});

const mailOptions = {
  from: 'correounqfy@gmail.com',
  to: 'urielintemperie@gmail.com',
  subject: 'Ejemplo de nodemailer',
  html: '<p>Esto es una prueba</p>'
};

transporter.sendMail(mailOptions, function (err, info){
  if(err) {
    console.log(err);
  } else {
    console.log(info);
  }
});
console.log('termino')
*/
