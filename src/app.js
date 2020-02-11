const express = require('express')
const bodyParser = require('body-parser');
const path = require('path')
const indexedRouter = require('./router/indexed')
const featuresRouter = require('./router/features')

const app = express()
const publicDirectoryPath = path.join(__dirname, '../public')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json())
app.use(indexedRouter)
app.use(featuresRouter)

app.get('/test', (req, res) => {
    console.log('yas')
    res.send(
            {
                options: ['option 1', 'option 2', 'option 3']
            }
        
    )
})

module.exports = app