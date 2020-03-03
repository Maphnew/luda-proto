const express = require('express')
const path = require('path')
const router = new express.Router()
const { spawn } = require('child_process');

const publicDirectoryPath = path.join(__dirname, '../../public')
const pythonDirectoryPath = path.join(publicDirectoryPath, 'python')
const testPath = path.join(pythonDirectoryPath, 'getStatistics.py')
// console.log(testPath)

const runPy = (startTime, stopTime, index_date, index_num) => {
    return new Promise((resolve, reject) => {
        const pyprog = spawn('python', [testPath, startTime, stopTime, index_date, index_num])
    
        pyprog.stdout.on('data', (data) => {
            resolve(data)
        })
        pyprog.stderr.on('data', (data) => {
            reject(data)
        })
    })
}

router.get('/python-test', async (req, res) => {
    const index_date = '2020-02-14' 
    const index_num = 1
    const startTime =  "2020-02-14 08:47:19.900000"
    const stopTime = "2020-02-14 08:47:23.300000"
    await runPy(startTime, stopTime, index_date, index_num).then((fromRunpy) => {
        const str = fromRunpy.toString()
        replace = str.replace(/'/gi, "\"")
        console.log('from Runpy: ', replace)
        return replace
    }).then((replace) => {
        console.log(typeof(replace))
        const json = JSON.parse(replace)
        console.log('json: ',json)
        res.send(json)
    }).catch((e) => {
        console.log(e)
        res.status(400).send(e)
    })
})

module.exports = router