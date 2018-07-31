const nodemailer = require('nodemailer');

class Observer {
  constructor (_email) {
    this.email = _email;
  }

  notify (_subject,_message,_from) {
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
