const fs = require('fs'); // necesitado para guardar/cargar unqfy
const notmod = require('../notificationService');
const errors = require('../errors');

// Retorna una instancia de NotificationService. Si existe filename, recupera la instancia desde el archivo.
function getNotificationService(filename) {
  let notificationService = new notmod.NotificationService();
  if (fs.existsSync("../" + filename)) {
    console.log();
    notificationService = notmod.NotificationService.load(filename);
  }
  return notificationService;
}

// Guarda el estado de NotificationService en filename
function saveNotificationService(notificationService, filename) {
  console.log();
  notificationService.save(filename);
}


function suscribe(req, res){
  if(req.body.artistId == undefined || req.body.email == undefined){
    throw new errors.BadRequestError;
  }

  if(!existArtistInUnqfy(req.body.artistId)){
    throw new errors.RelatedResourceNotFoundError;
  }

  let notificationService = getNotificationService("BaseDeDatos");

  if(!notificationService.existSubscriberOf(req.body.artistId, req.body.email)) {
    notificationService.addSubscriberTo(req.body.artistId, req.body.email);
    saveNotificationService(notificationService, "BaseDeDatos");
  }

  res.status(200).send();
}

function unsuscribe(req, res){
  if(req.body.artistId == undefined || req.body.email == undefined){
    throw new errors.BadRequestError;
  }

  if(!existArtistInUnqfy(req.body.artistId)){
    throw new errors.RelatedResourceNotFoundError;
  }

  let notificationService = getNotificationService("BaseDeDatos");

  if(notificationService.existSubscriberOf(req.body.artistId, req.body.email)){
    notificationService.deleteSubscriberOf(req.body.artistId, req.body.email);
    saveNotificationService(notificationService, "BaseDeDatos");
  }

  res.status(200).send();

}

function notify(req, res){
  if(req.body.artistId == undefined || req.body.subject == undefined || req.body.message == undefined || req.body.from == undefined){
    throw new errors.BadRequestError;
  }

  if(!existArtistInUnqfy(req.body.artistId)){
    throw new errors.RelatedResourceNotFoundError;
  }

  let notificationService = getNotificationService("BaseDeDatos");
  notificationService.notifyAll({artistId:req.body.artistId, subject:req.body.subject,message:req.body.message,from:req.body.from});
  res.status(200).send();
}

function getEmailsOf(req, res){
  if(req.params.artistId == undefined){
    throw new errors.BadRequestError;
  }

  if(!existArtistInUnqfy(req.params.artistId)){
    throw new errors.RelatedResourceNotFoundError;
  }

  let notificationService = getNotificationService("BaseDeDatos");
  let emails = notificationService.getEmailsOf(req.params.artistId);

  res.status(200).send({artistId:req.params.artistId, subscriptors:emails});
}

function deleteEmailsOf(req, res){
  if(req.body.artistId == undefined){
    throw new errors.BadRequestError;
  }

  if(!existArtistInUnqfy(req.body.artistId)){
    throw new errors.RelatedResourceNotFoundError;
  }

  let notificationService = getNotificationService("BaseDeDatos");
  notificationService.deleteEmailsOf(req.body.artistId);

  res.status(200).send();
}
