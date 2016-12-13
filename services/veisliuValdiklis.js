const mysql = require('mysql');
const vartotojai = require('./vartotojuValdiklis.js');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'pets'
});
connection.connect();

const allBreeds = (request, reply) => {
  const data = {};
  connection.query('select * from veisle', (err, veisles) => {
      if (veisles.length === 0) {
        data.message = 'Veislių sistemoje nėra.'; 
        reply.view('./veisles/visosVeisles.html', {htmlData: vartotojai.generateNavBar(request.state.session), data});
        return;       
      }
      else {
        data.veisles = veisles;
        data.veisles.forEach((item) => {
          item.redagavimo_data = formatDate(item.gimimo_data);
        });
        reply.view('./veisles/visosVeisles.html', {htmlData: vartotojai.generateNavBar(request.state.session), data});
      }      
    });
};

const registerView = (request, reply) => {
  reply.view('./veisles/veislesRegistracija.html', {htmlData: vartotojai.generateNavBar(request.state.session)});
};

const insertNew = (data) => {
  data = data.payload;
  const veisle = {
    redagavimo_data: new Date(),
    pavadinimas: data.pavadinimas,
    gyvuno_tipas: data.gyv_tip_radio,
    dydis: data.gyv_dyd_select,
    aprasymas: data.aprasymas,
    registravimo_data: new Date(),
    gyvunu_kiekis: 2,
    poveisliu_kiekis: 2,
  };

  connection.query('insert into veisle set ?', veisle, (err, result) => {

  });
};

const formatDate = (data) => {
  const date = new Date(data);
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
};

const showPage = (request, reply) => {
  const id = request.params.id;
  let data = {};
  connection.query('select * from veisle where id = ?', id, (err, veisle) => {
    if (veisle.length === 0) {
      data.message = '<div class="message">Nepavyko rasti veislės.</div>';
      reply.view('./veisles/veisle.html', {htmlData, data});
      return;
    }
    
    data.veisle = veisle[0];
    data.veisle.registravimo_data = formatDate(data.veisle.registravimo_data);
    data.veisle.redagavimo_data = formatDate(data.veisle.redagavimo_data);
    // data.image = `<img class="v-image" src="${veisle[0].nuotraukos_url}" alt="img"></img>`
    reply.view('./veisles/veisle.html', {htmlData: vartotojai.generateNavBar(request.state.session), data});
  });
}

module.exports = {
  allBreeds,
  registerView,
  insertNew,
  showPage,
}