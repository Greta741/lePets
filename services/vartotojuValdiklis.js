const mysql = require('mysql');
const bcrypt = require('bcryptjs');

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

    reply();
}

const saltRounds = 10;

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
    registerUser,
}