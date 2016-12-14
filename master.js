const Hapi = require('hapi');
const Vision = require('vision');
const Inert = require('inert');

const veislynai = require('./services/veislynuValdiklis.js');
const vartotojai = require('./services/vartotojuValdiklis.js');
const gyvunai = require('./services/gyvunuValdiklis.js');
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

server.route({
    method: 'GET',
    path: '/',
    handler: (request, reply) => {
        var data = vartotojai.generateNavBar(request.state.session);
        reply.view('index.html', {data});
    },
});

/* Veislių valdiklio routes  */
server.route({
    method: 'GET',
    path: '/visosveisles',
    handler: veisles.allBreeds,
});

server.route({
    method: 'GET',
    path: '/naujaveisle',
    handler: veisles.registerView,
});

server.route({
    method: 'POST',
    path: '/naujaveisle',
    handler: veisles.insertNew,
});

server.route({
    method: 'GET',
    path: '/naujapoveisle',
    handler: veisles.registerSubBreedView,
});

server.route({
    method: 'POST',
    path: '/naujapoveisle',
    handler: veisles.insertNewSubBreed,
});

server.route({
    method: 'GET',
    path: '/redveis/{id?}',
    handler: veisles.editView,
});

server.route({
    method: 'GET',
    path: '/redpoveis/{id?}',
    handler: veisles.editSubbreedView,
});

server.route({
    method: 'POST',
    path: '/redveis/{id?}',
    handler: veisles.editBreed,
});

server.route({
    method: 'POST',
    path: '/redpoveis/{id?}',
    handler: veisles.editSubBreed,
});

server.route({
    method: 'GET',
    path: '/veisle/{id?}',
    handler: veisles.showPage,
});

server.route({
    method: 'GET',
    path: '/poveisle/{id?}',
    handler: veisles.showSubbreedPage,
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


/* Vartotojų valdiklio routes pradžia */
server.route({
    method: 'POST',
    path: '/register',
    handler: vartotojai.registerUser,
});

server.route({
    method: 'POST',
    path: '/login',
    handler: vartotojai.loginUser,
});

server.route({
    method: 'GET',
    path: '/logout',
    handler: vartotojai.logoutUser,
});

server.route({
    method: 'GET',
    path: '/profile',
    handler: vartotojai.profileView,
});

server.route({
    method: 'POST',
    path: '/editProfile',
    handler: vartotojai.editProfile,
});

server.route({
    method: 'GET',
    path: '/rolesview',
    handler: vartotojai.rolesView,
});

server.route({
    method: 'POST',
    path: '/changeRole',
    handler: vartotojai.changeRole,
});

server.route({
    method: 'GET',
    path: '/veislynuregistracijos',
    handler: vartotojai.veislynuRegView,
});

server.route({
    method: 'POST',
    path: '/keistiVeislynoStatusa',
    handler: vartotojai.keistiVeislynoStatusa,
});

server.route({
    method: 'GET',
    path: '/ataskaitos/vartotojai',
    handler: vartotojai.chooseReport,
});

server.route({
    method: 'POST',
    path: '/ataskaitos/vartotojai',
    handler: vartotojai.returnReport,
});

server.state('session', {
    ttl: 24 * 60 * 60 * 1000,
    isSecure: false,
    path: '/',
    encoding: 'base64json'
});

/* Vartotojų valdiklio routes pabaiga */

/* Gyvūnų valdiklio routes  */

server.route({
    method: 'GET',
    path: '/gyvunai/{id?}',
    handler: gyvunai.showPage,
});

server.route({
    method: 'GET',
    path: '/naujasgyvunas',
    handler: gyvunai.registerView,
});

server.route({
    method: 'POST',
    path: '/naujasgyvunas',
    handler: gyvunai.insertNew,
});

server.route({
    method: 'GET',
    path: '/redaguotigyvuna/{id?}',
    handler: gyvunai.editView,
});

server.route({
    method: 'POST',
    path: '/redaguotigyvuna/{id?}',
    handler: gyvunai.edit,
});

/* Gyvūnų valdiklio routes pabaiga */

server.start((err) => {

    if (err) {
        throw err;
    }
    console.log(`Server running at: ${server.info.uri}`);
});
