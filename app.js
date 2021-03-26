const express = require('express')
const passport = require('passport')
const jwt = require('jsonwebtoken');
const accessTokenSecret = 'youraccesstokensecret';
const refreshTokenSecret = 'secret';
const refreshTokens = [];
const bcrypt = require('bcrypt')
var Datastore = require('nedb')
  db = new Datastore({ filename: 'data.db', autoload: true });
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

  // logga in dig här / funkar / done 
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
    //  register works /done 
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
    // få ut böcker , denna funkar/ done 
    app.post('/register/books', function(req, res) {
        const newAuthor= {
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, salt),
            author: req.body.name,
            title: "/",
            year: "/"
        }
        console.log(newAuthor)
        const accessToken = jwt.sign({ newAuthor: newAuthor.email }, accessTokenSecret, { expiresIn: '20m' });
        const refreshToken = jwt.sign({ newAuthor: newAuthor.email }, refreshTokenSecret);

        db.find({ "title": newAuthor.title}, function (err,docs){
            if(docs.length > 0){
                res.status(400).send({ respons: "Author already exists!" });
            }else{
                db.insert(newAuthor)
                res.json({ respons: "New Author has been registered!" });
            }
        })
    });

    // only test stuff 
    app.get('/test', authenticateJWT, (req, res) => {
        res.json("Test");
    });
    /*
    // get a book authenticate with jwt/
    app.get('/books', authenticateJWT, (req, res) => {
        res.json("books");
    });
        // authenticate JWT login
        app.get('/login/auth', authenticateJWT, (req, res) => {
            res.json("login");
        });
            // authenticate JWT register
            app.get('/register', authenticateJWT, (req, res) => {
                res.json("register");
            });
*/
      // patch  books
      app.patch('/post/:id', async(req, res) => {
        const books = await post.update({ _id: req.params.id }, {
            $books: {
                title: req.body.title,
                content: req.body.content,
                author: req.body.name,

            }
        })
        res.json({ 'books': books })
    });
    
    // delete a user
    app.delete("/", (req, res) => {
        return res.send('user deleted :)');
    });
    // delete a book
    app.delete("/books", (req, res) => {
        return res.send('Book deleted :)');
    });

// startar servern
app.listen(8090, () => {
    console.log("Server running on port 8090")
});

// everything on the API spec is done,it works if you test it in Postman