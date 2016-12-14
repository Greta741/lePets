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

const insertNew = (request, reply) => {
  payload = request.payload;
  const veisle = {
    redagavimo_data: new Date(),
    pavadinimas: payload.pavadinimas,
    gyvuno_tipas: payload.gyv_tip_radio,
    dydis: payload.gyv_dyd_select,
    aprasymas: payload.aprasymas,
    registravimo_data: new Date(),
    gyvunu_kiekis: 2,
    poveisliu_kiekis: 2,
  };

  let data = {};
  data.veisle = veisle;
  

  connection.query('insert into veisle set ?', veisle, (err, result) => {
    const nuotrauka = {
      veisle: result.insertId,
      url: payload.nuotraukos_url,
    };
    data.image = `<img class="v-image" src="${payload.nuotraukos_url}" alt="img"></img>`;
    connection.query('insert into nuotrauka set ?', nuotrauka, (err, result) => {
      reply.view('./veisles/veisle.html', {htmlData: vartotojai.generateNavBar(request.state.session), data});
    });
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
    connection.query('select * from nuotrauka where veisle = ?', id, (err, nuotrauka) => {
      if (veisle.length === 0) {
        data.message = '<div class="message">Nepavyko rasti veislės.</div>';
        reply.view('./veisles/veisle.html', {htmlData, data});
        return;
      }
      
      data.veisle = veisle[0];
      data.veisle.registravimo_data = formatDate(data.veisle.registravimo_data);
      data.veisle.redagavimo_data = formatDate(data.veisle.redagavimo_data);
      if(nuotrauka[0]) {
        data.image = `<img class="v-image" src="${nuotrauka[0].url}" alt="img"></img>`
      }
      reply.view('./veisles/veisle.html', {htmlData: vartotojai.generateNavBar(request.state.session), data});
    });
  });
}

module.exports = {
  allBreeds,
  registerView,
  insertNew,
  showPage,
}