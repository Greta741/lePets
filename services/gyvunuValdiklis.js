const mysql = require('mysql');
const vartotojai = require('./vartotojuValdiklis.js');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'pets'
});
connection.connect();

const showPage = (request, reply) => {
  // jei id, rodyti to id gyvūną
  if (request.params.id) {
    //showAnimalById(request, reply);
  } else { // jei be id, rodyti visus gyvūnus
    showAllAnimals(request, reply);
  }
};

const showAllAnimals = (request, reply) => {
  const data = {};
  connection.query('select * from gyvunas', (err, gyvunas) => {
      if (gyvunas.length === 0) {
        data.message = 'Gyvūnų sistemoje nėra.'; 
        reply.view('./gyvunai/gyvunai.html', {htmlData: vartotojai.generateNavBar(request.state.session), data});
        return;       
      }
      else {
        data.gyvunas = gyvunas;
        reply.view('./gyvunai/gyvunai.html', {htmlData: vartotojai.generateNavBar(request.state.session), data});
      }      
    });
};

/*const showAnimalById = (request, reply) => {
  reply.view('./gyvunai/gyvunai.html', {htmlData: vartotojai.generateNavBar(request.state.session), data});
};*/

const formatDate = (data) => {
  const date = new Date(data);
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
};

const generateTypeSelect = (data) => {
  let temp = '';
  data.forEach((tipas) => {
    temp += `<input type="radio" name="tipas" value="${tipas.id}" required="true"> ${tipas.gyvuno_tipas} ${tipas.lytis}<br>`;
  });
  return temp;
};

const registerView = (request, reply) => {
  const data = {};
  connection.query('select * from tipas', (err, tipas) => {
    data.tipas = tipas;
    connection.query('select * from veisle', (err, veisle) => {
      data.veisle = veisle;
      reply.view('./gyvunai/gyvunoRegistracija.html', {htmlData: vartotojai.generateNavBar(request.state.session), data : {tipas : generateTypeSelect(data.tipas), veisle : veisle}});
    });
  });
};

const insertNew = (data, reply) => {
  const user_id = data.state.session.user_id;
  console.log(data.state.session);
  data = data.payload;
  const atsiemimo_vieta = {
      miestas: data.miestas,
      gatve: data.gatve,
      namo_numeris: data.namo_numeris,
      buto_numeris: data.buto_numeris,
      salis: data.salis,
  };
  const pardavimas = {
      kaina: data.kaina,
      pardavejo_vardas: data.pardavejo_vardas,
      telefono_numeris: data.telefonas,
      data: new Date(),
      aprasymas: data.aprasymas,
  };
  const gyvunas = {
      tipas_id: data.tipas,
      vartotojas_id: user_id,
      vardas: data.vardas,
      nuotrauka: data.nuotrauka,
      tevas: data.tevas,
      motina: data.motina,
      spalva: data.spalva,
      registravimo_data: new Date(),
      amzius: data.amzius,
  };
  // Jeigu ivesta kilme ir apdovanojimas
  if (data.kilme == 1 && data.apdov == 1) {    
    connection.query('insert into atsiemimo_vieta set ?', atsiemimo_vieta, (err, result1) => {
      pardavimas.atsiemimo_vieta_id = result1.insertId;    
      connection.query('insert into pardavimas set ?', pardavimas, (err, result2) => {
        const apdovanojimas = {
          data: data.apdovanojimas_data,
          uzimta_vieta: data.uzimta_vieta,
          prizas: data.prizas,
          dalyviu_skaicius: data.dalyviu_skaicius,
          seimininkas: data.seimininkas,
          konkurso_miestas: data.konkurso_miestas,
          konkurso_salis: data.konkurso_salis,
        };
        connection.query('insert into apdovanojimas set ?', apdovanojimas, (err, result3) => {
          gyvunas.apdovanojimas_id = result3.insertId;
          gyvunas.veislės_id = data.veisle;
          gyvunas.pardavimas_id = result2.insertId;
          connection.query('insert into gyvunas set ?', gyvunas, (err, result) => {
          });
        });
      });
    });
  }
  // jeigu ivesta tik kilme
  else if (data.kilme == 1 && data.apdov == 0) {
    connection.query('insert into atsiemimo_vieta set ?', atsiemimo_vieta, (err, result1) => {
      pardavimas.atsiemimo_vieta_id = result1.insertId;     
      connection.query('insert into pardavimas set ?', pardavimas, (err, result2) => {
        gyvunas.veislės_id = data.veisle;
        gyvunas.pardavimas_id = result2.insertId;
          connection.query('insert into gyvunas set ?', gyvunas, (err, result) => {
        });
      });
    });
  }
  // jeigu ivesta tik apdovanojimas
  else if (data.kilme == 0 && data.apdov == 1) {
    connection.query('insert into atsiemimo_vieta set ?', atsiemimo_vieta, (err, result1) => {
      console.log(err);
      pardavimas.atsiemimo_vieta_id = result1.insertId;    
      connection.query('insert into pardavimas set ?', pardavimas, (err, result2) => {
        console.log(err);
        gyvunas.pardavimas_id = result2.insertId;
        const apdovanojimas = {
          data: data.apdovanojimas_data,
          uzimta_vieta: data.uzimta_vieta,
          prizas: data.prizas,
          dalyviu_skaicius: data.dalyviu_skaicius,
          seimininkas: data.seimininkas,
          konkurso_miestas: data.konkurso_miestas,
          konkurso_salis: data.konkurso_salis,
        };
        connection.query('insert into apdovanojimas set ?', apdovanojimas, (err, result3) => {
          console.log(err);
          gyvunas.apdovanojimas_id = result3.insertId;
          connection.query('insert into gyvunas set ?', gyvunas, (err, result) => {
            console.log(err);
          });
        });
      });
    });
  }
  // jei nenurodyta nei veisle, nei apdovanojimas
  else {
    connection.query('insert into atsiemimo_vieta set ?', atsiemimo_vieta, (err, result1) => {
      pardavimas.atsiemimo_vieta_id = result1.insertId;       
      connection.query('insert into pardavimas set ?', pardavimas, (err, result2) => {
        gyvunas.pardavimas_id = result2.insertId;
          connection.query('insert into gyvunas set ?', gyvunas, (err, result) => {
        });
      });
    });
  }

  reply.redirect('./gyvunai');
};

module.exports = {
  generateTypeSelect,
  formatDate,
  showAllAnimals,
  showPage,
  registerView,
  insertNew,
}