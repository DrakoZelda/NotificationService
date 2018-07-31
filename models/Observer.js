const nodemailer = require('nodemailer');

class Observer {
  constructor (_email) {
    this.email = _email;
  }

  notify (_subject,_message,_from) {
    /*
    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com', // server para enviar mail desde gmail
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: 'pruebasProgramacion.7@gmail.com',
        pass: 'adolfito123789',
      },
    });

    // setup email data with unicode symbols
    const mailOptions = {
      from: params.from, // sender address
      to: this.email, // list of receivers
      subject: params.subject, // Subject line
      text: params.message, // plain text body
      html: '<b>Hello world?</b>' // html body
    };

    // enviando mail con callbacks
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log(info);

      }
    });
    */


    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'correounqfy@gmail.com',
        pass: 'relojroto'
      }
    });

    console.log('PRE mailOptions')
    console.log('from')
    console.log(_from)
    console.log('subject')
    console.log(_subject)
    console.log('message')
    console.log(_message)

    const mailOptions = {
      from: _from,
      to: this.email,
      subject: _subject,
      text: _message
      /*
      from: _from,//'correounqfy@gmail.com',
      to: this.email,
      subject: _subject,//'Notificacion',
      text: _message
      //html: '<p>Esto es una notificacion</p>'
      */
    };

    console.log('mailOptions')
    console.log(mailOptions.from)
    console.log(mailOptions.to)
    console.log(mailOptions.subject)
    console.log(mailOptions.text)

    transporter.sendMail(mailOptions, function (err, info){
      if(err) {
        console.log('ERROR ORIGINAL - observer.notify()')
        console.log(err);
        throw err;
      } else {
        console.log(info);
      }
    });

  }
}

module.exports = Observer;
