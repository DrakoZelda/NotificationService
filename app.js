const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const errors = require('./errors')

const mainController = require('./controllers/main_controller')
const api = express.Router();

//Suscribir un email a un artista
api.post('/subscribe', mainController.subscribe);

//ESTO ES SOLO PARA TEST
api.get('/all', mainController.all);

//Desuscribir un email de un artista
api.post('/unsubscribe', mainController.unsubscribe);

//Notificar a los usuarios suscritos a un artista
api.post('/notify', mainController.notify);

//Obtener todos los emails suscritos a un artista
api.get('/subscriptions/:artistId', mainController.getEmailsOf);

//Eliminar todos los emails suscritos a un artista
api.delete('/subscriptions', mainController.deleteAllEmailsOf);

//Elimina el feed de un artista
api.delete('/deleteFeed',mainController.deleteFeed);

function invalidJsonHandler(err, req, res, next) {
    if (err) {
      throw new errors.BadRequestError();
    }
  }

app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
app.use(invalidJsonHandler);
app.use('/api', api);
app.use(function(req, res){
    res.status(404).send({status:404,errorCode:"RESOURCE_NOT_FOUND"});
});

module.exports = app;
