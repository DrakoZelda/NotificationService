const fs = require('fs'); // necesitado para guardar/cargar unqfy
const notmod = require('../notificationService');
const errors = require('../errors');
const rp = require('request-promise')
const UNQFY_BASEURL = 'http://' + 'localhost'+ ':' + '8000' + '/api/';

// Retorna una instancia de NotificationService. Si existe filename, recupera la instancia desde el archivo.
function getNotificationService(filename) {
  let notificationService = new notmod.NotificationService();
  if (fs.existsSync('./' + filename)) {
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

function existArtistInUnqfy(_artistId){
  let options = {
      url: UNQFY_BASEURL + 'existArtist/'+_artistId,
       json: true,
     };
     console.log(options.url)
     return rp.get(options).then((response) => response.exist).catch((err) => {
       if(err.statusCode == 404){
         throw new errors.RelatedResourceNotFoundError;
       } else {
         console.log('rompio existArtistInUnqfy. _artistId = '+_artistId);
         throw new errors.InternalServerError;
       }
     });
}

function isNumeric(n) {
  return !Number.isNaN(parseFloat(n));
}

function subscribe(req, res, next){
  console.log('subscribe')
  if(req.body.artistId == undefined || req.body.email == undefined || req.body.email == '' || !isNumeric(req.body.artistId)){
    let errorHandleado = new errors.BadRequestError
    res.status(errorHandleado.status).send(errorHandleado)
  } else {
    existArtistInUnqfy(req.body.artistId).then((existeArtista) => {
        if(!existeArtista){
          let errorHandleado = new errors.RelatedResourceNotFoundError
          res.status(errorHandleado.status).send(errorHandleado)
        }

      let notificationService = getNotificationService("BaseDeDatos");
      console.log(notificationService);

      if(!notificationService.existSubscriberOf(req.body.artistId, req.body.email)) {
        console.log('cargando nuevo subscriptor');
        console.log('artistId: '+req.body.artistId);
        console.log('email: '+req.body.email);
        notificationService.addSubscriberTo(req.body.artistId, req.body.email);
        saveNotificationService(notificationService, "BaseDeDatos");
        console.log('Guardo notificationService')
      } else {
        console.log('No guardo')
      }

      res.status(200).send();
    }).catch( (error) => {
    console.log('no pudo hablar con unqfy')
    let errorHandleado = new errors.InternalServerError
    res.status(errorHandleado.status).send(errorHandleado)
    });
  }
}

function unsubscribe(req, res){

  try {
    if(req.body.artistId == undefined || req.body.email == undefined || !isNumeric(req.body.artistId) || req.body.email == ''){
      throw new errors.BadRequestError;
    }

    existArtistInUnqfy(req.body.artistId).then((existeArtista) => {
      if(!existeArtista){
        throw new errors.RelatedResourceNotFoundError;
      } else {
        let notificationService = getNotificationService("BaseDeDatos");
        notificationService.deleteSubscriberIfExistOf(req.body.artistId,req.body.email);
        saveNotificationService(notificationService,"BaseDeDatos");
        res.status(200).send();
      }
    }).catch((err) => res.status(err.status).send(err));
  } catch (e) {
    res.status(e.status).send(e);
  }
}

function notify(req,res) {
  console.log('notify arranco')
  let artistId = req.body.artistId;
  let subject = req.body.subject;
  let message = req.body.message;
  let from = req.body.from;
  console.log('artistId = '+ req.body.artistId)
  console.log('subject = '+ req.body.subject)
  console.log('message = '+ req.body.message)
  console.log('from = '+ req.body.from)

  if(artistId == undefined || subject == undefined || message == undefined || from == undefined || !isNumeric(artistId)){
    let err = new errors.BadRequestError;
    res.status(err.status).send(err);
  } else {

    existArtistInUnqfy(artistId).then((existeArtista) => {
      if(!existeArtista){
        let errorHandleado = new errors.RelatedResourceNotFoundError;
        res.status(errorHandleado.status).send(errorHandleado)
      } else {
        let notificationService = getNotificationService("BaseDeDatos");


        try {
          notificationService.notify(artistId,subject,message,from);
          res.status(200).send();
        } catch (e) {
          console.log('ERROR ORIGINAL')
          console.log(e)
          let errorHandleado = new errors.InternalServerError
          res.status(errorHandleado.status).send(errorHandleado)
        }
      }
    }).catch(err => {
      console.log('no pudo hablar con unqfy')
      let errorHandleado = new errors.InternalServerError
      res.status(errorHandleado.status).send(errorHandleado)
    });

  }

}

function getEmailsOf(req, res){
  console.log('getEmailsOf')
  console.log('artistId: '+req.params.artistId);
  if(req.params.artistId == undefined || !isNumeric(req.params.artistId)){
    let errorHandleado = new errors.BadRequestError
    res.status(errorHandleado.status).send(errorHandleado)
  } else {
    existArtistInUnqfy(req.params.artistId).then((existeArtista) => {
      if(!existeArtista){
        let errorHandleado = new errors.RelatedResourceNotFoundError
        res.status(errorHandleado.status).send(errorHandleado)
      } else {
        let notificationService = getNotificationService("BaseDeDatos");
        let emails

        try{
         emails = notificationService.getEmailsOf(req.params.artistId);
         res.status(200).send({artistId:req.params.artistId, subscriptors:emails});
         console.log('getEmailsOf TERMINO')
        } catch(err) {
         let errorHandleado = new errors.RelatedResourceNotFoundError
         res.status(errorHandleado.status).send(errorHandleado)
       }
     }
    }).catch(err => {
      console.log('no pudo hablar con unqfy')
      let errorHandleado = new errors.InternalServerError
      res.status(errorHandleado.status).send(errorHandleado)
    });
  }
}

function deleteFeed(req, res){
  console.log('deleteFeed')
  if(req.body.artistId == undefined || !isNumeric(req.body.artistId)){
    throw new errors.BadRequestError;
  }
  try {
    let notificationService = getNotificationService("BaseDeDatos");
    console.log('PRE deleteArtistFeed')
    notificationService.deleteArtistFeed(req.body.artistId);
    console.log('POST deleteArtistFeed')
    saveNotificationService(notificationService,"BaseDeDatos");
    res.status(200).send();
  } catch (e) {
    console.log(e)
    let errorHandled = new errors.RelatedResourceNotFoundError;
    res.status(errorHandled.status).send(errorHandled);
  }

}

function deleteAllEmailsOf(req, res){
  if(req.body.artistId == undefined || !isNumeric(req.body.artistId)){
    let errorHandled = new errors.BadRequestError;
    res.status(errorHandled.status).send(errorHandled);
  } else {
    existArtistInUnqfy(req.body.artistId).then((existeArtista) => {
      if(!existeArtista){
        let errorHandled = new errors.RelatedResourceNotFoundError;
        res.status(errorHandled.status).send(errorHandled);
      } else {
        let notificationService = getNotificationService("BaseDeDatos");
        notificationService.deleteAllEmailsOf(req.body.artistId);
        saveNotificationService(notificationService,"BaseDeDatos");
        res.status(200).send();
      }
    }).catch((err) => {
      let errorHandled = new errors.RelatedResourceNotFoundError;
      res.status(errorHandled.status).send(errorHandled);
    });
  }
}

function all(req, res) {
  let notificationService = getNotificationService("BaseDeDatos");
  res.status(200).send(notificationService);
}

module.exports = {
  subscribe,
  unsubscribe,
  notify,
  getEmailsOf,
  deleteAllEmailsOf,
  deleteFeed,
  all
}
