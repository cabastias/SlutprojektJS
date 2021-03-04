const express = require('express')
const bcrypt = require('bcrypt')
var Datastore = require('nedb')
  , db = new Datastore({ filename: 'data.db', autoload: true });
const app = express();
const PORT = process.env.PORT;
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

    app.get('/login', function(req, res){
        
    });
    app.post('/register', function(req, res) {
        const newUser = {
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, salt),
            name: req.body.name,
            role: "user"
        }
        db.find({ "email": newUser.email}, function (err,docs){
            if(docs.length > 0){
                res.status(400).send({ respons: "User already exists!" });
            }else{
                db.insert(newUser)
                res.json({ respons: "User has been registered!" });
            }
        })
    });
    
app.listen(8090, () => {
    console.log("Server running on port 8090")
});