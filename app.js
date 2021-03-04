const express = require('express');
const bcrypt = require('bcrypt');
const app = express();
const PORT = process.env.PORT;
const saltRounds = 10;
app.use(express.json());
app.use(express.urlencoded());

    app.get('/login', function(req, res){
        
    });
    app.post('/register', function(req, res){
        var data = req.body;
        console.log(data);
    });
app.listen(8090, () => {
    console.log("Server running on port 8090")
});