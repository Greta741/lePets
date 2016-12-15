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

const getMaxId = (callback) => {
  connection.query('select max(id) from prenumeratos_parinktys', (err, result) => {
    callback(result[0]['max(id)']);
  });
};

const registerSubscription = (request, reply) => {
  payload = request.payload;

  let data = {};

  if(payload.turi_apdovanojima === 'true') {
      data.turi_apdovanojima = 1;
  }

  if(payload.nurodytas_tevas === 'true') {
      data.nurodytas_tevas = 1;
  }

  if(payload.nurodyta_motina === 'true') {
      data.nurodyta_motina = 1;
  }

  if(payload.su_nuotrauka === 'true') {
      data.su_nuotrauka = 1;
  }
  
  if(payload.veisle !== '') {
      data.veisle = payload.veisle;
  }

  if(payload.poveisle !== '') {
      data.poveisle = payload.poveisle;
  }

  if(payload.gyv_tip_radio !== undefined) {
      data.gyv_tip_radio = payload.gyv_tip_radio;
  }

  if(payload.miestas !== '') {
      data.miestas = payload.miestas;
  }

  if(payload.max_kaina !== '') {
      data.max_kaina = payload.max_kaina;
  }

  if(payload.min_kaina !== '') {
      data.min_kaina = payload.min_kaina;
  }

  if(payload.max_amzius !== '') {
      data.max_amzius = payload.max_amzius;
  }

  if(payload.min_amzius !== '') {
      data.min_amzius = payload.min_amzius;
  }
    connection.query('insert into prenumeratos_parinktys set ?', data, (err, result) => {
        let date = new Date();
        const prenumerata = {
            parinktys: result.insertId,
            vartotojas: request.state.session.user_id,
            registravimo_data: date,
            galioja_iki: new Date(date.getTime() + 31556926000),
        };
        data.prenumerata = prenumerata;
        connection.query('insert into prenumerata set ?', prenumerata, (err, result) => {
            reply.view('./veisles/visosveisles.html', {htmlData: vartotojai.generateNavBar(request.state.session)});
        });
    });
};

module.exports = {
    registerSubscriptionView,
    registerSubscription,
}