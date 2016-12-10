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
      '<li><a href="/gyvtipopas">Veislės</a></li>' +
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

module.exports = {
  chooseTypeView,
  registerView,
}