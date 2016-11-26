var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;
var crypto = require('crypto');
var bodyParser = require('body-parser');
var session = require('express-session');

var config = {
    user: 'vneogi199',
    database: 'vneogi199',
    host: 'db.imad.hasura-app.io',
    port: 5432,
    password: process.env.DB_PASSWORD
};

var app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(session({
    secret: 'someRandomSecretValue',
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 30}
}));

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
            <a href="/blog">Blog</a>
          </li>
          <li>
            <a href="/about">About Me</a>
          </li>
          <li>
            <a href="/contact">Contact Me</a>
          </li>
          <li>
            <a href="/login">Login/Register</a>
          </li>
        </ul>
      </nav>
    `;
function createTemplate(title, script, content) {
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
function homeContent()  {
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

function blogContent()  {
    var content=`
    <!doctype html>
        <html>
            <head>
                <link href="/ui/style.css" rel="stylesheet">
            </head>
            <body>
                <nav>
                    <ul>
                        <li><a href="/">Home</a></li>
                        <li><a href="/blog">Blog</a></li>
                        <li><a href="/about">About Me</a></li>
                        <li><a href="/contact">Contact Me</a></li>
                        <li><a href="/login">Login/Register</a></li>
                    </ul>
                </nav>
                <h2>My Articles</h2>
                <div id="articles">
                    <center>Loading articles...</center>
                </div>
                <div class="footer">
                </div>
                <script type="text/javascript" src="/ui/blog.js">
                </script>
            </body>
        </html>
    `;
    return content;
}

function aboutContent() {
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

function contactContent() {
  var content=nav+`
      <main id="contactMain">
        <img src="photo.jpg" id="photo" />
        <h1>Vinit Neogi</h1>
        <h2>You can e-mail me at : <a href="mailto:vneogi199@gmail.com" style="color: white;">vneogi199@gmail.com</a></h2>
      <h3>My LinkedIn profile : <a href="https://www.linkedin.com/in/vinit-neogi-b6477812a"  style="color: white;">Vinit Neogi - LinkedIn</a></h3>
      <h3>My Gihub profile : <a href="https://github.com/vneogi199/" style="color: white;">Vinit Neogi - Github</a></h3>
      </main>
      `;
      return content;
}

function createTemplateNew (data) {
    var title = data.title;
    var date = data.date;
    var heading = data.heading;
    var content = data.content;
    
    var htmlTemplate = `
    <html>
      <head>
          <title>
              ${title}
          </title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link href="/ui/style.css" rel="stylesheet" />
      </head> 
      <body>
      `+nav+`
          <div class="container">
              <h3>
                  ${heading}
              </h3>
              <div>
                  ${date.toDateString()}
              </div>
              <div>
                ${content}
              </div>
              <hr/>
              <h4>Comments</h4>
              <div id="comment_form">
              </div>
              <div id="comments">
                <center>Loading comments...</center>
              </div>
          </div>
          <script type="text/javascript" src="/ui/article.js"></script>
      </body>
    </html>
    `;
    return htmlTemplate;
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


app.get('/blog', function(req,res)  {
   res.send(blogContent()); 
});


app.get('/login', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});




function hash (input, salt) {
    // How do we create a hash?
    var hashed = crypto.pbkdf2Sync(input, salt, 10000, 512, 'sha512');
    return ["pbkdf2", "10000", salt, hashed.toString('hex')].join('$');
}


app.get('/hash/:input', function(req, res) {
   var hashedString = hash(req.params.input, 'this-is-some-random-string');
   res.send(hashedString);
});

app.post('/create-user', function (req, res) {
   // username, password
   // {"username": "tanmai", "password": "password"}
   // JSON
   var username = req.body.username;
   var password = req.body.password;
   var salt = crypto.randomBytes(128).toString('hex');
   var dbString = hash(password, salt);
   pool.query('INSERT INTO "user" (username, password) VALUES ($1, $2)', [username, dbString], function (err, result) {
      if (err) {
          res.status(500).send(err.toString());
      } else {
          res.send('User successfully created: ' + username);
      }
   });
});

app.post('/login', function (req, res) {
   var username = req.body.username;
   var password = req.body.password;
   
   pool.query('SELECT * FROM "user" WHERE username = $1', [username], function (err, result) {
      if (err) {
          res.status(500).send(err.toString());
      } else {
          if (result.rows.length === 0) {
              res.status(403).send('username/password is invalid');
          } else {
              // Match the password
              var dbString = result.rows[0].password;
              var salt = dbString.split('$')[2];
              var hashedPassword = hash(password, salt); // Creating a hash based on the password submitted and the original salt
              if (hashedPassword === dbString) {
                
                // Set the session
                req.session.auth = {userId: result.rows[0].id};
                // set cookie with a session id
                // internally, on the server side, it maps the session id to an object
                // { auth: {userId }}
                
                res.send('credentials correct!');
                
              } else {
                res.status(403).send('username/password is invalid');
              }
          }
      }
   });
});

app.get('/check-login', function (req, res) {
   if (req.session && req.session.auth && req.session.auth.userId) {
       // Load the user object
       pool.query('SELECT * FROM "user" WHERE id = $1', [req.session.auth.userId], function (err, result) {
           if (err) {
              res.status(500).send(err.toString());
           } else {
              res.send(result.rows[0].username);    
           }
       });
   } else {
       res.status(400).send('You are not logged in');
   }
});

app.get('/logout', function (req, res) {
   delete req.session.auth;
   res.send('<html><body>Logged out!<br/><br/><a href="/">Back to home</a></body></html>');
});

var pool = new Pool(config);

app.get('/get-articles', function (req, res) {
   // make a select request
   // return a response with the results
   pool.query('SELECT * FROM article ORDER BY date DESC', function (err, result) {
      if (err) {
          res.status(500).send(err.toString());
      } else {
          res.send(JSON.stringify(result.rows));
      }
   });
});

app.get('/get-comments/:articleName', function (req, res) {
   // make a select request
   // return a response with the results
   pool.query('SELECT comment.*, "user".username FROM article, comment, "user" WHERE article.title = $1 AND article.id = comment.article_id AND comment.user_id = "user".id ORDER BY comment.timestamp DESC', [req.params.articleName], function (err, result) {
      if (err) {
          res.status(500).send(err.toString());
      } else {
          res.send(JSON.stringify(result.rows));
      }
   });
});

app.post('/submit-comment/:articleName', function (req, res) {
   // Check if the user is logged in
    if (req.session && req.session.auth && req.session.auth.userId) {
        // First check if the article exists and get the article-id
        pool.query('SELECT * from article where title = $1', [req.params.articleName], function (err, result) {
            if (err) {
                res.status(500).send(err.toString());
            } else {
                if (result.rows.length === 0) {
                    res.status(400).send('Article not found');
                } else {
                    var articleId = result.rows[0].id;
                    // Now insert the right comment for this article
                    pool.query(
                        "INSERT INTO comment (comment, article_id, user_id) VALUES ($1, $2, $3)",
                        [req.body.comment, articleId, req.session.auth.userId],
                        function (err, result) {
                            if (err) {
                                res.status(500).send(err.toString());
                            } else {
                                res.status(200).send('Comment inserted!')
                            }
                        });
                }
            }
       });     
    } else {
        res.status(403).send('Only logged in users can comment');
    }
});

app.get('/articles/:articleName', function (req, res) {
  // SELECT * FROM article WHERE title = '\'; DELETE WHERE a = \'asdf'
  pool.query("SELECT * FROM article WHERE title = $1", [req.params.articleName], function (err, result) {
    if (err) {
        res.status(500).send(err.toString());
    } else {
        if (result.rows.length === 0) {
            res.status(404).send('Article not found');
        } else {
            var articleData = result.rows[0];
            res.send(createTemplateNew(articleData));
        }
    }
  });
});

app.get('/ui/:fileName', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', req.params.fileName));
});


var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
