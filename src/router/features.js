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
            if(error) {
                console.log('reject!')
                reject(error)
            }
            if(result) {
                resolve(result)
            }
        })
    })
}

const getSplitData = (indexResult, reqBody) => {
    return new Promise((resolve, reject) => {
        const indexDate = moment(indexResult.index_date).format('YYYY-MM-DD')
        const index_num = indexResult.index_num
        const splitQuery = `
            SELECT parts, features
            FROM ${reqBody.Table}
            WHERE index_date = '${indexDate}' AND index_num = ${index_num};
            `
        // console.log(splitQuery)
        dbSelect(splitQuery).then((splitResult) => {
            if(splitResult.length == 0) {
                reject('ZERO RESULT!')
            }
            // console.log('splitResult', splitResult)
            resolve(splitResult)
        })
    })
}

const resultdbSelect = async (query, reqBody) => {
    // console.log('query, reqBody:', query, reqBody)
    const resultdbSelect = await dbSelect(query)
    // console.log('resultdbSelect: ', resultdbSelect)
    let splitResults = []
    for (const indexResult of resultdbSelect) {
        let data = await getSplitData(indexResult, reqBody)
        splitResults.push(data[0])
    }
    // console.log('splitResults: ', splitResults)
    return splitResults
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
        }
        return resultdbSelect
    }).then((result) => {
        res.send(
            result
        )
    })
}, (error, req, res, next) => {
    res.status(400).send('Error!', error)
})

router.post('/features/feature/statistics', (req, res) => {
    console.log(req.body)
    const tagNameSplit = req.body.TagName.split(".")
    startTime = new Date(req.body.StartTime)
    stopTime = new Date(req.body.StopTime)
    const start = moment(startTime).format('YYYY-MM-DD HH:mm:ss.SSS')
    const stop = moment(stopTime).format('YYYY-MM-DD HH:mm:ss.SSS')
    const queryFeaturesStatistics = `
        SELECT DISTINCT JSON_KEYS(basicFeatures) as 'keys'
        FROM ${req.body.Table} 
        WHERE defServer = '${tagNameSplit[0]}' AND
            defTable = '${tagNameSplit[1]}' AND 
            defColumn = '${tagNameSplit[2]}' AND 
            startTime BETWEEN '${start}' AND '${stop}';
    `
    dbSelect(queryFeaturesStatistics).then((result) =>{
        console.log(result[0].keys)
        res.send(result[0].keys)
    })
    
})

router.post('/features/test', (req, res) => {
    console.log(req.body)
    res.send('test')
})


router.post('/features/feature', (req, res) => {
    console.log(req.body)
    const tagNameSplit = req.body.TagName.split(".")
    startTime = new Date(req.body.StartTime)
    stopTime = new Date(req.body.StopTime)
    const start = moment(startTime).format('YYYY-MM-DD HH:mm:ss.SSS')
    const stop = moment(stopTime).format('YYYY-MM-DD HH:mm:ss.SSS')

    let query = ''
    if (req.body.Table == 'WaveIndex') {
        query  = `
            SELECT startTime, stopTime, json_value(basicFeatures,'$.${req.body.Feature}') as 'values'
            FROM ${req.body.Table} 
            WHERE defServer = '${tagNameSplit[0]}' AND
            defTable = '${tagNameSplit[1]}' AND 
            defColumn = '${tagNameSplit[2]}' AND 
            startTime BETWEEN '${start}' AND '${stop}';
        `
        console.log(query)
        dbSelect(query).then((resultdbSelect) => {
            return resultdbSelect
        }).then((result) => {
            res.send(result)
        })
    } else if (req.body.Table == 'WaveSplit') {
        query  = `
            SELECT index_date, index_num
            FROM WaveIndex 
            WHERE defServer = '${tagNameSplit[0]}' AND
            defTable = '${tagNameSplit[1]}' AND 
            defColumn = '${tagNameSplit[2]}' AND 
            startTime BETWEEN '${start}' AND '${stop}';
        `
        console.log(query)

        resultdbSelect(query, req.body).then((result) => {
            res.send(result)
        })
    }
})

module.exports = router