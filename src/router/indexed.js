const express = require('express')
const path = require('path')
const { dbSelect, dbUpdate } = require('../database/db')
const moment = require('moment')
const router = new express.Router()
const pythonDirectoryPath = path.join(__dirname, '../../public/python')
const getStatisticsPath = path.join(pythonDirectoryPath, 'getStatistics.py')
const { spawn } = require('child_process');

const runPy = (startTime, stopTime, index_date, index_num) => {
    return new Promise((resolve, reject) => {
        const pyprog = spawn('python', [getStatisticsPath, startTime, stopTime, index_date, index_num])
    
        pyprog.stdout.on('data', (data) => {
            console.log('python data', data)
            resolve(data)
        })
        pyprog.stderr.on('data', (data) => {
            reject(data)
        })
    })
}

const getStatistics = async (indexDate, indexNum, parts) => {
    await runPy(indexDate, indexNum, parts).then( async (statistics) => {
        console.log(statistics)
    }).catch((e) => {
        console.log(e)
    })


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
        SELECT DataSavedTime as x, ${column} as y
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

// router.patch('/indexed/test', async (req, res) => {
//     // console.log(req.body)
//     const indexDate = moment(req.body.index_date).format('YYYY-MM-DD')
//     const indexNum = req.body.index_num
//     const parts = req.body.parts
    
//     // console.log(parts)
//     const query = await getStatisticsQuery(indexDate,indexNum,parts)
//     console.log("getStatisticsQuery",query)
//     await dbUpdate(query).then((result) => {
//         console.log('result: ', result)
//         res.status(200).send('ok')
//     }).catch((e) => {
//         res.status(400).send(e)
//     })
// })

router.patch('/indexed/splitlist', async (req, res) => {
    console.log('req.body:', req.body)
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
        return result
    }).then( async (result) => {
        if(result) {
            await getStatistics(indexDate,indexNum,parts)
        }
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