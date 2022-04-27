const mysql = require('mysql');

const connection = mysql.createConnection({
  host     : 'localhost',
  user     : process.env.MYSQL_USER || 'root',
  password : process.env.MYSQL_PASSWORD || 'admin',
  database: 'assignment6'
});

connection.connect();

connection.query(`INSERT INTO A01158178_user (id, user_name, first_name, last_name, email, password)
VALUES ('1', 'sarvmr', 'Sarv', 'More', 'sarvmr@bcit.ca', '123456');`, function (error) {
    if (error) {
        throw error
    };

    console.log('User added to A01158178_user table');
 
});

connection.query(`INSERT INTO A01158178_user (id, user_name, first_name, last_name, email, password)
VALUES ('2', 'kevindv', 'Kevin', 'Dev', 'kevindv@bcit.ca', 'testing');`, function (error) {
    if (error) {
        throw error
    };

    console.log('User added to A01158178_user table');
   
});

connection.query(`INSERT INTO A01158178_user (id, user_name, first_name, last_name, email, password)
VALUES ('3', 'johns', 'John', 'Smith', 'johns@bcit.ca', 'test1234');`, function (error) {
    if (error) {
        throw error
    };

    console.log('User added to A01158178_user table');
 
});

connection.query(`INSERT INTO A01158178_user_timeline (user_id, post_date, post, post_time, view_number)
VALUES ('1', '2022-MARCH-10', 'Today we made german fudge cake', '13:23:44', '10');`, function (error) {
    if (error) {
        throw error
    };

    console.log('User added to A01158178_user_timeline table');
   
});

connection.query(`INSERT INTO A01158178_user_timeline (user_id, post_date, post, post_time, view_number)
VALUES ('2', '2022-MAR-15', 'A real hell kitchen today!', '15:45:21', '5');`, function (error) {
    if (error) {
        throw error
    };

    console.log('User added to A01158178_user_timeline table');
  
});

connection.query(`INSERT INTO A01158178_user_timeline (user_id, post_date, post, post_time, view_number)
VALUES ('3', '2022-MAR-20', 'A wonderful day to make shrimp cocktail!', '14:56:59', '12');`, function (error) {
    if (error) {
        throw error
    };

    console.log('User added to A01158178_user_timeline table');

    process.exit(); 
});