const express = require('express')
const passport = require('passport')
const jwt = require('jsonwebtoken');
const accessTokenSecret = 'youraccesstokensecret';
const refreshTokenSecret = 'secret';
const refreshTokens = [];
const bcrypt = require('bcrypt')
var Datastore = require('nedb')
  db = new Datastore({ filename: 'data.db', autoload: true }),
  books = new Datastore({ filename: 'books.db', autoload: true });
const app = express();
const PORT = process.env.PORT;
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);
app.use(express.json());
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, accessTokenSecret, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }

            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
}
  // get for login 
app.get('/api/auth', function(req, res){
return response.render('login.html');

});


  // logga in dig här efter du gjort en användare, done 
    app.post('/api/auth',  function(req, res){
        const user_input = {
            email: req.body.email,
            password: req.body.password,
        }
        db.findOne({email: user_input.email}).exec((err, user_data) => {
           if(user_data){
            bcrypt.compare(user_input.password, user_data.password).then(function(result) {
                if(result){
                    const accessToken = jwt.sign({ email: user_data.email }, accessTokenSecret, { expiresIn: '20m' });
                   const refreshToken = jwt.sign({ email: user_data.email }, refreshTokenSecret);

        refreshTokens.push(refreshToken);
                    res.send({'respons': "You have been logged in!", 'token': accessToken})
                }else{
                    res.status(401).send({'respons': "Wrong password or email!"})
                }
            });
           }else{
                res.status(401).send({'respons': "Wrong password or email!"})
           }
            
            
        });
    });

    // registrerar en användare ,done 
    app.get('/api/register', function(req, res) {
        console.log(req.body);
        const newUser = {
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, salt),
            name: req.body.name,
            role: "admin"
        }
          db.find({ "email": newUser.email}, function (err,docs){
            if(docs.length > 0){
                res.status(400).send({ response: "User already exists!" });
            }else{
                  db.insert(newUser)
                res.json({ response: "User has been registered!" });
            }
        })
    }); 
   

/* Books */
    app.get('/api/books', function(req,res){
         //lägg till if sats om admin visar alla annars bara användaren
        if(docs.length > 0){
            res.status(400).send({ respons: "book already exists!" });
        }else{
            books.insert(newBooks)
            res.json({ respons: "Book not found!" });
        }
    
        books.find({}, function (err, docs) {
            res.json(docs);
        });
    });
    //Skapar nya böcker
    app.post('/api/books', function(req, res) {
        const newBooks= {
            name: req.body.name,
            language: req.body.language,
            title: req.body.title,
            year: req.body.year,
            country: req.body.country,
            userid: req.body.userid
        }
        const accessToken = jwt.sign({ newBooks: newBooks.author }, accessTokenSecret, { expiresIn: '20m' });
        const refreshToken = jwt.sign({ newBooks: newBooks.author }, refreshTokenSecret);

        books.find({ "title": newBooks.title}, function (err,docs){
            if(docs.length > 0){
                res.status(400).send({ respons: "Book already exists!" });
            }else{
                books.insert(newBooks)
                res.json({ respons: "Book has been added!" });
            }
        })
    });

    // Deleting a Book
    app.delete("/books", (req, res) => {
        console.log(req.body._id);
        books.remove({ _id: req.body._id}, {}, function (err, numRemoved) {
            if(numRemoved > 0){
                return res.json("Book has been deleted.");
            }else{
                return res.json("Nothing has been deleted.");
            }
        });
    });

// startar servern
app.listen(8090, () => {
    console.log("Server running on port 8090")
});