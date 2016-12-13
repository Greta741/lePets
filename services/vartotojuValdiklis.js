const mysql = require('mysql');
const bcrypt = require('bcryptjs');

const saltRounds = 10;

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'pets'
});
connection.connect();

const registerUser = (request, reply) => {

    const date = new Date();
    const newUser = {
        vartotojo_vardas: request.payload['data[username]'],
        el_pastas: request.payload['data[email]'],
        roles_id: 10
    }

    hashString(request.payload['data[password]'], (hashedString) => {
        hashString(newUser.vartotojo_vardas, (hashedString2) => {
            const loginInfo = {
                slaptazodis: hashedString,
                paskutinio_aktyvumo_laikas: date,
                prieigos_raktas: hashedString2,
                busena: 'aktyvus'
            }
            connection.query('insert into prisijungimo_duomenys set ?', loginInfo, (err, result) => {
                newUser.prisijung_id = result.insertId;
                connection.query('insert into vartotojai set ?', newUser, (err, result) => {})
            });
        })
    })

    reply().state('data', 'thisisacookiestring');
};

const loginUser = (request, reply) => {
    const loginData = {
        username: request.payload['data[username]'],
        password: request.payload['data[password]'],
    }

    connection.query('select vartotojo_vardas, slaptazodis, prieigos_raktas from vartotojai, prisijungimo_duomenys where ' +
        `vartotojo_vardas = '${loginData.username}' AND vartotojai.prisijung_id = prisijungimo_duomenys.id`,
        {}, (err, result1) => {
            if (result1.length > 0) {
                checkMatch(loginData.password, result1[0].slaptazodis, (res) => {
                    if (res) {
                        connection.query('select roles.id, roles.pavadinimas, roliu_teises.id, roliu_teises.pavadinimas, ' +
                            'vartotojai.vartotojo_vardas, vartotojai.id as vart_id from roles, vartotojai, roliu_teises, ' +
                            `role_teise WHERE vartotojai.vartotojo_vardas = '${loginData.username}' ` +
                            'AND vartotojai.roles_id = roles.id AND roles.id = role_teise.roles_id ' +
                            'AND role_teise.teises_id = roliu_teises.id', {}, (err, result2) => {
                            var teises = [];
                            for (var i = 10; i < 28; i++) {
                                teises[i] = 'no';
                            }
                            for (var i = 0; i < result2.length; i++) {
                                teises[result2[i].id] = 'yes';
                            }
                            reply().state('session', {
                                username: loginData.username,
                                user_id: result1[0].vart_id,
                                access_token: result1[0].prieigos_raktas,
                                gyvunoRegistravimas: teises[10],
                                uzregistruotoGyvunoRedagavimas: teises[11],
                                veislynoRegistravimas: teises[12],
                                asmeninioProfilioPerziuraRedagavimas: teises[13],
                                asmeniniuZinuciuSiuntimas: teises[14],
                                gyvunoPerziura: teises[15],
                                paieskaPagalRaktazodi: teises[16],
                                issamiPaieskaPagalKriterijus: teises[17],
                                veislesPuslapioPerziura: teises[18],
                                prenumeratosRegistravimas: teises[19],
                                prenumeratosPerziura: teises[20],
                                veislynoPatvirtinimas: teises[21],
                                veislesRegistravimas: teises[22],
                                registruotosVeislesRedagavimas: teises[23],
                                vartotojuRoliuKeitimas: teises[24],
                                perziuretiAtaskaitas: teises[25],
                                asmeninioPuslapioRedagavimas: teises[26],
                                naujienuSkelbimas: teises[27],
                            })
                        });
                    } else {
                        reply('slaptažodis neteisingas');
                    }
                });
            } else {
                reply('vartotojas nerastas');
            }

    });
};

const logoutUser = (request, reply) => {
    reply().redirect('/').unstate('session');
};

const generateNavBar = (session) => {
    htmlData = {};

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
        '<ul class="nav navbar-nav">';

    if (session != undefined) {
        if (session.veislynoRegistravimas == 'yes') {
            htmlData.navbar += '<li><a href="/veislynas">Veislynai</a></li>';
        }
        if (session.gyvunoPerziura == 'yes') {
            htmlData.navbar += '<li><a href="/gyvunai">Gyvūnai</a></li>';
        }
        if (session.veislesPuslapioPerziura == 'yes') {
            htmlData.navbar += '<li><a href="/veisle/1">Veislės</a></li>';
        }

        if (session.paieskaPagalRaktazodi == 'yes') {
            htmlData.navbar += '<li><a href="#"><span class="glyphicon glyphicon-search"></span> Paieška</a></li>';
        }
        htmlData.navbar += '</ul>';
        htmlData.navbar += '<ul class="nav navbar-nav navbar-right">';
        if (session.perziuretiAtaskaitas == 'yes') {
            htmlData.navbar += '<li class="dropdown">' +
                '<a class="dropdown-toggle" data-toggle="dropdown" href="#">Ataskaitos<span class="caret"></span></a>' +
                '<ul class="dropdown-menu">' +
                '<li><a href="/ataskaitos/veislynai">Veislynų ataskaita</a></li>' +
                '<li><a href="#">Veislių ataskaita</a></li>' +
                '<li><a href="#">Gyvūnų ataskaita</a></li>' +
                '<li><a href="#">Vartotojų ataskaita</a></li>' +
                '</ul></li>';
        }
    }

    if (session != undefined) {
        htmlData.navbar +=
            '<li class="dropdown">' +
            '<a class="dropdown-toggle" data-toggle="dropdown" href="#">Menu<span class="caret"></span></a>' +
            '<ul class="dropdown-menu">';
        if (session.asmeninioProfilioPerziuraRedagavimas == 'yes') {
            htmlData.navbar += '<li><a href="/profile">Redaguoti profilį</a></li>';
        }
        if (session.vartotojuRoliuKeitimas == 'yes') {
            htmlData.navbar += '<li><a href="#">Keisti roles</a></li>';
        }
        if (session.veislynoPatvirtinimas == 'yes') {
            htmlData.navbar += '<li><a href="#">Patvirtinti veislynus</a></li>';
        }
        if (session.asmeniniuZinuciuSiuntimas == 'yes') {
            htmlData.navbar += '<li><a href="#">Žinutės</a></li>';
        }
        if (session.prenumeratosRegistravimas == 'yes') {
            htmlData.navbar += '<li><a href="#">Prenumerata</a></li>';
        }

        htmlData.navbar += '<li><a href="/logout">Atsijungti</a></li>' +
            '</ul></li>';
    }
    if (session == undefined) {
        htmlData.navbar +=
            '<li><a style="cursor: pointer" data-toggle="modal" data-target="#registerModal"><span class="glyphicon glyphicon-user"></span> Registruotis</a></li>' +
            '<li><a style="cursor: pointer" data-toggle="modal" data-target="#loginModal"><span class="glyphicon glyphicon-log-in"></span> Prisijungti</a></li>';
    }
    htmlData.navbar += '</ul></div></nav>';
    return htmlData;
};

const profileView = (request, reply) => {
    var data = generateNavBar(request.state.session);
    reply.view('./vartotojai/profile.html', {data});
};

const hashString = (myString, callback) => {
    bcrypt.genSalt(saltRounds, (err, salt) => {
        bcrypt.hash(myString, salt, (error, hash) => {
            callback(hash);
        });
    });
};

const checkMatch = (plainString, hashedString, callback) => {
    bcrypt.compare(plainString, hashedString, (err, res) => {
        callback(res);
    });
};

module.exports = {
    registerUser: registerUser,
    loginUser: loginUser,
    generateNavBar: generateNavBar,
    logoutUser: logoutUser,
    profileView: profileView,
};