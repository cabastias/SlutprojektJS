const express = require('express')
const books = require('/routes/books')
const bcrypt = require('bcrypt')
var Datastore = require('nedb')
 db = new Datastore({ filename: 'books.db', autoload: true });

 // routes 
router.get('/', async function (req, res) {
    const books = await product.find().exec()
    res.send(books)
})
router.post('/', function (req, res) {
    books.create(req.body)
    res.send('POST accepted.')
})
router.patch('/:id', async function (req, res) {
    const result = await books.updateMany({
        "_id": String(req.params.id)
    }, { $set: req.body })
    res.send('PATCH accepted.')
})
router.delete('/:id', async function (req, res) {
    const result = await books.deleteMany({
        "_id": String(req.params.id)
    })
    res.send('DELETE accepted.')
})
module.exports = router

// startar servern
app.listen(8070, () => {
    console.log("Server running on port 8070")
});
