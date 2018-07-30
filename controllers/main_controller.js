const fs = require('fs'); // necesitado para guardar/cargar unqfy
const notmod = require('../notificationService');
const errors = require('../errors');
//const picklejs = require('picklejs');
const rp = require('request-promise')

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
      url: 'http://localhost:8000/api/existArtist/'+_artistId,
       json: true,
     };
     console.log(options.url)
     return rp.get(options).then((response) => response.exist).catch((err) => {
       //console.log('existArtistInUnqfy ORIGINAL ERROR:');
       //console.log(err);
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
  if(req.body.artistId == undefined || req.body.email == undefined){
    throw new errors.BadRequestError;
  }

  let options = {
      url: 'http://localhost:8000/api/existArtist/'+req.body.artistId,
       json: true,
     };
  console.log('http://localhost:8000/api/existArtist/'+req.body.artistId)
  rp.get(options).then((response) => {
      if(!response.exist){
        throw new errors.RelatedResourceNotFoundError;
      }
    //if(!existArtistInUnqfy(req.body.artistId)){
      //throw new errors.RelatedResourceNotFoundError;
    //}

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
  }).catch( (error) => next(error))
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
    }).catch((err) => res.status(err.status).send(err));//TO DO: AGREGAR CATCH CORRECTO (QUIZAS?)
  } catch (e) {
    res.status(e.status).send(e);
    throw e;
  }

/*
  if(!existArtistInUnqfy(req.body.artistId)){
    throw new errors.RelatedResourceNotFoundError;
  }

  let notificationService = getNotificationService("BaseDeDatos");

  if(notificationService.existSubscriberOf(req.body.artistId, req.body.email)){
    notificationService.deleteSubscriberOf(req.body.artistId, req.body.email);
    saveNotificationService(notificationService, "BaseDeDatos");
  }

  res.status(200).send();
*/
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
    //throw new errors.BadRequestError; //TO DO: MANEJO DE ERRORES
  } else {

    existArtistInUnqfy(artistId).then((existeArtista) => {
      if(!existeArtista){
        let errorHandleado = new errors.RelatedResourceNotFoundError;
        res.status(errorHandleado.status).send(errorHandleado)
        //throw new errors.RelatedResourceNotFoundError;//TO DO: MANEJO DE ERRORES
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
          //throw e;
        }//.catch();//TO DO: MANEJO DE ERRORES
      }
    })

  }

}

/*
function notifyAll(req, res){
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
*/
function getEmailsOf(req, res){
  console.log('getEmailsOf')
  console.log('artistId: '+req.params.artistId);
  if(req.params.artistId == undefined){
    throw new errors.BadRequestError;
  }

  existArtistInUnqfy(req.params.artistId).then((existeArtista) => {
    if(!existeArtista){
      throw new errors.RelatedResourceNotFoundError;
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
       //console.log(new errors.RelatedResourceNotFoundError)
       //throw new errors.RelatedResourceNotFoundError;
     }



    }
  });//TO DO: AGREGAR CATCH

  /*
  console.log(existArtistInUnqfy(req.params.artistId));
  if(!existArtistInUnqfy(req.params.artistId)){
    throw new errors.RelatedResourceNotFoundError;
  }

  let notificationService = getNotificationService("BaseDeDatos");
  let emails = notificationService.getEmailsOf(req.params.artistId);

  res.status(200).send({artistId:req.params.artistId, subscriptors:emails});
  console.log('getEmailsOf TERMINO')
  */
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
    //throw errorHandled //TO DO: MANEJO DE ERRORES
  }

}

function deleteAllEmailsOf(req, res){
  if(req.body.artistId == undefined || !isNumeric(req.body.artistId)){
    throw new errors.BadRequestError;
  }

  existArtistInUnqfy(req.body.artistId).then((existeArtista) => {
    if(!existeArtista){
      let errorHandled = new errors.RelatedResourceNotFoundError;
      res.status(errorHandled.status).send(errorHandled);
      //throw new errors.RelatedResourceNotFoundError;
    } else {
      let notificationService = getNotificationService("BaseDeDatos");
      notificationService.deleteAllEmailsOf(req.body.artistId);
      saveNotificationService(notificationService,"BaseDeDatos");
      res.status(200).send();
    }
  }).catch((err) => {
    let errorHandled = new errors.RelatedResourceNotFoundError;
    res.status(errorHandled.status).send(errorHandled);
    //throw errorHandled //TO DO: MANEJO DE ERRORES
  });

/*
  if(!existArtistInUnqfy(req.body.artistId)){
    throw new errors.RelatedResourceNotFoundError;
  }

  let notificationService = getNotificationService("BaseDeDatos");
  notificationService.deleteEmailsOf(req.body.artistId);

  res.status(200).send();
  */
}

function all(req, res) {
  let notificationService = getNotificationService("BaseDeDatos");
  //res.status(200).send(notificationService.subjects);
  //res.status(200).send({respuesta: 'funca'});
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
