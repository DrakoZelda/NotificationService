const app = require('./app');
const config = require('./config/cfg');

app.listen(config.port, () => {
  console.log(`API REST corriendo en http://localhost:${config.port}`);
});
