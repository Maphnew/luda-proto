const mysql = require('mysql')

const connection = mysql.createConnection({
    host: '192.168.101.50',
    port: '16033',
    user: 'root',
    password: 'its@1234',
    database: 'UYeG_Cloud'
})

const dbSelect = (query) => {
    return new Promise((resolve, reject) =>  {
        connection.query(query, (error, result) => {
            if(error) {
                console.log('reject!')
                reject(error)
            }
            if(result) {
                resolve(result)
            }
        })
    })
}

module.exports = {
    connection,
    dbSelect
}