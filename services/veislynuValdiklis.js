const mysql = require('mysql');
const vartotojai = require('./vartotojuValdiklis.js');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'pets'
});
connection.connect();

const generateTypeSelect = (data) => {
  let temp = '';
  data.forEach((tipas) => {
    temp += `<input type="radio" name="tipas" value="${tipas.id}" required="true"> ${tipas.gyvuno_tipas}<br>`;
  });
  return temp;
};

const generateTypeSelect2 = (data) => {
  let temp = '';
  data.forEach((tipas) => {
    temp += `<input type="radio" name="tipas" value="${tipas.gyvuno_tipas}" required="true"> ${tipas.gyvuno_tipas}<br>`;
  });
  return temp;
};

const generateDivs = (data, types) => {
  let temp = {};
  temp.pavadinimas = `<input type="text" id="pavadinimas" name="pavadinimas" class="form-control input-sm" required="true" value="${data.pavadinimas}">`;
  temp.aprasymas = `<textarea id="aprasymas" name="aprasymas" rows="15" class="form-control input-sm" required="true">${data.aprasymas}</textarea>`;
  temp.veiklos_pradzia = `<textarea id="veiklos_pradzia" name="veiklos_pradzia" rows="10" class="form-control input-sm" required="true">${data.veiklos_pradzia}</textarea>`;
  temp.nuotraukos_url = `<input type="URL" id="nuotraukos_url" name="nuotraukos_url" class="form-control input-sm" value="${data.nuotraukos_url}">`;
  temp.salis = `<input type="text" id="salis" name="salis" class="form-control input-sm" required="true" value="${data.salis}">`;
  temp.miestas = `<input type="text" id="miestas" name="miestas" class="form-control input-sm" required="true" value="${data.miestas}">`;
  temp.adresas = `<input type="text" id="adresas" name="adresas" class="form-control input-sm" required="true" value="${data.adresas}">`;
  temp.telefono_nr = `<input type="text" id="telefono_nr" name="telefono_nr" class="form-control input-sm" required="true" value="${data.telefono_nr}">`;
  temp.pasto_adresas = `<input type="email" id="pasto_adresas" name="pasto_adresas" class="form-control input-sm" required="true" value="${data.pasto_adresas}">`;
  temp.tipas = generateTypeSelect(types);
  return temp;
};

const getMaxId = (callback) => {
  connection.query('select max(id) from veislynai', (err, result) => {
    callback(result[0]['max(id)']);
  });
};

const insertNew = (data, maxId, userId, callback) => {
  const veislynas = {
    id: ++maxId,
    pavadinimas: data.pavadinimas,
    aprasymas: data.aprasymas,
    veiklos_pradzia: data.veiklos_pradzia,
    nuotraukos_url: data.nuotraukos_url,
    ar_patvirtintas: 0,
    ar_istrintas: false,
    gyvunu_skaicius: 0,
    tipo_id: data.tipas,
    vartotojo_id: userId,
  };

  connection.query('insert into veislynai set ?', veislynas, (err, result) => {
    callback();
  });

  const adresas = {
    veislyno_id: maxId,
    salis: data.salis,
    miestas: data.miestas,
    adresas: data.adresas,
    rodomas: true,
  };

  connection.query('insert into adresai set ?', adresas);

  const telefonas = {
    veislyno_id: maxId,
    telefono_nr: data.telefono_nr,
    rodomas: true,
  };

  connection.query('insert into telefonai set ?', telefonas);

  const pastas = {
    veislyno_id: maxId,
    pasto_adresas: data.pasto_adresas,
    rodomas: true,
  };

  connection.query('insert into pastai set ?', pastas);
};

const getId = (userId, callback) => {
  connection.query('select veislynai.id from vartotojai, veislynai where vartotojai.id = ? and veislynai.vartotojo_id = vartotojai.id and veislynai.ar_patvirtintas = 1', userId, (err, id) => {
    if (id.length === 1) {
      callback(id[0].id);
    } else {
      callback(false);
    }
  });
}

const getId2 = (userId, callback) => {
  connection.query('select veislynai.id from vartotojai, veislynai where vartotojai.id = ? and veislynai.vartotojo_id = vartotojai.id and veislynai.ar_patvirtintas = 1 or veislynai.ar_patvirtintas = 0', userId, (err, id) => {
    if (id.length === 1) {
      callback(id[0].id);
    } else {
      callback(false);
    }
  });
}

const getId3 = (userId, callback) => {
  connection.query('select veislynai.id, veislynai.ar_istrintas from vartotojai, veislynai where vartotojai.id = ? and veislynai.vartotojo_id = vartotojai.id and veislynai.ar_patvirtintas = 1 or veislynai.ar_patvirtintas = 0', userId, (err, data) => {
    if (data.length === 1) {
      if (!data[0].ar_istrintas) {
        callback(data[0].id);
      } else {
        callback('deleted');
      }
    } else {
      callback(false);
    }
  });
}

const registerView = (request, reply) => {
  if (!request.state.session) {
    reply.view('message.html', {htmlData: vartotojai.generateNavBar(request.state.session), data: {message: 'Negalima, prisijunkite.'}});
    return;
  } else if (request.state.session.veislynoRegistravimas !== 'yes') {
    reply.view('message.html', {htmlData: vartotojai.generateNavBar(request.state.session), data: {message: 'Negalima'}});
    return;
  }
  getId2(request.state.session.user_id, (result) => {
    if (!result) {
      connection.query('select * from tipas group by gyvuno_tipas', (err, result) => {
        reply.view('./veislynai/veislynoRegistracija.html', {htmlData: vartotojai.generateNavBar(request.state.session), data: {tipas : generateTypeSelect(result)}});
      });
    } else {
      reply.view('message.html', {htmlData: vartotojai.generateNavBar(request.state.session), data: {message: 'Negalima, jūs jau turite veislyną.'}});
    }
  });
};

const register = (request, reply) => {
  if (!request.state.session) {
    reply.view('message.html', {htmlData: vartotojai.generateNavBar(request.state.session), data: {message: 'Negalima, prisijunkite.'}});
    return;
  } else if (request.state.session.veislynoRegistravimas !== 'yes') {
    reply.view('message.html', {htmlData: vartotojai.generateNavBar(request.state.session), data: {message: 'Negalima'}});
    return;
  }
  let error;
  if (!/^\+?(0|[1-9]\d*)$/.test(request.payload.telefono_nr)) {
    error = '<div class="error">Blogas telefono numeris</div>';
  } else if (request.payload.telefono_nr.toString().length !== 9) {
    error = '<div class="error">Blogas telefono numeris</div>';
  }
  if (error) {
    connection.query('select * from tipas group by gyvuno_tipas', (err, result) => {
      const data = generateDivs(request.payload, result);
      data.errors = error; 
      reply.view('./veislynai/veislynoRegistracija.html', {htmlData: vartotojai.generateNavBar(request.state.session), data});
    });
  } else {
    getMaxId((maxId) => {
      insertNew(request.payload, maxId, request.state.session.user_id, () => {
        const data = {message: '<div class="message">Veislynas užregistruotas, laukite patvirtinimo.</div>'}
        reply.view('./veislynai/veislynas.html', {htmlData: vartotojai.generateNavBar(request.state.session), data});
      });
    });
  }
};

const updateTime = (id) => {
  const date = new Date();
  connection.query('update veislynai set paskutinio_aktyvumo_data = ? where id = ?',
    [date, id]);
};

const generateEditDivs = (data, adresai, telefonai, pastai) => {
  let temp = {};
  temp.id = `<input type="text" id="id" name="id" class="form-control input-sm" value="${data.id}" style="display: none">`;
  temp.pavadinimas = `<input type="text" id="pavadinimas" name="pavadinimas" class="form-control input-sm" required="true" value="${data.pavadinimas}">`;
  temp.aprasymas = `<textarea id="aprasymas" name="aprasymas" rows="15" class="form-control input-sm" required="true">${data.aprasymas}</textarea>`;
  temp.veiklos_pradzia = `<textarea id="veiklos_pradzia" name="veiklos_pradzia" rows="10" class="form-control input-sm" required="true">${data.veiklos_pradzia}</textarea>`;
  temp.nuotraukos_url = `<input type="URL" id="nuotraukos_url" name="nuotraukos_url" class="form-control input-sm" value="${data.nuotraukos_url}">`;
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
   if (!request.state.session) {
    reply.view('message.html', {htmlData: vartotojai.generateNavBar(request.state.session), data: {message: 'Negalima, prisijunkite.'}});
    return;
  } else if (request.state.session.asmeninioPuslapioRedagavimas !== 'yes') {
    reply.view('message.html', {htmlData: vartotojai.generateNavBar(request.state.session), data: {message: 'Negalima'}});
    return;
  }
  getId(request.state.session.user_id, (id) => {
    if (id) {
    connection.query('select * from veislynai where id = ?', id, (err, veislynas) => {
      connection.query('select * from adresai where veislyno_id = ?', id, (err, adresai) => {
        connection.query('select * from telefonai where veislyno_id = ?', id, (err, telefonai) => {
          connection.query('select * from pastai where veislyno_id = ?', id, (err, pastai) => {
            const data = generateEditDivs(veislynas[0], adresai, telefonai, pastai);
            reply.view('./veislynai/veislynoRedagavimas.html', {htmlData: vartotojai.generateNavBar(request.state.session), data});
          });
        });
      });
    }); 
    } else {
      reply.view('message.html', {htmlData: vartotojai.generateNavBar(request.state.session), data: {message: 'Negalima, jūs neturite veislyno.'}});
    }
  });
};

const edit = (request, reply) => {
  if (!request.state.session) {
    reply.view('message.html', {htmlData: vartotojai.generateNavBar(request.state.session), data: {message: 'Negalima, prisijunkite.'}});
    return;
  } else if (request.state.session.asmeninioPuslapioRedagavimas !== 'yes') {
    reply.view('message.html', {htmlData: vartotojai.generateNavBar(request.state.session), data: {message: 'Negalima'}});
    return;
  }
  connection.query('update veislynai set pavadinimas = ?, aprasymas = ?, veiklos_pradzia = ?, nuotraukos_url = ? where id = ?',
        [request.payload.pavadinimas, request.payload.aprasymas, request.payload.veiklos_pradzia,
        request.payload.nuotraukos_url, request.payload.id], (err, result) => {
          const data = {message: '<div class="message">Išsaugota</message>'}
          reply.view('./veislynai/veislynas.html', {htmlData: vartotojai.generateNavBar(request.state.session), data});
        });
  getId(request.state.session.user_id, (id) => {
    updateTime(id);
  });
};

const editContactInfo = (request, reply) => {
  if (!request.state.session) {
    reply(false);
    return;
  } else if (request.state.session.asmeninioPuslapioRedagavimas !== 'yes') {
    reply(false);
    return;
  }

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
   getId(request.state.session.user_id, (id) => {
     updateTime(id);
  });
};

const deleteContactInfo = (request, reply) => {
  if (!request.state.session) {
    reply(false);
    return;
  } else if (request.state.session.asmeninioPuslapioRedagavimas !== 'yes') {
    reply(false);
    return;
  }
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
  getId(request.state.session.user_id, (id) => {
     updateTime(id);
  });
};

const addContactInfo = (request, reply) => {
  if (!request.state.session) {
    reply(false);
    return;
  } else if (request.state.session.asmeninioPuslapioRedagavimas !== 'yes') {
    reply(false);
    return;
  }
  const id = request.payload['data[id]'];
  switch (request.payload.type) {
    case 'address': 
          const adresas = {
            veislyno_id: id,
            salis: request.payload['data[salis]'],
            miestas: request.payload['data[miestas]'],
            adresas: request.payload['data[adresas]'],
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
            rodomas: true,
          };
          connection.query('insert into pastai set ?', pastas, (error, result) => {
            reply('done');
          });
          break;
  }
  getId(request.state.session.user_id, (id) => {
     updateTime(id);
  });
};

const formatDate = (data) => {
  const date = new Date(data);
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
};

const generateImageDivs = (data, canDelete) => {
  data.forEach((item) => {
    if (item.nuotraukos_url) {
      item.nuotraukos_url = `<img class="note-image" src="${item.nuotraukos_url}" alt="img"></img>`;
    }
    item.data = formatDate(item.data);
    if (canDelete) {
      item.deleteLink = `<a href="./deleteNote/${item.id}" class="delete-note">Ištrinti</a>`;
    }
  });
  return data;
};

const generatePetsDiv = (data) => {
  data.forEach((pet) => {
    if (pet.nuotrauka) {
      pet.nuotrauka = `<div class="pet-img" style="background-image: url('${pet.nuotrauka}')"></div>`;
    } else {
      pet.nuotrauka = `<div class="pet-img" style="background-image: url('../public/noImg.jpg')"></div>`;
    }
    pet.button = `<button class="pet-button" onclick="window.location.href='../gyvunai/${pet.id}'">Peržiūrėti</butto>`;
  });
  return data;
};

const showOwnerPage = (request, reply) => {
   if (!request.state.session) {
    reply.view('message.html', {htmlData: vartotojai.generateNavBar(request.state.session), data: {message: 'Negalima, prisijunkite.'}});
    return;
  } else if (request.state.session.veislynoRegistravimas !== 'yes' && request.state.session.asmeninioPuslapioRedagavimas !== 'yes') {
    reply.view('message.html', {htmlData: vartotojai.generateNavBar(request.state.session), data: {message: 'Negalima'}});
    return;
  }
  const data = {};
  getId3(request.state.session.user_id, (id) => {
    if (id === 'deleted') {
      data.ownerDiv = '<div class="main">Jūsų veislynas buvo ištrintas</div>';
      reply.view('./veislynai/veislynas.html', {htmlData: vartotojai.generateNavBar(request.state.session), data});
      return;
    }
    if (id) {
      data.ownerDiv = '<div class="main"><a href="/redaguotiveislyna">Redaguoti veislyną</a> ' +
          '<a href="/note">Skelbti</a> ' +
          `<a href="./remove/${id}">Ištrinti</a></div>`;
      connection.query('select * from veislynai where id = ?', id, (err, veislynas) => {
          if (veislynas.length === 0) {
            data.message = 'Nepavyko rasti veislyno.';
            reply.view('./veislynai/veislynas.html', {htmlData: vartotojai.generateNavBar(request.state.session), data});
            return;
          }
          connection.query('select * from adresai where veislyno_id = ? and rodomas = true', id, (err, adresai) => {
              connection.query('select * from telefonai where veislyno_id = ? and rodomas = true', id, (err, telefonai) => {
                  connection.query('select * from pastai where veislyno_id = ? and rodomas = true', id, (err, pastai) => {
                    connection.query('select * from naujienos where veislyno_id = ? order by data DESC', id, (err, naujienos) => {
                      data.veislynas = veislynas[0];
                      data.veislynas.registracijos_data = formatDate(data.veislynas.registracijos_data);
                      data.veislynas.paskutinio_aktyvumo_data = formatDate(data.veislynas.paskutinio_aktyvumo_data);
                      data.adresai = adresai;
                      data.telefonai = telefonai;
                      data.pastai = pastai;
                      data.naujienos = generateImageDivs(naujienos, true);
                      if (veislynas[0].nuotraukos_url) {
                        data.image = `<img class="v-image" src="${veislynas[0].nuotraukos_url}" alt="img"></img>`
                      }
                      connection.query('select id, vardas, nuotrauka, amzius from gyvunas where vartotojas_id = ?', request.state.session.user_id, (err, gyvunai) => {
                        data.pets = generatePetsDiv(gyvunai);
                        reply.view('./veislynai/veislynas.html', {htmlData: vartotojai.generateNavBar(request.state.session), data});
                      });
                    });
                  });
              });
          });
      });
      getId(request.state.session.user_id, (id) => {
        updateTime(id);
      });
    } else {
      data.ownerDiv = '<div class="main"><a href="/naujasveislynas">Registruoti veislyną</a> ';
      reply.view('./veislynai/veislynas.html', {htmlData: vartotojai.generateNavBar(request.state.session), data});
    }
  });
};

const showPageById = (request, reply) => {
  const id = request.params.id;
  let data = {};
  connection.query('select * from veislynai where id = ? and ar_istrintas <> true and ar_patvirtintas = true', id, (err, veislynas) => {
      if (veislynas.length === 0) {
        data.message = '<div class="message">Nepavyko rasti veislyno.</div>';
        reply.view('./veislynai/veislynas.html', {htmlData: vartotojai.generateNavBar(request.state.session), data});
        return;
      }
      connection.query('select * from adresai where veislyno_id = ? and rodomas = true', id, (err, adresai) => {
          connection.query('select * from telefonai where veislyno_id = ? and rodomas = true', id, (err, telefonai) => {
              connection.query('select * from pastai where veislyno_id = ? and rodomas = true', id, (err, pastai) => {
                connection.query('select * from naujienos where veislyno_id = ? order by data DESC', id, (err, naujienos) => {
                  data.veislynas = veislynas[0];
                  data.veislynas.registracijos_data = formatDate(data.veislynas.registracijos_data);
                  data.veislynas.paskutinio_aktyvumo_data = formatDate(data.veislynas.paskutinio_aktyvumo_data);
                  data.adresai = adresai;
                  data.telefonai = telefonai;
                  data.pastai = pastai;
                  data.naujienos = generateImageDivs(naujienos);
                  if (veislynas[0].nuotraukos_url) {
                    data.image = `<img class="v-image" src="${veislynas[0].nuotraukos_url}" alt="img"></img>`
                  }
                  connection.query('select gyvunas.id, gyvunas.vardas, gyvunas.nuotrauka, gyvunas.amzius from gyvunas, ' +
                    'vartotojai, veislynai where vartotojas_id = veislynai.vartotojo_id and vartotojai.id = gyvunas.vartotojas_id ' +
                    'and veislynai.id = ?', id, (err, gyvunai) => {
                    data.pets = generatePetsDiv(gyvunai);
                    reply.view('./veislynai/veislynas.html', {htmlData: vartotojai.generateNavBar(request.state.session), data});
                  });
                });
              });
          });
      });
  });
}

const showPage = (request, reply) => {
  if (request.params.id) {
    showPageById(request, reply);
  } else {
    showOwnerPage(request, reply);
  }
};

const noteView = (request, reply) => {
   if (!request.state.session) {
    reply.view('message.html', {htmlData: vartotojai.generateNavBar(request.state.session), data: {message: 'Negalima, prisijunkite.'}});
    return;
  } else if (request.state.session.naujienuSkelbimas !== 'yes') {
    reply.view('message.html', {htmlData: vartotojai.generateNavBar(request.state.session), data: {message: 'Negalima'}});
    return;
  }
  getId(request.state.session.user_id, (id) => {
    if (id) {
      reply.view('./veislynai/naujiena.html', {htmlData: vartotojai.generateNavBar(request.state.session)});
    } else {
      reply.view('message.html', {htmlData: vartotojai.generateNavBar(request.state.session), data: {message: 'Negalima, jūs neturite veislyno.'}});
    }
  });
};

const note = (request, reply) => {
  if (!request.state.session) {
    reply.view('message.html', {htmlData: vartotojai.generateNavBar(request.state.session), data: {message: 'Negalima, prisijunkite.'}});
    return;
  } else if (request.state.session.naujienuSkelbimas !== 'yes') {
    reply.view('message.html', {htmlData: vartotojai.generateNavBar(request.state.session), data: {message: 'Negalima'}});
    return;
  }
  getId(request.state.session.user_id, (id) => {
    const naujiena = {
      veislyno_id: id,
      antraste: request.payload.antraste,
      tekstas: request.payload.tekstas,
      nuotraukos_url: request.payload.nuotraukos_url,
    };
    if (request.payload.ar_svarbus) {
      naujiena.ar_svarbus = true;
    } else {
      naujiena.ar_svarbus = false;
    }
    connection.query('insert into naujienos set ?', naujiena, (error, result) => {
      reply.redirect('./veislynas');
    }); 
    getId(request.state.session.user_id, (id) => {
      updateTime(id);
    });
  });
};

const deleteNote = (request, reply) => {
  if (!request.state.session) {
    reply.view('message.html', {htmlData: vartotojai.generateNavBar(request.state.session), data: {message: 'Negalima, prisijunkite.'}});
    return;
  } else if (request.state.session.naujienuSkelbimas !== 'yes') {
    reply.view('message.html', {htmlData: vartotojai.generateNavBar(request.state.session), data: {message: 'Negalima'}});
    return;
  }
  getId(request.state.session.user_id, (id) => {
    connection.query('select veislynai.id from veislynai, naujienos where veislynai.id = naujienos.veislyno_id and naujienos.id = ?', request.params.id, (err, result) => {
      if (id == result[0].id) {
        connection.query('delete from naujienos where id = ?', request.params.id, (err, result) => {
          reply.redirect('../veislynas');
        });
      } else {
        reply.view('./message.html', {htmlData: vartotojai.generateNavBar(request.state.session), data: {message: '<div class="message">Negalima.</div>'}})
      }
    });
    getId(request.state.session.user_id, (id) => {
      updateTime(id);
    });
  });
};

const remove = (request, reply) => {
  if (!request.state.session) {
    reply.view('message.html', {htmlData: vartotojai.generateNavBar(request.state.session), data: {message: 'Negalima, prisijunkite.'}});
    return;
  } else if (request.state.session.asmeninioPuslapioRedagavimas !== 'yes') {
    reply.view('message.html', {htmlData: vartotojai.generateNavBar(request.state.session), data: {message: 'Negalima'}});
    return;
  }
  getId(request.state.session.user_id, (id) => {
    connection.query('update veislynai set ar_istrintas = ? where id = ?', [true, id], (err, result) => {
      reply.view('./message.html', {htmlData: vartotojai.generateNavBar(request.state.session), data: {message: '<div class="message">Ištrinta</div>'}});
    });
  });
};

const reportView = (request, reply) => {
   if (!request.state.session) {
    reply.view('message.html', {htmlData: vartotojai.generateNavBar(request.state.session), data: {message: 'Negalima, prisijunkite.'}});
    return;
  } else if (request.state.session.perziuretiAtaskaitas !== 'yes') {
    reply.view('message.html', {htmlData: vartotojai.generateNavBar(request.state.session), data: {message: 'Negalima'}});
    return;
  }
  connection.query('select * from tipas group by gyvuno_tipas', (err, result) => {
    reply.view('./veislynai/ataskaita.html', {htmlData: vartotojai.generateNavBar(request.state.session), data : {tipas : generateTypeSelect2(result)}});
  });
};


const formatDateArray = (data) => {
  data.forEach((item) => {
    item.registracijos_data = formatDate(item.registracijos_data);
    item.paskutinio_aktyvumo_data = formatDate(item.paskutinio_aktyvumo_data);
  });
  return data;
}

const report = (request, reply) => {
  let data = {};
  if (!request.state.session) {
    reply.view('message.html', {htmlData: vartotojai.generateNavBar(request.state.session), data: {message: 'Negalima, prisijunkite.'}});
    return;
  } else if (request.state.session.perziuretiAtaskaitas !== 'yes') {
    reply.view('message.html', {htmlData: vartotojai.generateNavBar(request.state.session), data: {message: 'Negalima'}});
    return;
  }
  connection.query('select veislynai.pavadinimas, vartotojai.vartotojo_vardas as savininkas, tipas.gyvuno_tipas as tipas, veislynai.registracijos_data, ' +
    'veislynai.paskutinio_aktyvumo_data, veislynai.gyvunu_skaicius, count(gyvunas.apdovanojimas_id) as apdovanojimu_skaicius ' +
    'from veislynai, vartotojai, tipas, gyvunas where veislynai.vartotojo_id = vartotojai.id and veislynai.tipo_id = tipas.id ' +
    'and gyvunas.vartotojas_id = vartotojai.id and tipas.gyvuno_tipas = ? group by vartotojai.id order by veislynai.pavadinimas', request.payload.tipas, (err, result) => {
      result = formatDateArray(result);
      if (result.length === 0) {
        data.error = true;
      }
      data.veislynai = result;
      reply.view('./veislynai/ataskaita.html', {htmlData: vartotojai.generateNavBar(request.state.session), data});
    });
    updatePetsCount(request.state.session.user_id);
};

const updatePetsCount = (id) => {
  getId(id, (result) => {
    if (result) {
       connection.query('update veislynai set gyvunu_skaicius = gyvunu_skaicius + 1 where id = ?', result);
    }
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
  deleteNote,
  remove,
  reportView,
  report,
  updatePetsCount,
}