// const path = require('path')
// const publicDirectoryPath = path.join(__dirname, '../public')
// const pythonDirectoryPath = path.join(publicDirectoryPath, 'python')

// router.get('/python-test', (req, res) => {
//     let runPy = new Promise((resolve, reject) => {

//         const { spawn } = require('child_process');
//         const pyprog = spawn('python', [pythonDirectoryPath + '/test.py']);
    
//         pyprog.stdout.on('data', (data) => {
    
//             resolve(data);
//         });
    
//         pyprog.stderr.on('data', (data) => {
    
//             reject(data);
//         });
//     });

//     runPy.then(function(fromRunpy) {
//         console.log(fromRunpy) // Buffer
//         console.log(fromRunpy.toString());
//         res.end(fromRunpy);
//     });
// })