const express = require('express')
const moment = require('moment')
const {dbSelect} = require('../database/select')
const router = new express.Router()

const getSplitData = (indexResult, reqBody) => {
    return new Promise((resolve, reject) => {
        const indexDate = moment(indexResult.index_date).format('YYYY-MM-DD')
        const index_num = indexResult.index_num

        const splitQuery = `
            SELECT JSON_MERGE(parts, features) as parts
            FROM ${reqBody.Table}
            WHERE index_date = '${indexDate}' AND index_num = ${index_num};
        `
        console.log(splitQuery)
        dbSelect(splitQuery).then((splitResult) => {
            if(splitResult.length == 0) {
                reject('ZERO RESULT!')
            }
            resolve(splitResult)
        })
    })
}

const reArrangeFeatures = (splitResult, length, feature) => {
    console.log("splitResults:", splitResult, '\nlength:', length)
    let parts = {"parts":{'0':{}}}
    for (let i = 0; i <length; i++) {
      parts.parts[i] = {startTime: splitResult[i]["startTime"], stopTime: splitResult[i]["stopTime"], values: splitResult[i][feature]}
    }
    return parts
}

const resultdbSelect = async (query, reqBody) => {

    const resultdbSelect = await dbSelect(query)
    let splitResults = []
    let newParts =[]
    for (const indexResult of resultdbSelect) {
        let data = await getSplitData(indexResult, reqBody)
        splitResults.push(data[0])
    }
    // console.log('splitResults', splitResults)
    for (let splitResult of splitResults) {
        parts = JSON.parse(splitResult.parts)
        console.log('parts: ', parts,'length :', Object.keys(parts).length, reqBody.Feature)
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
        query  = `
            SELECT index_date, index_num
            FROM WaveIndex 
            WHERE defServer = '${tagNameSplit[0]}' AND
            defTable = '${tagNameSplit[1]}' AND 
            defColumn = '${tagNameSplit[2]}' AND 
            startTime BETWEEN '${start}' AND '${stop}';
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

// router.post('/features/test', (req, res) => {
//     console.log(req.body)
    
//     res.send(req.body)

// })

module.exports = router