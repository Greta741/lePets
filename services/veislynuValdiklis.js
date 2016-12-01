const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'pets'
});
connection.connect();

/* Laikinai čia, turės būt perkeltas ten, kur tikrinamas autentifikavimas, kad žinoti
    ką rodyti navbar'e. */

let htmlData = {};
htmlData.head = '<head><title>Le pets</title>' +
    '<link rel="stylesheet" href="../public/CSS/styles.css">' +
    '<meta charset="utf-8">' +
    '<meta name="viewport" content="width=device-width, initial-scale=1">' +
    '<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">' +
    '<link rel="stylesheet" href="http://www.w3schools.com/lib/w3.css">' +
    '<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>' +
    '<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script></head>';
htmlData.navbar = '<nav class="navbar navbar-default"><div class="container-fluid">' +
    '<div class="navbar-header"><a class="navbar-brand" href="/">Le pets</a></div>' +
    '<ul class="nav navbar-nav">' +
      '<li><a href="/veislynas/11">Veislynai</a></li>' +
      '<li><a href="#">Gyvūnai</a></li>' +
      '<li><a href="#">Veislės</a></li>' +
      '<li><a href="#"><span class="glyphicon glyphicon-search"></span> Paieška</a></li>'+ 
    '</ul>' +
    '<ul class="nav navbar-nav navbar-right">' +
    '<li class="dropdown">' +
        '<a class="dropdown-toggle" data-toggle="dropdown" href="#">Ataskaitos<span class="caret"></span></a>' +
        '<ul class="dropdown-menu">' +
          '<li><a href="#">Veislynų ataskaita</a></li>' +
          '<li><a href="#">Veislių ataskaita</a></li>' +
          '<li><a href="#">Gyvūnų ataskaita</a></li>' +
          '<li><a href="#">Vartotojų ataskaita</a></li>' +
        '</ul></li>' +
    '<li class="dropdown">' +
        '<a class="dropdown-toggle" data-toggle="dropdown" href="#">Menu<span class="caret"></span></a>' +
        '<ul class="dropdown-menu">' +
          '<li><a href="#">Redaguoti profilį</a></li>' +
          '<li><a href="#">Keisti roles</a></li>' +
          '<li><a href="#">Patvirtinti veislynus</a></li>' +
          '<li><a href="#">Žinutės</a></li>' +
          '<li><a href="#">Prenumerata</a></li>' +
          '<li><a href="#">Atsijungti</a></li>' +
        '</ul></li>' +
    '<li><a href="./register"><span class="glyphicon glyphicon-user"></span> Registruotis</a></li>' +
    '<li><a href="./login"><span class="glyphicon glyphicon-log-in"></span> Prisijungti</a></li>' +
    '</ul></div></nav>';



const generateDivs = (data) => {
  let temp = {};
  temp.pavadinimas = `<input type="text" id="pavadinimas" name="pavadinimas" class="form-control input-sm" required="true" value="${data.pavadinimas}">`;
  temp.aprasymas = `<textarea id="aprasymas" name="aprasymas" rows="15" class="form-control input-sm" required="true">${data.aprasymas}</textarea>`;
  temp.veiklos_pradzia = `<textarea id="veiklos_pradzia" name="veiklos_pradzia" rows="10" class="form-control input-sm" required="true">${data.veiklos_pradzia}</textarea>`;
  temp.nuotraukos_url = `<input type="URL" id="nuotraukos_url" name="nuotraukos_url" class="form-control input-sm" required="true" value="${data.nuotraukos_url}">`;
  temp.salis = `<input type="text" id="salis" name="salis" class="form-control input-sm" required="true" value="${data.salis}">`;
  temp.miestas = `<input type="text" id="miestas" name="miestas" class="form-control input-sm" required="true" value="${data.miestas}">`;
  temp.adresas = `<input type="text" id="adresas" name="adresas" class="form-control input-sm" required="true" value="${data.adresas}">`;
  temp.telefono_nr = `<input type="text" id="telefono_nr" name="telefono_nr" class="form-control input-sm" required="true" value="${data.telefono_nr}">`;
  temp.pasto_adresas = `<input type="email" id="pasto_adresas" name="pasto_adresas" class="form-control input-sm" required="true" value="${data.pasto_adresas}">`;
  return temp;
};

const getMaxId = (callback) => {
  connection.query('select max(id) from veislynai', (err, result) => {
    callback(result[0]['max(id)']);
  });
};

const insertNew = (data, maxId, callback) => {
  const today = new Date();
  const todayString = `${today.getFullYear()}-${today.getMonth()}-${today.getDay()}`;
  const veislynas = {
    id: ++maxId,
    pavadinimas: data.pavadinimas,
    aprasymas: data.aprasymas,
    veiklos_pradzia: data.veiklos_pradzia,
    nuotraukos_url: data.nuotraukos_url,
    registracijos_data: todayString,
    paskutinio_aktyvumo_data: todayString,
    ar_patvirtintas: false,
    ar_istrintas: false,
    gyvunu_skaicius: 0,
  };

  connection.query('insert into veislynai set ?', veislynas, (err, result) => {
    callback();
  });

  const adresas = {
    veislyno_id: maxId,
    salis: data.salis,
    miestas: data.miestas,
    adresas: data.adresas,
    data: todayString,
    rodomas: true,
  };

  connection.query('insert into adresai set ?', adresas);

  const telefonas = {
    veislyno_id: maxId,
    telefono_nr: data.telefono_nr,
    data: todayString,
    rodomas: true,
  };

  connection.query('insert into telefonai set ?', telefonas);

  const pastas = {
    veislyno_id: maxId,
    pasto_adresas: data.pasto_adresas,
    data: todayString,
    rodomas: true,
  };

  connection.query('insert into pastai set ?', pastas);
};

const registerView = (request, reply) => {
  reply.view('./veislynai/veislynoRegistracija.html', {htmlData});
};

const register = (request, reply) => {
  let error;
  if (!/^\+?(0|[1-9]\d*)$/.test(request.payload.telefono_nr)) {
    error = '<div class="error">Blogas telefono numeris</div>';
  } else if (request.payload.telefono_nr.toString().length !== 9) {
    error = '<div class="error">Blogas telefono numeris</div>';
  }
  if (error) {
    const data = generateDivs(request.payload);
    data.errors = error;
    reply.view('./veislynai/veislynoRegistracija.html', {htmlData, data});
  } else {
    getMaxId((maxId) => {
      insertNew(request.payload, maxId, () => {
        const data = {message: '<div class="message">Veislynas užregistruotas, laukite patvirtinimo.</div>'}
        reply.view('./veislynai/veislynas.html', {htmlData, data});
      });
    });
  }
};

const generateEditDivs = (data, adresai, telefonai, pastai) => {
  let temp = {};
  temp.id = `<input type="text" id="id" name="id" class="form-control input-sm" value="${data.id}" style="display: none">`;
  temp.pavadinimas = `<input type="text" id="pavadinimas" name="pavadinimas" class="form-control input-sm" required="true" value="${data.pavadinimas}">`;
  temp.aprasymas = `<textarea id="aprasymas" name="aprasymas" rows="15" class="form-control input-sm" required="true">${data.aprasymas}</textarea>`;
  temp.veiklos_pradzia = `<textarea id="veiklos_pradzia" name="veiklos_pradzia" rows="10" class="form-control input-sm" required="true">${data.veiklos_pradzia}</textarea>`;
  temp.nuotraukos_url = `<input type="URL" id="nuotraukos_url" name="nuotraukos_url" class="form-control input-sm" required="true" value="${data.nuotraukos_url}">`;
  let addressDiv = [];
  let phoneDiv = [];
  let emailDiv = [];
  let i = 0;
  adresai.forEach((item) => {
      let line = `<div id="address-div-${i}" class="inner-div"><div id="error-address-${i}" class="error"></div>` +
        `Šalis: ${item.salis}<br>` +
          `Miestas: ${item.miestas}<br>`+
          `Adresas: ${item.adresas}<br>`;
      if (item.rodomas) {
        line += `<button id="address-button-${i}" onClick="edit('address-button-${i}', '${item.id}', 'address', '${item.rodomas}')" class="btn btn-primary">Padaryti nerodomą</button>`;
      } else {
        line += `<button id="address-button-${i}" onClick="edit('address-button-${i}', '${item.id}', 'address', '${item.rodomas}')" class="btn btn-primary">Padaryti rodomą</button>`;
      }        
    line +=  `<button onclick="remove('address-div-${i}', 'error-address-${i}', '${item.id}', '${item.veislyno_id}', 'address')" class="btn btn-primary">Ištrinti</button></div>`;
    addressDiv.push(line);
    i++;
  });

  i = 0;
  telefonai.forEach((item) => {
    let line = `<div id="phone-div-${i}" class="inner-div"><div id="error-phone-${i}" class="error"></div>` +
        `Numeris: ${item.telefono_nr}<br>`;
    if (item.rodomas) {
        line += `<button id="phone-button-${i}" onClick="edit('phone-button-${i}', '${item.id}', 'phone', '${item.rodomas}')" class="btn btn-primary">Padaryti nerodomą</button>`;
    } else {
        line += `<button id="phone-button-${i}" onClick="edit('phone-button-${i}', '${item.id}', 'phone', '${item.rodomas}')" class="btn btn-primary">Padaryti rodomą</button>`;
    }        
    line +=  `<button onclick="remove('phone-div-${i}', 'error-phone-${i}', '${item.id}', '${item.veislyno_id}', 'phone')"  class="btn btn-primary">Ištrinti</button></div>`;
    phoneDiv.push(line);
    i++;
  });
  
  i = 0;
  pastai.forEach((item) => {
    let line = `<div id="email-div-${i}" class="inner-div"><div id="error-email-${i}" class="error"></div>` +
          `Pašto adresas: ${item.pasto_adresas}<br>`;
    if (item.rodomas) {
        line += `<button id="email-button-${i}" onClick="edit('email-button-${i}', '${item.id}', 'email', '${item.rodomas}')" class="btn btn-primary">Padaryti nerodomą</button>`;
    } else {
        line += `<button id="email-button-${i}" onClick="edit('email-button-${i}', '${item.id}', 'email', '${item.rodomas}')" class="btn btn-primary">Padaryti rodomą</button>`;
    }        
    line +=  `<button onclick="remove('email-div-${i}', 'error-email-${i}', '${item.id}', '${item.veislyno_id}', 'email')"  class="btn btn-primary">Ištrinti</button></div>`;
    emailDiv.push(line);
    i++;
  });
  temp.adresai = addressDiv;
  temp.telefonai = phoneDiv;
  temp.pastai = emailDiv;
  return temp;
};

const editView = (request, reply) => {
  const id = 11;
  connection.query('select * from veislynai where id = ?', id, (err, veislynas) => {
      connection.query('select * from adresai where veislyno_id = ?', id, (err, adresai) => {
          connection.query('select * from telefonai where veislyno_id = ?', id, (err, telefonai) => {
              connection.query('select * from pastai where veislyno_id = ?', id, (err, pastai) => {
                const data = generateEditDivs(veislynas[0], adresai, telefonai, pastai);
                reply.view('./veislynai/veislynoRedagavimas.html', {htmlData, data});
              });
          });
      });
  });
};

const edit = (request, reply) => {
  connection.query('update veislynai set pavadinimas = ?, aprasymas = ?, veiklos_pradzia = ?, nuotraukos_url = ? where id = ?',
        [request.payload.pavadinimas, request.payload.aprasymas, request.payload.veiklos_pradzia,
        request.payload.nuotraukos_url, request.payload.id], (err, result) => {
          const data = {message: '<div class="message">Išsaugota</message>'}
          reply.view('./veislynai/veislynas.html', {htmlData, data});
        });
};

const editContactInfo = (request, reply) => {
  let newState;
  if (request.payload.state === '1') {
    newState = false;
  } else {
    newState = true;
  }
  switch (request.payload.type) {
    case 'address': 
          connection.query('update adresai set rodomas = ? where id = ?',
                [newState, request.payload.id], (err, result) => {
                  reply('done');
          });
          break;
    case 'phone':
        connection.query('update telefonai set rodomas = ? where id = ?',
                [newState, request.payload.id], (err, result) => {
                  reply('done');
          });
          break;
    case 'email':
          connection.query('update pastai set rodomas = ? where id = ?',
                [newState, request.payload.id], (err, result) => {
                  reply('done');
          });
          break;
  }
};

const deleteContactInfo = (request, reply) => {
  switch (request.payload.type) {
    case 'address': 
          connection.query('select count(id) from adresai where veislyno_id = ?', request.payload.vId, (err, result) => {
            if (result[0]['count(id)'] !== 1) {
              connection.query('delete from adresai where id = ?', request.payload.id, (err, result) => {
                reply('done');
              });
            } else {
              reply('Cannot delete');
            }
          });
          break;
    case 'phone':
         connection.query('select count(id) from telefonai where veislyno_id = ?', request.payload.vId, (err, result) => {
            if (result[0]['count(id)'] !== 1) {
              connection.query('delete from telefonai where id = ?', request.payload.id, (err, result) => {
                reply('done');
              });
            } else {
              reply('Cannot delete');
            }
          });
          break;
    case 'email':
          connection.query('select count(id) from pastai where veislyno_id = ?', request.payload.vId, (err, result) => {
            if (result[0]['count(id)'] !== 1) {
              connection.query('delete from pastai where id = ?', request.payload.id, (err, result) => {
                reply('done');
              });
            } else {
              reply('Cannot delete');
            }
          });
          break;
  }
};

const addContactInfo = (request, reply) => {
  const today = new Date();
  const todayString = `${today.getFullYear()}-${today.getMonth()}-${today.getDay()}`;
  const id = 11;
   switch (request.payload.type) {
    case 'address': 
          const adresas = {
            veislyno_id: id,
            salis: request.payload['data[salis]'],
            miestas: request.payload['data[miestas]'],
            adresas: request.payload['data[adresas]'],
            data: todayString,
            rodomas: true,
          };
          connection.query('insert into adresai set ?', adresas, (error, result) => {
            reply('done');
          });
          break;
    case 'phone':
          if (!/^\+?(0|[1-9]\d*)$/.test(request.payload['data[telefono_nr]'])) {
            reply('Bad phone number');
            return;
          } else if (request.payload['data[telefono_nr]'].toString().length !== 9) {
            reply('Bad phone number');
            return;
          }
          const telefonas = {
            veislyno_id: id,
            telefono_nr: request.payload['data[telefono_nr]'],
            data: todayString,
            rodomas: true,
          };
          connection.query('insert into telefonai set ?', telefonas, (error, result) => {
            reply('done');
          });
          break;
    case 'email':
          const pastas = {
            veislyno_id: id,
            pasto_adresas: request.payload['data[pasto_adresas]'],
            data: todayString,
            rodomas: true,
          };
          connection.query('insert into pastai set ?', pastas, (error, result) => {
            reply('done');
          });
          break;
  }
};

const generateImageDivs = (data) => {
  data.forEach((item) => {
    if (item.nuotraukos_url) {
      item.nuotraukos_url = `<img class="note-image" src="${item.nuotraukos_url}" alt="img"></img>`;
    }
  });
  return data;
};

const showPage = (request, reply) => {
  let data = {};
  const id = request.params.id;
  data.ownerDiv = '<div class="main"><a href="/naujasveislynas">Registruoti veislyną</a> ' +
      '<a href="/redaguotiveislyna">Redaguoti veislyną</a> ' +
      '<a href="/note">Skelbti</a></div>';
  
  connection.query('select * from veislynai where id = ?', id, (err, veislynas) => {
      if (veislynas.length === 0) {
        data.message = 'Nepavyko rasti veislyno.';
        reply.view('./veislynai/veislynas.html', {htmlData, data});
        return;
      }
      connection.query('select * from adresai where veislyno_id = ? and rodomas = true', id, (err, adresai) => {
          connection.query('select * from telefonai where veislyno_id = ? and rodomas = true', id, (err, telefonai) => {
              connection.query('select * from pastai where veislyno_id = ? and rodomas = true', id, (err, pastai) => {
                connection.query('select * from naujienos where veislyno_id = ? order by data', id, (err, naujienos) => {
                  data.veislynas = veislynas[0];
                  data.adresai = adresai;
                  data.telefonai = telefonai;
                  data.pastai = pastai;
                  data.naujienos = generateImageDivs(naujienos);
                  data.image = `<img class="v-image" src="${veislynas[0].nuotraukos_url}" alt="img"></img>`
                  reply.view('./veislynai/veislynas.html', {htmlData, data});
                });
              });
          });
      });
  });
};

const noteView = (request, reply) => {
  reply.view('./veislynai/naujiena.html', {htmlData});
};

const note = (request, reply) => {
  const today = new Date();
  const todayString = `${today.getFullYear()}-${today.getMonth()}-${today.getDay()}`;
  const id = 11;
  const naujiena = {
    veislyno_id: id,
    antraste: request.payload.antraste,
    tekstas: request.payload.tekstas,
    data: todayString,
  };
  if (request.payload.ar_svarbus) {
    naujiena.ar_svarbus = true;
  } else {
    naujiena.ar_svarbus = false;
  }
  connection.query('insert into naujienos set ?', naujiena, (error, result) => {
    reply.redirect('./veislynas/11');
  }); 
};

module.exports = {
  registerView,
  register,
  editView,
  edit,
  editContactInfo,
  deleteContactInfo,
  addContactInfo,
  showPage,
  noteView,
  note,
}