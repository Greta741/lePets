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
      }
      else {
        data.gyvunas = gyvunas;
        reply.view('./paieska/paieska.html', {htmlData: vartotojai.generateNavBar(request.state.session), data : {gyvunas : generateEdits(data.gyvunas, user_id), ivesta : request.payload.vardas}});
      }      
    });
};

module.exports = {
  generateSearchBar,
  searchView,
  searchResult,
  generateEdits,
}