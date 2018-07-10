const express = require('express')
const mainController = require('../controllers/main_controller')
const api = express.Router();

api.post('/suscribe', mainController.suscribe);
api.post('/unsuscribe', mainController.unsuscribe);
api.post('/notify', mainController.notifyAll);
api.get('/subscriptions?artistId=:artistId', mainController.getEmailsOf);
api.delete('/subscriptions', mainController.deleteEmailsOf);
