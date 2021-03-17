const express = require('express')
const passport = require('passport')
const jwt = require('jsonwebtoken');
const accessTokenSecret = 'youraccesstokensecret';
const refreshTokenSecret = 'secret';
const refreshTokens = [];
const bcrypt = require('bcrypt')
var Datastore = require('nedb')
  , db = new Datastore({ filename: 'data.db', autoload: true });
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
app.get('/', function(req, res) {
    res.sendFile('views/index.ejs', { root: __dirname });
});

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
    // registerar en användare / funkar 
    app.post('/register', function(req, res) {
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
    
    // app delete books id
    app.delete('/book/:id', (req, res) =>
    Book.findOneAndRemove({
     _id: req.params.id
    }, (err, book) => {
     if(err) {
      res.send('Books remove')
     } else {
      console.log(book);
      res.status(204);
    }
   }));
    
    // app patch books id
    app.patch('/api/todos/:id', (req, res) => {
        const todo = todos.find(todo => todo.id == req.params.id);
        if (!todo) return res.sendStatus(404);
        todo.completed = !todo.completed;
        res.json(todo);
       });

    // only test stuff 
    app.get('/test', authenticateJWT, (req, res) => {
        res.json("Test");
    });
    // get a book authenticate with jwt/ oklar
    app.get('/books', authenticateJWT, (req, res) => {
        res.json("books");
    });

// startar servern
app.listen(8090, () => {
    console.log("Server running on port 8090")
});
// glöm inte skriva bearer in token in postman //