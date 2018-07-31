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
    /*
    let sub = this.subjects.filter(s => s.artistId == _artistId);
    return (sub.length !== 0);
    */
    let sub = this.subjects.find(s => s.artistId == _artistId);
    return (sub !== undefined);
  }

  addSubscriberTo(_artistId, _email){
    console.log('addSubscriberTo')
    let sub;
    if(this.existSubjectOf(_artistId)){
      console.log('if existSubjectOf TRUE')
      sub = this.subjects.find(s => s.artistId == _artistId);
      sub.subscribe(new Observer(_email));
      //this.subjects = this.subjects.filter(s => s.artistId !== _artistId).push(sub);
      let newSubjects = this.subjects.filter(s => s.artistId !== _artistId);
      newSubjects.push(sub);
      this.subjects = newSubjects;

    } else{
      console.log('if existSubjectOf FALSE')
      sub = new Subject(_artistId);
      console.log('new subject')
      console.log(sub)
      sub.subscribe(new Observer(_email));
      console.log('add observer')
      console.log(sub)
      this.subjects.push(sub);
      console.log(this.subjects)
    }
  }

  deleteSubscriberOf(_artistId, _email){
    let sub = this.subjects.find(s => s.artistId == _artistId);
    sub.unsuscribe(new Observer(_email));
    this.subjects = this.subjects.filter(s => s.artistId !== _artistId).push(sub);
  }

  deleteSubscriberIfExistOf(_artistId, _email){
    try {
      console.log(_artistId)
      let artist = this.subjects.find(s => s.artistId == _artistId);
      console.log(artist)
      /*if(artist === undefined) {
          throw new Error('No existe el artista con id: '+_artistId);
      }*/
      artist.deleteSubscriberIfExist(_email);
    } catch (e) {}

  }

  notifyAll(_params){
    this.subjects.forEach(s => s.notify(_params));
  }

  getEmailsOf(_artistId){
    let artist = this.subjects.find(s => s.artistId == _artistId)
    if(artist === undefined) {
        throw new Error('No existe el artista con id: '+_artistId);
    }
    let emails = artist.getObservers();
    return emails;
  }

  deleteAllEmailsOf(_artistId){
    let sub = this.subjects.find(s => s.artistId == _artistId);
    if(sub !== undefined){
      sub.deleteEmails();
      let subjectsUpdated = this.subjects.filter(s => s.artistId !== _artistId);
      subjectsUpdated.push(sub);
      this.subjects = subjectsUpdated;
    }

  }

  deleteArtistFeed(_artistId) {
    console.log('deleteArtistFeed')
  //  if(this.existSubjectOf(_artistId)){
      console.log('if true')
      console.log('_artistId = '+_artistId)
      let subjectsUpdated = this.subjects.filter(s => s.artistId != _artistId);
      this.subjects = subjectsUpdated;
      console.log('subjectsUpdated')
      console.log(subjectsUpdated)
      console.log('this.subjects')
      console.log(this.subjects)
    /*} else {
      console.log('if false')
      throw new Error('No existe el artista con id: '+_artistId);
    }
    */
  }

  notify(_artistId,_subject,_message,_from){
    let artist = this.subjects.find(s => s.artistId == _artistId);
    if(artist === undefined) {
      //No hace nada porque si llego hasta aca significa que el artista existe en UNQfy (chequeado en main_controller)
      // pero el hecho de que no exista en notificationService es porque nunca se subscribio alguien
    } else {
      try {
        artist.notifyAll(_subject,_message,_from);
      } catch (e) {
        //throw e;
        console.log('ERROR ORIGINAL')
        console.log(e)
        let errorHandleado = new errors.InternalServerError
        res.status(errorHandleado.status).send(errorHandleado)
      }
    }
  }

  save(filename) {
    new picklejs.FileSerializer().serialize(filename, this);
  }

  static load(filename = 'notificationService.json') {
    const fs = new picklejs.FileSerializer();
    // TODO: Agregar a la lista todas las clases que necesitan ser instanciadas
    const classes = [NotificationService,Subject,Observer];
    fs.registerClasses(...classes);
    return fs.load(filename);
  }

/*
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
  */


}

module.exports = {
  NotificationService
};
