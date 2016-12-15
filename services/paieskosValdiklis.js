const mysql = require('mysql');
const vartotojai = require('./vartotojuValdiklis.js');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'pets'
});
connection.connect()

const generateSearchBar = () => {
  let temp = '';
  temp += `<input type="text" maxlength="50" size="100" id="vardas" name="vardas" class="form-control input-sm" required="true" value="">`;
  return temp;
};

const searchView = (request, reply) => {
  if (!request.state.session) {
    reply.view('message.html', {htmlData: vartotojai.generateNavBar(request.state.session), data: {message: 'Negalima, prisijunkite.'}});
    return;
  }
  reply.view('./paieska/paieska.html', {htmlData: vartotojai.generateNavBar(request.state.session), data : {paieska : generateSearchBar()}});
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

const generateEdits2 = (data, user_id) => {
  let temp = '';
  data.forEach((gyvunas) => {
    if (gyvunas.vartotojas_id === user_id) {
      temp += `<div class="inner-form"> 
      <a href="/gyvunai/${gyvunas.id}" class="btn btn-default"><h2>${gyvunas.vardas}</h2></a><br>
      <div><strong>Kaina (eurais): </strong>${gyvunas.kaina}</div>
      <div><strong>Tipas: </strong>${gyvunas.tipas}</div>
      <img class="v-image" src="${gyvunas.nuotrauka}" width=600px alt="img"><br>
      <a href="/redaguotigyvuna/${gyvunas.id}"><button class="submit btn btn-success">Redaguoti</button></a><br>
      </div>`;
    }
    else {
      temp += `<div class="inner-form"> 
      <a href="/gyvunai/${gyvunas.id}" class="btn btn-default"><h2>${gyvunas.vardas}</h2></a><br>
      <div><strong>Kaina (eurais): </strong>${gyvunas.kaina}</div>
      <div><strong>Tipas: </strong>${gyvunas.tipas}</div>
      <img class="v-image" src="${gyvunas.nuotrauka}" width=600px alt="img"><br>
      <div><strong>Redaguoti negalima</strong></div>
      </div>`;      
    }
  });
  return temp;
};

const searchResult = (request, reply) => {
  if (!request.state.session) {
    reply.view('message.html', {htmlData: vartotojai.generateNavBar(request.state.session), data: {message: 'Negalima, prisijunkite.'}});
    return;
  }
  const user_id = request.state.session.user_id;
  const data = {};
  const name = request.payload.vardas + `%`;
  connection.query('select * from gyvunas where vardas like ?', name, (err, gyvunas) => {
      if (gyvunas.length === 0) {
          data.error = true;
          reply.view('./paieska/paieska.html', {htmlData: vartotojai.generateNavBar(request.state.session), data});
      }
      else {
        data.gyvunas = gyvunas;
        reply.view('./paieska/paieska.html', {htmlData: vartotojai.generateNavBar(request.state.session), data : {gyvunas : generateEdits(data.gyvunas, user_id), ivesta : request.payload.vardas}});
      }      
    });
};

const generateTypeSelect2 = (data) => {
  let temp = '';
  data.forEach((tipas) => {
    temp += `<input type="radio" name="tipas" value="${tipas.gyvuno_tipas}" required="true"> ${tipas.gyvuno_tipas}<br>`;
  });
  temp += `<input type="radio" name="tipas" value="0" required="true"> visi<br>`;
  return temp;
};

const detailSearchView = (request, reply) => {
  if (!request.state.session) {
    reply.view('message.html', {htmlData: vartotojai.generateNavBar(request.state.session), data: {message: 'Negalima, prisijunkite.'}});
    return;
  }
  connection.query('select * from tipas group by gyvuno_tipas', (err, result) => {
    reply.view('./paieska/issamipaieska.html', {htmlData: vartotojai.generateNavBar(request.state.session), data : {issamipaieska : generateTypeSelect2(result)}});
  });
};

const detailSearchResult = (request, reply) => {
  if (!request.state.session) {
    reply.view('message.html', {htmlData: vartotojai.generateNavBar(request.state.session), data: {message: 'Negalima, prisijunkite.'}});
    return;
  }
  const user_id = request.state.session.user_id;
  const data = {};
  const tipas = request.payload.tipas;
  const kaina = request.payload.kaina;
  if (tipas == 0) {
    connection.query('select gyvunas.id, gyvunas.vardas, gyvunas.nuotrauka, gyvunas.vartotojas_id, pardavimas.kaina as kaina, tipas.gyvuno_tipas as tipas ' +
        'from tipas, gyvunas, pardavimas where gyvunas.pardavimas_id = pardavimas.id and gyvunas.tipas_id = tipas.id and pardavimas.kaina <= ? and tipas.gyvuno_tipas like "%" ' +
        'group by gyvunas.id order by kaina', kaina, (err, gyvunas) => {
        if (gyvunas.length === 0) {
            data.error = true;
            reply.view('./paieska/issamipaieska.html', {htmlData: vartotojai.generateNavBar(request.state.session), data});
        }
        else {
          data.gyvunas = gyvunas;
          reply.view('./paieska/issamipaieska.html', {htmlData: vartotojai.generateNavBar(request.state.session), data : {gyvunas : generateEdits2(data.gyvunas, user_id)}});
        }      
      });
  }
  else {
    connection.query('select gyvunas.id, gyvunas.vardas, gyvunas.nuotrauka, gyvunas.vartotojas_id, pardavimas.kaina as kaina, tipas.gyvuno_tipas as tipas ' +
        'from tipas, gyvunas, pardavimas where gyvunas.pardavimas_id = pardavimas.id and gyvunas.tipas_id = tipas.id and tipas.gyvuno_tipas = ? and pardavimas.kaina <= ? ' +
        'group by gyvunas.id order by kaina', [tipas, kaina], (err, gyvunas) => {
        if (gyvunas.length === 0) {
            data.error = true;
            reply.view('./paieska/issamipaieska.html', {htmlData: vartotojai.generateNavBar(request.state.session), data});
        }
        else {
          data.gyvunas = gyvunas;
          reply.view('./paieska/issamipaieska.html', {htmlData: vartotojai.generateNavBar(request.state.session), data : {gyvunas : generateEdits2(data.gyvunas, user_id)}});
        }      
      });
  }
};

module.exports = {
  generateSearchBar,
  searchView,
  searchResult,
  generateEdits,
  generateEdits2,
  detailSearchView,
  generateTypeSelect2,
  detailSearchResult,
}