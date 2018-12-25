const { spawn } = require('child_process');

const server = spawn('npm', ['run', 'debug'], {cwd: `./server`});
const client = spawn('npm', ['start'], {cwd: `./client`});

function output(process, name = []) {
    process.stdout.on('data', (data) => {
        console.log(...name, data.toString().replace(/\n$/, ''));
    });

    process.stderr.on('data', (data) => {
        console.log(...name, data.toString().replace(/\n$/, ''));
    });
}

output(server, ['\x1b[43m', 'Server:', '\x1b[0m']);
output(client, ['\x1b[42m', 'Client:', '\x1b[0m']);
