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
          item.redagavimo_data = formatDate(item.redagavimo_data);
        });
        reply.view('./veisles/visosVeisles.html', {htmlData: vartotojai.generateNavBar(request.state.session), data});
      }      
    });
};

const registerView = (request, reply) => {
  reply.view('./veisles/veislesRegistracija.html', {htmlData: vartotojai.generateNavBar(request.state.session)});
};

const registerSubBreedView = (request, reply) => {
  connection.query('select * from veisle', (err, veisle) => {
    let data = {};
    data.veisle = veisle;
    reply.view('./veisles/poveislesRegistracija.html', {htmlData: vartotojai.generateNavBar(request.state.session), data});
  });
};

const editView = (request, reply) => {
  const id = request.params.id;

  let data = {};
  connection.query('select * from veisle where id = ?', id, (err, veisle) => {
    connection.query('select * from nuotrauka where veisle = ?', id, (err, nuotrauka) => {
      if (veisle.length === 0) {
        data.message = '<div class="message">Nepavyko rasti veislės.</div>';
        reply.view('./veisles/veisle.html', {htmlData, data});
        return;
      }
      switch(veisle[0].gyvuno_tipas) {
        case "šuo":
          data.dog = 'checked';
        break;
        case "katė":
          data.cat = 'checked';
        break;
      }

      switch(veisle[0].dydis) {
        case "XS":
          data.XS = 'selected';
        break;
        case "S":
          data.S = 'selected';
        break;
        case "M":
          data.M = 'selected';
        break;
        case "L":
          data.L = 'selected';
        break;
        case "XL":
          data.XL = 'selected';
        break;
        case "2XL":
          data.XL2 = 'selected';
        break;
        case "3XL":
          data.XL3 = 'selected';
        break;
        case "4XL":
          data.XL4 = 'selected';
        break;
      }

      data.veisle = veisle[0];
      if(nuotrauka[0]) {
        data.image = `<img class="v-image" src="${nuotrauka[0].url}" alt="img"></img>`
        data.nuotraukos_url = nuotrauka[0].url;
      }
      
      reply.view('./veisles/veislesRedagavimas.html', {htmlData: vartotojai.generateNavBar(request.state.session), data});
    });
  });
};

const editSubbreedView = (request, reply) => {
  const id = request.params.id;

  let data = {};
  connection.query('select * from poveisle where id = ?', id, (err, poveisle) => {
    connection.query('select * from nuotrauka where poveisle = ?', id, (err, nuotrauka) => {
      connection.query('select * from veisle', (err, veisle) => {
        data.veisle = veisle;
      
        if (poveisle.length === 0) {
          data.message = '<div class="message">Nepavyko rasti poveislės.</div>';
          reply.view('./veisles/poveisle.html', {htmlData, data});
          return;
        }

        data.poveisle = poveisle[0];
        if(nuotrauka[0]) {
          data.image = `<img class="v-image" src="${nuotrauka[0].url}" alt="img"></img>`
          data.nuotraukos_url = nuotrauka[0].url;
        }
        
        reply.view('./veisles/poveislesRedagavimas.html', {htmlData: vartotojai.generateNavBar(request.state.session), data});
      });
    });
  });
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
const insertNewSubBreed = (request, reply) => {
  payload = request.payload;
  const poveisle = {
    veisle: payload.veisle,
    redagavimo_data: new Date(),
    pavadinimas: payload.pavadinimas,
    aprasymas: payload.aprasymas,
    registravimo_data: new Date(),
    gyvunu_kiekis: 2,
  };
  console.log(poveisle);
  let data = {};
  data.poveisle = poveisle;
  
  connection.query('insert into poveisle set ?', poveisle, (err, result) => {
    const nuotrauka = {
      poveisle: result.insertId,
      url: payload.nuotraukos_url,
    };
    data.image = `<img class="v-image" src="${payload.nuotraukos_url}" alt="img"></img>`;
    connection.query('insert into nuotrauka set ?', nuotrauka, (err, result) => {
      connection.query('select poveisliu_kiekis from veisle where id', payload.veisle, (err, pov_kiekis) => {
        connection.query('update veisle set poveisliu_kiekis = ? where id = ?', [++pov_kiekis[0].poveisliu_kiekis, payload.veisle], (err, result) => {
          reply.view('./veisles/poveislesRegistracija.html', {htmlData: vartotojai.generateNavBar(request.state.session)});
        });
      });
    });
  });
};

const editBreed = (request, reply) => {
  const id = request.params.id;
  const payload = request.payload;
  const veisle = {
    redagavimo_data: new Date(),
    pavadinimas: payload.pavadinimas,
    gyvuno_tipas: payload.gyv_tip_radio,
    dydis: payload.gyv_dyd_select,
    aprasymas: payload.aprasymas,
    registravimo_data: payload.registravimo_data,
    gyvunu_kiekis: 2,
    poveisliu_kiekis: 2,
  };

  let data = {};
  data.veisle = veisle;
  
  connection.query('update veisle set redagavimo_data = ?, pavadinimas = ?, gyvuno_tipas = ?, dydis = ?, aprasymas = ? where id = ?',
   [veisle.redagavimo_data, veisle.pavadinimas, veisle.gyvuno_tipas,
   veisle.dydis, veisle.aprasymas, id], (err, result) => {
    const nuotrauka = {
      veisle: id,
      url: payload.nuotraukos_url,
    };
    data.image = `<img class="v-image" src="${nuotrauka.url}" alt="img"></img>`;
    connection.query('update nuotrauka set url = ? where veisle = ?', [nuotrauka.url, id], (err, result) => {
      reply.view('./veisles/veisle.html', {htmlData: vartotojai.generateNavBar(request.state.session), data});
    });
  });
};

const editSubBreed = (request, reply) => {
  const id = request.params.id;
  const payload = request.payload;
  const poveisle = {
    veisle: payload.veisle,
    redagavimo_data: new Date(),
    pavadinimas: payload.pavadinimas,
    aprasymas: payload.aprasymas,
    registravimo_data: payload.registravimo_data,
    gyvunu_kiekis: 2,
    poveisliu_kiekis: 2,
  };
  console.log(poveisle);
  let data = {};
  data.poveisle = poveisle;
  
  connection.query('update poveisle set veisle = ?, redagavimo_data = ?, pavadinimas = ?, aprasymas = ? where id = ?',
   [poveisle.veisle, poveisle.redagavimo_data, poveisle.pavadinimas, poveisle.aprasymas, id], (err, result) => {
    const nuotrauka = {
      veisle: id,
      url: payload.nuotraukos_url,
    };
    data.image = `<img class="v-image" src="${nuotrauka.url}" alt="img"></img>`;
    connection.query('update nuotrauka set url = ? where poveisle = ?', [nuotrauka.url, id], (err, result) => {
      reply.view('./veisles/poveisle.html', {htmlData: vartotojai.generateNavBar(request.state.session), data});
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
      connection.query('select * from poveisle where veisle = ?', id, (err, poveisles) => {
        if (veisle.length === 0) {
          data.message = '<div class="message">Nepavyko rasti veislės.</div>';
          reply.view('./veisles/veisle.html', {htmlData, data});
          return;
        }
        data.poveisles = poveisles;
        data.veisle = veisle[0];
        data.veisle.registravimo_data = formatDate(data.veisle.registravimo_data);
        data.veisle.redagavimo_data = formatDate(data.veisle.redagavimo_data);
        if(nuotrauka[0]) {
          data.image = `<img class="v-image" src="${nuotrauka[0].url}" alt="img"></img>`
        }
        reply.view('./veisles/veisle.html', {htmlData: vartotojai.generateNavBar(request.state.session), data});
      });
    });
  });
}

const showSubbreedPage = (request, reply) => {
  const id = request.params.id;
  let data = {};
  connection.query('select * from poveisle where id = ?', id, (err, poveisle) => {
    connection.query('select * from nuotrauka where poveisle = ?', id, (err, nuotrauka) => {
      if (poveisle.length === 0) {
        data.message = '<div class="message">Nepavyko rasti poveislės.</div>';
        reply.view('./veisles/poveisle.html', {htmlData, data});
        return;
      }
      data.poveisle = poveisle[0];
      data.poveisle.registravimo_data = formatDate(data.poveisle.registravimo_data);
      data.poveisle.redagavimo_data = formatDate(data.poveisle.redagavimo_data);
      if(nuotrauka[0]) {
        data.image = `<img class="v-image" src="${nuotrauka[0].url}" alt="img"></img>`
      }
      reply.view('./veisles/poveisle.html', {htmlData: vartotojai.generateNavBar(request.state.session), data});
    });
  });
}

const chooseReport = (request, reply) => {
    let nera = true;
    reply.view('./veisles/ataskaita.html', {htmlData: vartotojai.generateNavBar(request.state.session), nera});
};

const report = (request, reply) => {
   if (!request.state.session) {
    reply.view('message.html', {htmlData: vartotojai.generateNavBar(request.state.session), data: {message: 'Negalima, prisijunkite.'}});
    return;
  } else if (request.state.session.perziuretiAtaskaitas !== 'yes') {
    reply.view('message.html', {htmlData: vartotojai.generateNavBar(request.state.session), data: {message: 'Negalima'}});
    return;
  }

  let data = {};

  if(request.payload.tipas == 'veisle') {
    connection.query('select * from veisle', (err, veisle) => {
      data.veisles = veisle;
      data.veisles.forEach((item) => {
        item.registravimo_data = formatDate(item.registravimo_data);
        item.redagavimo_data = formatDate(item.redagavimo_data);
      });
      
      reply.view('./veisles/ataskaita.html', {htmlData: vartotojai.generateNavBar(request.state.session), data});
    });
  } else if(request.payload.tipas == 'poveisle'){
    connection.query('select * from poveisle', (err, poveisle) => {
      data.poveisles = poveisle;
      data.poveisles.forEach((item) => {
          item.registravimo_data = formatDate(item.registravimo_data);
          item.redagavimo_data = formatDate(item.redagavimo_data);
          // item.veisle = veisPav[0].pavadinimas;
      });
      data.poveisles = poveisle;
      reply.view('./veisles/ataskaita.html', {htmlData: vartotojai.generateNavBar(request.state.session), data});
    });
  }
};

module.exports = {
  allBreeds,
  registerView,
  registerSubBreedView,
  editView,
  editSubbreedView,
  insertNew,
  insertNewSubBreed,
  editBreed,
  editSubBreed,
  showPage,
  showSubbreedPage,
  chooseReport,
  report,
}