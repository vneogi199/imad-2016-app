var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;

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

app.get('/ui/test.php', function (req, res) {
res.sendFile(path.join(__dirname, 'ui', 'test.php'));
});

app.get('/', function (req, res) {
res.sendFile(path.join(__dirname, 'ui', 'index.html'));
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

app.get('/header.html', function (req, res) {
res.sendFile(path.join(__dirname, 'ui', 'header.html'));
});

app.get('/register', function (req, res) {
res.sendFile(path.join(__dirname, 'ui', 'register.html'));
});

app.get('/ui/style.css', function (req, res) {
res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
console.log(`IMAD course app listening on port ${port}!`);
});