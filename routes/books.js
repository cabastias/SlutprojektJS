const express = require('express')
const passport = require('passport')
const jwt = require('jsonwebtoken');
const books = require('../routes/books')

router.get('/', async function (req, res) {
    const books = await product.find().exec()
    res.send(books)
})
router.post('/', function (req, res) {
    books.create(req.body)
    res.send('POST Request accepted.')
})
router.patch('/:id', async function (req, res) {
    const result = await books.updateMany({
        "_id": String(req.params.id)
    }, { $set: req.body })
    res.send('PATCH Request accepted.')
})
router.delete('/:id', async function (req, res) {
    const result = await books.deleteMany({
        "_id": String(req.params.id)
    })
    res.send('DELETE Request accepted.')
})
module.exports = router

// startar servern
app.listen(8090, () => {
    console.log("Server running on port 8090")
});
