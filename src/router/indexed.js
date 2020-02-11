const express = require('express')
const router = new express.Router()

router.get('/indexed', (req, res) => {
    console.log('indexed')
    res.send('Hello Indexed')
})

module.exports = router