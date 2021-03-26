const express = require('express')
const passport = require('passport')
const jwt = require('jsonwebtoken');
const accessTokenSecret = 'youraccesstokensecret';
const refreshTokenSecret = 'secret';
const refreshTokens = [];
const bcrypt = require('bcrypt')
var Datastore = require('nedb')
 db = new Datastore({ filename: 'books.db', autoload: true });
const app = express();
const PORT = process.env.PORT;
const saltRounds = 20;
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
  // logga in dig här / funkar 
    app.post('/login/auth', function(req, res){
        const user_input = {
            email: req.body.email,
            password: req.body.password,
        }
        db.findOne({email: user_input.email}).exec((err, user_data) => {
            console.log(user_data);
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
   // api register works
    app.get('/register', function(req, res) {
        console.log(req.body);
        const newUser = {
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, salt),
            name: req.body.name,
            role: "admin"
        }
        console.log(newUser)
        db.find({ "email": newUser.email}, function (err,docs){
            if(docs.length > 0){
                res.status(400).send({ respons: "User already exists!" });
            }else{
                db.insert(newUser)
                res.json({ respons: "User has been registered!" });
            }
        })
    });

    // få ut böcker , denna funkar, kommer ut något
    app.post('/register/books', function(req, res) {
        const newBooks= {
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, salt),
            author: req.body.name,
            language: "/",
            title: "/",
            year: "/",
            country: "/",
        }
        console.log(newBooks)
        const accessToken = jwt.sign({ newBooks: newBooks.email }, accessTokenSecret, { expiresIn: '20m' });
        const refreshToken = jwt.sign({ newBooks: newBooks.email }, refreshTokenSecret);

        db.find({ "title": newBooks.title}, function (err,docs){
            if(docs.length > 0){
                res.status(400).send({ respons: "new Books already exists!" });
            }else{
                db.insert(newBooks)
                res.json({ respons: "new Books has been registered!" });
            }
        })
    });

    // get a book authenticate with jwt/
    app.get('/books', authenticateJWT, (req, res) => {
        res.json("books");
    });

      // put/patch
      app.put('/books', (req, res) => {
        return res.send('Received a PUT HTTP method');
      });

    // delete 
    app.delete("/books", (req, res) => {
        return res.send('Book deleted :)');
    });
    
// startar servern
app.listen(8070, () => {
    console.log("Server running on port 8070")
});
