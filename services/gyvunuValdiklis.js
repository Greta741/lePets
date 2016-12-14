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
    showAnimalById(request, reply);
  } else { // jei be id, rodyti visus gyvūnus
    showAllAnimals(request, reply);
  }
};

const generateEdits = (data, user_id) => {
  let temp = '';
  data.forEach((gyvunas) => {
    if (gyvunas.vartotojas_id === user_id) {
      temp += `<div class="inner-form"> 
      <a href="/gyvunai/${gyvunas.id}" class="btn btn-default"><h2>${gyvunas.vardas}</h2></a><br>
      <img class="v-image" src="${gyvunas.nuotrauka}" width=600px alt="img"><br>
      <a href="/redaguotigyvuna/${gyvunas.id}"><button class="submit btn btn-success">Redaguoti</button></a><br>
      </div>`;
    }
    else {
      temp += `<div class="inner-form"> 
      <a href="/gyvunai/${gyvunas.id}" class="btn btn-default"><h2>${gyvunas.vardas}</h2></a><br>
      <img class="v-image" src="${gyvunas.nuotrauka}" width=600px alt="img"><br>
      <div><strong>Redaguoti negalima</strong></div>
      </div>`;      
    }
  });
  return temp;
};

const showAllAnimals = (request, reply) => {
  const user_id = request.state.session.user_id;
  const data = {};
  connection.query('select * from gyvunas', (err, gyvunas) => {
      if (gyvunas.length === 0) {
        data.message = 'Gyvūnų sistemoje nėra.'; 
        reply.view('./gyvunai/gyvunai.html', {htmlData: vartotojai.generateNavBar(request.state.session), data});
        return;       
      }
      else {
        data.gyvunas = gyvunas;
        reply.view('./gyvunai/gyvunai.html', {htmlData: vartotojai.generateNavBar(request.state.session), data : {gyvunas : generateEdits(data.gyvunas, user_id)}});
      }      
    });
};

const showAnimalById = (request, reply) => {
  const id = request.params.id;
  const data = {};
  connection.query('select * from gyvunas where id = ?', id, (err, gyvunas) => {
    data.gyvunas = gyvunas[0];
    data.gyvunas.registravimo_data = formatDate(data.gyvunas.registravimo_data);
    connection.query('select * from tipas where id = ?', data.gyvunas.tipas_id, (err, tipas) => {
      data.tipas = tipas[0]; 
      connection.query('select * from pardavimas where id = ?', gyvunas[0].pardavimas_id, (err, pardavimas) => { 
        data.pardavimas = pardavimas[0];
        data.pardavimas.data = formatDate(data.pardavimas.data);       
        connection.query('select * from atsiemimo_vieta where id = ?', data.pardavimas.atsiemimo_vieta_id, (err, vieta) => {
          data.vieta = vieta[0];

          if (data.gyvunas.apdovanojimas_id) {
            connection.query('select * from apdovanojimas where id = ?', data.gyvunas.apdovanojimas_id, (err, apdovanojimas) => {
              data.apdovanojimas = apdovanojimas[0];
              data.apdovanojimas.data = formatDate(data.apdovanojimas.data);
            if (data.gyvunas.veislės_id) {            
              connection.query('select * from veisle where id = ?', data.gyvunas.veislės_id, (err, veisle) => {
                data.veisle = veisle[0];
                reply.view('./gyvunai/gyvunas.html', {htmlData: vartotojai.generateNavBar(request.state.session), data});
              });
            }
            else {
              reply.view('./gyvunai/gyvunas.html', {htmlData: vartotojai.generateNavBar(request.state.session), data});
            }
            });     
          }

          else if (data.gyvunas.veislės_id) {
            connection.query('select * from veisle where id = ?', data.gyvunas.veislės_id, (err, veisle) => {
                data.veisle = veisle[0];
                if (data.gyvunas.apdovanojimas_id) {
                  connection.query('select * from apdovanojimas where id = ?', data.gyvunas.apdovanojimas_id, (err, apdovanojimas) => {
                    data.apdovanojimas = apdovanojimas[0];
                    data.apdovanojimas.data = formatDate(data.apdovanojimas.data);
                    reply.view('./gyvunai/gyvunas.html', {htmlData: vartotojai.generateNavBar(request.state.session), data});
                  });
                }
                else {
                  reply.view('./gyvunai/gyvunas.html', {htmlData: vartotojai.generateNavBar(request.state.session), data});
                }
            });
          }

          else {
            reply.view('./gyvunai/gyvunas.html', {htmlData: vartotojai.generateNavBar(request.state.session), data});
          }          
        });
      });
    });    
  });
};

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
      pardavimas.atsiemimo_vieta_id = result1.insertId;    
      connection.query('insert into pardavimas set ?', pardavimas, (err, result2) => {
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
          gyvunas.apdovanojimas_id = result3.insertId;
          connection.query('insert into gyvunas set ?', gyvunas, (err, result) => {
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

  reply.redirect('./gyvunai/');
};

const editView = (request, reply) => {
  const id = request.params.id;
  const data = {};
  connection.query('select * from gyvunas where id = ?', id, (err, gyvunas) => {
    data.gyvunas = gyvunas[0];
    connection.query('select * from pardavimas where id = ?', data.gyvunas.pardavimas_id, (err, pardavimas) => {
      data.pardavimas = pardavimas[0];
      data.pardavimas.data = formatDate(data.pardavimas.data);  
      connection.query('select * from atsiemimo_vieta where id = ?', data.pardavimas.atsiemimo_vieta_id, (err, vieta) => {
        data.vieta = vieta[0];
        reply.view('./gyvunai/gyvunoRedagavimas.html', {htmlData: vartotojai.generateNavBar(request.state.session), data});
      });
    });
  });
};

const edit = (request, reply) => {
  const id = request.params.id;
  const duom = request.payload;
  const tmp = {};
  connection.query('update gyvunas set vardas = ?, amzius = ?, nuotrauka = ?, tevas = ?, motina = ?, spalva = ? where id = ?',
        [duom.vardas, duom.amzius, duom.nuotrauka, duom.tevas, duom.motina, duom.spalva, id], (err, result) => {
          connection.query('select * from gyvunas where id = ?', id, (err, gyvunas) => {
            tmp.gyvunas = gyvunas[0];
            connection.query('update pardavimas set kaina = ?, pardavejo_vardas = ?, telefono_numeris = ?, aprasymas = ? where id = ?',
                  [duom.kaina, duom.pardavejo_vardas, duom.telefonas, duom.aprasymas, tmp.gyvunas.pardavimas_id], (err, result) => {
                    connection.query('select * from pardavimas where id = ?',  tmp.gyvunas.pardavimas_id, (err, pardavimas) => {
                      tmp.pardavimas = pardavimas[0];
                      connection.query('select * from atsiemimo_vieta where id = ?',  tmp.pardavimas.atsiemimo_vieta_id, (err, vieta) => {
                        connection.query('update atsiemimo_vieta set miestas = ?, gatve = ?, namo_numeris = ?, buto_numeris = ?, salis =? where id = ?',
                            [duom.miestas, duom.gatve, duom.namo_numeris, duom.buto_numeris, duom.salis, tmp.pardavimas.atsiemimo_vieta_id], (err, result) => {
                              console.log(result);
                            });
                      });
                    });
            });
        });
  });

  reply.redirect('../gyvunai/');
};

module.exports = {
  edit,
  editView,
  generateEdits,
  showAnimalById,
  generateTypeSelect,
  formatDate,
  showAllAnimals,
  showPage,
  registerView,
  insertNew,
}