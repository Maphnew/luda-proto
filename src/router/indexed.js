const express = require('express')
const {dbSelect} = require('../database/select')
const moment = require('moment')
const router = new express.Router()

router.get('/indexed', (req, res) => {
    console.log('indexed')
    res.send('Hello Indexed')
})

router.post('/indexed/wavelist', (req, res) => {
    console.log(req.body)
    const tagNameSplit = req.body.TagName.split(".")
    startTime = new Date(req.body.StartTime)
    stopTime = new Date(req.body.StopTime)
    const start = moment(startTime).format('YYYY-MM-DD HH:mm:ss.SSS')
    const stop = moment(stopTime).format('YYYY-MM-DD HH:mm:ss.SSS')
    const queryWavelist = `
        SELECT t2.startTime, t2.stopTime, JSON_LENGTH(JSON_KEYS(t1.parts)) AS split
        FROM WaveSplit t1, (
            SELECT index_date, index_num, startTime, stopTime
            FROM WaveIndex
            WHERE defServer = '${tagNameSplit[0]}' AND
            defTable = '${tagNameSplit[1]}' AND
            defColumn = '${tagNameSplit[2]}' AND
            startTime BETWEEN '${start}' AND '${stop}'
        ) t2
        WHERE t1.index_date = t2.index_date AND t1.index_num = t2.index_num
    `

    dbSelect(queryWavelist).then((result) => {
        res.send(result)
    })
})


module.exports = router