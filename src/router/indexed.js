const express = require('express')
const path = require('path')
const { dbSelect, dbUpdate } = require('../database/db')
const moment = require('moment')
const router = new express.Router()
const pythonDirectoryPath = path.join(__dirname, '../../public/python')
const getStatisticsPath = path.join(pythonDirectoryPath, 'getStatistics.py')
const { spawn } = require('child_process');

const runPy = async (startTime, stopTime, index_date, index_num) => {
    return new Promise(async (resolve, reject) => {
        const pyprog = await spawn('python', [getStatisticsPath, startTime, stopTime, index_date, index_num])
    
        await pyprog.stdout.on('data', async (data) => {
            // console.log('python data', data)
            const str = await data.toString()
            //console.log('str: ', str)
            const replace = str.replace(/'/gi, "\"")
            // console.log('json: ', replace)
            const json = JSON.parse(replace)
            //
            await resolve(json)
        })
        await pyprog.stderr.on('data', (data) => {
            reject(data)
        })
    }).catch((e) => {
        console.log('error! ',e)
    })
}

const getStatisticsQuery = async (tagNameSplit,indexDate, indexNum, parts) => {
    const partsIndex = Object.keys(parts)
    const [ server = 'S1', table = 'HisItemCurr', column = 'Item005' ] = tagNameSplit
    console.log('partsIndex:', partsIndex)
    console.log('tagNameSplit:', tagNameSplit)
    console.log('indexDate:', indexDate)
    console.log('indexNum:', indexNum)
    console.log('parts:', parts)
    let query = `UPDATE WaveSplit SET features = JSON_SET(features,`
    for await (let k of partsIndex) {
        startTime = parts[k]['startTime']
        stopTime = parts[k]['stopTime']
        console.log('k:', k, indexDate, indexNum, startTime, stopTime)
        await runPy(startTime, stopTime, indexDate, indexNum).then( async (json) => {
            const key = Object.keys(json)
            let queryKey = ''
            for await (let s of key) {
                const stat = json[s]
                queryKey += `'$.${k}.${s}', ${stat},`
            }
            // console.log('queryKey', queryKey)
            query += queryKey
        }).catch((e) => {
            console.log(e)
        })
    }
    query = query.slice(0, -1)
    query += `
        ) WHERE index_date = '${indexDate}' AND index_num = ${indexNum} AND
        defServer = '${server}' AND defTable = '${table}' AND defColumn = '${column}';
        `
    console.log('query: ', query)
    return query
}

router.get('/indexed', (req, res) => {
    console.log('indexed')
    res.send('Hello Indexed')
})

router.post('/indexed/waveform', async (req,res) => {
    console.log('/indexed/waveform', req.body)
    const tagNameSplit = req.body.tagName.split(".")
    const [ , table = 'HisItemCurr', column = 'Item005' ] = tagNameSplit
    startTime = new Date(req.body.startTime)
    stopTime = new Date(req.body.stopTime)
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
}, (error, req, res, next) => {
    res.status(400).send('Error!', error)
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
    console.log('/indexed/splitlist:', req.body)
    const stringify = JSON.stringify(req.body)
    console.log('req.body to stringify:', stringify)
    const tagNameSplit = req.body.tagName.split(".")
    const [ server = 'S1', table = 'HisItemCurr', column = 'Item005' ] = tagNameSplit
    const indexDate = moment(req.body.index_date).format('YYYY-MM-DD')
    const indexNum = req.body.index_num
    const parts = req.body.parts
    const count = Object.keys(parts).length
    console.log(count)

    let queryUpdateWaveList = `
        UPDATE WaveSplit SET parts = JSON_REPLACE(parts,
    `
    for (let part in parts) {
        console.log('part: ', part)
        let startTime = await parts[part]['startTime']
        let stopTime = await parts[part]['stopTime']
        let queryTemp = await `'$.${part}.startTime', '${startTime}', '$.${part}.stopTime', '${stopTime}',`
        console.log('queryTemp: ',queryTemp)
        queryUpdateWaveList += queryTemp
    }
    queryUpdateWaveList = await queryUpdateWaveList.slice(0, -1)
    queryUpdateWaveList += `
        )  
        WHERE index_date = '${indexDate}' AND index_num = ${indexNum} AND
        defServer = '${server}' AND defTable = '${table}' AND defColumn = '${column}';
    `
    console.log(queryUpdateWaveList)
    const queryStatistics = await getStatisticsQuery(tagNameSplit,indexDate,indexNum,parts)
    await dbUpdate(queryUpdateWaveList).then((result) => {
        return result
    }).then( async(result) => {
        if(result) {
            await dbUpdate(queryStatistics).then((result) => {
                console.log(result)
            }).catch((e) => {
                console.log(e)
            })
        }
        res.status(200).send('ok')
    }).catch((e) => {
        res.status(400).send(e)
    })
}, (error, req, res, next) => {
    res.status(400).send('Error!', error)
})

router.post('/indexed/wavelist', async (req, res) => {
    console.log('/indexed/wavelist', req.body)
    const tagNameSplit = req.body.tagName.split(".")
    const [ server = 'S1', table = 'HisItemCurr', column = 'Item005' ] = tagNameSplit
    startTime = new Date(req.body.startTime)
    stopTime = new Date(req.body.stopTime)
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
        WHERE t1.index_date = t2.index_date AND t1.index_num = t2.index_num AND 
        defServer = '${server}' AND
        defTable = '${table}' AND
        defColumn = '${column}'
    `
    console.log(queryWavelist)

    await dbSelect(queryWavelist).then((result) => {
        res.send(result)
    }).catch((e) => {
        res.status(500).send(e)
    })
}, (error, req, res, next) => {
    res.status(400).send('Error!', error)
})


module.exports = router