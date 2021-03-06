const express = require('express')
const moment = require('moment')
const {dbSelect} = require('../database/db')
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
    let newResult = []

    const resultdbSelect = await dbSelect(query)
    // console.log('resultdbSelect:', resultdbSelect)

    for (let splitResult of resultdbSelect) {
        if(splitResult.parts) {
            const parts = JSON.parse(splitResult.parts)
            // console.log(parts)
            let eachParts = await reArrangeFeatures(parts, Object.keys(parts).length, reqBody.feature)
            splitResult.parts = eachParts.parts
            newResult.push(splitResult) // feature/features +index_date +index_num (importance C)
        }
    }
    // console.log('newResult: ', newResult)
    return newResult
}

router.get('/features', (req, res) => {
    console.log('features')
    res.send('Hello features')
})

router.get('/features/info', async (req, res) => {
    console.log('features/info')
    const queryFeaturesInfo = "SELECT * FROM WaveMaster;"
    await dbSelect(queryFeaturesInfo).then((resultSelect) => {
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



router.post('/features/feature', async (req, res) => {
    console.log('/features/feature', req.body)
    const tagNameSplit = req.body.tagName.split(".")
    const [ server, table, column ] = tagNameSplit
    const startTime = new Date(req.body.startTime)
    const stopTime = new Date(req.body.stopTime)
    const start = moment(startTime).format('YYYY-MM-DD HH:mm:ss.SSS')
    const stop = moment(stopTime).format('YYYY-MM-DD HH:mm:ss.SSS')
    let query = ''
    if (req.body.table == 'WaveIndex') {
        if (req.body.feature == 'length') {
            query = `
                SELECT index_date, index_num, startTime, stopTime, ROUND(TIMESTAMPDIFF(MICROSECOND, startTime, stopTime)/1000,0) as 'values'
                FROM ${req.body.table} 
                WHERE defServer = '${server}' AND
                defTable = '${table}' AND 
                defColumn = '${column}' AND 
                startTime BETWEEN '${start}' AND '${stop}';
            `
            console.log(query)
            try {
                await dbSelect(query).then((resultdbSelect) => {
                    res.send(resultdbSelect)
                })
            } catch(e) {
                res.status(500).send(e)
            }
        } else {
            query  = `
                SELECT index_date, index_num, startTime, stopTime, json_value(basicFeatures,'$.${req.body.feature}') as 'values'
                FROM ${req.body.table} 
                WHERE defServer = '${server}' AND
                defTable = '${table}' AND 
                defColumn = '${column}' AND 
                startTime BETWEEN '${start}' AND '${stop}';
            `
            console.log(query)
            try {
                await dbSelect(query).then((resultdbSelect) => {
                    res.send(resultdbSelect)
                })
            } catch(e) {
                res.status(500).send(e)
            }
        }
        
    } else if (req.body.table == 'WaveSplit') {
        query = `
            SELECT index_date, index_num, startTime, stopTime, JSON_MERGE(parts, features) as parts
            FROM WaveSplit 
            WHERE 
            defServer = '${server}' AND
            defTable = '${table}' AND 
            defColumn = '${column}' AND
            startTime BETWEEN '${start}' AND '${stop}'
        `
        console.log(query)

        await resultdbSelect(query, req.body)
        .then((splitResults) => {
            res.send(splitResults)
        })
    }
})

router.post('/features/feature/labeldata', async (req, res) => {
    console.log('/features/feature/labeldata', req.body)
    const tagNameSplit = req.body.tagName.split(".")
    const [ server, table, column ] = tagNameSplit
    const startTime = new Date(req.body.startTime)
    const stopTime = new Date(req.body.stopTime)
    console.log(startTime, stopTime)
    const start = moment(startTime).format('YYYY-MM-DD HH:mm:ss.SSS')
    const stop = moment(stopTime).format('YYYY-MM-DD HH:mm:ss.SSS')
    const label = req.body.label
    const feature = req.body.feature
    if (req.body.table === 'WaveIndex'){
        const queryLabelData = `
            SELECT t1.index_date, t1.index_num, t2.startTime, t2.stopTime, json_value(t1.labels,'$.${label}') as 'labels', t2.feature AS 'values'
            FROM WaveLabels t1, (
                SELECT index_date, index_num, startTime, stopTime, JSON_VALUE(basicFeatures, '$.${feature}') AS feature
                FROM WaveIndex
                WHERE defServer = '${server}' AND
                defTable = '${table}' AND 
                defColumn = '${column}' AND 
                startTime BETWEEN '${start}' AND '${stop}'
            ) t2
            WHERE t1.index_date = t2.index_date AND t1.index_num = t2.index_num AND
            defServer = '${server}' AND
            defTable = '${table}' AND 
            defColumn = '${column}' AND 
            t1.startTime BETWEEN '${start}' AND '${stop}'
        `
        console.log('queryLabelData: ',queryLabelData)
        await dbSelect(queryLabelData).then((result) => {
            // console.log(result)
            res.send(result)
        }).catch((e) => {
            res.status(500).send(e)
        })
    } else if (req.body.table === 'WaveSplit') {
        const queryLabelData = `
            SELECT t1.index_date, t1.index_num, t2.startTime, t2.stopTime, json_value(t1.labels,'$.${label}') as 'labels', t2.parts AS 'parts'
            FROM WaveLabels t1, (
                SELECT index_date, index_num, startTime, stopTime, JSON_MERGE(parts, features) as parts 
                FROM WaveSplit
                WHERE defServer = '${server}' AND
                defTable = '${table}' AND 
                defColumn = '${column}' AND 
                startTime BETWEEN '${start}' AND '${stop}'
            ) t2
            WHERE t1.index_date = t2.index_date AND t1.index_num = t2.index_num AND
            defServer = '${server}' AND
            defTable = '${table}' AND 
            defColumn = '${column}' AND 
            t1.startTime BETWEEN '${start}' AND '${stop}'
        `
        console.log('queryLabelData: ',queryLabelData)
        await resultdbSelect(queryLabelData, req.body)
        .then((splitResults) => {
            res.send(splitResults)
        })
    }

    
})

router.post('/features/feature/labels', async (req,res) => {
    console.log('/features/feature/labels', req.body)
    const tagNameSplit = req.body.tagName.split(".")
    const [ server, table, column ] = tagNameSplit
    const startTime = new Date(req.body.startTime)
    const stopTime = new Date(req.body.stopTime)
    const start = moment(startTime).format('YYYY-MM-DD')
    const stop = moment(stopTime).format('YYYY-MM-DD')

    const queryLabels = `
        SELECT DISTINCT JSON_KEYS(labels) as 'labels'
        FROM WaveLabels
        WHERE defServer = '${server}' AND
            defTable = '${table}' AND 
            defColumn = '${column}' AND
            index_date BETWEEN '${start}' AND '${stop}'
    `
    console.log(queryLabels)

    await dbSelect(queryLabels).then((result) =>{
        const keys = Object.values(result[0])[0]
        const json = JSON.parse(keys)
        console.log(json)
        res.send(json)
    }).catch((e) => {
        res.status(200).send(e)
    })
})

router.post('/features/feature/statistics', async (req, res) => {
    console.log('/features/feature/statistics', req.body)
    const tagNameSplit = req.body.tagName.split(".")
    const [ server, table, column ] = tagNameSplit
    const startTime = new Date(req.body.startTime)
    const stopTime = new Date(req.body.stopTime)
    const start = moment(startTime).format('YYYY-MM-DD HH:mm:ss.SSS')
    const stop = moment(stopTime).format('YYYY-MM-DD HH:mm:ss.SSS')
    const queryFeaturesStatistics = `
        SELECT DISTINCT JSON_KEYS(basicFeatures) as 'keys'
        FROM WaveIndex 
        WHERE defServer = '${server}' AND
            defTable = '${table}' AND 
            defColumn = '${column}' AND 
            startTime BETWEEN '${start}' AND '${stop}';
    `
    console.log(queryFeaturesStatistics)
    try {
        await dbSelect(queryFeaturesStatistics).then((result) =>{
            // console.log('statistics keys',result[0].keys)
            const json = JSON.parse(result[0].keys)
            json.push('length')
            // console.log(json, typeof(json))
            res.send(json)
        })
    } catch(e) {
        res.status(200).send(e)
    }
    
    
})

module.exports = router