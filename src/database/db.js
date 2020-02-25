const mysql = require('mysql')

const connection = mysql.createConnection({
    host: '192.168.101.50',
    port: '16033',
    user: 'root',
    password: 'its@1234',
    database: 'UYeG_Cloud',
    multipleStatements: true
})

const dbSelect = (query) => {
    return new Promise((resolve, reject) =>  {
        connection.query(query, (error, result) => {
            if(error) {
                console.log('reject!', query)
                return reject(error)
            }
            if(result) {
                resolve(result)
            }
        })
    })
}

const dbUpdate = (queryUpdate) => {
    return new Promise((resolve, reject) => {
        connection.query(queryUpdate, (error, result) => {
            if(error) {
                console.log('reject!', queryUpdate)
                return reject(error)
            }
            if(result) {
                resolve(result)
            }
        })
    })
}

module.exports = {
    dbSelect,
    dbUpdate
}