const mysql = require('mysql');
const vartotojai = require('./vartotojuValdiklis.js');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'pets'
});
connection.connect();

const registerSubscriptionView = (request, reply) => {
  connection.query('select * from veisle', (err, veisle) => {
    connection.query('select * from poveisle', (err, poveisle) => {
      let data = {};
      data.veisle = veisle;
      data.poveisle = poveisle;
      reply.view('./prenumeratos/prenumeratuRegistracija.html', {htmlData: vartotojai.generateNavBar(request.state.session), data});
    });
  });
};

module.exports = {
    registerSubscriptionView,
}