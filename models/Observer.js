const nodemailer = require('nodemailer');

class Observer {
  contructor (_email) {
    this.email = _email;
  }

  notify (params) {
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
    }
  }
