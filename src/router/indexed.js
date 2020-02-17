const express = require('express')
const {dbSelect} = require('../database/select')
const moment = require('moment')
const router = new express.Router()

router.get('/indexed', (req, res) => {
    console.log('indexed')
    res.send('Hello Indexed')
})

router.get('/indexed/wavelist', (req, res) => {
    console.log('indexed')
    console.log(req.body)
    res.send('Hello Indexed')
})


module.exports = router