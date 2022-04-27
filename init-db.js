const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || 'admin'
});

connection.connect();

connection.query(`CREATE DATABASE IF NOT EXISTS assignment6;`, function (dbCreateError) {
    if (dbCreateError) {
        throw dbCreateError
    };

    console.log("DB created: assignment6");

    connection.changeUser({ database: 'assignment6' }, function () {
        connection.query(`CREATE TABLE IF NOT EXISTS A01158178_user	 (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_name VARCHAR(255) NOT NULL,
            first_name VARCHAR(255) NOT NULL,
            last_name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            password VARCHAR(255) NOT NULL
            
            )  ENGINE=INNODB;`, function (tableCreateError) {
            if (tableCreateError) {
                throw tableCreateError;
            };

            console.log("A01158178_user table created");

            connection.query(`CREATE TABLE IF NOT EXISTS A01158178_user_timeline    (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            post_date VARCHAR(255),
            post TEXT,
            post_time VARCHAR(255),
            view_number INT,
            FOREIGN KEY (user_id) REFERENCES A01158178_user(id) ON UPDATE CASCADE ON DELETE CASCADE 
            )  ENGINE=INNODB; `, function (tableCreateError) {
                if (tableCreateError) {
                    throw tableCreateError;
                };

            console.log("A01158178_user_timeline table created");
            process.exit();
            });
        });
    })
});