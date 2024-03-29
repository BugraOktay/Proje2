const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'database-1.ckwgtkctaxgm.eu-north-1.rds.amazonaws.com',
    user: 'admin',
    port: '3306',
    password: 'oki1962.',
    database: ''
});

connection.connect(err => {
    if (err) {
        console.error('Veritabanına bağlanılamadı:', err);
    } else {


        console.log('Veritabanına başarıyla bağlandı');

    }
});

module.exports = connection;