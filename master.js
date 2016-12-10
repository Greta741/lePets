const Hapi = require('hapi');
const Vision = require('vision');
const Inert = require('inert');
const veislynai = require('./services/veislynuValdiklis.js');
const veisles = require('./services/veisliuValdiklis.js');

const server = new Hapi.Server();

server.connection({
    host: process.env.HOST || '0.0.0.0',
    port: process.env.PORT || 3000,
});

server.register(Vision, () => {});
server.register(Inert, () => {});

server.views({
    path: './templates',
    engines: {
        html: require('handlebars'),
    },
});

server.route({
    method: 'GET',
    path: '/public/{path*}',
    handler: {
        directory: {
            path: './public',
            listing: false,
            index: false,
        },
    },
});


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
      '<li><a href="/veislynas">Veislynai</a></li>' +
      '<li><a href="#">Gyvūnai</a></li>' +
      '<li><a href="/naujaveisle">Veislės</a></li>' +
      '<li><a href="#"><span class="glyphicon glyphicon-search"></span> Paieška</a></li>'+ 
    '</ul>' +
    '<ul class="nav navbar-nav navbar-right">' +
    '<li class="dropdown">' +
        '<a class="dropdown-toggle" data-toggle="dropdown" href="#">Ataskaitos<span class="caret"></span></a>' +
        '<ul class="dropdown-menu">' +
          '<li><a href="/ataskaitos/veislynai">Veislynų ataskaita</a></li>' +
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

server.route({
    method: 'GET',
    path: '/',
    handler: (request, reply) => {
        reply.view('index.html', {htmlData});
    },
});

/* Veislių valdiklio routes  */
server.route({
    method: 'GET',
    path: '/naujaveisle',
    handler: veisles.registerView,
});

/* Veislių valdiklio routes pabaiga  */

/* Veislynų valdiklio routes  */
server.route({
    method: 'GET',
    path: '/naujasveislynas',
    handler: veislynai.registerView,
});

server.route({
    method: 'POST',
    path: '/naujasveislynas',
    handler: veislynai.register,
});

server.route({
    method: 'GET',
    path: '/redaguotiveislyna',
    handler: veislynai.editView,
});

server.route({
    method: 'POST',
    path: '/redaguotiveislyna',
    handler: veislynai.edit,
});

server.route({
    method: 'POST',
    path: '/editContactInfo',
    handler: veislynai.editContactInfo,
});

server.route({
    method: 'POST',
    path: '/deleteContactInfo',
    handler: veislynai.deleteContactInfo,
});

server.route({
    method: 'POST',
    path: '/addContactInfo',
    handler: veislynai.addContactInfo,
});

server.route({
    method: 'GET',
    path: '/veislynas/{id?}',
    handler: veislynai.showPage,
});

server.route({
    method: 'GET',
    path: '/note',
    handler: veislynai.noteView,
});

server.route({
    method: 'POST',
    path: '/note',
    handler: veislynai.note,
});

server.route({
    method: 'GET',
    path: '/deleteNote/{id}',
    handler: veislynai.deleteNote,
});

server.route({
    method: 'GET',
    path: '/remove/{id}',
    handler: veislynai.remove,
});

server.route({
    method: 'GET',
    path: '/ataskaitos/veislynai',
    handler: veislynai.reportView,
});

server.route({
    method: 'POST',
    path: '/ataskaitos/veislynai',
    handler: veislynai.report,
});


/* Veislynų valdiklio routes pabaiga */

server.start((err) => {

    if (err) {
        throw err;
    }
    console.log(`Server running at: ${server.info.uri}`);
});
