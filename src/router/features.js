const express = require('express')
const mysql = require('mysql')
const moment = require('moment')
const router = new express.Router()

const connection = mysql.createConnection({
    host: '192.168.101.50',
    port: '16033',
    user: 'root',
    password: 'its@1234',
    database: 'UYeG_Cloud',
})

// connection.connect()

const dbSelect = (query) => {
    return new Promise((resolve, reject) =>  {
        connection.query(query, (error, result) => {
            if(error) throw error
            if(result) {
                resolve(result)
            }
        })
    })
}

router.get('/features', (req, res) => {
    console.log('features')
    res.send('Hello features')
})

router.get('/features/info', (req, res) => {
    // console.log('features info')
    const queryFeaturesInfo = "SELECT * FROM WaveMaster;"
    dbSelect(queryFeaturesInfo).then((resultdbSelect) => {
        for (let i = 0; i <resultdbSelect.length; i++){
            resultdbSelect[i].value = i
            // console.log(resultdbSelect[i])
        }
        return resultdbSelect
    }).then((result) => {
        res.send(
            result
        )
    })
})

router.post('/features/feature', (req, res) => {
    console.log(req.body)
    const tagNameSplit = req.body.TagName.split(".")
    const start = moment(req.body.StartTime).format('YYYY-MM-DD HH:mm:SS.sss')
    const stop = moment(req.body.StopTime).format('YYYY-MM-DD HH:mm:SS.sss')

    const query  = `
        SELECT defServer, defTable, defColumn, startTime, stopTime, json_value(basicFeatures,'$.${req.body.Feature}')
        FROM ${req.body.Table} 
        WHERE defServer = '${tagNameSplit[0]}' AND
        defTable = '${tagNameSplit[1]}' AND 
        defColumn = '${tagNameSplit[2]}' AND 
        startTime BETWEEN '${start}' AND '${stop}';
    `
    console.log(query)

    dbSelect(query).then((resultdbSelect) => {
        console.log(resultdbSelect)
        return resultdbSelect
    }).then((result) => {
        res.send(
            result
        )
    })

})

router.get('/features/feature2', (req, res) => {
    res.send('feature2')
})

router.post('/features/feature2', (req, res) => {
    console.log(req)

    res.send('feature2')
})

module.exports = router