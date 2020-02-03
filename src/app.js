const express = require('express')
const app = express()
const path = require('path')

const publicDirectoryPath = path.join(__dirname, '../public')
const pythonDirectoryPath = path.join(publicDirectoryPath, 'python')
app.use(express.static(publicDirectoryPath))
console.log(pythonDirectoryPath)

let runPy = new Promise((resolve, reject) => {

    const { spawn } = require('child_process');
    const pyprog = spawn('python', [pythonDirectoryPath + '/test.py']);

    pyprog.stdout.on('data', (data) => {

        resolve(data);
    });

    pyprog.stderr.on('data', (data) => {

        reject(data);
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