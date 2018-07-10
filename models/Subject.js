const Observer = require('./Observer');

class Subject {
  contructor(_artistId){
    this.artistId = _artistId
    this.observers = [];
  }

  subscribe (_observer) {
    this.observers.push(_observer);
  }

  unsuscribe (_observer) {
    this.observers = this.observers.filter(o => o.email != _observer.email);
  }

  notifyAll (_params) {
    this.observers.forEach(o => o.notify(_params));
  }

  existObserver (_observer){
    let ob = this.observers.filter(o => o.email == _observer.email);
    return (ob.length !== 0);
  }

  deleteEmails (){
    this.observers = []
  }
}
