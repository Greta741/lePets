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
        data.gyvunas.forEach((item) => {
          item.gimimo_data = formatDate(item.gimimo_data);
        });
        reply.view('./gyvunai/gyvunai.html', {htmlData: vartotojai.generateNavBar(request.state.session), data});
      }      
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
    reply.view('./gyvunai/gyvunoRegistracija.html', {htmlData: vartotojai.generateNavBar(request.state.session), data : {tipas : generateTypeSelect(data.tipas)}});
  });
};

module.exports = {
  generateTypeSelect,
  formatDate,
  showAllAnimals,
  showPage,
  registerView,
}