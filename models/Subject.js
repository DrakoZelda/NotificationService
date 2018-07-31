const Observer = require('./Observer');

class Subject {
  constructor(_artistId){
    this.artistId = _artistId
    this.observers = [];
  }

  subscribe (_observer) {
    this.observers.push(_observer);
  }

  unsuscribe (_observer) {
    this.observers = this.observers.filter(o => o.email != _observer.email);
  }

  notifyAll (_subject,_message,_from) {
    try {
      this.observers.forEach(o => o.notify(_subject,_message,_from));
    } catch (e) {
      throw e;
    }

  }

  existObserver (_observer){
    let ob = this.observers.filter(o => o.email == _observer.email);
    return (ob.length !== 0);
  }

  deleteEmails (){
    this.observers = []
  }

  deleteSubscriberIfExist (_email){
    let filteredSubs = this.observers.filter(o => o.email !== _email);
    this.observers = filteredSubs;
    console.log(filteredSubs)
  }

  getObservers () {
    return this.observers.map((obs) => obs.email);
  }
}

module.exports = Subject;
