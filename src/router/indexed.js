const express = require('express')
const path = require('path')
const { dbSelect, dbUpdate } = require('../database/db')
const moment = require('moment')
const router = new express.Router()
const pythonDirectoryPath = path.join(__dirname, '../../public/python')
const getStatisticsPath = path.join(pythonDirectoryPath, 'getStatistics.py')
const { spawn } = require('child_process');

router.get('/indexed', (req, res) => {
    console.log('indexed')
    res.send('Hello Indexed')
})

router.post('/indexed/waveform', async (req,res) => {
    console.log('/indexed/waveform', req.body)
    const tagNameSplit = req.body.tagName.split(".")
    const [ , table = 'HisItemCurr', column = 'Item005' ] = tagNameSplit
    const startTime = new Date(req.body.startTime)
    const stopTime = new Date(req.body.stopTime)
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


const runPy = async (startTime, stopTime, index_date, index_num, defServer, defTable, defColumn) => {
    return new Promise(async (resolve, reject) => {
        const pyprog = await spawn('python', [getStatisticsPath, startTime, stopTime, index_date, index_num, defServer, defTable, defColumn])
    
        await pyprog.stdout.on('data', async (data) => {
            // console.log('python data', data)
            const str = await data.toString()
            // console.log('str: ', str)
            const replace = str.replace(/'/gi, "\"")
            // console.log('replace: ', replace)
            const json = JSON.parse(replace)
            await resolve(json)
        })
        await pyprog.stderr.on('data', (data) => {
            reject(data)
        })
    }).catch(async (e) => {
        const error = await e.toString()
        console.log('error! ', error)
    })
}


const getInsertFeaturesQuery = async (tagNameSplit,indexDate, indexNum, parts) => {
    const partsIndex = Object.keys(parts)
    const [ server, table, column ] = tagNameSplit

    let query = `UPDATE WaveSplit SET features = JSON_OBJECT(`
    for await (let k of partsIndex) {
        const startTime = parts[k]['startTime']
        const stopTime = parts[k]['stopTime']
        console.log('k:', k, indexDate, indexNum, startTime, stopTime, server , table , column)
        await runPy(startTime, stopTime, indexDate, indexNum, server, table, column).then( async (json) => {
            console.log('json: ',json)
            let queryKey = `"${k}", JSON_OBJECT(`

            for (let [key, value] of Object.entries(json)) {
                // console.log(`"${key}", ${value}`);
                queryKey += `"${key}", ${value},`
            }
            queryKey = await queryKey.slice(0, -1)
            queryKey += `),`
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
    // console.log('query: ', query)
    return query
}

router.patch('/indexed/splitlist', async (req, res) => {
    console.log('/indexed/splitlist:', req.body)

    // const stringify = JSON.stringify(req.body)
    // console.log('req.body to stringify:', stringify)

    const tagNameSplit = req.body.tagName.split(".")
    const [ server, table, column ] = tagNameSplit

    const indexDate = moment(req.body.index_date).format('YYYY-MM-DD')
    const indexNum = req.body.index_num
    const parts = req.body.parts

    const keysOfParts = Object.keys(parts)


    const delQuery = `
        UPDATE WaveSplit SET parts = null, features = NULL
        WHERE index_date = '${indexDate}' AND index_num = ${indexNum} AND
        defServer = '${server}' AND defTable = '${table}' AND defColumn = '${column}';
    `
    let insertPartsQuery = `UPDATE WaveSplit SET parts = JSON_OBJECT(`

    for (let key of keysOfParts) {
        insertPartsQuery += `
            "${key}", JSON_OBJECT("startTime", "${Object.values(parts)[key]['startTime']}", "stopTime", "${Object.values(parts)[key]['stopTime']}"),`
    }

    insertPartsQuery = insertPartsQuery.slice(0, -1)
    insertPartsQuery += `
        )
        WHERE index_date = '${indexDate}' AND index_num = ${indexNum} AND
        defServer = '${server}' AND defTable = '${table}' AND defColumn = '${column}';
    `
    const InsertFeaturesQuery = await getInsertFeaturesQuery(tagNameSplit,indexDate,indexNum,parts)

    await dbUpdate(delQuery).then( async (result) => {
        if(result) {
            await dbUpdate(insertPartsQuery).then( async (result) => {
                if(result) {
                    await dbUpdate(InsertFeaturesQuery).then((result) => {
                        return result
                    })
                }
            }).catch((e) => {
                console.log(e)
            })
        } else {
            return result
        }
    }).then((result) => {
        res.status(200).send('ok')
    }).catch((e) => {
        res.status(400).send(e)
    })
})

router.post('/indexed/waveinfo', async (req,res) => {
    console.log('/indexed/waveinfo', req.body)
    const tagNameSplit = req.body.tagName.split(".")
    const [ server , table , column ] = tagNameSplit
    const indexDate = moment(req.body.index_date).format('YYYY-MM-DD')
    const indexNum = req.body.index_num
    const queryWaveinfo = `
        SELECT JSON_MERGE(parts, features) AS parts
        FROM WaveSplit
        WHERE index_date = '${indexDate}' AND index_num = ${indexNum} AND
        defServer = '${server}' AND defTable = '${table}' AND defColumn = '${column}';
    `
    console.log(queryWaveinfo)
    await dbSelect(queryWaveinfo).then((result) => {
        res.send(result)
    }).catch((e) => {
        res.status(500).send(e)
    })
}, (error, req, res, next) => {
    res.status(400).send('Error!', error)
})

router.post('/indexed/wavelisttest', async (req,res) => {
    console.log('/indexed/wavelisttest', req.body)
    const tagNameSplit = req.body.tagName.split(".")
    const [ server , table , column ] = tagNameSplit
    const startTime = new Date(req.body.startTime)
    const stopTime = new Date(req.body.stopTime)
    const start = moment(startTime).format('YYYY-MM-DD HH:mm:ss.SSS')
    const stop = moment(stopTime).format('YYYY-MM-DD HH:mm:ss.SSS')
    const queryWavelist = `
        SELECT index_date, index_num, startTime, stopTime
        FROM WaveIndex
        WHERE defServer = '${server}' AND
        defTable = '${table}' AND
        defColumn = '${column}' AND
        startTime BETWEEN '${start}' AND '${stop}'
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

router.post('/indexed/wavelist', async (req, res) => {
    console.log('/indexed/wavelist', req.body)
    const tagNameSplit = req.body.tagName.split(".")
    const [ server = 'S1', table = 'HisItemCurr', column = 'Item005' ] = tagNameSplit
    const startTime = new Date(req.body.startTime)
    const stopTime = new Date(req.body.stopTime)
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

router.delete('/indexed', async (req,res) => {
    console.log('DELETE /indexed', req.body)
    const tagNameSplit = req.body.tagName.split(".")
    const [ server , table , column ] = tagNameSplit
    const indexDate = moment(req.body.index_date).format('YYYY-MM-DD')
    const indexNum = req.body.index_num
    const queryDeleteWaveIndex = `
        DELETE
        FROM WaveIndex
        WHERE index_date = '${indexDate}' AND index_num = ${indexNum} AND
        defServer = '${server}' AND defTable = '${table}' AND defColumn = '${column}';
    `
    const queryDeleteWaveSplit = `
        DELETE
        FROM WaveSplit
        WHERE index_date = '${indexDate}' AND index_num = ${indexNum} AND
        defServer = '${server}' AND defTable = '${table}' AND defColumn = '${column}';
    `
    await dbUpdate(queryDeleteWaveIndex).then( async (result) => {
        if(result) {
            await dbUpdate(queryDeleteWaveSplit).then((delResult) => {
                if(delResult) {
                    req.status(200).send('ok', delResult)
                }
            })
        }
    }).catch((e) => {
        res.status(500).send(e)
    })


})

module.exports = router