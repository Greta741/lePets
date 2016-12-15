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
            connection.query(`select vartotojai.id from vartotojai where vartotojo_vardas='${newUser.vartotojo_vardas}' or 
                el_pastas='${newUser.el_pastas}'`, {}, (err, res) => {
                if (res.length == 0) {
                    connection.query('insert into prisijungimo_duomenys set ?', loginInfo, (err, result) => {
                        newUser.prisijung_id = result.insertId;
                        connection.query('insert into vartotojai set ?', newUser, (err, result) => {})
                    });
                    reply();
                } else {
                    reply({message: 'egzistuoja'});
                }
            });

        })
    })
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
                                user_id: result2[0].vart_id,
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
                        reply({message: 'slaptazodis neteisingas'});
                    }
                });
            } else {
                reply({message: 'vartotojas nerastas'});
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
        if (session.veislynoRegistravimas == 'yes' || session.asmeninioPuslapioRedagavimas == 'yes') {
            htmlData.navbar += '<li><a href="/veislynas">Veislynai</a></li>';
        }
        if (session.gyvunoPerziura == 'yes') {
            htmlData.navbar += '<li><a href="/gyvunai">Gyvūnai</a></li>';
        }
        if (session.veislesPuslapioPerziura == 'yes') {
            htmlData.navbar += '<li><a href="/visosveisles">Veislės</a></li>';
        }

        if (session.paieskaPagalRaktazodi == 'yes') {
            htmlData.navbar += '<li><a href="/paieska"><span class="glyphicon glyphicon-search"></span> Gyvūnų paieška</a></li>';
        }
        
        htmlData.navbar += '</ul>';
        htmlData.navbar += '<ul class="nav navbar-nav navbar-right">';
        if (session.perziuretiAtaskaitas == 'yes') {
            htmlData.navbar += '<li class="dropdown">' +
                '<a class="dropdown-toggle" data-toggle="dropdown" href="#">Ataskaitos<span class="caret"></span></a>' +
                '<ul class="dropdown-menu">' +
                '<li><a href="/ataskaitos/veislynai">Veislynų ataskaita</a></li>' +
                '<li><a href="/ataskaitos/veisles">Veislių ataskaita</a></li>' +
                '<li><a href="/ataskaitos/gyvunai">Gyvūnų ataskaita</a></li>' +
                '<li><a href="/ataskaitos/vartotojai">Vartotojų ataskaita</a></li>' +
                '</ul></li>';
        }
    }

    if (session != undefined) {
        htmlData.navbar +=
            '<li class="dropdown">' +
            '<a class="dropdown-toggle" data-toggle="dropdown" href="#">Meniu<span class="caret"></span></a>' +
            '<ul class="dropdown-menu">';
        if (session.asmeninioProfilioPerziuraRedagavimas == 'yes') {
            htmlData.navbar += '<li><a href="/profile">Redaguoti profilį</a></li>';
        }
        if (session.vartotojuRoliuKeitimas == 'yes') {
            htmlData.navbar += '<li><a href="/rolesview">Keisti roles</a></li>';
        }
        if (session.veislynoPatvirtinimas == 'yes') {
            htmlData.navbar += '<li><a href="/veislynuregistracijos">Patvirtinti veislynus</a></li>';
        }
        if (session.asmeniniuZinuciuSiuntimas == 'yes') {
            htmlData.navbar += '<li><a href="/messages">Žinutės</a></li>';
        }
        if (session.prenumeratosRegistravimas == 'yes') {
            htmlData.navbar += '<li><a href="/visospren">Prenumerata</a></li>';
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
    if (request.state.session.asmeninioProfilioPerziuraRedagavimas == 'yes') {
        connection.query(`select * from vartotojai where vartotojo_vardas='${request.state.session.username}'`, {}, (err, res) => {
            var birthdate = res[0].gimimo_data;
            var dateString = '';
            if (birthdate != null) {
                var date = new Date(birthdate);
                date.setDate(date.getDate() + 1);
                dateString = date.toISOString().substring(0, 10);
            }
            var userData = {
                vartotojo_vardas: res[0].vartotojo_vardas,
                el_pastas: res[0].el_pastas,
                telefono_nr: res[0].telefono_nr,
                gimimo_data: dateString,
                vardas: res[0].vardas,
                pavarde: res[0].pavarde,
                lytis: res[0].lytis,
                salis: res[0].salis,
                miestas: res[0].miestas,
            }
            var data = generateNavBar(request.state.session);
            reply.view('./vartotojai/profile.html', {data, userData});
        });
    } else {
        reply('negalima');
    }
};

const editProfile = (request, reply) => {
    if (request.state.session.asmeninioProfilioPerziuraRedagavimas == 'yes') {
        const newData = {
            el_pastas: request.payload['newData[email]'],
            telefono_nr: request.payload['newData[tel]'],
            gimimo_data: request.payload['newData[birthdate]'],
            vardas: request.payload['newData[vardas]'],
            pavarde: request.payload['newData[pav]'],
            salis: request.payload['newData[count]'],
            miestas: request.payload['newData[city]'],
            lytis: request.payload['newData[gender]'],
        }
        connection.query(`update vartotojai set ? where vartotojo_vardas='${request.state.session.username}'`, newData, (err, res) => {
            reply();
        });
    } else {
        reply("negalima");
    }
};

const rolesView  = (request, reply) => {
    if (request.state.session.vartotojuRoliuKeitimas == 'yes') {
        var usersData = {
            users: []
        };
        connection.query('select vartotojo_vardas, vartotojai.id as vart_id, el_pastas, roles.id, roles.pavadinimas from vartotojai, ' +
            'roles where vartotojai.roles_id = roles.id', {}, (err, res) => {
            for (var i = 0; i < res.length; i++) {
                usersData.users[i] = {
                    username: res[i].vartotojo_vardas,
                    user_id: res[i].vart_id,
                    email: res[i].el_pastas,
                    roles_id: res[i].id,
                    role: res[i].pavadinimas
                }
            }
            var data = generateNavBar(request.state.session);
            reply.view('./vartotojai/roles.html', {data, usersData});
        });
    } else {
        reply();
    }
};

const changeRole = (request, reply) => {
    if (request.state.session.vartotojuRoliuKeitimas == 'yes') {
        var id;
        if (request.payload.value == "Registruotas vartotojas") {
            id = 10;
        } else if (request.payload.value == "Moderatorius") {
            id = 11;
        } else if (request.payload.value == "Administratorius") {
            id = 12;
        } else if (request.payload.value == "Veislyno savininkas") {
            id = 13;
        }
        connection.query(`update vartotojai set vartotojai.roles_id=${id} where 
        vartotojai.id=${request.payload.id}`, {}, (err, res) => {
            reply();
        });
    } else {
        reply();
    }
};

const veislynuRegView = (request, reply) => {
    if (request.state.session.veislynoPatvirtinimas == 'yes') {
        var veislynuData = {
            data: []
        }
        connection.query('select pavadinimas, veislynai.id, registracijos_data, vartotojai.id as vart_id, vartotojo_vardas ' +
            'from veislynai, vartotojai where veislynai.ar_patvirtintas = 0 and vartotojai.id=veislynai.vartotojo_id ' +
            'order by registracijos_data', {}, (err, res) => {
            for (var i = 0; i < res.length; i++) {
                var fullDate = res[i].registracijos_data;
                var dateString = '';
                var date = new Date(fullDate);
                date.setDate(date.getDate() + 1);
                dateString = date.toISOString().substring(0, 10);
                veislynuData.data[i] = {
                    pavadinimas: res[i].pavadinimas,
                    id: res[i].id,
                    registracijos_data: dateString,
                    vart_id: res[i].vart_id,
                    vartotojo_vardas: res[i].vartotojo_vardas
                };
            }
            var data = generateNavBar(request.state.session);
            reply.view('./vartotojai/veislynuregistracijos.html', {data, veislynuData});
        });
    } else {
        reply();
    }
};

const keistiVeislynoStatusa = (request, reply) => {
    if (request.state.session.veislynoPatvirtinimas == 'yes') {
        var decisionId;
        if (request.payload.decision == 'accept') {
            decisionId = 1;
        } else {
            decisionId = 2;
        }
        connection.query(`update veislynai set veislynai.ar_patvirtintas=${decisionId} where 
            veislynai.id=${request.payload.id}`, {}, (err, res) => {
            connection.query(`update vartotojai set vartotojai.roles_id=13 where 
                vartotojai.vartotojo_vardas='${request.payload.username}'`, {}, (err, res) => {
                reply();
            });
        });
    } else {
        reply();
    }
};

const chooseReport = (request, reply) => {
    if (request.state.session && request.state.session.perziuretiAtaskaitas == 'yes') {
        var data = generateNavBar(request.state.session);
        data.select = 1;
        reply.view('./vartotojai/ataskaita.html', {data});
    } else {
        reply('negalima');
    }
};

const returnReport = (request, reply) => {
    var data = generateNavBar(request.state.session);
    if (request.payload.choice.toString() == '1') {
        connection.query('select vartotojai.id as vart_id, vartotojo_vardas, el_pastas, roles.id, roles.pavadinimas ' +
            'from vartotojai, roles where vartotojai.roles_id = roles.id', {}, (err, res) => {
            data.roles = [];
            for (var i = 0; i < res.length; i++) {
                data.roles[i] = {
                    id: res[i].vart_id,
                    username: res[i].vartotojo_vardas,
                    email: res[i].el_pastas,
                    role: res[i].pavadinimas
                }
            }
            reply.view('./vartotojai/ataskaita.html', {data});
        });
    } else {
        connection.query('select vartotojai.id, vartotojo_vardas, el_pastas, veislynai.pavadinimas, gyvunu_skaicius ' +
            'from vartotojai, veislynai where veislynai.vartotojo_id = vartotojai.id', {}, (err, res) => {
            data.veislynai = [];
            for (var i = 0; i < res.length; i++) {
                data.veislynai[i] = {
                    id: res[i].id,
                    username: res[i].vartotojo_vardas,
                    email: res[i].el_pastas,
                    title: res[i].pavadinimas,
                    pets: res[i].gyvunu_skaicius
                }
            }
            reply.view('./vartotojai/ataskaita.html', {data});
        });
    }
};

const messagesView = (request, reply) => {
    connection.query('select vartotojai.id, asmenines_zinutes.id, vartotojo_vardas, tema, tekstas, issiuntimo_laikas ' +
        `from vartotojai, asmenines_zinutes where asmenines_zinutes.adresatas = ${request.state.session.user_id} ` +
        'and vartotojai.id = asmenines_zinutes.siuntejas order by issiuntimo_laikas desc', {}, (err, res) => {
        var data = generateNavBar(request.state.session);
        data.messages = [];
        for (var i = 0; i < res.length; i++) {
            var tmpdata = res[i].issiuntimo_laikas.toISOString();
            var date = tmpdata.substring(0, 10) + ' ' + tmpdata.substring(11, 19);
            data.messages[i] = {
                id: res[i].id,
                username: res[i].vartotojo_vardas,
                tema: res[i].tema,
                tekstas: res[i].tekstas,
                issiuntimo_laikas: date,
            };
            var perz = new Date().toISOString();
            connection.query(`update asmenines_zinutes set perziurejimo_laikas='${perz}', busena='perziuretas' 
                where id=${data.messages[i].id}`, {}, (err ,res) => {
            });
        }
        reply.view('./vartotojai/messages.html', {data});
    });
}

const sendMessage = (request, reply) => {
    if (request.state.session.asmeniniuZinuciuSiuntimas) {
        connection.query(`select id, vartotojai.vartotojo_vardas from vartotojai where 
        vartotojo_vardas='${request.payload.adresatas}'`, {}, (err, res) => {
            if (res.length == 1) {
                const newMessage = {
                    adresatas: res[0].id,
                    siuntejas: request.state.session.user_id,
                    tekstas: request.payload.zinute,
                    tema: request.payload.tema
                }
                connection.query('insert into asmenines_zinutes set ?', newMessage, (err, res) => {
                    reply();
                });
            } else {
                reply({message: 'adresato nera'});
            }
        });
    } else {
        reply('negalima');
    }
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
    editProfile: editProfile,
    rolesView: rolesView,
    changeRole: changeRole,
    veislynuRegView: veislynuRegView,
    keistiVeislynoStatusa: keistiVeislynoStatusa,
    chooseReport: chooseReport,
    returnReport: returnReport,
    messagesView: messagesView,
    sendMessage: sendMessage,
};