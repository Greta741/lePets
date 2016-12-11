const mysql = require('mysql');

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
        registracijos_laikas: date,
    }

    connection.query('insert into vartotojai set ?', newUser, (err, result) => {});

    reply('reply');
}

module.exports = {
    registerUser,
}