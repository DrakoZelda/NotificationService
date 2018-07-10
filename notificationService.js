const picklejs = require('picklejs');
const Subject = require('./models/Subject');
const Observer = require('./models/Observer');

class NotificationService {

  constructor (_subjects) {
    if (_subjects !== undefined){
      this.subjects = _subjects;
    } else{
      this.subjects = new Array();
    }
  }

  existSubscriberOf(_artistId, _email){
    let sub = this.subjects.filter(s => s.artistId == _artistId);
    let ret = false
    if(sub.length !== 0){
      ret = sub[0].existObserver(new Observer(_email));
    }
    return ret;
  }

  existSubjectOf(_artistId){
    let sub = this.subjects.filter(s => s.artistId == _artistId);
    return (sub.length !== 0);
  }

  addSubscriberTo(_artistId, _email){
    let sub;
    if(existSubjectOf(_artistId)){
      sub = this.subjects.find(s => s.artistId == _artistId);
      sub.suscribe(new Observer(_email));
      this.subjects = this.subjects.filter(s => s.artistId !== _artistId).push(sub);

    } else{
      sub = new Subject(_artistId);
      sub.suscribe(new Observer(_email));
      this.subjects.push(sub);
    }
  }

  deleteSubscriberOf(_artistId, _email){
    let sub = this.subjects.find(s => s.artistId == _artistId);
    sub.unsuscribe(new Observer(_email));
    this.subjects = this.subjects.filter(s => s.artistId !== _artistId).push(sub);
  }

  notifyAll(_params){
    this.subjects.forEach(s => s.notify(_params));
  }

  getEmailsOf(_artistId){
    let emails = this.subjects.find(s => s.artistId == _artistId).observers;
    return emails;
  }

  deleteEmailsOf(_artistId){
    let sub = this.subjects.find(s => s.artistId == _artistId);
    sub.deleteEmails();
    this.subjects = this.subjects.filter(s => s.artistId !== _artistId).push(sub);
  }



  //save(filename = 'notificationService.json') {
  save(filename) {
    new picklejs.FileSerializer().serialize(filename, this);
  }

  static load(filename = 'notificationService.json') {
    const fs = new picklejs.FileSerializer();
    // TODO: Agregar a la lista todas las clases que necesitan ser instanciadas
    const classes = [NotificationService, Subject, Observer];
    fs.registerClasses(...classes);
    return fs.load(filename);
  }


}

module.exports = {
  NotificationService,
};
