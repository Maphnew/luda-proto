const express = require('express')
const router = new express.Router()

router.get('/features', (req, res) => {
    console.log('indexed')
    res.send('Hello features')
})

module.exports = router