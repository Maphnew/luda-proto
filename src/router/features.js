const express = require('express')
const moment = require('moment')
const {dbSelect} = require('../database/select')
const router = new express.Router()


const reArrangeFeatures = (splitResult, length, feature) => {
    // console.log("splitResults:", splitResult, '\nlength:', length)
    try {
        let parts = {"parts":{'0':{}}}
        for (let i = 0; i <length; i++) {
            parts.parts[i] = {startTime: splitResult[i]["startTime"], stopTime: splitResult[i]["stopTime"], values: splitResult[i][feature]}
        }
        return parts
    } catch(e) {
        console.log(e)
        return e
    } 
}

const resultdbSelect = async (query, reqBody) => {
    let newParts =[]

    const resultdbSelect = await dbSelect(query)
    //console.log('resultdbSelect:', resultdbSelect)

    for (let splitResult of resultdbSelect) {
        parts = JSON.parse(splitResult.parts)
        // console.log('parts: ', parts,'length :', Object.keys(parts).length, reqBody.Feature)
        let eachParts = await reArrangeFeatures(parts, Object.keys(parts).length, reqBody.Feature)
        newParts.push(eachParts)
    }
    return newParts
}

router.get('/features', (req, res) => {
    console.log('features')
    res.send('Hello features')
})

router.get('/features/info', (req, res) => {
    // console.log('features info')
    const queryFeaturesInfo = "SELECT * FROM WaveMaster;"
    dbSelect(queryFeaturesInfo).then((resultSelect) => {
        for (let i = 0; i <resultSelect.length; i++){
            resultSelect[i].value = i
        }
        return resultSelect
    }).then((result) => {
        res.send(
            result
        )
    })
}, (error, req, res, next) => {
    res.status(400).send('Error!', error)
})



router.post('/features/feature', (req, res) => {
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
        // console.log(query)
        dbSelect(query).then((resultdbSelect) => {
            res.send(resultdbSelect)
        })
    } else if (req.body.Table == 'WaveSplit') {
        query = `
            SELECT JSON_MERGE(t1.parts, t1.features) as parts
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
        console.log(query)

        resultdbSelect(query, req.body)
        .then((splitResults) => {
            res.send(splitResults)
        })
    }
})

router.post('/features/feature/statistics', (req, res) => {
    // console.log(req.body)
    const tagNameSplit = req.body.TagName.split(".")
    startTime = new Date(req.body.StartTime)
    stopTime = new Date(req.body.StopTime)
    const start = moment(startTime).format('YYYY-MM-DD HH:mm:ss.SSS')
    const stop = moment(stopTime).format('YYYY-MM-DD HH:mm:ss.SSS')
    const queryFeaturesStatistics = `
        SELECT DISTINCT JSON_KEYS(basicFeatures) as 'keys'
        FROM WaveIndex 
        WHERE defServer = '${tagNameSplit[0]}' AND
            defTable = '${tagNameSplit[1]}' AND 
            defColumn = '${tagNameSplit[2]}' AND 
            startTime BETWEEN '${start}' AND '${stop}';
    `
    try {
        dbSelect(queryFeaturesStatistics).then((result) =>{
            console.log('statistics keys', result[0].keys)
            res.send(result[0].keys)
        })
    } catch(e) {
        res.status(500).send(e)
    }
    
    
})

// router.post('/features/test', (req, res) => {
//     console.log(req.body)
    
//     res.send(req.body)

// })

module.exports = router