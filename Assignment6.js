
const { Console } = require("console");
const express = require("express");
const session = require("express-session");
const app = express();
const fs = require("fs");
const { JSDOM } = require('jsdom');

// static path mappings
app.use("/js", express.static("./public/js"));
app.use("/css", express.static("./public/css"));
app.use("/imgs", express.static("./public/imgs"));
app.use("/fonts", express.static("./public/fonts"));
app.use("/html", express.static("./public/html"));
app.use("/media", express.static("./public/media"));

const userTable = 'A01158178_user';
const userTimelineTable = 'A01158178_user_timeline';

const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || 'admin',
    database: 'assignment6'
});

app.use(session(
    {
        secret: "extra text that no one will guess",
        name: "wazaSessionID",
        resave: false,
        // create a unique identifier for that client
        saveUninitialized: true
    })
);


app.get("/", function (req, res) {

    if (req.session.loggedIn) {
        res.redirect("/profile");
    } else {

        let doc = fs.readFileSync("./app/html/index.html", "utf8");

        res.set("Server", "Wazubi Engine");
        res.set("X-Powered-By", "Wazubi");
        res.send(doc);
    }
});


app.get("/profile", function (req, res) {

    // check for a session first!
    if (req.session.loggedIn) {

        let profile = fs.readFileSync("./app/html/profile.html", "utf8");
        let profileDOM = new JSDOM(profile);
        console.log("begin");
        console.log(`SELECT * FROM ${userTimelineTable} INNER JOIN ${userTable} ON ${userTimelineTable}.user_id = ${userTable}.id AND ${userTable}.id = '${req.session.userID}'`);

        connection.query(`SELECT * FROM ${userTimelineTable} INNER JOIN ${userTable} ON 
        ${userTimelineTable}.user_id = ${userTable}.id AND ${userTable}.id = '${req.session.userID}' `, function (error, results) {
            console.log(error);
            console.log(results);
            // great time to get the user's data and put it into the page!
            profileDOM.window.document.getElementsByTagName("title")[0].innerHTML
                = req.session.name + "'s Profile";
            profileDOM.window.document.getElementById("profile_name").innerHTML
                = "Welcome back " + results[0].first_name;
            profileDOM.window.document.getElementById("desc_top").innerHTML
                =results[0].post;
            profileDOM.window.document.getElementById("post_date").innerHTML
                =results[0].post_date;
            profileDOM.window.document.getElementById("post_time").innerHTML
                =results[0].post_time;
            profileDOM.window.document.getElementById("post_view").innerHTML
                =results[0].view_number;
            
            res.set("Server", "Wazubi Engine");
            res.set("X-Powered-By", "Wazubi");
            res.send(profileDOM.serialize());
            // TO DO build DOM and add to innerHTML of time-line container
        });
                // great time to get the user's data and put it into the page!
            //     profileDOM.window.document.getElementsByTagName("title")[0].innerHTML
            //     = req.session.name + "'s Profile";
            // profileDOM.window.document.getElementById("profile_name").innerHTML
            //     = "Welcome back " + req.session.name;
    
            // res.set("Server", "Wazubi Engine");
            // res.set("X-Powered-By", "Wazubi");
            // res.send(profileDOM.serialize());


    } else {
        // not logged in - no session and no access, redirect to home!
        res.redirect("/");
    }

});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));



connection.connect();

// Notice that this is a "POST"
app.post("/login", function (req, res) {
    res.setHeader("Content-Type", "application/json");

    console.log("What was sent", req.body.email, req.body.password);

    connection.query(`SELECT * FROM ${userTable} WHERE email = '${req.body.email}' AND password = '${req.body.password}'`, function (error, results) {
        console.log(req,results);
        if (error || !results || !results.length) {
            res.send({ status: "fail", msg: "User account not found." });
        } else {
            // user authenticated, create a session
            req.session.loggedIn = true;
            req.session.email = results[0].email;
            req.session.name = results[0].user_name;
            req.session.userID = results[0].id;
            req.session.username = results[0].first_name;
            req.session.save(function (err) {
                // session saved. For analytics, we could record this in a DB
            });

            // all we are doing as a server is telling the client that they
            // are logged in, it is up to them to switch to the profile page
            res.send({ status: "success", msg: "Logged in." });
        }
    });
});

app.get("/logout", function (req, res) {

    if (req.session) {
        req.session.destroy(function (error) {
            if (error) {
                res.status(400).send("Unable to log out")
            } else {
                // session deleted, redirect to home
                res.redirect("/");
            }
        });
    }
});


// RUN SERVER
let port = 5000;
app.listen(port, function () {
    console.log("Listening on port " + port + "!");
});
