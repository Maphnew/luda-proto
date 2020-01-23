const express = require('express')
const app = express()
const path = require('path')

const publicDirectoryPath = path.join(__dirname, '../public')
app.use(express.static(publicDirectoryPath))
console.log(publicDirectoryPath)

let runPy = new Promise(function(success, nosuccess) {

    const { spawn } = require('child_process');
    const pyprog = spawn('python', [publicDirectoryPath + '/python/test.py']);

    pyprog.stdout.on('data', function(data) {

        success(data);
    });

    pyprog.stderr.on('data', (data) => {

        nosuccess(data);
    });
});

app.get('/', (req, res) => {

    res.write('welcome\n');

    runPy.then(function(fromRunpy) {
        console.log(fromRunpy) // Buffer
        console.log(fromRunpy.toString());
        res.end(fromRunpy);
    });
})

app.listen(4000, () => console.log('Application listening on port 4000!'))