var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;
var crypto = require('crypto');

var config = {
    user: 'vneogi199',
    database: 'vneogi199',
    host: 'db.imad.hasura-app.io',
    port: 5432,
    password: process.env.DB_PASSWORD
};

var pool = new Pool(config);

var app = express();
app.use(morgan('combined'));

app.get('/', function (req, res) {
res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

function aboutpg()  {
    var aboutcontent='Hi';
    return aboutcontent;
}

function hash(input, salt) {
    //creation of hash
    var hashed = crypto.pbkdf2Sync(input, salt, 10000, 512, 'sha512');
    return ['pbkdf2Sync',salt, hashed.toString('hex')].join('$');
}

app.get('/hash/:input',function(req,res)    {
    var hashedString = hash(req.params.input, 'this-is-some-random-string');
    res.send(hashedString);
});

app.get('/about', function (req, res){
    res.send(aboutpg());
});

app.get('/test-db',function (req, res)   {
    pool.query('SELECT * FROM article', function(err, result)  {
       if(err)  {
           res.status(500).send(err.toString());
       } else   {
           res.send(JSON.stringify(result.rows));
       }
    });
});

app.get('/style.css', function (req, res) {
res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/mobile.jpg', function (req, res) {
res.sendFile(path.join(__dirname, 'ui', 'mobile.jpg'));
});

app.get('/comp.jpg', function (req, res) {
res.sendFile(path.join(__dirname, 'ui', 'comp.jpg'));
});

var port = 8080 || process.env.port; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080 || process.env.port, function () {
console.log(`IMAD course app listening on port ${port}!`);
});
