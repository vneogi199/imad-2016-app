//including all dependencies
var express = require('express');
var morgan = require('morgan');
var path = require('path');
//var Pool = require('pg').Pool;
var crypto = require('crypto');

//config variable
var config = {
    user: 'vneogi199',
    database: 'vneogi199',
    host: 'db.imad.hasura-app.io',
    port: 5432,
    password: process.env.DB_PASSWORD
};

//var pool = new Pool(config);

var app = express();
app.use(morgan('combined'));


//creation of resources for the application
app.get('/style.css', function (req, res) {
res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/mobile.jpg', function (req, res) {
res.sendFile(path.join(__dirname, 'ui', 'mobile.jpg'));
});

app.get('/comp.jpg', function (req, res) {
res.sendFile(path.join(__dirname, 'ui', 'comp.jpg'));
});

app.get('/photo.jpg', function (req, res) {
res.sendFile(path.join(__dirname, 'ui', 'photo.jpg'));
});

var nav=`
		<nav>
	    	<ul>
	   			<li>
	   				<a href="/">Home</a>
	   			</li>
	   			<li>
	   				<a href="blog">Blog</a>
    			</li>
	    		<li>
	    			<a href="about">About Me</a>
	    		</li>
	   			<li>
	   				<a href="contact">Contact Me</a>
	   			</li>
	   			<li>
    				<a href="reg">Login/Register</a>
    			</li>
    		</ul>
	    </nav>
		`;
function createTemplate(title, script, content)	{
	var template=`
		<!DOCTYPE html>	
			<html>
			    <head>
			        <title>`+title+`</title>
			        <link rel="stylesheet" href="style.css">
			        `+script+`
			    </head>
			    <body>
			    	`+content+`
			    </body>
			</html>
			`;
			return template;
}
function homeContent()	{
	var content=nav+`
	    <main>
	   		<img src="comp.jpg"/>
	   	</main>
	   	<footer>
	   		Welcome. This site has been created by Vinit Neogi.
	   	</footer>
	   	`;
	   	return content;
}


function aboutContent()	{
	var content=nav+`
	    <main id="aboutMain">
    		<img src="photo.jpg" id="photo" />
    		<h1>Vinit Neogi</h1>
    		<h2>Student at St. Francis Institute of Technology, Mumbai</h2>
			<h3>Tech enthusiast</h3>
			<h3>Interested in Android and Linux</h3>
			<h3>Likes programming and developing apps</h3>
    	</main>
	   	`;
	   	return content;
}

function contactContent()	{
	var content=nav+`
	    <main id="contactMain">
    		<img src="photo.jpg" id="photo" />
    		<h1>Vinit Neogi</h1>
    		<h2>You can e-mail me at : <a href="mailto:vneogi199@gmail.com" style="color: white;">vneogi199@gmail.com</a></h2>
			<h3>LinkedIn profile : <a href="https://www.linkedin.com/in/vinit-neogi-b6477812a"  style="color: white;">Vinit Neogi - LinkedIn</a></h3>
			<h3>Gihub profile : <a href="https://github.com/vneogi199/" style="color: white;">Vinit Neogi - Github</a></h3>
    	</main>
	   	`;
	   	return content;
}


app.get('/', function (req, res) {
res.send(createTemplate(
		'Welcome to Techniqed',
		`
		<script type="text/javascript">
			alert("Welcome to Techniqed.Created by Vinit Neogi.The images used on this website are used from various sources on the Internet.No copyright infringement intended.");
      	</script>
      	`,
      	homeContent()
	));
});

app.get('/about', function (req, res){
    res.send(createTemplate('About Me', '', aboutContent()));
});

app.get('/contact', function (req, res){
    res.send(createTemplate('Contact Us', '', contactContent()));
});



function hash(input, salt) {
    //creation of hash
    var hashed = crypto.pbkdf2Sync(input, salt, 10000, 512, 'sha512');
    return ['pbkdf2Sync',salt, hashed.toString('hex')].join('$');
}

app.get('/hash/:input',function(req,res)    {
    var hashedString = hash(req.params.input, 'this-is-some-random-string');
    res.send(hashedString);
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

var port = 8080 || process.env.port; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080 || process.env.port, function () {
console.log(`IMAD course app listening on port ${port}!`);
});
