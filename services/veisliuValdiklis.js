const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'pets'
});
connection.connect();

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
      '<li><a href="/veisle/1">Veislės</a></li>' +
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

const chooseTypeView = (request, reply) => {
  reply.view('./veisles/veisTipoPasirinkimas.html', {htmlData});
};

const registerView = (request, reply) => {
  reply.view('./veisles/veislesRegistracija.html', {htmlData});
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
    reply.view('./veisles/veisle.html', {htmlData, data});
  });
}

module.exports = {
  chooseTypeView,
  registerView,
  insertNew,
  showPage,
}