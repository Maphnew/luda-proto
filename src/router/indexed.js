const express = require('express')
const path = require('path')
const { dbSelect, dbUpdate } = require('../database/db')
const moment = require('moment')
const router = new express.Router()
const pythonDirectoryPath = path.join(__dirname, '../../public/python')
const getStatisticsPath = path.join(pythonDirectoryPath, 'getStatistics.py')

const getStatistics = async (indexDate, indexNum, parts) => {
    let times = []
    const partsIndex = Object.keys(parts)
    console.log(partsIndex)
    for (let k of partsIndex) {
        tempStart = parts[k]['startTime']
        tempStop = parts[k]['stopTime']
        console.log( tempStart, tempStop)
    }


    return partsIndex
}

router.get('/indexed', (req, res) => {
    console.log('indexed')
    res.send('Hello Indexed')
})

router.post('/indexed/waveform', async (req,res) => {
    console.log(req.body)
    const tagNameSplit = req.body.TagName.split(".")
    const [ , table = 'HisItemCurr', column = 'Item005' ] = tagNameSplit
    startTime = new Date(req.body.StartTime)
    stopTime = new Date(req.body.StopTime)
    const start = moment(startTime).format('YYYY-MM-DD HH:mm:ss.SSS')
    const stop = moment(stopTime).format('YYYY-MM-DD HH:mm:ss.SSS')
    const queryWaveForm = `
        SELECT DataSavedTime, ${column}
        FROM ${table}
        WHERE DataSavedTime BETWEEN '${start}' AND '${stop}'
    `
    console.log(queryWaveForm)
    await dbSelect(queryWaveForm).then((result) => {
        res.send(result)
    }).catch((e) => {
        res.status(500).send(e)
    })
})

router.patch('/indexed/test', async (req, res) => {
    // console.log(req.body)
    const indexDate = moment(req.body.index_date).format('YYYY-MM-DD')
    const indexNum = req.body.index_num
    const parts = req.body.parts
    const partsKeys = Object.keys(req.body.parts)
    console.log(parts)
    const tempJSON = await getStatistics(indexDate,indexNum,parts)
    console.log(tempJSON)
    // const updates = Object.keys(req.body.features)
    // console.log(updates)
    res.send('yaaaaaaaaaaaaas')
})


router.patch('/indexed/splitlist', async (req, res) => {
    console.log(req.body)
    const indexDate = moment(req.body.index_date).format('YYYY-MM-DD')
    const indexNum = req.body.index_num
    const parts = req.body.parts
    const count = Object.keys(parts).length

    let queryUpdateWaveList = `
        UPDATE WaveSplit SET parts = JSON_REPLACE(parts,
    `
    for (i=0; i<count-1; i++) {
        let stopTime = await parts[`${i}`]['stopTime']
        let startTime = await parts[`${i+1}`]['startTime']
        let queryTemp = await `'$.${i}.stopTime', '${stopTime}', '$.${i+1}.startTime', '${startTime}',`
        queryUpdateWaveList += queryTemp
    }
    queryUpdateWaveList = await queryUpdateWaveList.slice(0, -1)
    queryUpdateWaveList += `
        )  
        WHERE index_date = '${indexDate}' AND index_num = ${indexNum};
    `
    console.log(queryUpdateWaveList)
    await dbUpdate(queryUpdateWaveList).then((result) => {
        res.status(200).send('ok')
    }).catch((e) => {
        res.status(400).send(e)
    })
})

router.post('/indexed/wavelist', async (req, res) => {
    console.log(req.body)
    const tagNameSplit = req.body.TagName.split(".")
    const [ server = 'S1', table = 'HisItemCurr', column = 'Item005' ] = tagNameSplit
    startTime = new Date(req.body.StartTime)
    stopTime = new Date(req.body.StopTime)
    const start = moment(startTime).format('YYYY-MM-DD HH:mm:ss.SSS')
    const stop = moment(stopTime).format('YYYY-MM-DD HH:mm:ss.SSS')
    const queryWavelist = `
        SELECT t2.index_date, t2.index_num, t2.startTime, t2.stopTime, JSON_LENGTH(JSON_KEYS(t1.parts)) AS split, JSON_MERGE(t1.parts, t1.features) AS parts 
        FROM WaveSplit t1, (
            SELECT index_date, index_num, startTime, stopTime
            FROM WaveIndex
            WHERE defServer = '${server}' AND
            defTable = '${table}' AND
            defColumn = '${column}' AND
            startTime BETWEEN '${start}' AND '${stop}'
        ) t2
        WHERE t1.index_date = t2.index_date AND t1.index_num = t2.index_num
    `
    console.log(queryWavelist)

    await dbSelect(queryWavelist).then((result) => {
        res.send(result)
    }).catch((e) => {
        res.status(500).send(e)
    })
})


module.exports = router