const express = require('express')
const mysql = require('mysql')
const router = new express.Router()

const connection = mysql.createConnection({
    host: '192.168.101.50',
    port: '16033',
    user: 'root',
    password: 'its@1234',
    database: 'UYeG_Cloud',
    multipleStatements: true
})

connection.connect()

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
    console.log('features info')
    const queryFeaturesInfo = "SELECT * FROM WaveMaster;"
    dbSelect(queryFeaturesInfo).then((resultdbSelect) => {
        for (let i = 0; i <resultdbSelect.length; i++){
            resultdbSelect[i].value = i
            console.log(resultdbSelect[i])
        }
        return resultdbSelect
    }).then((result) => {
        res.send(
            result
        )
    })
})

module.exports = router